import client from "../client";
import type { CategoriesResponse } from "./response/categories.response";
import type { CategoryListData } from "./categories.types";

const getCategories = async (): Promise<CategoryListData[]> => {
  const response = await client.get<CategoriesResponse>("/categories");

  return response.data.data;
};

const categoriesApi = {
  getCategories,
};

export default categoriesApi;
