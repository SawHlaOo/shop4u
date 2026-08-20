import { RequestHandler } from "express";

// Wrap a current handler and mark the route as deprecated.
export function deprecatedHandler(handler: RequestHandler, message?: string): RequestHandler {
  return (req, res, next) => {
    // Add deprecation headers for clients and logs
    if (!res.headersSent) {
      res.setHeader("Deprecation", "true");
      if (message) res.setHeader("Warning", message);
    }
    try {
      return handler(req, res, next as any);
    } catch (err) {
      return next(err);
    }
  };
}
