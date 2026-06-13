import { paginationQuery } from "../../types/pagination.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { IUserService } from "./user.service.js";

export class UserController {
  readonly #userService: IUserService;
  constructor(userService: IUserService) {
    this.#userService = userService;
  }

  getById = asyncHandler(async (req, res) => {
    const data = await this.#userService.getById(
      req.params.userId as string,
      req.user!.role,
    );

    ApiResponse.success(res, data);
  });

  getAll = asyncHandler(async (req, res) => {
    const query = req.validateQuery as paginationQuery;

    const data = await this.#userService.getAll(req.user!.role, query);

    ApiResponse.paginationData(res, data);
  });

  softDeleteById = asyncHandler(async (req, res) => {
    const data = await this.#userService.softDeleteById(
      req.params.userId as string,
      req.user!.role,
    );

    ApiResponse.success(res, data);
  });

  updateById = asyncHandler(async (req, res) => {
    const data = await this.#userService.updateById(
      req.params.userId as string,
      req.user!.role,
      req.body,
    );

    ApiResponse.success(res, data);
  });
}
