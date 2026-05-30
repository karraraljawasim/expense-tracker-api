import { z } from "zod";
import { Types } from "mongoose";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Too short category name")
    .max(255, "Too long category name"),
  color: z.string(),
  budgetLimit: z.number().min(0, "Budget limit must be a positive number"),
  currency: z.enum(["USD", "IQD"]).optional(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Too short category name")
    .max(255, "Too long category name")
    .optional(),
  color: z.string().optional(),
  budgetLimit: z
    .number()
    .min(0, "Budget limit must be a positive number")
    .optional(),
  currency: z.enum(["USD", "IQD"]).optional(),
});

export const categoryIdParamsSchema = z.object({
  categoryId: z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: "Invalid Mongoose ObjectId",
  }),
});

export type CreateCategoryRequestDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryRequestDto = z.infer<typeof updateCategorySchema>;
