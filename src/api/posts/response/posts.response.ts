import type {
  PostListData,
  PostDetailResponseData,
  UploadPostImageData,
} from "../posts.types";

export interface PostListResponse {
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
