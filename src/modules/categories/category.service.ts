import {
  AppError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/AppError.js";
import User from "../users/user.model.js";
import Categories from "./category.model.js";
import { Category } from "./category.types.js";
import {
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
} from "./category.validation.js";

export interface ICategoryService {
  create: (
    input: CreateCategoryRequestDto & { userId: string },
  ) => Promise<void>;

  getAll: (userId: string) => Promise<Category[]>;
  getOneById: (categoryId: string, userId: string) => Promise<Category>;
  updateById: (
    input: UpdateCategoryRequestDto,
    categoryId: string,
    userId: string,
  ) => Promise<void>;

  deleteById: (categoryId: string, userId: string) => Promise<void>;
}

export class CategoryService implements ICategoryService {
  async create(input: CreateCategoryRequestDto & { userId: string }) {
    const categoryExist = await Categories.findOne({ name: input.name });
    if (categoryExist) {
      throw new ConflictError("Category with same name");
    }

    if (!input.currency && input.userId) {
      const user = await User.findById(input.userId);
      if (user && user.currency) {
        input.currency = user.currency;
      }
    }

    const newCategory = await Categories.create({ ...input });
    if (!newCategory) {
      throw new AppError("Create new category failed");
    }
  }

  async getAll(userId: string) {
    const categories = await Categories.find({ userId: userId });

    return categories;
  }

  async getOneById(categoryId: string, userId: string) {
    const category = await Categories.findById(categoryId);
    if (!category) {
      throw new NotFoundError("Category");
    }

    if (!category.userId.equals(userId)) {
      throw new UnauthorizedError("You not owner to this category");
    }

    return category;
  }

  async updateById(
    input: UpdateCategoryRequestDto,
    categoryId: string,
    userId: string,
  ) {
    const categoryExist = await Categories.findById({ _id: categoryId });
    if (!categoryExist) {
      throw new NotFoundError("Category");
    }

    if (!categoryExist.userId.equals(userId)) {
      throw new UnauthorizedError("You not owner to this category");
    }

    const updatedCateogry = await Categories.updateOne(
      { _id: categoryId },
      { ...input },
      { timestamps: true },
    );

    if (!updatedCateogry) {
      throw new AppError("Update category failed");
    }
  }

  async deleteById(categoryId: string, userId: string) {
    const categoryExist = await Categories.findById(categoryId);
    if (!categoryExist) {
      throw new NotFoundError("Category");
    }

    if (!categoryExist.userId.equals(userId)) {
      throw new UnauthorizedError("You not owner to this cateogry");
    }

    const deletedCategory = await Categories.deleteOne({ _id: categoryId });
    if (!deletedCategory) {
      throw new AppError("Delete category failed");
    }
  }
}
