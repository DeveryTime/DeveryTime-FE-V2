import type {
  PostDetailData,
  PostListResponseItem,
  UploadPostImageData,
} from "../posts.types";

export interface PostListResponse {
  content: PostListResponseItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UpdatePostResponse {
  id: number;
  title: string;
  updatedAt: string;
}

export type PostDetailResponse = PostDetailData;

export interface UploadPostImageResponse {
  success: boolean;
  data: UploadPostImageData;
}
