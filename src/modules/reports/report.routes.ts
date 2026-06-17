import { Router } from "express";
import { ReportController } from "./report.controller.js";
import { ReportService } from "./report.service.js";
import { authenticate } from "../../middlewares/auth.middlewares.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { getMonthlyReportQuerySchmea } from "./report.validation.js";
import { categoryIdParamsSchema } from "../categories/category.validation.js";

const reportController = new ReportController(new ReportService());
export const reportRouter = Router();

reportRouter
  .route("/monthly")
  .get(
    authenticate,
    validate(getMonthlyReportQuerySchmea, "query"),
    reportController.getMonthlyReport,
  );

reportRouter
  .route("/categories/:categoryId")
  .get(
    authenticate,
    validate(categoryIdParamsSchema, "params"),
    reportController.getExpenseReportByCategory,
  );
