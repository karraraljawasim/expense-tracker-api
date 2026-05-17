import { Schema, model } from "mongoose";

const userShema = new Schema(
  {
    name: {
      type: String,
      min: [2, "Too short name"],
      max: 100,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
      min: [8, "Too short password"],
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "IQD"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true },
);

const User = model("User", userShema);

export default User;
