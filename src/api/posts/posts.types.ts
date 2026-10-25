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

export type PostSort = "likes" | "latest" | "views";

export interface PostListResponseItem {
  id: number;
  title: string;
  category: string;
  createdAt: string;
}

export interface MyPostListResponseItem {
  id: number;
  title: string;
  categoryName: string;
  createdAt: string;
}

export interface PostWriter {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface PostCategory {
  id: number;
  name: string;
}

export interface PostImage {
  id: number;
  imageUrl: string;
  sortOrder: number;
}

export interface PostDetailResponseData {
  id: number;
  title: string;
  content: string;
  status: string;
  viewCount: number;
  writer: PostWriter;
  category: PostCategory;
  images: PostImage[];
  likeCount?: number;
  liked?: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface UploadPostImageData {
  id: number;
  imageUrl: string;
  sortOrder: number;
}
