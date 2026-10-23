import client from "../client";
import type {
  CreateCommentRequest,
  UpdateCommentRequest,
} from "./request/comments.request";
import type {
  CreateCommentResponse,
  DeleteCommentResponse,
  PostCommentListResponse,
  UpdateCommentResponse,
} from "./response/comments.response";
import type { CreateCommentData, UpdateCommentData } from "./comments.types";

const getComments = async (postId: number): Promise<PostCommentListResponse> => {
  const response = await client.get<PostCommentListResponse>(
    `/posts/${postId}/comments`,
  );

  return response.data;
};

const createComment = async (
  postId: number,
  request: CreateCommentRequest,
): Promise<CreateCommentData> => {
  const response = await client.post<CreateCommentResponse>(
    `/posts/${postId}/comments`,
    request,
  );

  return response.data.data;
};

const updateComment = async (
  postId: number,
  commentId: number,
  request: UpdateCommentRequest,
): Promise<UpdateCommentData> => {
  const response = await client.patch<UpdateCommentResponse>(
    `/posts/${postId}/comments/${commentId}`,
    request,
  );

  return response.data.data;
};

const deleteComment = async (
  postId: number,
  commentId: number,
): Promise<DeleteCommentResponse> => {
  const response = await client.delete<DeleteCommentResponse>(
    `/posts/${postId}/comments/${commentId}`,
  );

  return response.data;
};

const commentsApi = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};

export default commentsApi;
