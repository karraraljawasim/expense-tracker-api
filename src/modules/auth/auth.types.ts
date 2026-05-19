export type JwtPayload = {
  sub: { id: string; role: "admin" | "user" };
  type: "refresh" | "access";
};

export type TokenPair = {
  refreshToken: string;
  accessToken: string;
};
