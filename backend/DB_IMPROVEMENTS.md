Database improvements: connection pooling and indexing

This document describes recommended changes made in the repository and how to apply/verify them.

What was added

1) Indexes (prisma schema)
- Targeted indexes were added to the Prisma schema for frequently queried fields and foreign keys:
  - User: @@index([createdAt])
  - ProductCard: @@index([createdAt]), @@index([gameId]), @@index([appId]), @@index([powerpointId]), @@index([sectionId])
  - Order: @@index([productId]), @@index([paymentId])
  - ProductInfo: @@index([userId]), @@index([email])
  - Payment: @@index([userId]), @@index([createdAt])

These indexes help the database locate rows faster for common query patterns (joins on foreign keys, queries ordered/filtered by createdAt, lookups by email).

2) Documentation for connection pooling and EXPLAIN ANALYZE
- This file includes instructions for using PgBouncer locally (recommended for Postgres connection pooling), how to update DATABASE_URL to point to PgBouncer, and how to create/verify indexes with EXPLAIN ANALYZE.

Applying the Prisma schema changes to your database

Important: If you use a production database, don't run non-concurrent index creation during peak hours. Use CREATE INDEX CONCURRENTLY for Postgres to avoid long locks.

Recommended (development / local):

1) Generate a migration and apply (development):

   cd backend
   npx prisma migrate dev --name add-targeted-indexes

This creates a migration file and applies it to the connected database.

For production or large tables (Postgres):

1) Generate SQL migration but apply indexes with CONCURRENTLY (to avoid table locks):

   npx prisma migrate diff --from-schema-datasource "file:./prisma/schema.prisma" --to-schema-datasource "<current-db>" --script > add_indexes.sql

Edit add_indexes.sql to use CONCURRENTLY for CREATE INDEX statements, or create indexes by hand:

   CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productcard_createdat ON "ProductCard" ("createdAt");
   CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_productid ON "Order" ("productId");
   -- etc.

Then run these statements against the database using psql or your DB admin tool.

Connection pooling (recommended approach)

Prisma's client manages connections itself; however for high-concurrency apps it's common to put a lightweight connection pooler (PgBouncer) between the app and Postgres so many app connections multiplex over a smaller set of DB connections.

Local development example using PgBouncer (optional)

1) Add a PgBouncer service to docker-compose and run a local Postgres. Example snippet (not applied automatically):

services:
  pgbouncer:
    image: edoburu/pgbouncer
    environment:
      - DATABASE_URL=postgres://postgres:postgres@postgres:5432/postgres
    ports:
      - "6432:6432"
    volumes:
      - ./pgbouncer:/etc/pgbouncer
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_PASSWORD=postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

Configure your backend to point to PgBouncer by setting DATABASE_URL to pgsql://postgres:postgres@pgbouncer:6432/postgres (or use host/port form).

Production notes

- For cloud-managed Postgres (e.g., Neon, RDS), some providers recommend using their connection pooling solution or a connection proxy. Follow provider-specific docs.
- If using Prisma Data Proxy (hosted by Prisma), it provides pooling optimizations without PgBouncer.

Verifying query plans (EXPLAIN ANALYZE)

To confirm an index is used and measure query performance:

1) Connect to your Postgres with psql or any SQL client.
2) Run:

   EXPLAIN ANALYZE SELECT * FROM "ProductCard" WHERE "gameId" = 123 ORDER BY "createdAt" DESC LIMIT 10;

3) Inspect the plan output: look for Index Scan on idx_productcard_gameid (or similar) and check the actual time. If you see Seq Scan you may need an index that matches the query (e.g., composite index on gameId + createdAt).

If query patterns include both filtering by a FK and ordering by createdAt, consider a composite index for that pattern:

   CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_productcard_gameid_createdat ON "ProductCard" ("gameId", "createdAt" DESC);

Follow-up suggestions (can implement on request)

- Add composite indexes for heavy query patterns once those patterns are observed in production (use EXPLAIN ANALYZE to confirm).
- Add an automated check or a simple endpoint that runs a representative query with EXPLAIN ANALYZE (only in non-production or protected routes) for spot checks.
- If desired, add an optional PgBouncer service to the repository docker-compose with configuration and a sample DATABASE_URL mapping.

If you want, next steps I can do for you

- Create a migration file and run prisma migrate dev locally to apply these index changes (development DB required).
- Add an optional PgBouncer service to docker-compose.yml and wire the backend DATABASE_URL to it for local pooling testing.
- Add a small endpoint /tools/db-plan that runs EXPLAIN ANALYZE for a given query (dev-only) so you can fetch execution plans from the app.

Notes

- Indexes speed reads but add overhead to writes; pick only those used by queries. Use EXPLAIN ANALYZE to validate.
- For large tables use CREATE INDEX CONCURRENTLY in Postgres to avoid blocking writes.

