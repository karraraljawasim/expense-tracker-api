import { z } from "zod";

export const getMonthlyReportQuerySchmea = z.object({
  page: z.string().optional().default("1"),
  pageSize: z.string().optional().default("10"),
  month: z.string().regex(/^\d{4}-\d{2}$/, {
    message: "Must be in YYYY-MM format",
  }),
});

export type GetMonthlyReportQuery = z.infer<typeof getMonthlyReportQuerySchmea>;
