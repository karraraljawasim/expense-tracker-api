import { Schema, model } from "mongoose";

const userShema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      min: [8, "Too short password"],
    },
    currency: {
      type: String,
      uppercase: true,
      default: "USD",
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true },
);

const Users = model("Users", userShema);

export default Users;
