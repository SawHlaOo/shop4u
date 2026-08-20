import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
  image: z.string().trim().url().optional(),
  logo: z.string().trim().url().optional(),
  badge: z.string().trim().optional(),
});

export const editProductSchema = createProductSchema.partial();
