import mongoose, { Schema, model } from "mongoose";
import { IRefreshToken } from "./auth.types.js";

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

// Indexes
refreshTokenSchema.index({ userId: 1 });

const RefreshToken = model<IRefreshToken>("RefreshToken", refreshTokenSchema);

export default RefreshToken;
