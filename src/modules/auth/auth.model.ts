import mongoose, { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema(
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

const RefreshToken = model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
