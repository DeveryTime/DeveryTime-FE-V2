import type { PostListResponseItem } from "../posts.types";

export interface PostListResponse {
  content: PostListResponseItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
