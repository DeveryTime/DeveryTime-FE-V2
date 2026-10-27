import type { PostLikeData } from "../likes.types";

export interface PostLikeResponse {
  success: boolean;
  data: PostLikeData;
  message: string;
}
