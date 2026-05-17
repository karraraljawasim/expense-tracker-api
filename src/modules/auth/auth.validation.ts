import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Too short name"),
  email: z.string().email(),
  password: z.string().min(8, "Too short password"),
  currency: z.enum(["USD", "IQD"]).default("USD"),
  role: z.enum(["admin", "user"]).default("user"),
});

export type RegisterUserRequestDto = z.infer<typeof registerSchema>;
