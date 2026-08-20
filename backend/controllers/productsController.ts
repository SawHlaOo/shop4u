import { productsService } from "../services/productsService";
import { createProductSchema, editProductSchema } from "../lib/dtos_products";

export const productsController = {
  listGames: async (_req: any, res: any) => {
    const games = await productsService.listGames();
    return res.json({ success: true, data: games });
  },

  getGame: async (req: any, res: any) => {
    const id = Number(req.params?.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid game id" });
    }

    const game = await productsService.getGame(id);
    if (!game) {
      return res.status(404).json({ success: false, error: "Game not found" });
    }

    return res.json({ success: true, data: game });
  },

  listApps: async (_req: any, res: any) => {
    const apps = await productsService.listApps();
    return res.json({ success: true, data: apps });
  },

  getApp: async (req: any, res: any) => {
    const id = Number(req.params?.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, error: "Invalid app id" });
    const app = await productsService.getApp(id);
    return app ? res.json({ success: true, data: app }) : res.status(404).json({ success: false, error: "App not found" });
  },

  listPowerPoints: async (_req: any, res: any) => {
    const slides = await productsService.listPowerPoints();
    return res.json({ success: true, data: slides });
  },

  getPowerPoint: async (req: any, res: any) => {
    const id = Number(req.params?.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ success: false, error: "Invalid presentation id" });
    const powerpoint = await productsService.getPowerPoint(id);
    return powerpoint ? res.json({ success: true, data: powerpoint }) : res.status(404).json({ success: false, error: "Presentation not found" });
  },

  createGame: async (req: any, res: any) => {
    const user = res.locals.user as { role?: string };
    if (user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const parsed = createProductSchema.parse(req.body);
    const game = await productsService.createGame(parsed);
    return res.status(201).json({ success: true, data: game });
  },

  updateGame: async (req: any, res: any) => {
    const user = res.locals.user as { role?: string };
    if (user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const parsed = editProductSchema.parse(req.body);
    const game = await productsService.updateGame(Number(req.params.id), parsed);
    return res.json({ success: true, data: game });
  },

  deleteGame: async (req: any, res: any) => {
    const user = res.locals.user as { role?: string };
    if (user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    await productsService.deleteGame(Number(req.params.id));
    return res.json({ success: true });
  },

  createApp: async (req: any, res: any) => {
    const user = res.locals.user as { role?: string };
    if (user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const parsed = createProductSchema.parse(req.body);
    const app = await productsService.createApp(parsed);
    return res.status(201).json({ success: true, data: app });
  },

  updateApp: async (req: any, res: any) => {
    const user = res.locals.user as { role?: string };
    if (user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const parsed = editProductSchema.parse(req.body);
    const app = await productsService.updateApp(Number(req.params.id), parsed);
    return res.json({ success: true, data: app });
  },

  deleteApp: async (req: any, res: any) => {
    const user = res.locals.user as { role?: string };
    if (user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    await productsService.deleteApp(Number(req.params.id));
    return res.json({ success: true });
  },

  createPowerPoint: async (req: any, res: any) => {
    const user = res.locals.user as { role?: string };
    if (user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const parsed = createProductSchema.parse(req.body);
    const powerpoint = await productsService.createPowerPoint(parsed);
    return res.status(201).json({ success: true, data: powerpoint });
  },

  updatePowerPoint: async (req: any, res: any) => {
    const user = res.locals.user as { role?: string };
    if (user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    const parsed = editProductSchema.parse(req.body);
    const powerpoint = await productsService.updatePowerPoint(Number(req.params.id), parsed);
    return res.json({ success: true, data: powerpoint });
  },

  deletePowerPoint: async (req: any, res: any) => {
    const user = res.locals.user as { role?: string };
    if (user.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }

    await productsService.deletePowerPoint(Number(req.params.id));
    return res.json({ success: true });
  },
};
