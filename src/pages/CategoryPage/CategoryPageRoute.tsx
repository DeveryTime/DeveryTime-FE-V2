import { useSearchParams } from "react-router-dom";
import { CATEGORIES } from "../../constants/categories";
import CategoryPage from "./CategoryPage";

const CategoryPageRoute = () => {
  const [searchParams] = useSearchParams();
  const rawId = searchParams.get("categoryId");
  const categoryId = Number(rawId);
  if (!rawId || !Number.isSafeInteger(categoryId) || categoryId < 1) {
    return <p role="alert">유효하지 않은 카테고리입니다.</p>;
  }
  const category = CATEGORIES.find((item) => item.id === categoryId);
  if (!category) return <p role="alert">존재하지 않는 카테고리입니다.</p>;

  return <CategoryPage key={category.id} categoryId={category.id} categoryName={category.name} />;
};

export default CategoryPageRoute;
