export interface SearchRequest {
  keyword: string;
  page: number;
  size: number;
  sort: string;
}

export interface SearchUser {
  id: number;
  username: string;
  nickname: string;
}

export interface SearchPost {
  id: number;
  title: string;
  writerId: number;
  categoryName: string;
  createdAt: string;
  likeCount: number;
}

export interface SearchPostsPage {
  content: SearchPost[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface SearchData {
  users: SearchUser[];
  posts: SearchPostsPage;
}

export interface SearchSuccessResponse {
  success: true;
  data: SearchData;
}

export type SearchErrorCode = "VALIDATION_ERROR" | "UNAUTHORIZED";

export interface SearchErrorResponse {
  success: false;
  error: {
    code: SearchErrorCode;
    message: string;
  };
}

export type SearchResponse = SearchSuccessResponse | SearchErrorResponse;
