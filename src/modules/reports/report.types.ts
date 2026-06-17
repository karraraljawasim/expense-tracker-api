import { Types } from "mongoose";

export type GetMonthlyReportResponseDto = {
  totalExpensesOveral: number;
  totalCategories: number;
  spendingByCategory: {
    categoryId: Types.ObjectId;
    totalSpend: number;
    avargSpend: number;
    expenseCount: number;
  }[];
};
