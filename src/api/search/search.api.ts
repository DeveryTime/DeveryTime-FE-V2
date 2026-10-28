import client from "../client";
import type { SearchRequest, SearchResponse } from "../../types/search.types";

export const searchApi = async (
  request: SearchRequest,
  signal?: AbortSignal,
): Promise<SearchResponse> => {
  const { data } = await client.post<SearchResponse>("/search", request, {
    signal,
  });

  return data;
};
