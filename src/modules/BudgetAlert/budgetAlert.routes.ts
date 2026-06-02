import { Router } from "express";
import { BudgetAlertController } from "./budgetAlert.controller.js";
import { BudgetAlertService } from "./budgetAlert.service.js";
import { authenticate } from "../../middlewares/auth.middlewares.js";

const budgetAlertController = new BudgetAlertController(
  new BudgetAlertService(),
);

export const budgetAlertRouter = Router();

budgetAlertRouter
  .route("/")
  .get(authenticate, budgetAlertController.getMonthlyBudgetStatus);
