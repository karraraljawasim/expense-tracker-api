import { Types } from "mongoose";
import { Expense } from "../expenses/expense.modle.js";
import { GetMonthlyReportQuery } from "./report.validation.js";
import {
  GetExpenseReportByCategoryResponseDto,
  GetMonthlyReportResponseDto,
} from "./report.types.js";
import { PaginationResponseDto } from "../../types/pagination.js";
import Categories from "../categories/category.model.js";
import { NotFoundError } from "../../utils/AppError.js";

export interface IReportService {
  getMonthlyReport: (
    query: GetMonthlyReportQuery,
    userId: string,
  ) => Promise<PaginationResponseDto<GetMonthlyReportResponseDto>>;
  getExpenseReportByCategory: (
    categoryId: string,
    userId: string,
  ) => Promise<GetExpenseReportByCategoryResponseDto>;
}
export class ReportService implements IReportService {
  async getMonthlyReport(query: GetMonthlyReportQuery, userId: string) {
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;

    const date = new Date(query.month);

    const startMonth = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), 1),
    );
    const nextMonth = new Date(
      Date.UTC(date.getFullYear(), date.getMonth() + 1, 1),
    );

    const expenseReport = await Expense.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: startMonth, $lt: nextMonth },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$categoryId",
          totalSpendByCategory: { $sum: "$amountInBaseCurrency" },
          avargSpendByCategory: { $avg: "$amountInBaseCurrency" },
          expenseCountInCategory: { $sum: 1 },
        },
      },
      {
        $facet: {
          metaData: [
            {
              $group: {
                _id: null,
                totalCategories: { $sum: 1 },
                totalExpensesOverall: { $sum: "$expenseCountInCategory" },
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ]);

    const totalCategories = expenseReport[0]?.metaData[0]?.totalCategories || 0;
    const totalExpensesOverall =
      expenseReport[0]?.metaData[0]?.totalExpensesOverall || 0;

    return {
      totalExpensesOverall,
      totalCategories,
      spendingByCategory: expenseReport[0].data.map((row: any) => {
        return {
          categoryId: row?._id,
          totalSpend: row?.totalSpendByCategory,
          avargSpend: row?.avargSpendByCategory,
          expenseCount: row?.expenseCountInCategory,
        };
      }),
      metaData: {
        totalCount: totalCategories,
        page,
        pageSize,
        totalPages: Math.round(totalCategories / pageSize),
      },
    };
  }

  async getExpenseReportByCategory(categoryId: string, userId: string) {
    const category = await Categories.findOne({
      _id: new Types.ObjectId(categoryId),
      userId,
      isDeleted: false,
    });

    if (!category) {
      throw new NotFoundError("Category");
    }

    const expenseReport = await Expense.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          categoryId: new Types.ObjectId(categoryId),
          isDeleted: false,
        },
      },
      {
        $sort: {
          amountInBaseCurrency: -1,
        },
      },
      {
        $facet: {
          metaData: [
            {
              $group: {
                _id: null,
                totalSpendOverall: { $sum: "$amountInBaseCurrency" },
              },
            },
          ],
          expensiveExpenses: [
            { $limit: 3 },
            {
              $project: {
                amount: 99.99,
                currency: 1,
                amountInBaseCurrency: 1,
                exchangeRateUsed: 1,
                note: 1,
                date: 1,
                isRecurring: 1,
                recurrence: 1,
              },
            },
          ],
        },
      },
    ]);

    return {
      totalSpendOverall: expenseReport[0]?.metaData[0]?.totalSpendOverall || 0,
      top3ExpensiveExpenses: expenseReport[0]?.expensiveExpenses || null,
    };
  }
}
