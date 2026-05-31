import { z } from "zod";
import { Types } from "mongoose";

export const recurrenceSchema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  interval: z.number().min(1, "Min interval is 1"),
  startDate: z.string(),
  endDate: z.string().nullable().default(null),
});

export const createExpenseSchema = z.object({
  categoryId: z.string().refine((vlaue) => Types.ObjectId.isValid(vlaue), {
    message: "Invalid object id",
  }),
  amount: z.number().min(0, "Amount must be gerater than 0"),
  currency: z.string().optional().default("USD"),
  note: z.string().max(500, "Too long note").nullable().default(null),
  date: z.string(),
  isRecurring: z.boolean().optional().default(false),
  recurrence: recurrenceSchema.nullable().default(null),
  attachmentUrl: z.string().nullable().default(null),
});

export type CreateExpenseRequestDto = z.infer<typeof createExpenseSchema>;
