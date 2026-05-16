export type JwtPayload = {
  sub: { id: string; role: "admin" | "uesr" };
  type: "refresh" | "access";
};

export type TokenPair = {
  refreshToken: string;
  accessToken: string;
};
