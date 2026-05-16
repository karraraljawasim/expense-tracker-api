import jwt from "jsonwebtoken";
import type { JwtPayload, TokenPair } from "../modules/auth/auth.types.js";
import { env } from "../config/env.js";
import { AppError } from "./AppError.js";

export const jwtUtils = {
  signAccessToken(payload: Omit<JwtPayload, "type">): string {
    return jwt.sign({ ...payload, type: "access" }, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRE as any,
    });
  },

  signRefreshToken(payload: Omit<JwtPayload, "type">): string {
    return jwt.sign({ ...payload, type: "refresh" }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRE as any,
    });
  },

  signPair(payload: Omit<JwtPayload, "type">): TokenPair {
    return {
      accessToken: this.signAccessToken(payload),
      refreshToken: this.signRefreshToken(payload),
    };
  },

  verifyAccessToken(token: string): JwtPayload {
    const payload = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET,
    ) as unknown as JwtPayload;

    if (payload.type !== "access") {
      throw new AppError("Invalid token type");
    }

    return payload;
  },

  verifyRefreshToken(token: string): JwtPayload {
    const payload = jwt.verify(
      token,
      env.JWT_REFRESH_SECRET,
    ) as unknown as JwtPayload;

    if (payload.type !== "refresh") {
      throw new AppError("Invalid token type");
    }

    return payload;
  },
};
