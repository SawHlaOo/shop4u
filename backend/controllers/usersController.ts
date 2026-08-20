import { usersService } from "../services/usersService.js";
import { loginSchema, registrationSchema } from "../lib/dtos_users.js";

export const usersController = {
  verify: async (_req: any, res: any) => {
    const id = res.locals.user.id as number;
    const user = await usersService.verify(id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({ success: true, user });
  },

  login: async (req: any, res: any) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: "username and password are required" });
    }

    const result = await usersService.login(parsed.data);
    if (!result) {
      return res.status(401).json({ success: false, error: "invalid username or password" });
    }

    return res.json({ success: true, user: result.user, token: result.token });
  },

  register: async (req: any, res: any) => {
    const parsed = registrationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: "name, username, email, password and role are required" });
    }

    const result = await usersService.register(parsed.data);
    if (!result) {
      return res.status(409).json({ success: false, error: "username or email already exists" });
    }

    return res.status(201).json({ success: true, user: result.user, token: result.token });
  },

  deleteUser: async (req: any, res: any) => {
    const user = res.locals.user as { role?: string };
    if (user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid user id" });
    }

    const deleted = await usersService.deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({ success: true });
  },
};
