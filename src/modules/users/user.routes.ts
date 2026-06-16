import { Router } from "express";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { authenticate } from "../../middlewares/auth.middlewares.js";
import { validate } from "../../middlewares/validation.middleware.js";
import {
  paginateQury,
  updateuserSchema,
  userIdParamsSchma,
} from "./user.validation.js";

const userController = new UserController(new UserService());

export const userRouter = Router();

userRouter
  .route("/")
  .get(authenticate, validate(paginateQury, "query"), userController.getAll);

userRouter
  .route("/:userId")
  .get(
    authenticate,
    validate(userIdParamsSchma, "params"),
    userController.getById,
  )
  .patch(
    authenticate,
    validate(userIdParamsSchma, "params"),
    validate(updateuserSchema),
    userController.updateById,
  );

userRouter
  .route("/:userId/soft-delete")
  .patch(
    authenticate,
    validate(userIdParamsSchma, "params"),
    userController.softDeleteById,
  );
