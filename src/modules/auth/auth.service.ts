import bcrypt from "bcrypt";
import RefreshToken from "./auth.model.js";
import { RegisterUserRequestDto } from "./auth.validation.js";
import User from "../users/user.model.js";
import { ConflictError } from "../../utils/AppError.js";
import { jwtUtils } from "../../utils/jwt.js";
import { TokenPair } from "./auth.types.js";

const EXPIRES_REFRESH_TOKEN = 1000 * 60 * 60 * 24 * 7;
export interface IAuthService {
  register: (input: RegisterUserRequestDto) => Promise<TokenPair>;
}

export class AuthService implements IAuthService {
  async register(input: RegisterUserRequestDto) {
    const userExist = await User.findOne({ email: input.email });
    if (userExist) {
      throw new ConflictError("User");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const newUser = await User.create({
      ...input,
      passwordHash: passwordHash,
    });

    const tokenPair = jwtUtils.signPair({
      sub: {
        id: newUser.id,
        role: newUser.role,
      },
    });

    await RefreshToken.create({
      userId: newUser.id,
      token: tokenPair.refreshToken,
      expiresAt: new Date(Date.now() + EXPIRES_REFRESH_TOKEN),
    });

    return tokenPair;
  }
}
