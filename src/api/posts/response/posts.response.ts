import type {
  PostListResponseItem,
  PostListData,
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

export interface CreatePostData {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface CreatePostResponse {
  success: boolean;
  data: CreatePostData;
  message: string;
}

export type CreatePostErrorCode =
  | "USER_NOT_FOUND"
  | "CATEGORY_NOT_FOUND"
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR";

export interface CreatePostErrorResponse {
  success: false;
  error: {
    code: CreatePostErrorCode;
    message: string;
  };
  success: boolean;
  data: PostListData;
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
