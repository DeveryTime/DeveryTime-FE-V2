import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import PostMarkdown from "./PostMarkdown";
import S from "./PostDetailModal.styles";
import { X, UserRound } from "lucide-react";
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor";
import commentIcon from "../../../assets/comment.svg";
import likeDefaultIcon from "../../../assets/Like.svg";
import likeActiveIcon from "../../../assets/Like-active.svg";
import KebabMenu from "../../../assets/Kebab-menu.svg";
import type {
  PostComment,
  PostDetailData,
  UpdatePostRequest,
} from "../../../types/posts.types";
import postsApi from "../../../api/posts.api";
import commentsApi from "../../../api/comments/comments.api";
import likesApi from "../../../api/likes/likes.api";

interface PostDetailModalProps {
  post: PostDetailData;
  currentUserId: number;
  onClose: () => void;
  onDelete: (postId: number) => void | Promise<void>;
  onUpdate?: (postId: number, title: string, content: string) => void;
  isLikeEnabled?: boolean;
  isMyPost?: boolean;
}

// 게시글 작성일을 상세 모달에 표시할 형식으로 변환한다.
const formatPostDate = (dateString: string) => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

// 댓글 작성일을 짧은 날짜 형식으로 변환한다.
const CommentDate = (dateString: string) => {
  const setCommentDate = new Date(dateString);

  return new Intl.DateTimeFormat("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  })
    .format(setCommentDate)
    .replace(/\.$/, "");
};

const PostDetailModal = ({
  post,
  currentUserId,
  onClose,
  onDelete,
  onUpdate,
  isLikeEnabled = true,
  isMyPost = false,
}: PostDetailModalProps) => {
  // 좋아요 상태와 게시글의 좋아요 개수를 관리한다.
  const [isLiked, setIsLiked] = useState(post.liked ?? false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const currentPostRef = useRef(post);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // 의도적으로 게시글 상태 변경 시점에만 동기화한다.
  useLayoutEffect(() => {
    currentPostRef.current = post;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLiked(post.liked ?? false);
    setLikeCount(post.likeCount ?? 0);
    setIsLikeLoading(false);
    setLikeError(null);
  }, [post.id, post.liked, post.likeCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // 게시글 메뉴와 댓글 메뉴의 열림 상태를 관리한다.
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [openCommentMenuId, setOpenCommentMenuId] = useState<number | null>(
    null,
  );

  // API에서 조회한 댓글 목록과 댓글 조회 상태를 관리한다.
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isCommentError, setIsCommentError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [commentSubmitError, setCommentSubmitError] = useState<string | null>(
    null,
  );
  const [editingCommentId, setEditingCommentId] = useState<number | null>(
    null,
  );
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [commentActionError, setCommentActionError] = useState<string | null>(
    null,
  );
  const [isCommentActionLoading, setIsCommentActionLoading] = useState(false);
  const [commentReloadKey, setCommentReloadKey] = useState(0);

  // 게시글 수정 모드 여부를 관리한다.
  const [isPostEditing, setIsPostEditing] = useState(false);
  const [editingPostTitle, setEditingPostTitle] = useState("");
  const [editingPostContent, setEditingPostContent] = useState("");
  const [postUpdateError, setPostUpdateError] = useState<string | null>(null);
  const [isPostSaving, setIsPostSaving] = useState(false);
  const [displayedPostTitle, setDisplayedPostTitle] = useState(post.title);
  const [displayedPostContent, setDisplayedPostContent] = useState(
    post.content,
  );

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayedPostTitle(post.title);
    setDisplayedPostContent(post.content);
  }, [post.id, post.title, post.content]);

  // 좋아요 등록·취소 API를 호출하고 성공했을 때만 화면 상태를 변경한다.
  const handleLikeClick = async () => {
    if (!isLikeEnabled || isLikeLoading) {
      return;
    }

    const requestedPostId = post.id;
    setLikeError(null);
    setIsLikeLoading(true);

    try {
      const likeResult = isLiked
        ? await likesApi.unlikePost(requestedPostId)
        : await likesApi.likePost(requestedPostId);

      if (currentPostRef.current.id !== requestedPostId) {
        return;
      }

      setLikeCount((previous) => {
        if (likeResult.liked === isLiked) {
          return previous;
        }

        return likeResult.liked ? previous + 1 : Math.max(0, previous - 1);
      });
      setIsLiked(likeResult.liked);
    } catch {
      if (currentPostRef.current.id === requestedPostId) {
        setLikeError("좋아요 처리에 실패했습니다.");
      }
    } finally {
      if (currentPostRef.current.id === requestedPostId) {
        setIsLikeLoading(false);
      }
    }
  };

  const handlePostDelete = async () => {
    setDeleteError(null);
    try {
      await onDelete(post.id);
    } catch {
      setDeleteError("게시글을 삭제하지 못했습니다.");
    }
  };

  // 게시글 수정 모드를 시작하고 게시글 메뉴를 닫는다.
  const handlePostEditStart = () => {
    setIsPostEditing(true);
    setIsPostMenuOpen(false);
    setEditingPostTitle(displayedPostTitle);
    setEditingPostContent(displayedPostContent);
    setPostUpdateError(null);
  };

  // post.id가 마운트 될 때 댓글 목록을 불러오는 코드
  useEffect(() => {
    let isActive = true;

    const fetchComments = async () => {
      setIsCommentLoading(true);
      setIsCommentError(null);

      try {
        const response = await commentsApi.getComments(post.id);
        if (isActive) {
          setComments(response.data);
        }
      } catch {
        if (isActive) {
          setIsCommentError("댓글을 조회하는데 실패했습니다.");
        }
      } finally {
        if (isActive) {
          setIsCommentLoading(false);
        }
      }
    };

    void fetchComments();

    return () => {
      isActive = false;
    };
  }, [post.id, commentReloadKey]);

  const handleCommentSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const trimmedComment = commentContent.trim();
    if (!trimmedComment || isCommentSubmitting) return;

    setIsCommentSubmitting(true);
    setCommentSubmitError(null);

    try {
      await commentsApi.createComment(post.id, { content: trimmedComment });
      setCommentContent("");
      setCommentReloadKey((current) => current + 1);
    } catch {
      setCommentSubmitError("댓글을 작성하지 못했습니다.");
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  // 내 댓글의 수정 입력창을 열고, 열려 있던 메뉴는 닫는다.
  const handleCommentEditStart = (comment: PostComment): void => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
    setOpenCommentMenuId(null);
    setCommentActionError(null);
  };

  const handleCommentEditSave = async (
    event: FormEvent<HTMLFormElement>,
    commentId: number,
  ): Promise<void> => {
    event.preventDefault();

    const trimmedComment = editingCommentContent.trim();
    if (!trimmedComment || isCommentActionLoading) return;

    setIsCommentActionLoading(true);
    setCommentActionError(null);

    try {
      const updatedComment = await commentsApi.updateComment(post.id, commentId, {
        content: trimmedComment,
      });
      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: updatedComment.content }
            : comment,
        ),
      );
      setEditingCommentId(null);
      setEditingCommentContent("");
    } catch {
      setCommentActionError("댓글을 수정하지 못했습니다.");
    } finally {
      setIsCommentActionLoading(false);
    }
  };

  const handleCommentDelete = async (commentId: number): Promise<void> => {
    if (isCommentActionLoading || !window.confirm("댓글을 삭제할까요?")) {
      return;
    }

    setIsCommentActionLoading(true);
    setCommentActionError(null);
    setOpenCommentMenuId(null);

    try {
      await commentsApi.deleteComment(post.id, commentId);
      setComments((currentComments) =>
        currentComments.filter((comment) => comment.id !== commentId),
      );
    } catch {
      setCommentActionError("댓글을 삭제하지 못했습니다.");
    } finally {
      setIsCommentActionLoading(false);
    }
  };

  //게시글 수정 저장 함수 로직
  const handlePostEditSave = async () => {
    const trimmedPostTitle = editingPostTitle.trim();
    const trimmedPostContent = editingPostContent.trim();

    setPostUpdateError(null);

    if (isPostSaving || trimmedPostTitle === "" || trimmedPostContent === "") {
      return;
    }

    const updateData: UpdatePostRequest = {
      userId: currentUserId,
      title: trimmedPostTitle,
      content: trimmedPostContent,
    };
    setIsPostSaving(true);
    try {
      await postsApi.updatePost(post.id, updateData);

      setDisplayedPostTitle(trimmedPostTitle);
      setDisplayedPostContent(trimmedPostContent);
      onUpdate?.(post.id, trimmedPostTitle, trimmedPostContent);
      setIsPostEditing(false);
    } catch {
      setPostUpdateError("게시물을 수정하는데 실패하였습니다.");
    } finally {
      setIsPostSaving(false);
    }
  };

  return (
    <S.DetailDialog
      onClose={onClose}
      aria-labelledby="post-detail-title"
      closeIcon={<X aria-hidden="true" />}
    >
      <S.ModalScrollArea>
        <S.DetailContent>
          {/* 작성자 정보와 게시글 메뉴 */}
          <S.PostHeader>
            {post.writerProfileImageUrl ? (
              <S.ProfileImage src={post.writerProfileImageUrl} alt="" />
            ) : (
              <S.DefaultProfileImage>
                <UserRound aria-hidden="true" />
              </S.DefaultProfileImage>
            )}
            <S.WriterInfo>
              <S.WriterName> {post.writerNickname} </S.WriterName>
              <S.PostMeta>
                {formatPostDate(post.createdAt)} - {post.viewCount} 조회
              </S.PostMeta>
            </S.WriterInfo>

            <S.PostMenuArea>
              <S.PostMenuButton
                type="button"
                aria-label="게시글 메뉴"
                disabled={isPostEditing}
                onClick={() => setIsPostMenuOpen((previous) => !previous)}
                aria-expanded={isPostMenuOpen}
              >
                <S.KebabIcon src={KebabMenu} alt="" />
              </S.PostMenuButton>

              {isPostMenuOpen && (
                <S.PostMenuPopover>
                  {!isMyPost && (
                    <S.ReportPopoverLink
                      href="https://docs.google.com/forms/d/e/1FAIpQLSeLaXHB-Wo9VVqcbNtGBlzQtL5rscli2KoiMpWsRs277_8Qbw/viewform"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      신고하기
                    </S.ReportPopoverLink>
                  )}

                  {isMyPost && (
                    <>
                      <S.CommentEditButton
                        type="button"
                        aria-label="게시글 수정"
                        onClick={handlePostEditStart}
                      >
                        글 수정
                      </S.CommentEditButton>

                      <S.CommentDeleteButton
                        type="button"
                        aria-label="게시글 삭제"
                        onClick={handlePostDelete}
                      >
                        삭제하기
                      </S.CommentDeleteButton>
                    </>
                  )}
                  {deleteError && (
                    <p role="alert">{deleteError}</p>
                  )}
                </S.PostMenuPopover>
              )}
            </S.PostMenuArea>
          </S.PostHeader>

          {isPostEditing ? (
            <S.PostEditForm>
              <S.PostTitle id="post-detail-title">게시글 수정</S.PostTitle>
              <S.PostEditTitleInput
                value={editingPostTitle}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setEditingPostTitle(event.target.value)}
                aria-label="게시글 제목"
                disabled={isPostSaving}
              />
              {postUpdateError && <p role="alert">{postUpdateError}</p>}
              <MarkdownEditor
                value={editingPostContent}
                onChange={setEditingPostContent}
                disabled={isPostSaving}
                actions={
                  <S.PostEditActions>
                    <S.PostEditCancelButton type="button" variant="secondary" disabled={isPostSaving} onClick={() => setIsPostEditing(false)}>
                      취소
                    </S.PostEditCancelButton>
                    <S.PostEditSaveButton type="button" variant="primary" onClick={handlePostEditSave} disabled={isPostSaving || !editingPostTitle.trim() || !editingPostContent.trim()}>
                      {isPostSaving ? "저장 중" : "저장"}
                    </S.PostEditSaveButton>
                  </S.PostEditActions>
                }
              />
            </S.PostEditForm>
          ) : (
            <>
              <S.PostTitle id="post-detail-title">{displayedPostTitle}</S.PostTitle>
              <S.PostContent><PostMarkdown content={displayedPostContent} /></S.PostContent>
            </>
          )}
          {post.imageUrls.length > 0 && (
            <S.ImageList>
              {post.imageUrls.map((imageUrl, index) => (
                <S.ContentImage
                  key={`${imageUrl}-${index}`}
                  src={imageUrl}
                  alt={`${displayedPostTitle} 첨부된 이미지`}
                />
              ))}
            </S.ImageList>
          )}
        </S.DetailContent>

        {/* 좋아요와 댓글 개수 */}
        <S.ReactionBar>
          <S.LikeButton
            type="button"
            onClick={handleLikeClick}
            aria-pressed={isLiked}
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            disabled={!isLikeEnabled || isLikeLoading}
          >
            <img src={isLiked ? likeActiveIcon : likeDefaultIcon} alt="" />
            <S.LikeCount>{likeCount}</S.LikeCount>
          </S.LikeButton>

          <S.CommentInfo>
            <S.CommentImage src={commentIcon} alt="" />
            <S.CommentCount> {comments.length} </S.CommentCount>
          </S.CommentInfo>
        </S.ReactionBar>
        {likeError && <p role="alert">{likeError}</p>}

        {/* 댓글 목록과 댓글별 메뉴 */}
        <S.CommentList>
          {isCommentLoading && <p> 댓글을 불러오는 중입니다... </p>}

          {!isCommentLoading && !isCommentError && (
            <>
              {comments.map((comment) => (
                <S.CommentItem key={comment.id}>
                  <S.CommentHeader>
                    <S.CommentAuthor>
                      {comment.profileImageUrl ? (
                        <S.CommentProfile
                          src={comment.profileImageUrl}
                          alt=""
                        />
                      ) : (
                        <S.CommentDefaultProfileImage>
                          <UserRound aria-hidden="true" />
                        </S.CommentDefaultProfileImage>
                      )}
                      {comment.authorName}
                    </S.CommentAuthor>

                    <S.CommentMenuArea>
                      <S.CommentDateCreatedAt>
                        {CommentDate(comment.createdAt)}
                      </S.CommentDateCreatedAt>

                      <S.CommentButton
                        type="button"
                        aria-label="댓글 메뉴"
                        onClick={() =>
                          setOpenCommentMenuId((previous) =>
                            previous === comment.id ? null : comment.id,
                          )
                        }
                        aria-expanded={openCommentMenuId === comment.id}
                      >
                        <S.KebabIcon src={KebabMenu} alt="" />
                      </S.CommentButton>
                      {openCommentMenuId === comment.id && (
                        <S.CommentMenuPopover>
                          {currentUserId === comment.userId ? (
                            <>
                              <S.CommentEditButton
                                type="button"
                                onClick={() => handleCommentEditStart(comment)}
                              >
                                댓글 수정
                              </S.CommentEditButton>
                              <S.CommentDeleteButton
                                type="button"
                                onClick={() => void handleCommentDelete(comment.id)}
                                disabled={isCommentActionLoading}
                              >
                                삭제하기
                              </S.CommentDeleteButton>
                            </>
                          ) : (
                              <S.CommentMenuPopoverLink
                                href="https://docs.google.com/forms/d/e/1FAIpQLSdZfb16smuoFx3K4JUiB-dqX5hKLywfr2FcyAI4KqWuSYdLZg/viewform"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                신고하기
                              </S.CommentMenuPopoverLink>
                          )}
                        </S.CommentMenuPopover>
                      )}
                    </S.CommentMenuArea>
                  </S.CommentHeader>
                  {editingCommentId === comment.id ? (
                    <S.CommentEditForm
                      onSubmit={(event) =>
                        void handleCommentEditSave(event, comment.id)
                      }
                    >
                      <S.CommentInput
                        value={editingCommentContent}
                        onChange={(event) =>
                          setEditingCommentContent(event.target.value)
                        }
                        aria-label="댓글 수정 내용"
                        disabled={isCommentActionLoading}
                        autoFocus
                      />
                      <S.CommentEditCancelButton
                        type="button"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingCommentContent("");
                        }}
                        disabled={isCommentActionLoading}
                      >
                        취소
                      </S.CommentEditCancelButton>
                      <S.CommentEditSaveButton
                        type="submit"
                        disabled={
                          !editingCommentContent.trim() ||
                          isCommentActionLoading
                        }
                      >
                        저장
                      </S.CommentEditSaveButton>
                    </S.CommentEditForm>
                  ) : (
                    <S.CommentBody>{comment.content}</S.CommentBody>
                  )}
                </S.CommentItem>
              ))}
            </>
          )}
          {isCommentError && <p role="alert"> {isCommentError} </p>}
          {commentActionError && <p role="alert">{commentActionError}</p>}
        </S.CommentList>

        <S.CommentComposer onSubmit={handleCommentSubmit}>
          <S.CommentInput
            value={commentContent}
            onChange={(event) => setCommentContent(event.target.value)}
            placeholder="댓글을 작성해주세요."
            aria-label="댓글 내용"
            disabled={isCommentSubmitting}
          />
          <S.CommentSubmitButton
            type="submit"
            disabled={!commentContent.trim() || isCommentSubmitting}
          >
            {isCommentSubmitting ? "등록 중" : "등록"}
          </S.CommentSubmitButton>
        </S.CommentComposer>
        {commentSubmitError && <p role="alert">{commentSubmitError}</p>}
      </S.ModalScrollArea>
    </S.DetailDialog>
  );
};

export default PostDetailModal;
