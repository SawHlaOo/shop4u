import { z, ZodError } from "zod";
import { RequestHandler } from "express";

export function validateBody(schema: z.ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = (result.error as ZodError).format();
      return res.status(400).json({ success: false, error: "Validation failed", details: issues });
    }
    // replace body with parsed data (sanitized)
    req.body = result.data;
    return next();
  };
}

export function validateQuery(schema: z.ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const issues = (result.error as ZodError).format();
      return res.status(400).json({ success: false, error: "Validation failed", details: issues });
    }
    req.query = result.data as any;
    return next();
  };
}

export function validateParams(schema: z.ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const issues = (result.error as ZodError).format();
      return res.status(400).json({ success: false, error: "Validation failed", details: issues });
    }
    req.params = result.data as any;
    return next();
  };
}
