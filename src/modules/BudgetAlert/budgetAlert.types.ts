import { Types } from "mongoose";

export type IBudgetAlert = {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  month: string;
  budgetLimit: number;
  spentAmount: number;
  percentage: number;
  alertType: "warning" | "exceeded";
  triggered: boolean;
  triggeredAt: Date | null;
  isRead: boolean;
  createdAt: Date;
};
