export type IUser = {
  name: string;
  email: string;
  passwordHash: string;
  currency: string;
  role: "user" | "admin";
  createAt?: Date;
  updateAt?: Date;
};
