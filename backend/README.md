# onlineshops

This backend uses Prisma and PostgreSQL, designed for a Neon PostgreSQL deployment on Vercel.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set `DATABASE_URL` to your Neon PostgreSQL connection URL in the environment or `.env` file:
   ```bash
   DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?sslmode=require"
   JWT_SECRET="<your-secret>"
   ```
3. Create or update the database schema:
   ```bash
   npm run db:push
   ```
4. Populate initial data for development:
   ```bash
   npm run db:seed
   ```
5. Start the API:
   ```bash
   npm run dev
   ```

If you see `The table ... does not exist` when querying the API, run `npm run db:push` to sync the Prisma schema with the database. If there is no data yet, run `npm run db:seed` to populate sample catalog and feature flag records.

Vercel deployment notes

- Deploy `backend` as its own Vercel project (set **Root Directory** to `backend`).
  The default export in `index.ts` is detected as the Express serverless function.
- Set `DATABASE_URL`, `JWT_SECRET`, and `FRONTEND_URLS` in the Vercel project
  environment variables. `FRONTEND_URLS` is a comma-separated list of the
  exact production frontend origins, for example `https://shop.example.com`.
- Use the Neon pooled or direct Postgres connection string exactly in the service environment.
  Keep `sslmode=require` enabled for Neon compatibility.
- Do not set `REDIS_URL` or `REDIS_HOST` unless a managed Redis service and a
  separately hosted queue worker are available. Vercel functions are not
  persistent workers.

Frontend deployment

Deploy `frontend` as a separate Vercel project with its Root Directory set to
`frontend`. Set `VITE_API_URL` to the backend deployment URL (without a trailing
slash), then redeploy the frontend. Add the frontend URL to `FRONTEND_URLS` in
the backend and redeploy the backend.

Health and readiness endpoints

- Liveness: GET /healthz — returns 200 when the server process is alive
- Readiness: GET /ready — returns 200 when the server can reach the database (and Redis, if configured). Use these for Kubernetes probes or load balancer checks.
