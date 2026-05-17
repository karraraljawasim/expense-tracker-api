import { env } from "../../config/env.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { setRefreshCookie } from "./auth.cookie.js";
import { IAuthService } from "./auth.service.js";

export class AuthController {
  readonly authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  register = asyncHandler(async (req, res) => {
    const tokens = await this.authService.register(req.body);
    setRefreshCookie(res, tokens.refreshToken);

    ApiResponse.create(res, {
      accessToken: tokens.accessToken,
      ...(env.NODE_ENV !== "production" && {
        refreshToken: tokens.refreshToken,
      }),
    });
  });
}
