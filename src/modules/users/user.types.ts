export type UserRole = "user" | "admin";

export type IUser = {
  name: string;
  email: string;
  passwordHash: string;
  currency: string;
  role: UserRole;
  isDeleted: boolean;
  createAt?: Date;
  updateAt?: Date;
};
