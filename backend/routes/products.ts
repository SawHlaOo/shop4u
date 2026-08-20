import express from "express";
import { auth } from "../middlewares/auth";
import { productsController } from "../controllers/productsController";
import { validateBody } from "../middlewares/validate";
import { createProductSchema, editProductSchema } from "../lib/dtos_products";
import { deprecatedHandler } from "../lib/compat";

export const router = express.Router();

router.get("/games", productsController.listGames);
router.get("/games/:id", productsController.getGame);
// deprecated singular route mapped to /games/:id
router.get(
  "/game/:id",
  deprecatedHandler((req, res, next) => productsController.getGame(req, res), "Deprecated endpoint: use GET /games/:id instead")
);

router.get("/apps", productsController.listApps);
router.get("/apps/:id", productsController.getApp);
router.get("/powerpoints", productsController.listPowerPoints);
router.get("/powerpoints/:id", productsController.getPowerPoint);

router.post("/games", auth, validateBody(createProductSchema), productsController.createGame);
router.patch("/games/:id", auth, validateBody(editProductSchema), productsController.updateGame);
router.delete("/games/:id", auth, productsController.deleteGame);

router.post("/apps", auth, validateBody(createProductSchema), productsController.createApp);
router.patch("/apps/:id", auth, validateBody(editProductSchema), productsController.updateApp);
router.delete("/apps/:id", auth, productsController.deleteApp);

router.post("/powerpoints", auth, validateBody(createProductSchema), productsController.createPowerPoint);
router.patch("/powerpoints/:id", auth, validateBody(editProductSchema), productsController.updatePowerPoint);
router.delete("/powerpoints/:id", auth, productsController.deletePowerPoint);
