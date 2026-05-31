import { Types } from "mongoose";

export type IRecurrence = {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  startDate: Date;
  endDate: Date | null;
  nextRunAt: Date;
  parentId: Types.ObjectId | null;
};

export type IExpense = {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amount: number;
  currency: string;
  amountInBaseCurrency: number;
  exchangeRateUsed: number;
  note: string | null;
  date: Date;
  isRecurring: boolean;
  recurrence: IRecurrence | null;
  attachmentUrl: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};
