-- Migration: add-targeted-indexes
-- Generated: 2026-08-18
-- Note: Use psql or your DB admin tool to run these statements against your Postgres database.
-- For large production tables, run the CREATE INDEX CONCURRENTLY statements during low traffic.

-- User: index on createdAt
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_createdat ON "User" ("createdAt");

-- ProductCard: createdAt and foreign keys
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productcard_createdat ON "ProductCard" ("createdAt");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productcard_gameid ON "ProductCard" ("gameId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productcard_appid ON "ProductCard" ("appId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productcard_powerpointid ON "ProductCard" ("powerpointId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productcard_sectionid ON "ProductCard" ("sectionId");

-- Order: foreign keys
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_productid ON "Order" ("productId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_paymentid ON "Order" ("paymentId");

-- ProductInfo: userId and email
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productinfo_userid ON "ProductInfo" ("userId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productinfo_email ON "ProductInfo" ("email");

-- Payment: userId and createdAt
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_userid ON "Payment" ("userId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_createdat ON "Payment" ("createdAt");

-- Helpful composite index examples (uncomment and adjust if your query patterns need them)
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productcard_gameid_createdat ON "ProductCard" ("gameId", "createdAt" DESC);


-- End of migration
