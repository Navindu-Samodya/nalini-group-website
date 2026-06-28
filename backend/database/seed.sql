-- ============================================================
--  Nalini Group — Seed Data
--  Database: nalini_group
--
--  Safe to re-run:
--    - shops and categories use INSERT IGNORE (unique keys exist)
--    - a unique index on products (shop_id, name) is created
--      with IF NOT EXISTS, then products also use INSERT IGNORE
-- ============================================================

USE nalini_group;


-- ------------------------------------------------------------
--  SHOPS  (idempotent — unique key on slug already exists)
-- ------------------------------------------------------------
INSERT IGNORE INTO shops (slug, name) VALUES
  ('studio',   'Nalini Studio'),
  ('eshop',    'Nalini E-Shop'),
  ('bookshop', 'Nalini Book Shop');


-- ------------------------------------------------------------
--  CATEGORIES  (idempotent — unique key on shop_id+name exists)
-- ------------------------------------------------------------
INSERT IGNORE INTO categories (shop_id, name)
SELECT s.id, c.name FROM shops s
JOIN (
  SELECT 'studio'   AS slug, 'Sessions'    AS name UNION ALL
  SELECT 'studio',           'Packages'            UNION ALL
  SELECT 'studio',           'Prints'              UNION ALL
  SELECT 'eshop',            'Electronics'         UNION ALL
  SELECT 'eshop',            'Bags'                UNION ALL
  SELECT 'eshop',            'Office'              UNION ALL
  SELECT 'bookshop',         'Fiction'             UNION ALL
  SELECT 'bookshop',         'Non-Fiction'         UNION ALL
  SELECT 'bookshop',         'Academic'            UNION ALL
  SELECT 'bookshop',         'Children''s'
) c ON s.slug = c.slug;





-- ------------------------------------------------------------
--  Resolve IDs into session variables
-- ------------------------------------------------------------
SET @studio_id   = (SELECT id FROM shops WHERE slug = 'studio');
SET @eshop_id    = (SELECT id FROM shops WHERE slug = 'eshop');
SET @bookshop_id = (SELECT id FROM shops WHERE slug = 'bookshop');

SET @sessions    = (SELECT id FROM categories WHERE shop_id = @studio_id   AND name = 'Sessions');
SET @packages    = (SELECT id FROM categories WHERE shop_id = @studio_id   AND name = 'Packages');
SET @prints      = (SELECT id FROM categories WHERE shop_id = @studio_id   AND name = 'Prints');
SET @electronics = (SELECT id FROM categories WHERE shop_id = @eshop_id    AND name = 'Electronics');
SET @bags        = (SELECT id FROM categories WHERE shop_id = @eshop_id    AND name = 'Bags');
SET @office      = (SELECT id FROM categories WHERE shop_id = @eshop_id    AND name = 'Office');
SET @fiction     = (SELECT id FROM categories WHERE shop_id = @bookshop_id AND name = 'Fiction');
SET @nonfiction  = (SELECT id FROM categories WHERE shop_id = @bookshop_id AND name = 'Non-Fiction');
SET @academic    = (SELECT id FROM categories WHERE shop_id = @bookshop_id AND name = 'Academic');
SET @childrens   = (SELECT id FROM categories WHERE shop_id = @bookshop_id AND name = 'Children''s');


-- ------------------------------------------------------------
--  STUDIO PRODUCTS
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (shop_id, category_id, name, description, price, rating, reviews, image)
VALUES

  (@studio_id, @sessions, 'Professional Portrait Session',
   'A 2-hour professional portrait session with our expert photographers. Includes 10 edited digital images delivered within 48 hours in a private online gallery.',
   25000, 4.9, 42, 'https://picsum.photos/seed/studio-portrait/400/400'),

  (@studio_id, @sessions, 'Corporate Photography Package',
   'Complete corporate photography package including team headshots, office environment shots, and product images. Up to 4 hours of shooting time.',
   50000, 4.8, 28, 'https://picsum.photos/seed/studio-corporate/400/400'),

  (@studio_id, @sessions, 'Baby & Family Photography',
   'Capture precious family moments in our warm, child-friendly studio. 3-hour session with themed props. 50 edited digital images delivered.',
   35000, 4.9, 22, 'https://picsum.photos/seed/studio-family/400/400'),

  (@studio_id, @packages, 'Wedding Photography — Full Day',
   'Full wedding day coverage from preparation to reception. Two photographers, 300+ edited photos, and a luxury photo album included.',
   150000, 5.0, 15, 'https://picsum.photos/seed/studio-wedding/400/400'),

  (@studio_id, @packages, 'Premium Photo Album (30 pages)',
   'Lay-flat premium photo album, 30 double-page spreads with professional layout design. Hardcover, matte or gloss finish available.',
   20000, 4.8, 30, 'https://picsum.photos/seed/studio-album/400/400'),

  (@studio_id, @prints, 'Passport Photographs (6 pcs)',
   'Standard passport-size photographs — 6 high-quality copies ready within 30 minutes. Meets all official Sri Lankan and international requirements.',
   2000, 4.7, 120, 'https://picsum.photos/seed/studio-passport/400/400'),

  (@studio_id, @prints, 'Canvas Print 20×24 inch',
   'Gallery-quality canvas print of your favourite photo. Stretched on a solid wood frame and ready to hang. Vivid, fade-resistant archival inks.',
   12000, 4.6, 55, 'https://picsum.photos/seed/studio-canvas/400/400'),

  (@studio_id, @prints, 'Framed Photo Print A3',
   'Premium A3 photo print in an elegant hardwood frame with anti-glare glass. Perfect for home decor or a heartfelt gift.',
   7500, 4.5, 38, 'https://picsum.photos/seed/studio-frame/400/400');


