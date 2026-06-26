const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Allow requests from the frontend (any origin during development)
app.use(cors());
app.use(express.json());

// --- Mock product data (replace with DB queries later) ---
const products = [

  // Studio
  { id: 101, name: 'Professional Portrait Session', price: 25000, category: 'Sessions',
    rating: 4.9, reviews: 42,
    description: 'A 2-hour professional portrait session with our expert photographers. Includes 10 edited digital images delivered within 48 hours in a private online gallery.',
    image: 'https://picsum.photos/seed/studio-portrait/400/400', shop: 'studio' },

  { id: 102, name: 'Corporate Photography Package', price: 50000, category: 'Sessions',
    rating: 4.8, reviews: 28,
    description: 'Complete corporate photography package including team headshots, office environment shots, and product images. Up to 4 hours of shooting time.',
    image: 'https://picsum.photos/seed/studio-corporate/400/400', shop: 'studio' },

  { id: 103, name: 'Wedding Photography — Full Day', price: 150000, category: 'Packages',
    rating: 5.0, reviews: 15,
    description: 'Full wedding day coverage from preparation to reception. Two photographers, 300+ edited photos, and a luxury photo album included.',
    image: 'https://picsum.photos/seed/studio-wedding/400/400', shop: 'studio' },

  { id: 104, name: 'Passport Photographs (6 pcs)', price: 2000, category: 'Prints',
    rating: 4.7, reviews: 120,
    description: 'Standard passport-size photographs — 6 high-quality copies ready within 30 minutes. Meets all official Sri Lankan and international requirements.',
    image: 'https://picsum.photos/seed/studio-passport/400/400', shop: 'studio' },

  { id: 105, name: 'Canvas Print 20×24 inch', price: 12000, category: 'Prints',
    rating: 4.6, reviews: 55,
    description: 'Gallery-quality canvas print of your favourite photo. Stretched on a solid wood frame and ready to hang. Vivid, fade-resistant archival inks.',
    image: 'https://picsum.photos/seed/studio-canvas/400/400', shop: 'studio' },

  { id: 106, name: 'Framed Photo Print A3', price: 7500, category: 'Prints',
    rating: 4.5, reviews: 38,
    description: 'Premium A3 photo print in an elegant hardwood frame with anti-glare glass. Perfect for home decor or a heartfelt gift.',
    image: 'https://picsum.photos/seed/studio-frame/400/400', shop: 'studio' },

  { id: 107, name: 'Baby & Family Photography', price: 35000, category: 'Sessions',
    rating: 4.9, reviews: 22,
    description: 'Capture precious family moments in our warm, child-friendly studio. 3-hour session with themed props. 50 edited digital images delivered.',
    image: 'https://picsum.photos/seed/studio-family/400/400', shop: 'studio' },

  { id: 108, name: 'Premium Photo Album (30 pages)', price: 20000, category: 'Packages',
    rating: 4.8, reviews: 30,
    description: 'Lay-flat premium photo album, 30 double-page spreads with professional layout design. Hardcover, matte or gloss finish available.',
    image: 'https://picsum.photos/seed/studio-album/400/400', shop: 'studio' },

  // E-shop
  { id: 201, name: 'Wireless Bluetooth Earbuds', price: 15000, category: 'Electronics',
    rating: 4.7, reviews: 89,
    description: 'True wireless earbuds with active noise cancellation. 8-hour playback + 24h charging case. IPX5 water-resistant. Compatible with all Bluetooth devices.',
    image: 'https://picsum.photos/seed/eshop-earbuds/400/400', shop: 'eshop' },

  { id: 202, name: 'Premium Laptop Bag 15.6"', price: 12000, category: 'Bags',
    rating: 4.6, reviews: 64,
    description: 'Water-resistant polyester laptop bag with padded laptop sleeve, multiple organiser pockets, and ergonomic shoulder strap. Fits laptops up to 15.6 inches.',
    image: 'https://picsum.photos/seed/eshop-laptopbag/400/400', shop: 'eshop' },

  { id: 203, name: 'Smart Watch Pro', price: 35000, category: 'Electronics',
    rating: 4.8, reviews: 47,
    description: 'Full-featured smartwatch with heart rate, SpO2, sleep tracking, GPS, and 7-day battery. Water-resistant to 50m. Works with Android and iOS.',
    image: 'https://picsum.photos/seed/eshop-watch/400/400', shop: 'eshop' },

  { id: 204, name: 'USB-C Hub 7-in-1', price: 18000, category: 'Electronics',
    rating: 4.5, reviews: 55,
    description: 'Expand your laptop connectivity: HDMI 4K, 3× USB-A, SD & microSD card slots, and USB-C Power Delivery. Plug-and-play, no drivers needed.',
    image: 'https://picsum.photos/seed/eshop-usbhub/400/400', shop: 'eshop' },

  { id: 205, name: 'Power Bank 20,000mAh', price: 22000, category: 'Electronics',
    rating: 4.7, reviews: 103,
    description: 'High-capacity power bank with 22.5W fast charging. Charges 3 devices simultaneously via USB-A × 2 and USB-C. LED power indicator.',
    image: 'https://picsum.photos/seed/eshop-powerbank/400/400', shop: 'eshop' },

  { id: 206, name: 'Ergonomic Office Chair', price: 55000, category: 'Office',
    rating: 4.6, reviews: 28,
    description: 'Breathable mesh back with lumbar support, adjustable armrests, seat height, and tilt tension. Built for all-day comfort. Max load: 120kg.',
    image: 'https://picsum.photos/seed/eshop-chair/400/400', shop: 'eshop' },

  { id: 207, name: 'LED Desk Lamp', price: 8500, category: 'Office',
    rating: 4.5, reviews: 76,
    description: 'Adjustable colour temperature (warm to cool) and 5 brightness levels. Built-in USB-A charging port. Flicker-free, eye-care technology.',
    image: 'https://picsum.photos/seed/eshop-lamp/400/400', shop: 'eshop' },

  { id: 208, name: 'Premium Travel Backpack', price: 28000, category: 'Bags',
    rating: 4.7, reviews: 42,
    description: 'Durable 30L backpack with dedicated laptop compartment, hidden anti-theft pocket, USB charging port pass-through, and rain cover included.',
    image: 'https://picsum.photos/seed/eshop-backpack/400/400', shop: 'eshop' },

  // Bookshop
  { id: 301, name: 'Things Fall Apart', price: 3500, category: 'Fiction',
    rating: 4.9, reviews: 200,
    description: "Chinua Achebe's timeless masterpiece. Explores the life of Okonkwo and the devastating impact of British colonialism on traditional Igbo society. A cornerstone of African literature.",
    image: 'https://picsum.photos/seed/book-thingsfall/400/400', shop: 'bookshop' },

  { id: 302, name: 'Purple Hibiscus', price: 4000, category: 'Fiction',
    rating: 4.8, reviews: 150,
    description: "Chimamanda Ngozi Adichie's debut novel about family, freedom, and faith in post-colonial Nigeria. A story of beauty, courage, and the quest for independence.",
    image: 'https://picsum.photos/seed/book-hibiscus/400/400', shop: 'bookshop' },

  { id: 303, name: 'Half of a Yellow Sun', price: 4500, category: 'Fiction',
    rating: 4.9, reviews: 135,
    description: "Set against the backdrop of the Nigerian Civil War, Adichie traces five lives through one of Africa's most turbulent and heartbreaking periods.",
    image: 'https://picsum.photos/seed/book-yellowsun/400/400', shop: 'bookshop' },

  { id: 304, name: 'Rich Dad Poor Dad', price: 4500, category: 'Non-Fiction',
    rating: 4.7, reviews: 320,
    description: "Robert Kiyosaki's classic guide to financial literacy, the mindset behind wealth-building, and why the school system fails to teach money management.",
    image: 'https://picsum.photos/seed/book-richdad/400/400', shop: 'bookshop' },

  { id: 305, name: 'The 48 Laws of Power', price: 5500, category: 'Non-Fiction',
    rating: 4.6, reviews: 280,
    description: "Robert Greene's definitive guide to power dynamics, influence, and social strategy. Illustrated with historical examples. Essential reading for ambitious individuals.",
    image: 'https://picsum.photos/seed/book-48laws/400/400', shop: 'bookshop' },

  { id: 306, name: 'O/L Mathematics Past Papers', price: 2500, category: 'Academic',
    rating: 4.8, reviews: 450,
    description: "Comprehensive G.C.E. Ordinary Level Mathematics past papers with fully worked solutions from 2010–2024. The #1 exam prep resource for O/L candidates across Sri Lanka.",
    image: 'https://picsum.photos/seed/book-waec/400/400', shop: 'bookshop' },

  { id: 307, name: 'A/L Combined Maths Study Guide', price: 3000, category: 'Academic',
    rating: 4.7, reviews: 380,
    description: "All-topic G.C.E. Advanced Level Combined Mathematics guide with thousands of practice questions, timed mock tests, and detailed answer explanations for Sri Lankan A/L students.",
    image: 'https://picsum.photos/seed/book-jamb/400/400', shop: 'bookshop' },

  { id: 308, name: "My First ABC — Children's Book", price: 1800, category: "Children's",
    rating: 4.9, reviews: 95,
    description: 'Beautifully illustrated full-colour alphabet book for children aged 3–6. Large, friendly print with fun activities on every page. A perfect first book.',
    image: 'https://picsum.photos/seed/book-abc/400/400', shop: 'bookshop' },

];

// GET /api/health – simple liveness check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nalini Group API is running' });
});

// GET /api/products – return all products, or filter by ?shop=studio|eshop|bookshop
app.get('/api/products', (req, res) => {
  const { shop } = req.query;
  const result = shop ? products.filter(p => p.shop === shop) : products;
  res.json({ success: true, count: result.length, products: result });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
