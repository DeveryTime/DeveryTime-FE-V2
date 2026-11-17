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
  categoryId: number;
  title: string;
  content: string;
  status: "PUBLISHED";
  deleteImageIds?: number[];
}

export interface CreatePostRequest {
  title: string;
  content: string;
  categoryId: number;
  status: "PUBLISHED";
}

export interface UploadPostImageRequest {
  file: File;
  sortOrder?: number;
}
