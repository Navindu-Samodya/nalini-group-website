-- ============================================================
--  Reset product data only.
--  Safe to run because there are no orders yet.
--  After running this, re-run seed.sql to insert clean data.
-- ============================================================

USE nalini_group;

DELETE FROM products;

-- Reset the auto-increment so IDs start from 1 again
ALTER TABLE products AUTO_INCREMENT = 1;
