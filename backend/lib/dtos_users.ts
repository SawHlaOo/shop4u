import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().trim().min(1),
});

export const registrationSchema = z.object({
  name: z.string().trim().min(1),
  username: z.string().trim().min(3),
  email: z.string().trim().email(),
  password: z.string().trim().min(6),
  bio: z.string().trim().optional(),
  role: z.literal("USER").default("USER"),
});
