import { Types } from "mongoose";
import { IExpense } from "../expenses/expense.types.js";

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

export type GetExpenseReportByCategoryResponseDto = {
  totalSpendOverall: number;
  top3ExpensiveExpenses: IExpense[];
};