-- ------------------------------------------------------------
--  E-SHOP PRODUCTS
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (shop_id, category_id, name, description, price, rating, reviews, image)
VALUES

  (@eshop_id, @electronics, 'Wireless Bluetooth Earbuds',
   'True wireless earbuds with active noise cancellation. 8-hour playback + 24h charging case. IPX5 water-resistant. Compatible with all Bluetooth devices.',
   15000, 4.7, 89, 'https://picsum.photos/seed/eshop-earbuds/400/400'),

  (@eshop_id, @electronics, 'Smart Watch Pro',
   'Full-featured smartwatch with heart rate, SpO2, sleep tracking, GPS, and 7-day battery. Water-resistant to 50m. Works with Android and iOS.',
   35000, 4.8, 47, 'https://picsum.photos/seed/eshop-watch/400/400'),

  (@eshop_id, @electronics, 'USB-C Hub 7-in-1',
   'Expand your laptop connectivity: HDMI 4K, 3× USB-A, SD & microSD card slots, and USB-C Power Delivery. Plug-and-play, no drivers needed.',
   18000, 4.5, 55, 'https://picsum.photos/seed/eshop-usbhub/400/400'),

  (@eshop_id, @electronics, 'Power Bank 20,000mAh',
   'High-capacity power bank with 22.5W fast charging. Charges 3 devices simultaneously via USB-A × 2 and USB-C. LED power indicator.',
   22000, 4.7, 103, 'https://picsum.photos/seed/eshop-powerbank/400/400'),

  (@eshop_id, @bags, 'Premium Laptop Bag 15.6"',
   'Water-resistant polyester laptop bag with padded laptop sleeve, multiple organiser pockets, and ergonomic shoulder strap. Fits laptops up to 15.6 inches.',
   12000, 4.6, 64, 'https://picsum.photos/seed/eshop-laptopbag/400/400'),

  (@eshop_id, @bags, 'Premium Travel Backpack',
   'Durable 30L backpack with dedicated laptop compartment, hidden anti-theft pocket, USB charging port pass-through, and rain cover included.',
   28000, 4.7, 42, 'https://picsum.photos/seed/eshop-backpack/400/400'),

  (@eshop_id, @office, 'Ergonomic Office Chair',
   'Breathable mesh back with lumbar support, adjustable armrests, seat height, and tilt tension. Built for all-day comfort. Max load: 120kg.',
   55000, 4.6, 28, 'https://picsum.photos/seed/eshop-chair/400/400'),

  (@eshop_id, @office, 'LED Desk Lamp',
   'Adjustable colour temperature (warm to cool) and 5 brightness levels. Built-in USB-A charging port. Flicker-free, eye-care technology.',
   8500, 4.5, 76, 'https://picsum.photos/seed/eshop-lamp/400/400');


-- ------------------------------------------------------------
--  BOOKSHOP PRODUCTS
-- ------------------------------------------------------------
INSERT IGNORE INTO products
  (shop_id, category_id, name, description, price, rating, reviews, image)
VALUES

  (@bookshop_id, @fiction, 'Things Fall Apart',
   'Chinua Achebe''s timeless masterpiece. Explores the life of Okonkwo and the devastating impact of British colonialism on traditional Igbo society. A cornerstone of African literature.',
   3500, 4.9, 200, 'https://picsum.photos/seed/book-thingsfall/400/400'),

  (@bookshop_id, @fiction, 'Purple Hibiscus',
   'Chimamanda Ngozi Adichie''s debut novel about family, freedom, and faith in post-colonial Nigeria. A story of beauty, courage, and the quest for independence.',
   4000, 4.8, 150, 'https://picsum.photos/seed/book-hibiscus/400/400'),

  (@bookshop_id, @fiction, 'Half of a Yellow Sun',
   'Set against the backdrop of the Nigerian Civil War, Adichie traces five lives through one of Africa''s most turbulent and heartbreaking periods.',
   4500, 4.9, 135, 'https://picsum.photos/seed/book-yellowsun/400/400'),

  (@bookshop_id, @nonfiction, 'Rich Dad Poor Dad',
   'Robert Kiyosaki''s classic guide to financial literacy, the mindset behind wealth-building, and why the school system fails to teach money management.',
   4500, 4.7, 320, 'https://picsum.photos/seed/book-richdad/400/400'),

  (@bookshop_id, @nonfiction, 'The 48 Laws of Power',
   'Robert Greene''s definitive guide to power dynamics, influence, and social strategy. Illustrated with historical examples. Essential reading for ambitious individuals.',
   5500, 4.6, 280, 'https://picsum.photos/seed/book-48laws/400/400'),

  (@bookshop_id, @academic, 'O/L Mathematics Past Papers',
   'Comprehensive G.C.E. Ordinary Level Mathematics past papers with fully worked solutions from 2010–2024. The #1 exam prep resource for O/L candidates across Sri Lanka.',
   2500, 4.8, 450, 'https://picsum.photos/seed/book-waec/400/400'),

  (@bookshop_id, @academic, 'A/L Combined Maths Study Guide',
   'All-topic G.C.E. Advanced Level Combined Mathematics guide with thousands of practice questions, timed mock tests, and detailed answer explanations for Sri Lankan A/L students.',
   3000, 4.7, 380, 'https://picsum.photos/seed/book-jamb/400/400'),

  (@bookshop_id, @childrens, 'My First ABC — Children''s Book',
   'Beautifully illustrated full-colour alphabet book for children aged 3–6. Large, friendly print with fun activities on every page. A perfect first book.',
   1800, 4.9, 95, 'https://picsum.photos/seed/book-abc/400/400');
