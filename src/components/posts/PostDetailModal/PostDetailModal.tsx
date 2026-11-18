import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  autoUpdate,
  computePosition,
  flip,
  hide,
  offset,
  shift,
} from "@floating-ui/dom";
import PostMarkdown from "./PostMarkdown";
import { CATEGORIES } from "../../../constants/categories";
import S from "./PostDetailModal.styles";
import { X, UserRound } from "lucide-react";
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import commentIcon from "../../../assets/comment.svg";
import deleteImageIcon from "../../../assets/delete-image.svg";
import likeDefaultIcon from "../../../assets/Like.svg";
import likeActiveIcon from "../../../assets/Like-active.svg";
import KebabMenu from "../../../assets/Kebab-menu.svg";
import type { PostComment, PostDetailData } from "../../../types/posts.types";
import type { UpdatePostRequest } from "../../../api/posts/request/posts.request";
import type { ProfileData } from "../../../api/profile/profile.types";
import postsApi from "../../../api/posts.api";
import commentsApi from "../../../api/comments/comments.api";
import likesApi from "../../../api/likes/likes.api";
import profileApi from "../../../api/profile/profile.api";
import { normalizeDisplayText } from "../../../utils/normalizeDisplayText";

interface PostDetailModalProps {
  post: PostDetailData;
  currentUserId: number;
  onClose: () => void;
  onDelete: (postId: number) => void | Promise<void>;
  onUpdate?: (postId: number, title: string, content: string) => void;
  isLikeEnabled?: boolean;
  isMyPost?: boolean;
}

type PostImage = {
  id?: number;
  imageUrl: string;
  sortOrder?: number;
};

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

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const removeDeletedImageMarkdown = (content: string, imageUrls: string[]) =>
  imageUrls.reduce((markdown, imageUrl) => {
    const imagePattern = new RegExp(
      `!\\[[^\\]]*\\]\\(${escapeRegExp(imageUrl)}(?:\\s+["'][^"']*["'])?\\)`,
      "g",
    );

    return markdown.replace(imagePattern, "");
  }, content);

const COMMENT_SKELETON_COUNT = 2;

