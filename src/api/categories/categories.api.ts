import client from "../client";
import type { CategoriesResponse } from "./response/categories.response";

const getCategories = async (): Promise<CategoriesResponse> => {
  const response = await client.get<CategoriesResponse>("/categories");

  return response.data;
};

const categoriesApi = {
  getCategories,
};

export default categoriesApi;
