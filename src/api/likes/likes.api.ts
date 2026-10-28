import client from "../client";
import type { PostLikeData } from "./likes.types";
import type { PostLikeResponse } from "./response/likes.response";

const likePost = async (postId: number): Promise<PostLikeData> => {
  const response = await client.post<PostLikeResponse>(
    `/posts/${postId}/likes`,
  );

  return response.data.data;
};

const unlikePost = async (postId: number): Promise<PostLikeData> => {
  const response = await client.delete<PostLikeResponse>(
    `/posts/${postId}/likes`,
  );

  return response.data.data;
};

const likesApi = {
  likePost,
  unlikePost,
};

export default likesApi;
