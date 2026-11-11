export interface CategoryListData {
  id: number;
  name: string;
}

export type Category = CategoryListData;

export interface CategoryResponseProps {
  success: boolean;
  data: CategoryListData[];
}
