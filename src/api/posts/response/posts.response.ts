import type {
  PostListResponseItem,
  PostDetailResponseData,
  UploadPostImageData,
} from "../posts.types";

export interface PageSort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PostPageData {
  content: PostListResponseItem[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: PageSort;
    unpaged: boolean;
  };
  size: number;
  sort: PageSort;
  totalElements: number;
  totalPages: number;
}

export interface PostListResponse {
  success: boolean;
  data: PostPageData;
}

export interface UpdatePostResponse {
  id: number;
  title: string;
  updatedAt: string;
}

export interface PostDetailResponse {
  success: boolean;
  data: PostDetailResponseData;
}

export interface UploadPostImageResponse {
  success: boolean;
  data: UploadPostImageData;
}
