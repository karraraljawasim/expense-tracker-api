import { z } from "zod";

export const getAllTriggeredAlertsQueryschema = z.object({
  isRead: z.boolean().optional().default(false),
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, {
      message: "Must be in YYYY-MM format",
    })
    .optional()
    .default(() => {
      const now = new Date();
      const startOfCurrentMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1,
      );
      return startOfCurrentMonth.toISOString().slice(0, 7);
    }),
});

export type GetAllTriggeredAlertsQueryDto = z.infer<
  typeof getAllTriggeredAlertsQueryschema
>;
