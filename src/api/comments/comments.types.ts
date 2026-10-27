export interface PostComment {
  id: number;
  userId: number;
  authorName: string;
  content: string;
  createdAt: string;
  profileImageUrl: string | null;
}

export interface CreateCommentData {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface UpdateCommentData {
  id: number;
  content: string;
  updatedAt: string;
}
