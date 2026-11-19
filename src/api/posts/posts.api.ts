import client from "../client";
import commentsApi from "../comments/comments.api";
import type { PostCommentListResponse } from "../comments/response/comments.response";
import likesApi from "../likes/likes.api";
import type { PostLikeData } from "../likes/likes.types";
import type {
  CreatePostRequest,
  GetMyPostsRequest,
  PostListParams,
  UpdatePostRequest,
} from "./request/posts.request";
import type {
  CreatePostResponse,
  PostDetailResponse,
  PostListResponse,
  ReplacePostImageResponse,
  UpdatePostResponse,
  UploadPostImagesResponse,
} from "./response/posts.response";
import type { PostDetailData, PostListData } from "./posts.types";

const getPosts = async (params: PostListParams): Promise<PostListData> => {
  const response = await client.get<PostListResponse>("/posts", { params });

  return response.data.data;
};

const getMyPosts = async (
  params: GetMyPostsRequest,
): Promise<PostListData> => {
  const response = await client.get<PostListResponse>("/users/me/posts", {
    params,
  });

  return response.data.data;
};

const getPost = async (postId: number): Promise<PostDetailData> => {
  const response = await client.get<PostDetailResponse>(`/posts/${postId}`);

  return response.data.data;
};

const createPost = async (request: CreatePostRequest): Promise<number> => {
  const response = await client.post<CreatePostResponse>("/posts", request);
  const body = response.data;
  const postId =
    "data" in body
      ? typeof body.data === "number"
        ? body.data
        : body.data.id
      : body.id;

  if (!Number.isInteger(postId) || postId <= 0) {
    throw new Error("게시글 생성 응답에 올바른 게시글 ID가 없습니다.");
  }

  return postId;
};

const likePost = (postId: number): Promise<PostLikeData> =>
  likesApi.likePost(postId);

const unlikePost = (postId: number): Promise<PostLikeData> =>
  likesApi.unlikePost(postId);

const getComments = (postId: number): Promise<PostCommentListResponse> =>
  commentsApi.getComments(postId);

const deletePost = async (postId: number): Promise<void> => {
  await client.delete(`/posts/${postId}`);
};

const uploadPostImages = async (
  postId: number,
  files: File[],
) => {
  const formData = new FormData();

  files.forEach((file) => formData.append("files", file));

  const response = await client.post<UploadPostImagesResponse>(
    `/posts/${postId}/images`,
    formData,
    { headers: { "Content-Type": undefined } },
  );

  return response.data.data;
};

const replacePostImage = async (
  postId: number,
  imageId: number,
  file: File,
) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await client.put<ReplacePostImageResponse>(
    `/posts/${postId}/images/${imageId}`,
    formData,
    { headers: { "Content-Type": undefined } },
  );

  return response.data.data;
};

const updatePost = async (
  postId: number,
  request: UpdatePostRequest,
): Promise<UpdatePostResponse> => {
  const response = await client.put<UpdatePostResponse>(
    `/posts/${postId}`,
    request,
  );

  return response.data;
};

const postsApi = {
  getPosts,
  getMyPosts,
  getPost,
  createPost,
  likePost,
  unlikePost,
  getComments,
  deletePost,
  uploadPostImages,
  replacePostImage,
  updatePost,
};

export default postsApi;
