import { jwtUtils } from "../../src/utils/jwt.js";

export function getAuthToken(user: any) {
  return jwtUtils.signRefreshToken({ sub: { id: user._id, role: user.role } });
}
