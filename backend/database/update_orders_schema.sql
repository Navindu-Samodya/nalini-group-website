-- ============================================================
--  Migration: correct orders table structure
--
--  Change: remove shop_id from orders (one order can span
--          multiple shops; shop source lives in order_items).
--  Change: add order_number as a unique human-readable reference.
--
--  Safe to run because there is no real order data yet.
--  order_items is dropped first (FK dependency), then orders,
--  then both are recreated with the corrected structure.
-- ============================================================

USE nalini_group;

-- Drop child table first to satisfy the FK constraint
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;


-- ------------------------------------------------------------
--  ORDERS (corrected)
-- ------------------------------------------------------------
CREATE TABLE orders (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_number VARCHAR(30)  NOT NULL,
  customer_id  INT UNSIGNED NOT NULL,
  status       ENUM(
                 'pending',
                 'confirmed',
                 'processing',
                 'completed',
                 'cancelled'
               )             NOT NULL DEFAULT 'pending',
  total_lkr    INT UNSIGNED  NOT NULL DEFAULT 0,
  notes        TEXT          DEFAULT NULL,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                      ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_order_number (order_number),
  KEY idx_customer (customer_id),
  KEY idx_status   (status),
  FOREIGN KEY (customer_id) REFERENCES customers (id)
) ENGINE=InnoDB;


-- ------------------------------------------------------------
--  ORDER ITEMS (unchanged except recreated after DROP)
--  product_name and unit_price are snapshots at order time.
--  shop_id is a snapshot of the item's source shop.
-- ------------------------------------------------------------
CREATE TABLE order_items (
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
