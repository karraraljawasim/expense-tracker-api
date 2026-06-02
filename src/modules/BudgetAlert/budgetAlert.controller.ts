import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { IBudgetAlertService } from "./budgetAlert.service.js";

export class BudgetAlertController {
  readonly #budgetAlertService: IBudgetAlertService;

  constructor(budgetAlertService: IBudgetAlertService) {
    this.#budgetAlertService = budgetAlertService;
  }

  getMonthlyBudgetStatus = asyncHandler(async (req, res) => {
    const data = await this.#budgetAlertService.getMonthlyBudgetStatus(
      req.user!.id,
    );

    ApiResponse.success(res, data);
  });
}
