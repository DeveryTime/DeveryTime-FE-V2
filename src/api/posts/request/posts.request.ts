import type { PostSort } from "../posts.types";

export interface PostListParams {
  page: number;
  size: number;
  sort: PostSort;
  categoryId?: number;
}

export interface GetMyPostsRequest {
  page: number;
  size: number;
}

export interface UpdatePostRequest {
  userId: number;
  title: string;
  content: string;
}

export interface CreatePostRequest {
  title: string;
  content: unknown;
  categoryId?: number;
}

export interface UploadPostImageRequest {
  file: File;
  sortOrder?: number;
}
