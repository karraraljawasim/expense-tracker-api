import { Types } from "mongoose";

export type Category = {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  color: string;
  currency: "USD" | "IQD";
  createAt?: Date;
  updateAt?: Date;
};
