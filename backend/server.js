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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
