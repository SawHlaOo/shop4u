import type { ErrorRequestHandler } from 'express';

// Centralized error handler that logs full errors server-side but
// returns sanitized responses to clients to avoid leaking internal details
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Log full error for diagnostics
  console.error(err);

  // Sanitize Prisma and low-level DB errors so we don't expose credentials or stack traces
  const isPrismaError = err && (err.name && String(err.name).toLowerCase().startsWith('prisma') || /prisma/i.test(String(err.message || '')) || /authentication failed/i.test(String(err.message || '')));

  if (isPrismaError) {
    return res.status(503).json({ success: false, error: 'Database unavailable' });
  }

  // For other errors, preserve statusCode if present, otherwise 500
  const status = (err && (err.statusCode || err.status)) || 500;
  const message = err && err.message ? String(err.message) : 'Internal server error';
  return res.status(status).json({ success: false, error: message });
};
