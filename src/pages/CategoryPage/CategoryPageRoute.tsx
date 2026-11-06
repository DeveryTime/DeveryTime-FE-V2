import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import categoriesApi from "../../api/categories/categories.api";
import type { CategoryListData } from "../../api/categories/categories.types";
import CategoryPage from "./CategoryPage";

const CategoryPageRoute = () => {
  const [searchParams] = useSearchParams();
  const rawId = searchParams.get("categoryId");
  const categoryId = Number(rawId);
  const [categories, setCategories] = useState<CategoryListData[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    void categoriesApi.getCategories().then(
      (result) => { if (active) setCategories(result); },
      () => { if (active) setError(true); },
    );
    return () => { active = false; };
  }, []);

  if (!rawId || !Number.isSafeInteger(categoryId) || categoryId < 1) {
    return <p role="alert">유효하지 않은 카테고리입니다.</p>;
  }
  if (error) return <p role="alert">카테고리를 불러오지 못했습니다.</p>;
  if (!categories) return <p role="status">카테고리를 불러오는 중입니다...</p>;

  const category = categories.find((item) => item.id === categoryId);
  if (!category) return <p role="alert">존재하지 않는 카테고리입니다.</p>;

  return <CategoryPage key={category.id} categoryId={category.id} categoryName={category.name} />;
};

export default CategoryPageRoute;
