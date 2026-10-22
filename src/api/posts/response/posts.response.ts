import type {
  PostListResponseItem,
  PostDetailResponseData,
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

export interface PostDetailResponse {
  success: boolean;
  data: PostDetailResponseData;
}

export interface UploadPostImageResponse {
  success: boolean;
  data: UploadPostImageData;
}
