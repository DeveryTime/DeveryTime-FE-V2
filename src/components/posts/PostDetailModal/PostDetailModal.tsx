import { useState, useEffect, useLayoutEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import S from "./PostDetailModal.styles";
import { X, UserRound } from "lucide-react";
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor";
import commentIcon from "../../../assets/icons/comment.svg";
import likeDefaultIcon from "../../../assets/icons/Like.svg";
import likeActiveIcon from "../../../assets/icons/Like-active.svg";
import KebabMenu from "../../../assets/icons/Kebab-menu.svg";
import type {
  PostComment,
  UpdatePostRequest,
  PostDetailData,
} from "../../../types/posts.types";
import postsApi from "../../../api/posts.api";
import getApiErrorMessage from "../../../api/errorMessages";

interface PostDetailModalProps {
  post: PostDetailData;
  currentUserId: number;
  onClose: () => void;
  onDelete: (postId: number, userId: number) => void;
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
  const [isLiked, setIsLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const currentPostRef = useRef(post);

  useLayoutEffect(() => {
    currentPostRef.current = post;
    setIsLiked(post.liked);
    setLikeCount(post.likeCount);
    setIsLikeLoading(false);
    setLikeError(null);
  }, [post.id, post.liked, post.likeCount]);

  // 게시글 메뉴와 댓글 메뉴의 열림 상태를 관리한다.
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [openCommentMenuId, setOpenCommentMenuId] = useState<number | null>(
    null,
  );

  // API에서 조회한 댓글 목록과 댓글 조회 상태를 관리한다.
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isCommentError, setIsCommentError] = useState<string | null>(null);

  // 게시글 수정 모드 여부를 관리한다.
  const [isPostEditing, setIsPostEditing] = useState(false);
  const [editingPostTitle, setEditingPostTitle] = useState("");
  const [editingPostContent, setEditingPostContent] = useState("");
  const [postUpdateError, setPostUpdateError] = useState<string | null>(null);
  const [displayedPostTitle, setDisplayedPostTitle] = useState(post.title);
  const [displayedPostContent, setDisplayedPostContent] = useState(
    post.content,
  );

  useLayoutEffect(() => {
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
        ? await postsApi.unlikePost(requestedPostId)
        : await postsApi.likePost(requestedPostId);

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
    } catch (error) {
      if (currentPostRef.current.id === requestedPostId) {
        setLikeError(getApiErrorMessage(error, "좋아요 처리에 실패했습니다."));
      }
    } finally {
      if (currentPostRef.current.id === requestedPostId) {
        setIsLikeLoading(false);
      }
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
    const fetchComments = async () => {
      setIsCommentLoading(true);
      setIsCommentError(null);

      try {
        const response = await postsApi.getComments(post.id);
        setComments(response.data);
      } catch (error) {
        setIsCommentError(
          getApiErrorMessage(error, "댓글을 조회하는데 실패했습니다."),
        );
      } finally {
        setIsCommentLoading(false);
      }
    };
    fetchComments();
  }, [post.id]);

  //게시글 수정 저장 함수 로직
  const handlePostEditSave = async () => {
    const trimmedPostTitle = editingPostTitle.trim();
    const trimmedPostContent = editingPostContent.trim();

    setPostUpdateError(null);

    if (trimmedPostTitle === "" || trimmedPostContent === "") {
      return;
    }

    const updateData: UpdatePostRequest = {
      userId: currentUserId,
      title: trimmedPostTitle,
      content: trimmedPostContent,
    };
    try {
      await postsApi.updatePost(post.id, updateData);

      setDisplayedPostTitle(trimmedPostTitle);
      setDisplayedPostContent(trimmedPostContent);
      onUpdate?.(post.id, trimmedPostTitle, trimmedPostContent);
      setIsPostEditing(false);
    } catch (error) {
      setPostUpdateError(
        getApiErrorMessage(error, "게시물을 수정하는데 실패하였습니다."),
      );
    }
  };

  return (
    <S.DetailDialog
      onClose={onClose}
      aria-labelledby="post-detail-title"
      closeIcon={<X aria-hidden="true" />}
    >
      {/* 게시글 카테고리 */}
      <S.CategoryLabel> {post.categoryName} </S.CategoryLabel>

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
                      <S.CommentDeleteButton
                        type="button"
                        aria-label="게시글 삭제"
                        onClick={() => onDelete(post.id, currentUserId)}
                      >
                        삭제하기
                      </S.CommentDeleteButton>

                      <S.CommentEditButton
                        type="button"
                        aria-label="게시글 수정"
                        onClick={handlePostEditStart}
                      >
                        수정하기
                      </S.CommentEditButton>
                    </>
                  )}
                </S.PostMenuPopover>
              )}
            </S.PostMenuArea>
          </S.PostHeader>

          {/* 게시글 본문 또는 게시글 수정 화면 */}
          {isPostEditing ? (
            <S.PostEditForm>
              <S.PostTitle id="post-detail-title">게시글 수정</S.PostTitle>

              <S.PostEditTitleInput
                value={editingPostTitle}
                onChange={(event) => setEditingPostTitle(event.target.value)}
                aria-label="게시글 제목"
              />

              <MarkdownEditor
                value={editingPostContent}
                onChange={setEditingPostContent}
              />

              {postUpdateError && <p role="alert">{postUpdateError}</p>}

              <S.PostEditActions>
                <S.PostEditCancelButton
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingPostTitle(displayedPostTitle);
                    setEditingPostContent(displayedPostContent);
                    setIsPostEditing(false);
                  }}
                >
                  취소
                </S.PostEditCancelButton>

                <S.PostEditSaveButton
                  type="button"
                  variant="primary"
                  onClick={handlePostEditSave}
                  disabled={
                    !editingPostTitle.trim() || !editingPostContent.trim()
                  }
                >
                  저장
                </S.PostEditSaveButton>
              </S.PostEditActions>
            </S.PostEditForm>
          ) : (
            <>
              <S.PostTitle id="post-detail-title">
                {displayedPostTitle}
              </S.PostTitle>
              <S.PostContent>
                <ReactMarkdown>{displayedPostContent}</ReactMarkdown>
              </S.PostContent>
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
            </>
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

                      {currentUserId !== comment.userId && (
                        <>
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
                              <S.CommentMenuPopoverLink
                                href="https://docs.google.com/forms/d/e/1FAIpQLSdZfb16smuoFx3K4JUiB-dqX5hKLywfr2FcyAI4KqWuSYdLZg/viewform"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                신고하기
                              </S.CommentMenuPopoverLink>
                            </S.CommentMenuPopover>
                          )}
                        </>
                      )}
                    </S.CommentMenuArea>
                  </S.CommentHeader>
                  <S.CommentBody> {comment.content} </S.CommentBody>
                </S.CommentItem>
              ))}
            </>
          )}
          {isCommentError && <p role="alert"> {isCommentError} </p>}
        </S.CommentList>
      </S.ModalScrollArea>
    </S.DetailDialog>
  );
};

export default PostDetailModal;
