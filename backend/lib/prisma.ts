import "dotenv/config";
import { PrismaClient, Prisma } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const configuredDatabaseUrl = process.env.DATABASE_URL;
// Do not crash the whole function during module initialization when an
// environment variable was missed in Vercel. Requests that need the database
// will return the existing sanitized 503 response, while /healthz stays useful.
const databaseUrl = configuredDatabaseUrl || "postgresql://unconfigured:unconfigured@127.0.0.1:1/unconfigured";

export const isDatabaseConfigured = Boolean(configuredDatabaseUrl);

const adapter = new PrismaPg({
  connectionString: databaseUrl,
  max: 1,
  connectionTimeoutMillis: 5_000,
});

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
globalForPrisma.prisma = prisma;

export { prisma, Prisma };
