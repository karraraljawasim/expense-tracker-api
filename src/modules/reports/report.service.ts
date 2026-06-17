import { Types } from "mongoose";
import { Expense } from "../expenses/expense.modle.js";
import { GetMonthlyReportQuery } from "./report.validation.js";
import { GetMonthlyReportResponseDto } from "./report.types.js";
import { PaginationResponseDto } from "../../types/pagination.js";

export interface IReportService {
  getMonthlyReport: (
    query: GetMonthlyReportQuery,
    userId: string,
  ) => Promise<PaginationResponseDto<GetMonthlyReportResponseDto>>;
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
}
