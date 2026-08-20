import express from "express";
import { auth } from "../middlewares/auth.js";
import { featureFlagsController } from "../controllers/featureFlagsController.js";
import { validateBody } from "../middlewares/validate.js";
import { flagSchema } from "../lib/dtos_featureFlags.js";

export const router = express.Router();

const isDev = process.env.NODE_ENV !== "production";

router.get("/feature-flags", featureFlagsController.listFlags);
router.get("/feature-flags/:key", featureFlagsController.getFlag);
router.post("/feature-flags", auth, validateBody(flagSchema), featureFlagsController.createFlag);
router.patch("/feature-flags/:key", auth, validateBody(flagSchema.partial()), featureFlagsController.updateFlag);
router.delete("/feature-flags/:key", auth, featureFlagsController.deleteFlag);

if (isDev) {
  router.post("/dev/feature-flags", validateBody(flagSchema), featureFlagsController.createFlagDev);
  router.patch("/dev/feature-flags/:key", validateBody(flagSchema.partial()), featureFlagsController.updateFlagDev);
  router.delete("/dev/feature-flags/:key", featureFlagsController.deleteFlagDev);
}
