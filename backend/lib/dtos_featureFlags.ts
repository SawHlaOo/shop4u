import { z } from "zod";

export const flagSchema = z.object({
  key: z.string().trim().min(2),
  enabled: z.boolean().optional(),
  description: z.string().trim().optional(),
});
