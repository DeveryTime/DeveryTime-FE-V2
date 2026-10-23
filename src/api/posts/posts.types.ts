export interface PostTableItem {
  id: number;
  number: number;
  category: string;
  title: string;
  createdAt: string;
}

export interface PostListItemType extends PostTableItem {
  categoryId: number;
  viewCount: number;
  likeCount: number;
}

export type PostSort =
  | "likeCount,desc"
  | "createdAt,desc"
  | "viewCount,desc";

export interface PostListResponseItem {
  id: number;
  title: string;
  writerId: number;
  categoryName: string;
  createdAt: string;
  likeCount: number;
}

export interface PostDetailResponseData {
  id: number;
  title: string;
  content: string;
  status: string;
  viewCount: number;
  writerId: number;
  writerNickname: string;
  writerProfileImageUrl: string | null;
  categoryName: string;
  imageUrls: string[];
  likeCount: number;
  liked: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface UploadPostImageData {
  id: number;
  imageUrl: string;
  sortOrder: number;
}
