require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = 3000;

// Allow requests from the frontend (any origin during development)
app.use(cors());
app.use(express.json());

// Serve the project root (one level up from backend/) as static files
app.use(express.static(path.join(__dirname, '..')));


// GET /api/health – simple liveness check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nalini Group API is running' });
});

// GET /api/db-test – verify MySQL connection
app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS connected');
    res.json({ success: true, message: 'MySQL connection successful', result: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'MySQL connection failed', error: err.message });
  }
});

// Valid shop slugs — used for input validation
const VALID_SHOPS = new Set(['studio', 'eshop', 'bookshop']);

// GET /api/products – return active products from MySQL, optionally filtered by ?shop=
app.get('/api/products', async (req, res) => {
  const { shop } = req.query;

  if (shop !== undefined && !VALID_SHOPS.has(shop)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid shop. Must be one of: studio, eshop, bookshop'
    });
  }

  try {
    let sql = `
      SELECT
        p.id,
        s.slug        AS shop,
        c.name        AS category,
        p.name,
        p.description,
        p.price,
        p.rating,
        p.reviews,
        p.image
      FROM products p
      JOIN shops      s ON s.id = p.shop_id
      JOIN categories c ON c.id = p.category_id
      WHERE p.active = 1
    `;

    const params = [];
    if (shop) {
      sql += ' AND s.slug = ?';
      params.push(shop);
    }

    sql += ' ORDER BY p.id';

    const [rows] = await pool.query(sql, params);

    // mysql2 returns DECIMAL columns as strings — convert rating to a number
    const result = rows.map(r => ({ ...r, rating: parseFloat(r.rating) }));

    res.json({ success: true, count: result.length, products: result });
  } catch (err) {
    console.error('GET /api/products error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load products' });
  }
});

// POST /api/orders — place a new order
app.post('/api/orders', async (req, res) => {
  const { name, email, phone, address, notes, items } = req.body;

  // --- Validate customer fields ---
  if (!name  || !String(name).trim())    return res.status(400).json({ success: false, message: 'name is required' });
  if (!email || !String(email).trim())   return res.status(400).json({ success: false, message: 'email is required' });
  if (!phone || !String(phone).trim())   return res.status(400).json({ success: false, message: 'phone is required' });
  if (!address || !String(address).trim()) return res.status(400).json({ success: false, message: 'address is required' });

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_RE.test(String(email).trim())) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  // --- Validate cart ---
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  for (const item of items) {
    const id  = Number(item.product_id);
    const qty = Number(item.quantity);
    if (!Number.isInteger(id)  || id  < 1) return res.status(400).json({ success: false, message: `Invalid product_id: ${item.product_id}` });
    if (!Number.isInteger(qty) || qty < 1) return res.status(400).json({ success: false, message: `Invalid quantity for product_id ${item.product_id}` });
  }

  const productIds = [...new Set(items.map(i => Number(i.product_id)))];

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // --- Fetch products from DB; never trust frontend prices ---
    const [dbProducts] = await conn.query(
      `SELECT p.id, p.name, p.price, p.shop_id
       FROM products p
       WHERE p.id IN (?) AND p.active = 1`,
      [productIds]
    );

    const productMap = new Map(dbProducts.map(p => [p.id, p]));

    for (const id of productIds) {
      if (!productMap.has(id)) {
        await conn.rollback();
        return res.status(400).json({ success: false, message: `Product ID ${id} not found or is unavailable` });
      }
    }

    // --- Calculate total from DB prices ---
    let totalLkr = 0;
    for (const item of items) {
      const product = productMap.get(Number(item.product_id));
      totalLkr += product.price * Number(item.quantity);
    }

    // --- Create or reuse customer by email ---
    const normalizedEmail = String(email).trim().toLowerCase();
    const [existing] = await conn.query(
      'SELECT id FROM customers WHERE email = ?',
      [normalizedEmail]
    );

    let customerId;
    if (existing.length > 0) {
      customerId = existing[0].id;
    } else {
      const [ins] = await conn.query(
        'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
        [String(name).trim(), normalizedEmail, String(phone).trim(), String(address).trim()]
      );
      customerId = ins.insertId;
    }

    // --- Insert order with temporary order_number, then update after getting the ID ---
    const [orderResult] = await conn.query(
      'INSERT INTO orders (order_number, customer_id, total_lkr, notes) VALUES (?, ?, ?, ?)',
      [`PENDING-${Date.now()}`, customerId, totalLkr, notes ? String(notes).trim() : null]
    );
    const orderId = orderResult.insertId;

    const year        = new Date().getFullYear();
    const orderNumber = `NG-${year}-${String(orderId).padStart(6, '0')}`;

    await conn.query('UPDATE orders SET order_number = ? WHERE id = ?', [orderNumber, orderId]);

    // --- Insert order_items ---
    const itemRows = items.map(item => {
      const p = productMap.get(Number(item.product_id));
      return [orderId, p.id, p.name, p.shop_id, Number(item.quantity), p.price];
    });

    await conn.query(
      `INSERT INTO order_items (order_id, product_id, product_name, shop_id, quantity, unit_price)
       VALUES ?`,
      [itemRows]
    );

    await conn.commit();

    res.status(201).json({
      success:      true,
      order_number: orderNumber,
      order_id:     orderId,
      total_lkr:    totalLkr
    });

  } catch (err) {
    await conn.rollback();
    console.error('POST /api/orders error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  } finally {
    conn.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
