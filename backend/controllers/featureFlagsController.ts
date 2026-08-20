import { featureFlagsService } from "../services/featureFlagsService.js";
import { flagSchema } from "../lib/dtos_featureFlags.js";

export const featureFlagsController = {
  listFlags: async (_req: any, res: any) => {
    try {
      const flags = await featureFlagsService.listFlags();
      return res.json({ success: true, data: flags });
    } catch (_error) {
      return res.status(500).json({ success: false, error: "Unable to load feature flags" });
    }
  },

  getFlag: async (req: any, res: any) => {
    try {
      const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
      if (!key) {
        return res.status(400).json({ success: false, error: "Feature flag key is required" });
      }

      const flag = await featureFlagsService.getFlag(key);
      if (!flag) {
        return res.status(404).json({ success: false, error: "Feature flag not found" });
      }

      return res.json({ success: true, data: flag });
    } catch (_error) {
      return res.status(500).json({ success: false, error: "Unable to load feature flag" });
    }
  },

  createFlag: async (req: any, res: any) => {
    try {
      const user = res.locals.user as { id: number; role?: string };
      if (user.role !== "ADMIN") {
        return res.status(403).json({ success: false, error: "Admin access required" });
      }

      const parsed = flagSchema.parse(req.body);
      const flag = await featureFlagsService.createFlag(parsed);
      return res.status(201).json({ success: true, data: flag });
    } catch (_error) {
      return res.status(400).json({ success: false, error: "Unable to create feature flag" });
    }
  },

  updateFlag: async (req: any, res: any) => {
    try {
      const user = res.locals.user as { id: number; role?: string };
      if (user.role !== "ADMIN") {
        return res.status(403).json({ success: false, error: "Admin access required" });
      }

      const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
      if (!key) {
        return res.status(400).json({ success: false, error: "Feature flag key is required" });
      }

      const parsed = flagSchema.partial().parse(req.body);
      const flag = await featureFlagsService.updateFlag(key, parsed);
      return res.json({ success: true, data: flag });
    } catch (_error) {
      return res.status(400).json({ success: false, error: "Unable to update feature flag" });
    }
  },

  deleteFlag: async (req: any, res: any) => {
    try {
      const user = res.locals.user as { id: number; role?: string };
      if (user.role !== "ADMIN") {
        return res.status(403).json({ success: false, error: "Admin access required" });
      }

      const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
      if (!key) {
        return res.status(400).json({ success: false, error: "Feature flag key is required" });
      }

      await featureFlagsService.deleteFlag(key);
      return res.json({ success: true });
    } catch (_error) {
      return res.status(400).json({ success: false, error: "Unable to delete feature flag" });
    }
  },

  createFlagDev: async (req: any, res: any) => {
    try {
      const parsed = flagSchema.parse(req.body);
      const flag = await featureFlagsService.createFlag(parsed);
      return res.status(201).json({ success: true, data: flag });
    } catch (_error) {
      return res.status(400).json({ success: false, error: "Unable to create feature flag (dev)" });
    }
  },

  updateFlagDev: async (req: any, res: any) => {
    try {
      const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
      if (!key) {
        return res.status(400).json({ success: false, error: "Feature flag key is required" });
      }

      const parsed = flagSchema.partial().parse(req.body);
      const flag = await featureFlagsService.updateFlag(key, parsed);
      return res.json({ success: true, data: flag });
    } catch (_error) {
      return res.status(400).json({ success: false, error: "Unable to update feature flag (dev)" });
    }
  },

  deleteFlagDev: async (req: any, res: any) => {
    try {
      const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
      if (!key) {
        return res.status(400).json({ success: false, error: "Feature flag key is required" });
      }

      await featureFlagsService.deleteFlag(key);
      return res.json({ success: true });
    } catch (_error) {
      return res.status(400).json({ success: false, error: "Unable to delete feature flag (dev)" });
    }
  },
};
