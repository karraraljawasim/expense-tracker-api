export type IUser = {
  name: string;
  email: string;
  passwordHash: string;
  currency: string;
  role: "user" | "admin";
  isDeleted: boolean;
  createAt?: Date;
  updateAt?: Date;
};
