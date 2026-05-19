import type { Request, Response } from "express";
import { env } from "../../config/env.js";

const REFRESH_COOKIE_PATH = "/";
const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: REFRESH_COOKIE_MAX_AGE,
  path: REFRESH_COOKIE_PATH,
};

export const setRefreshCookie = (res: Response, token: string): void => {
  res.cookie(REFRESH_COOKIE_NAME, token, REFRESH_COOKIE_OPTIONS);
};

export const clearRefreshCookie = (res: Response): void => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    path: REFRESH_COOKIE_PATH,
  });
};

export const getRefreshCookie = (req: Request): string | undefined => {
  const fromCookie = req.cookies?.[REFRESH_COOKIE_NAME];
  if (fromCookie) return fromCookie;

  if (env.NODE_ENV !== "production") {
    return req.body?.refreshToken;
  }

  return undefined;
};
