import client from "../client";
import type { GetMyPostsRequest } from "./request/posts.request";
import type { PostListResponse } from "./response/posts.response";

const getMyPosts = async (
  params: GetMyPostsRequest,
): Promise<PostListResponse> => {
  const response = await client.get<PostListResponse>("/users/me/posts", {
    params,
  });

  return response.data;
};

const postsApi = {
  getMyPosts,
};

export default postsApi;
