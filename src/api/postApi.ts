import client from "./client";
import type { CreatePostRequest, CreatePostResponse } from "../types/posts.types";

export const createPostApi = async (
  data: CreatePostRequest,
): Promise<CreatePostResponse> => {
  const response = await client.post<CreatePostResponse>("/posts", data);
  return response.data;
};
