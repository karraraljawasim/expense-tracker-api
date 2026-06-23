import { Router } from "express";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { authenticate } from "../../middlewares/auth.middlewares.js";
import { validate } from "../../middlewares/validation.middleware.js";
import {
  paginateQuery,
  updateUserSchema,
  userIdParamsSchema,
} from "./user.validation.js";

const userController = new UserController(new UserService());

export const userRouter = Router();

userRouter
  .route("/")
  .get(authenticate, validate(paginateQuery, "query"), userController.getAll);

userRouter
  .route("/:userId")
  .get(
    authenticate,
    validate(userIdParamsSchema, "params"),
    userController.getById,
  )
  .patch(
    authenticate,
    validate(userIdParamsSchema, "params"),
    validate(updateUserSchema),
    userController.updateById,
  );

userRouter
  .route("/:userId/soft-delete")
  .patch(
    authenticate,
    validate(userIdParamsSchema, "params"),
    userController.softDeleteById,
  );