const CommentSkeleton = () => (
  <>
    {Array.from({ length: COMMENT_SKELETON_COUNT }, (_, index) => (
      <S.CommentItem key={index} aria-hidden="true">
        <S.CommentHeader>
          <S.CommentAuthor>
            <Skeleton circle width={45} height={45} />
            <Skeleton width={80} height={20} />
          </S.CommentAuthor>
          <Skeleton width={72} height={20} />
        </S.CommentHeader>
        <S.CommentBody>
          <Skeleton width="82%" height={20} />
        </S.CommentBody>
      </S.CommentItem>
    ))}
  </>
);

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

  // effect 안에서 상태를 즉시 변경하면 불필요한 추가 렌더링이 발생할 수 있음
  useLayoutEffect(() => {
    currentPostRef.current = post;
  }, [post]);

  // 게시글 메뉴와 댓글 메뉴의 열림 상태를 관리한다.
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [openCommentMenuId, setOpenCommentMenuId] = useState<number | null>(
    null,
  );

  // API에서 조회한 댓글 목록과 댓글 조회 상태를 관리한다.
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isCommentError, setIsCommentError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<
    Pick<ProfileData, "username" | "profileImageUrl"> | null
  >(null);
  const [commentSubmitError, setCommentSubmitError] = useState<string | null>(
    null,
  );
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [commentActionError, setCommentActionError] = useState<string | null>(
    null,
  );
  const [isCommentActionLoading, setIsCommentActionLoading] = useState(false);
  const commentListRef = useRef<HTMLDivElement>(null);
  const shouldScrollCommentsToBottomRef = useRef(false);
  const createdCommentIdRef = useRef<number | null>(null);
  const commentMenuPopoverRef = useRef<HTMLDivElement>(null);
  const [commentMenuAnchor, setCommentMenuAnchor] =
    useState<HTMLButtonElement | null>(null);
  const [commentMenuPosition, setCommentMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const closeCommentMenu = () => {
    setOpenCommentMenuId(null);
    setCommentMenuAnchor(null);
    setCommentMenuPosition(null);
  };

  // 게시글 수정 모드 여부를 관리한다.
  const [isPostEditing, setIsPostEditing] = useState(false);
  const [editingPostTitle, setEditingPostTitle] = useState("");
  const [editingPostContent, setEditingPostContent] = useState("");
  const [postUpdateError, setPostUpdateError] = useState<string | null>(null);
  const [isPostSaving, setIsPostSaving] = useState(false);
  const [isPostDeleting, setIsPostDeleting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<
    { id: number; imageUrl: string }[]
  >([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [savedDeletedImageIds, setSavedDeletedImageIds] = useState<number[]>(
    [],
  );
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [savedDeletedImageUrls, setSavedDeletedImageUrls] = useState<string[]>(
    [],
  );
  const [displayedPostTitle, setDisplayedPostTitle] = useState(post.title);
  const [displayedPostContent, setDisplayedPostContent] = useState(
    post.content,
  );

  const [previousPost, setPreviousPost] = useState(post);
  if (previousPost !== post) {
    setPreviousPost(post);
    if (
      previousPost.liked !== post.liked ||
      previousPost.likeCount !== post.likeCount
    ) {
      setIsLiked(post.liked ?? false);
      setLikeCount(post.likeCount ?? 0);
      setIsLikeLoading(false);
      setLikeError(null);
    }
    if (
      previousPost.title !== post.title ||
      previousPost.content !== post.content
    ) {
      setDisplayedPostTitle(post.title);
      setDisplayedPostContent(post.content);
    }
  }

  // 상세 응답 형식에 맞춰 게시글 이미지를 구성한다.
  const postImages: PostImage[] =
    post.images?.length > 0
      ? post.images
      : (post.imageUrls ?? []).map((imageUrl) => ({ imageUrl }));

  // 삭제된 이미지는 ID 또는 URL 기준으로 숨긴다.
  const hiddenImageIds = new Set([...deletedImageIds, ...savedDeletedImageIds]);
  const hiddenImageUrls = new Set([
    ...deletedImageUrls,
    ...savedDeletedImageUrls,
  ]);

  // 삭제되지 않은 기존 이미지와 새로 업로드한 이미지만 표시한다.
  const visibleImages = [...postImages, ...uploadedImages].filter(
    (image) =>
      !hiddenImageUrls.has(image.imageUrl) &&
      (image.id === undefined || !hiddenImageIds.has(image.id)),
  );

  // 본문에 포함된 이미지는 별도 목록에서 중복 표시하지 않는다.
  const visibleStandaloneImages = visibleImages.filter(
    (image) => !isPostEditing || !editingPostContent.includes(image.imageUrl),
  );
  const openComment = comments.find(
    (comment) => comment.id === openCommentMenuId,
  );

  // 이미지 ID와 URL을 삭제 목록에 추가한다.
  const handleImageDelete = (image: PostImage) => {
    if (image.id !== undefined) {
      setDeletedImageIds((current) =>
        current.includes(image.id as number)
          ? current
          : [...current, image.id as number],
      );
    }
    setDeletedImageUrls((current) =>
      current.includes(image.imageUrl) ? current : [...current, image.imageUrl],
    );
  };

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
    setIsPostDeleting(true);
    try {
      await onDelete(post.id);
    } catch {
      setDeleteError("게시글을 삭제하지 못했습니다.");
    } finally {
      setIsPostDeleting(false);
    }
  };

  // 게시글 수정 모드를 시작하고 게시글 메뉴를 닫는다.
  const handlePostEditStart = () => {
    // 수정할 때 이전 수정 시도의 임시 삭제 상태를 초기화한다.
    setSelectedImages([]);
    setDeletedImageIds([]);
    setDeletedImageUrls([]);
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
  }, [post.id]);

  // 새 댓글을 등록한 뒤 댓글 목록의 마지막 위치로 이동한다.
  useEffect(() => {
    if (
      !shouldScrollCommentsToBottomRef.current ||
      isCommentLoading
    ) {
      return;
    }

    const commentList = commentListRef.current;
    const createdCommentId = createdCommentIdRef.current;
    if (!commentList || createdCommentId === null) {
      return;
    }

    const createdComment = commentList.querySelector(
      `[data-comment-id="${createdCommentId}"]`,
    );
    if (!createdComment) {
      return;
    }

    const animationFrame = requestAnimationFrame(() => {
      commentList.scrollTo({
        top: commentList.scrollHeight,
        behavior: "smooth",
      });
      shouldScrollCommentsToBottomRef.current = false;
      createdCommentIdRef.current = null;
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [
    comments,
    isCommentLoading,
  ]);

  useLayoutEffect(() => {
    const popover = commentMenuPopoverRef.current;
    if (!commentMenuAnchor || openCommentMenuId === null || !popover) {
      return;
    }

    return autoUpdate(commentMenuAnchor, popover, () => {
      void computePosition(commentMenuAnchor, popover, {
        placement: "top-end",
        strategy: "fixed",
        middleware: [
          offset(8),
          flip(),
          shift({ padding: 8 }),
          hide({ strategy: "referenceHidden" }),
        ],
      }).then(({ x, y, middlewareData }) => {
        // 댓글 버튼이 스크롤 영역 밖으로 나가면 팝업도 닫는다.
        if (middlewareData.hide?.referenceHidden) {
          closeCommentMenu();
          return;
        }

        setCommentMenuPosition({ x, y });
      });
    });
  }, [commentMenuAnchor, openCommentMenuId]);

  const handleCommentSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const trimmedComment = commentContent.trim();
    if (!trimmedComment || isCommentSubmitting) return;

    setIsCommentSubmitting(true);
    setCommentSubmitError(null);

    try {
      const createdComment = await commentsApi.createComment(post.id, {
        content: trimmedComment,
      });
      let currentUserProfileSnapshot = currentUserProfile;
      if (!currentUserProfileSnapshot) {
        try {
          const profile = await profileApi.getMyProfile();
          currentUserProfileSnapshot = profile;
          setCurrentUserProfile(profile);
        } catch {
          // 댓글 생성은 성공했으므로 닉네임 조회 실패가 등록을 실패시키지 않도록 한다.
        }
      }
      const authorName =
        currentUserProfileSnapshot?.username ??
        createdComment.authorName ??
        "사용자";
      const profileImageUrl =
        currentUserProfileSnapshot?.profileImageUrl ??
        createdComment.profileImageUrl ??
        null;
      setCommentContent("");
      setIsCommentError(null);
      createdCommentIdRef.current = createdComment.id;
      shouldScrollCommentsToBottomRef.current = true;
      setComments((currentComments) => [
        ...currentComments,
        {
          id: createdComment.id,
          userId: createdComment.userId,
          authorName,
          content: createdComment.content,
          createdAt: createdComment.createdAt,
          profileImageUrl,
        },
      ]);
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
    closeCommentMenu();
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
      const updatedComment = await commentsApi.updateComment(
        post.id,
        commentId,
        {
          content: trimmedComment,
        },
      );
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
    closeCommentMenu();

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

    const categoryId =
      post.categoryId ??
      CATEGORIES.find((category) => category.name === post.categoryName)?.id;
    if (!categoryId) {
      setPostUpdateError("카테고리 정보를 확인할 수 없습니다.");
      return;
    }
    // 삭제한 이미지의 마크다운을 저장할 본문에서 제거한다.
    const deletedContentImageUrls = deletedImageUrls;
    const deletedImageUrlsFromIds = (post.images ?? [])
      .filter((image) => deletedImageIds.includes(image.id))
      .map((image) => image.imageUrl);
    const contentWithoutDeletedImages = removeDeletedImageMarkdown(
      trimmedPostContent,
      [...new Set([...deletedContentImageUrls, ...deletedImageUrlsFromIds])],
    );
    const updateData: UpdatePostRequest = {
      categoryId,
      title: trimmedPostTitle,
      content: contentWithoutDeletedImages,
      status: "PUBLISHED",
      deleteImageIds: deletedImageIds,
    };
    setIsPostSaving(true);
    try {
      for (const [index, file] of selectedImages.entries()) {
        const uploaded = await postsApi.uploadPostImage(post.id, {
          file,
          sortOrder:
            (post.images?.length ?? post.imageUrls?.length ?? 0) +
            uploadedImages.length +
            index,
        });
        setUploadedImages((current) => [...current, uploaded]);
        setSelectedImages((current) => current.slice(1));
      }
      await postsApi.updatePost(post.id, updateData);

      // 저장된 삭제 상태를 유지해 화면에 삭제한 이미지를 다시 표시하지 않는다.
      setSavedDeletedImageIds((current) => [...current, ...deletedImageIds]);
      setSavedDeletedImageUrls((current) => [
        ...new Set([...current, ...deletedContentImageUrls]),
      ]);
      setDeletedImageIds([]);
      setDeletedImageUrls([]);

      setDisplayedPostTitle(trimmedPostTitle);
      setDisplayedPostContent(updateData.content);
      onUpdate?.(post.id, trimmedPostTitle, updateData.content);
      setIsPostEditing(false);
    } catch {
      setPostUpdateError(
        "저장에 실패했습니다. 업로드된 이미지는 유지되며 다시 시도할 수 있습니다.",
      );
    } finally {
      setIsPostSaving(false);
    }
  };

  return (
    <S.DetailDialog
      onClose={onClose}
      aria-labelledby="post-detail-title"
    >
      <S.ModalScrollArea>
        <S.DetailActionLayer>
          <S.DetailCloseButton
            type="button"
            aria-label="모달 닫기"
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </S.DetailCloseButton>
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
                    onClick={() => setIsPostMenuOpen(false)}
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
                      onClick={() => {
                        setIsPostMenuOpen(false);
                        setIsDeleteConfirmOpen(true);
                      }}
                    >
                      삭제하기
                    </S.CommentDeleteButton>
                  </>
                )}
              </S.PostMenuPopover>
            )}
          </S.PostMenuArea>
        </S.DetailActionLayer>
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

          </S.PostHeader>

          {isPostEditing ? (
            <S.PostEditForm>
              <S.PostTitle id="post-detail-title">게시글 수정</S.PostTitle>
              <S.PostEditTitleInput
                value={editingPostTitle}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setEditingPostTitle(event.target.value)
                }
                aria-label="게시글 제목"
                disabled={isPostSaving}
              />
              {postUpdateError && <p role="alert">{postUpdateError}</p>}
              <MarkdownEditor
                value={editingPostContent}
                onChange={setEditingPostContent}
                disabled={isPostSaving}
                onDeleteImage={(imageUrl) => {
                  // 에디터에서 삭제한 이미지의 ID와 URL을 찾아 기록한다.
                  const image = postImages.find(
                    (postImage) => postImage.imageUrl === imageUrl,
                  );
                  handleImageDelete(image ?? { imageUrl });
                }}
                selectedImages={selectedImages}
                onRemoveImage={(index) =>
                  setSelectedImages((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                onSelectImages={(files) =>
                  setSelectedImages((current) => [...current, ...files])
                }
                actions={
                  <S.PostEditActions>
                    <S.PostEditCancelButton
                      type="button"
                      variant="secondary"
                      disabled={isPostSaving}
                      onClick={() => {
                        setSelectedImages([]);
                        setDeletedImageIds([]);
                        setDeletedImageUrls([]);
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
                        isPostSaving ||
                        !editingPostTitle.trim() ||
                        !editingPostContent.trim()
                      }
                    >
                      {isPostSaving ? "저장 중" : "저장"}
                    </S.PostEditSaveButton>
                  </S.PostEditActions>
                }
              />
            </S.PostEditForm>
          ) : (
            <>
              <S.PostTitle id="post-detail-title">
                {normalizeDisplayText(displayedPostTitle)}
              </S.PostTitle>
              <S.PostContent>
                <PostMarkdown content={displayedPostContent} />
              </S.PostContent>
            </>
          )}
          {visibleStandaloneImages.length > 0 && (
            <S.ImageList>
              {visibleStandaloneImages.map((image, index) => (
                <S.ImageItem key={`${image.imageUrl}-${index}`}>
                  <S.ContentImage
                    src={image.imageUrl}
                    alt={`${displayedPostTitle} 첨부된 이미지`}
                  />
                  {isPostEditing && (
                    <S.ImageDeleteButton
                      type="button"
                      aria-label="이미지 삭제"
                      $alwaysVisible={isPostEditing}
                      disabled={isPostSaving}
                      onClick={() => handleImageDelete(image)}
                    >
                      <img src={deleteImageIcon} alt="" />
                    </S.ImageDeleteButton>
                  )}
                </S.ImageItem>
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
        <S.CommentList
          ref={commentListRef}
          aria-busy={isCommentLoading || isCommentSubmitting}
        >
          {isCommentLoading && <CommentSkeleton />}

          {!isCommentLoading && (
            <>
              {comments.map((comment) => (
                <S.CommentItem
                  key={comment.id}
                  data-comment-id={comment.id}
                >
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
                        onClick={(event) => {
                          if (openCommentMenuId === comment.id) {
                            closeCommentMenu();
                            return;
                          }

                          setOpenCommentMenuId(comment.id);
                          setCommentMenuAnchor(event.currentTarget);
                          setCommentMenuPosition(null);
                        }}
                        aria-expanded={openCommentMenuId === comment.id}
                      >
                        <S.KebabIcon src={KebabMenu} alt="" />
                      </S.CommentButton>
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
                    <S.CommentBody>
                      <PostMarkdown content={comment.content} />
                    </S.CommentBody>
                  )}
                </S.CommentItem>
              ))}
            </>
          )}
          {!isCommentLoading && isCommentSubmitting && <CommentSkeleton />}
          {isCommentError && comments.length === 0 && (
            <p role="alert"> {isCommentError} </p>
          )}
          {commentActionError && <p role="alert">{commentActionError}</p>}
        </S.CommentList>

        {openComment &&
          commentMenuAnchor &&
          createPortal(
            <S.CommentMenuPopover
              ref={commentMenuPopoverRef}
              style={{
                left: commentMenuPosition?.x ?? 0,
                top: commentMenuPosition?.y ?? 0,
                visibility: commentMenuPosition ? "visible" : "hidden",
              }}
            >
              {currentUserId === openComment.userId ? (
                <>
                  <S.CommentEditButton
                    type="button"
                    onClick={() => handleCommentEditStart(openComment)}
                  >
                    댓글 수정
                  </S.CommentEditButton>
                  <S.CommentDeleteButton
                    type="button"
                    onClick={() => void handleCommentDelete(openComment.id)}
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
                  onClick={closeCommentMenu}
                >
                  신고하기
                </S.CommentMenuPopoverLink>
              )}
            </S.CommentMenuPopover>,
            commentMenuAnchor.closest("dialog") ?? document.body,
          )}

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
      {isDeleteConfirmOpen && (
        <S.DeleteConfirmDialog
          onClose={() => {
            if (!isPostDeleting) {
              setDeleteError(null);
              setIsDeleteConfirmOpen(false);
            }
          }}
          aria-labelledby="post-delete-confirm-title"
        >
          <S.DeleteConfirmTitle id="post-delete-confirm-title">
            게시글을 삭제하시겠습니까?
          </S.DeleteConfirmTitle>
          <S.DeleteConfirmActions>
            <S.DeleteConfirmButton
              type="button"
              disabled={isPostDeleting}
              onClick={() => {
                void handlePostDelete();
              }}
            >
              {isPostDeleting ? "삭제 중" : "삭제"}
            </S.DeleteConfirmButton>
            <S.DeleteCancelButton
              type="button"
              autoFocus
              disabled={isPostDeleting}
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              취소
            </S.DeleteCancelButton>
          </S.DeleteConfirmActions>
          {deleteError && <p role="alert">{deleteError}</p>}
        </S.DeleteConfirmDialog>
      )}
    </S.DetailDialog>
  );
};

export default PostDetailModal;
