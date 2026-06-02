import { Types } from "mongoose";
import { BudgetAlert } from "./budgetAlert.modle.js";
import Categories from "../categories/category.model.js";
import { Expense } from "../expenses/expense.modle.js";
import { MonthlyBudgetResponse } from "./budgetAlert.types.js";

export interface IBudgetAlertService {
  getMonthlyBudgetStatus: (userId: string) => Promise<MonthlyBudgetResponse>;
}
export class BudgetAlertService implements IBudgetAlertService {
  async getMonthlyBudgetStatus(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const userCategories = await Categories.find({ userId, isDeleted: false });

    const result = await Expense.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: startOfMonth, $lt: startOfNextMonth },
          categoryId: {
            $in: userCategories.map((c) => new Types.ObjectId(c._id)),
          },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$categoryId",
          totalSpent: { $sum: "$amountInBaseCurrency" },
        },
      },
    ]);

    const categorySpend = await Promise.all(
      userCategories.map(async (category) => {
        const categoryExpense = result.find(
          (expense) => String(expense._id) === String(category._id),
        );

        const totalSpent = categoryExpense ? categoryExpense.totalSpent : 0;

        const budgetLimit = category.budgetLimit || 0;

        let percentage;
        if (budgetLimit === 0) {
          percentage = 0;
        } else {
          percentage = (totalSpent / budgetLimit) * 100;
          percentage = Math.round(percentage / 100) * 100;
        }

        let status: "safe" | "warning" | "exceeded";

        if (percentage >= 80 && percentage < 100) {
          status = "warning";
        } else if (percentage >= 100) {
          status = "exceeded";
        } else {
          status = "safe";
        }

        const budgetAlert = await BudgetAlert.findOne({
          categoryId: category._id,
          userId,
        });

        return {
          category: {
            _id: category._id.toString(),
            name: category.name,
            color: category.color,
          },
          budgetLimit,
          totalSpent,
          percentage,
          remaining: percentage
            ? Math.round(totalSpent / percentage)
            : totalSpent,
          status,
          alerts: {
            warning: budgetAlert ? budgetAlert.alertType === "warning" : false,
            exceeded: budgetAlert
              ? budgetAlert.alertType === "exceeded"
              : false,
          },
        };
      }),
    );

    const totalBudget = categorySpend.reduce(
      (sum, c) => sum + c.budgetLimit,
      0,
    );
    const totalSpent = categorySpend.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalRemaining = categorySpend.reduce(
      (sum, c) => sum + c.remaining,
      0,
    );
    let categoriesExceeded = 0;
    categorySpend.forEach((c) => {
      c.status === "exceeded"
        ? (categoriesExceeded += 1)
        : (categoriesExceeded += 0);
    });
    let categoriesWarning = 0;
    categorySpend.forEach((c) => {
      c.status === "warning"
        ? (categoriesWarning += 1)
        : (categoriesWarning += 0);
    });

    let categoriesSafe = 0;
    categorySpend.forEach((c) => {
      c.status === "safe" ? (categoriesSafe += 1) : (categoriesSafe += 0);
    });

    return {
      month: startOfMonth,
      categories: categorySpend,
      summary: {
        totalBudget,
        totalSpent,
        totalRemaining,
        categoriesExceeded,
        categoriesWarning,
        categoriesSafe,
      },
    };
  }
}
