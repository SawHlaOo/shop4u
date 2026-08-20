import express from "express";
import { auth } from "../middlewares/auth";
import { usersController } from "../controllers/usersController";
import { validateBody } from "../middlewares/validate";
import { loginSchema, registrationSchema } from "../lib/dtos_users";
import { deprecatedHandler } from "../lib/compat";

export const router = express.Router();

router.get("/verify", auth, usersController.verify);
router.post("/login", validateBody(loginSchema), usersController.login);
router.post("/users", validateBody(registrationSchema), usersController.register);
// Deprecated convenience route mapped to new /users route
router.post(
  "/register",
  deprecatedHandler((req, res, next) => usersController.register(req, res), "Deprecated endpoint: use POST /users instead")
);
router.delete("/users/:id", auth, usersController.deleteUser);
