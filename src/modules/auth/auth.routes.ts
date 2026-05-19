import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { validate } from "../../middlewares/validation.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

const authController = new AuthController(new AuthService());

export const authRouter = Router();

authRouter
  .route("/register")
  .post(validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);
