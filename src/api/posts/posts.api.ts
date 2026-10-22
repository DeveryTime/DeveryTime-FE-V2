import client from "../client";
import type {
  GetMyPostsRequest,
  PostListParams,
  UpdatePostRequest,
  UploadPostImageRequest,
} from "./request/posts.request";
import type {
  PostDetailResponse,
  PostListResponse,
  UpdatePostResponse,
  UploadPostImageResponse,
} from "./response/posts.response";
import type { PostDetailData } from "./posts.types";

const getPosts = async (params: PostListParams): Promise<PostListResponse> => {
  const response = await client.get<PostListResponse>("/posts", { params });

  return response.data;
};

const getMyPosts = async (
  params: GetMyPostsRequest,
): Promise<PostListResponse> => {
  const response = await client.get<PostListResponse>("/users/me/posts", {
    params,
  });

  return response.data;
};

const getPost = async (postId: number): Promise<PostDetailData> => {
  const response = await client.get<PostDetailResponse>(`/posts/${postId}`);

  return response.data;
};

const deletePost = async (postId: number): Promise<void> => {
  await client.delete(`/posts/${postId}`);
};

const uploadPostImage = async (
  postId: number,
  request: UploadPostImageRequest,
) => {
  const formData = new FormData();

  formData.append("file", request.file);
  formData.append("sortOrder", String(request.sortOrder ?? 0));

  const response = await client.post<UploadPostImageResponse>(
    `/posts/${postId}/images`,
    formData,
    { headers: { "content-Type": undefined } },
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
  deletePost,
  uploadPostImage,
  updatePost,
};

export default postsApi;
