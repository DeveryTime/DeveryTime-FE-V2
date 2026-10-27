import type {
  CreateCommentData,
  PostComment,
  UpdateCommentData,
} from "../comments.types";

export interface PostCommentListResponse {
  success: boolean;
  data: PostComment[];
}

export interface CreateCommentResponse {
  success: boolean;
  data: CreateCommentData;
  message: string;
}

export interface UpdateCommentResponse {
  success: boolean;
  data: UpdateCommentData;
  message: string;
}

export interface DeleteCommentResponse {
  success: boolean;
  data: null;
  message: string;
}
