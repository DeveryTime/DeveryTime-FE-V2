export interface PostTableItem {
  id: number;
  number: number;
  category: string;
  title: string;
  createdAt: string;
}

export interface PostListItemType extends PostTableItem {
  categoryId: number;
  viewCount: number;
  likeCount: number;
}

export type PostSort = "likes" | "latest" | "views";

export interface PostListParams {
  page: number;
  size: number;
  sort: PostSort;
  categoryId?: number;
}

export interface PostListResponseItem {
  id: number;
  title: string;
  category: string;
  createdAt: string;
}

export interface PostListResponse {
  content: PostListResponseItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UpdatePostRequest {
  userId: number;
  title: string;
  content: string;
}

export interface UpdatePostResponse {
  id: number;
  title: string;
  updatedAt: string;
}

export interface PostDetailData {
  id: number;
  title: string;
  content: string;
  status: string;
  viewCount: number;
  writerNickname: string;
  writerProfileImageUrl: string | null;
  categoryName: string;
  imageUrls: string[];
  likeCount: number;
  liked: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface PostDetailResponse {
  success: boolean;
  data: PostDetailData;
}

export interface PostLikeData {
  postId: number;
  userId: number;
  liked: boolean;
}

export interface PostLikeResponse {
  success: boolean;
  data: PostLikeData;
  message: string;
}

export interface PostComment {
  id: number;
  userId: number;
  authorName: string;
  content: string;
  createdAt: string;
  profileImageUrl: string | null;
}

export interface PostCommentListResponse {
  success: boolean;
  data: PostComment[];
}

export interface CreateCommentRequest {
  content: string;
}

export interface CreateCommentData {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface CreateCommentResponse {
  success: boolean;
  data: CreateCommentData;
  message: string;
}

export interface DeleteCommentResponse {
  success: boolean;
  data: null;
  message: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface UpdateCommentData {
  id: number;
  content: string;
  updatedAt: string;
}

export interface UpdateCommentResponse {
  success: boolean;
  data: UpdateCommentData;
  message: string;
}

export interface UploadPostImageRequest {
  file: File;
  sortOrder?: number;
}

export interface UploadPostImageData {
  id: number;
  imageUrl: string;
  sortOrder: number;
}
