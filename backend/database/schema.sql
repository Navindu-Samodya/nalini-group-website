-- ============================================================
--  Nalini Group — MySQL Schema
--  Database: nalini_group
-- ============================================================

CREATE DATABASE IF NOT EXISTS nalini_group
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nalini_group;


-- ------------------------------------------------------------
--  SHOPS
--  Only the three shops that sell products.
--  Agbo Hotel and Solar Energy are NOT included here.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shops (
  id    TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug  VARCHAR(20)      NOT NULL,
  name  VARCHAR(100)     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_slug (slug)
) ENGINE=InnoDB;

INSERT IGNORE INTO shops (slug, name) VALUES
  ('studio',   'Nalini Studio'),
  ('eshop',    'Nalini E-Shop'),
  ('bookshop', 'Nalini Book Shop');


-- ------------------------------------------------------------
--  CATEGORIES
--  Each category belongs to one shop.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id      SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  shop_id TINYINT UNSIGNED  NOT NULL,
  name    VARCHAR(100)      NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_shop_category (shop_id, name),
  FOREIGN KEY (shop_id) REFERENCES shops (id)
) ENGINE=InnoDB;

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
--  PRODUCTS
--  price is a plain LKR integer (no decimals, no currency field).
--  active = 0 hides a product without deleting it.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id          INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  shop_id     TINYINT UNSIGNED  NOT NULL,
  category_id SMALLINT UNSIGNED NOT NULL,
  name        VARCHAR(255)      NOT NULL,
  description TEXT              NOT NULL,
  price       INT UNSIGNED      NOT NULL,
  rating      DECIMAL(2,1)      NOT NULL DEFAULT 0.0,
  reviews     INT UNSIGNED      NOT NULL DEFAULT 0,
  image       VARCHAR(500)      NOT NULL DEFAULT '',
  active      TINYINT(1)        NOT NULL DEFAULT 1,
  created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_shop   (shop_id),
  KEY idx_active (active),
  FOREIGN KEY (shop_id)     REFERENCES shops      (id),
  FOREIGN KEY (category_id) REFERENCES categories (id)
) ENGINE=InnoDB;


-- ------------------------------------------------------------
--  CUSTOMERS
--  One row per unique customer (identified by email).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  phone      VARCHAR(30)  DEFAULT NULL,
  address    TEXT         DEFAULT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email)
) ENGINE=InnoDB;


-- ------------------------------------------------------------
--  ORDERS
--  shop_id records which shop the order was placed from.
--  total_lkr is stored as a plain LKR integer.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  customer_id INT UNSIGNED     NOT NULL,
  shop_id     TINYINT UNSIGNED NOT NULL,
  status      ENUM(
                'pending',
                'confirmed',
                'processing',
                'completed',
                'cancelled'
              )                NOT NULL DEFAULT 'pending',
  total_lkr   INT UNSIGNED     NOT NULL DEFAULT 0,
  notes       TEXT             DEFAULT NULL,
  created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_customer (customer_id),
  KEY idx_shop     (shop_id),
  KEY idx_status   (status),
  FOREIGN KEY (customer_id) REFERENCES customers (id),
  FOREIGN KEY (shop_id)     REFERENCES shops     (id)
) ENGINE=InnoDB;


-- ------------------------------------------------------------
--  ORDER ITEMS
--  product_name and unit_price are snapshots taken at order time
--  so historical orders remain accurate if products are later
--  edited or removed.
--  shop_id here is also a snapshot of the item's source shop.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id           INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  order_id     INT UNSIGNED      NOT NULL,
  product_id   INT UNSIGNED      NOT NULL,
  product_name VARCHAR(255)      NOT NULL,
  shop_id      TINYINT UNSIGNED  NOT NULL,
  quantity     SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  unit_price   INT UNSIGNED      NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order   (order_id),
  KEY idx_product (product_id),
  FOREIGN KEY (order_id)   REFERENCES orders   (id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products (id),
  FOREIGN KEY (shop_id)    REFERENCES shops    (id)
) ENGINE=InnoDB;
