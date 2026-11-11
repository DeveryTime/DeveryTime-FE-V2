import type {
  PostListData,
  PostDetailData,
  UploadPostImageData,
} from "../posts.types";

export interface PostListResponse {
  success: boolean;
  data: PostListData;
}

export interface CreatePostData {
  id: number;
  title: string;
  status: string;
  createdAt: string;
}

export type CreatePostResponse = CreatePostData | {
  success: boolean;
  data: number | CreatePostData;
  message?: string;
};

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
}

export interface UpdatePostResponse {
  id: number;
  title: string;
  updatedAt: string;
}

export interface PostDetailResponse {
  success: boolean;
  data: PostDetailData;
}

export interface UploadPostImageResponse {
  success: boolean;
  data: UploadPostImageData;
}

export type UploadPostImageErrorCode =
  | "UNAUTHORIZED"
  | "POST_NOT_FOUND"
  | "FORBIDDEN"
  | "INVALID_IMAGE_FILE"
  | "INVALID_IMAGE_TYPE"
  | "IMAGE_FILE_TOO_LARGE"
  | "IMAGE_UPLOAD_FAILED";

export interface UploadPostImageErrorResponse {
  success: false;
  error: {
    code: UploadPostImageErrorCode;
    message: string;
  };
}
