import { it, describe, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { jwtUtils } from "../../src/utils/jwt.js";

describe("Test registeration fanctionalty", () => {
  const endpoint = "/api/auth/register";
  const registerPayload = {
    name: "test",
    email: "test@exmpile.com",
    password: "11111111",
    role: "admin",
  };

  it("Should return refersh and access tokens", async () => {
    const res = await request(app).post(endpoint).send(registerPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("Disallows duplicated email", async () => {
    await request(app).post(endpoint).send(registerPayload).expect(201);

    await request(app).post(endpoint).send(registerPayload).expect(409);
  });

  it("Should set refersh token in cookies on successful registeration", async () => {
    const res = await request(app)
      .post(endpoint)
      .send(registerPayload)
      .expect(201);

    expect(res.header["set-cookie"]).toBeDefined();
    const cookies = Array.isArray(res.header["set-cookie"])
      ? res.header["set-cookie"]
      : [];
    expect(
      cookies.some((cookie: string) => cookie.startsWith("refreshToken=")),
    ).toBe(true);
  });

  it("Should generate tokens with correct payload", async () => {
    const res = await request(app)
      .post(endpoint)
      .send(registerPayload)
      .expect(201);

    const cookies = Array.isArray(res.header["set-cookie"])
      ? res.header["set-cookie"]
      : [];
    const refreshTokenCookies = cookies.find((cookie: string) =>
      cookie.startsWith("refreshToken="),
    ) as string;

    const accessToken = res.body.data.accessToken;

    expect(refreshTokenCookies).toBeDefined();
    expect(accessToken).toBeDefined();

    const refreshToken = refreshTokenCookies?.split(";")[0]?.split("=")[1];

    const verifyRefreshToken = jwtUtils.verifyRefreshToken(refreshToken);
    const verifyAccessToken = jwtUtils.verifyAccessToken(accessToken);

    expect(verifyAccessToken.sub).toBeDefined();
    expect(verifyAccessToken.type).toBe("access");
    expect(verifyAccessToken.sub.role).toBe("admin");

    expect(verifyRefreshToken.sub).toBeDefined();
    expect(verifyRefreshToken.type).toBe("refresh");
    expect(verifyRefreshToken.sub.role).toBe("admin");
  });
});
