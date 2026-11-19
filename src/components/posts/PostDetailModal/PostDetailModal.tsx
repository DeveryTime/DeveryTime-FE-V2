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
import { type JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Markdown, MarkdownManager } from "@tiptap/markdown";

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
  previousImageUrls?: string[];
};

type PendingImageReplacement = {
  file: File;
  currentUrl: string;
  previewUrl: string;
};

const MAX_POST_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_POST_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

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

const MARKDOWN_IMAGE_EXTENSIONS = [StarterKit, Markdown, Image];

const updateImageNodes = (
  node: JSONContent,
  updateSrc: (src: string) => string | null,
): JSONContent => {
  if (node.type === "image") {
    const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
    const nextSrc = updateSrc(src);

    if (nextSrc === null) {
      return { ...node, type: "removedImage" };
    }

    return {
      ...node,
      attrs: {
        ...node.attrs,
        src: nextSrc,
      },
    };
  }

  if (!node.content) {
    return node;
  }

  return {
    ...node,
    content: node.content
      .map((child) => updateImageNodes(child, updateSrc))
      .filter((child) => child.type !== "removedImage"),
  };
};

const transformMarkdownImageNodes = (
  content: string,
  updateSrc: (src: string) => string | null,
) => {
  const manager = new MarkdownManager({
    extensions: MARKDOWN_IMAGE_EXTENSIONS,
  });
  const document = manager.parse(content);

  return manager.serialize(updateImageNodes(document, updateSrc));
};

const removeDeletedImageMarkdown = (content: string, imageUrls: string[]) => {
  const deletedUrls = new Set(imageUrls);

  return transformMarkdownImageNodes(content, (src) =>
    deletedUrls.has(src) ? null : src,
  );
};

const replaceImageUrlInMarkdown = (
  content: string,
  previousUrl: string,
  nextUrl: string,
) =>
  transformMarkdownImageNodes(content, (src) =>
    src === previousUrl ? nextUrl : src,
  );

const appendImageMarkdown = (
  content: string,
  images: { imageUrl: string }[],
  files: File[],
) => {
  if (images.length === 0) return content;

  const imageMarkdown = images
    .map(
      (image, index) =>
        `![${files[index]?.name ?? "첨부 이미지"}](${image.imageUrl})`,
    )
    .join("\n\n");

  return content ? `${content}\n\n${imageMarkdown}` : imageMarkdown;
};

const revokeReplacementPreviews = (
  replacements: Record<number, PendingImageReplacement>,
) => {
  Object.values(replacements).forEach(({ previewUrl }) => {
    URL.revokeObjectURL(previewUrl);
  });
};

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

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

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
  const [replacementFiles, setReplacementFiles] = useState<
    Record<number, PendingImageReplacement>
  >({});
  const replacementFilesRef = useRef(replacementFiles);
  const [uploadedImages, setUploadedImages] = useState<
    { id: number; imageUrl: string }[]
  >([]);
  const [postImageOverrides, setPostImageOverrides] = useState<{
    postId: number;
    images: Record<number, PostImage>;
  }>({ postId: post.id, images: {} });
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

  useEffect(() => {
    replacementFilesRef.current = replacementFiles;
  }, [replacementFiles]);

  useEffect(
    () => () => revokeReplacementPreviews(replacementFilesRef.current),
    [],
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
  const sourcePostImages: PostImage[] =
    post.images?.length > 0
      ? post.images
      : (post.imageUrls ?? []).map((imageUrl) => ({ imageUrl }));
  const postImages = sourcePostImages.map((image) => {
    if (image.id === undefined || postImageOverrides.postId !== post.id) {
      return image;
    }

    return {
      ...image,
      ...postImageOverrides.images[image.id],
    };
  });
  const findPostImage = (imageUrl: string) => {
    const image = postImages.find(
      (postImage) =>
        postImage.imageUrl === imageUrl ||
        postImage.previousImageUrls?.includes(imageUrl),
    );
    if (image) {
      return image;
    }

    const pendingReplacement = Object.entries(replacementFiles).find(
      ([, replacement]) =>
        replacement.currentUrl === imageUrl ||
        replacement.previewUrl === imageUrl,
    );
    if (!pendingReplacement) {
      return undefined;
    }

    const imageId = Number(pendingReplacement[0]);
    return postImages.find((postImage) => postImage.id === imageId);
  };

  // 삭제된 이미지는 ID 또는 URL 기준으로 숨긴다.
  const hiddenImageIds = new Set([...deletedImageIds, ...savedDeletedImageIds]);
  const hiddenImageUrls = new Set([
    ...deletedImageUrls,
    ...savedDeletedImageUrls,
  ]);

  // 게시글 응답과 업로드 직후 상태에 같은 이미지가 함께 있을 수 있으므로 ID 기준으로 합친다.
  const imageMap = new Map<string, PostImage>();
  [...postImages, ...uploadedImages].forEach((image) => {
    const key = image.id === undefined ? `url:${image.imageUrl}` : `id:${image.id}`;
    imageMap.set(key, image);
  });

  // 삭제되지 않은 기존 이미지와 새로 업로드한 이미지만 표시한다.
  const visibleImages = [...imageMap.values()].filter(
    (image) =>
      !hiddenImageUrls.has(image.imageUrl) &&
      (image.id === undefined || !hiddenImageIds.has(image.id)),
  );

  // 본문에 포함된 이미지는 별도 목록에서 중복 표시하지 않는다.
  const contentForImageVisibility = isPostEditing
    ? editingPostContent
    : displayedPostContent;
  const visibleStandaloneImages = visibleImages.filter(
    (image) => {
      const pendingReplacement =
        image.id === undefined ? undefined : replacementFiles[image.id];
      const isRenderedInContent =
        contentForImageVisibility.includes(image.imageUrl) ||
        Boolean(
          pendingReplacement &&
            contentForImageVisibility.includes(pendingReplacement.previewUrl),
        ) ||
        (image.previousImageUrls ?? []).some((url) =>
          contentForImageVisibility.includes(url),
        );

      return !isRenderedInContent;
    },
  );
  const openComment = comments.find(
    (comment) => comment.id === openCommentMenuId,
  );

  // 이미지 ID와 URL을 삭제 목록에 추가한다.
  const handleImageDelete = (image: PostImage) => {
    if (image.id !== undefined) {
      const pendingReplacement = replacementFiles[image.id];
      if (pendingReplacement) {
        URL.revokeObjectURL(pendingReplacement.previewUrl);
      }
      setDeletedImageIds((current) =>
        current.includes(image.id as number)
          ? current
          : [...current, image.id as number],
      );
      setReplacementFiles((current) => {
        const next = { ...current };
        delete next[image.id as number];
        return next;
      });
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
    revokeReplacementPreviews(replacementFiles);
    setSelectedImages([]);
    setReplacementFiles({});
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
    setIsPostSaving(true);
    try {
      let nextContent = contentWithoutDeletedImages;
      const replacedImages: Record<number, PostImage> = {};
      for (const [imageIdString, replacement] of Object.entries(
        replacementFiles,
      )) {
        const imageId = Number(imageIdString);
        const image = postImages.find((postImage) => postImage.id === imageId);
        if (!image) continue;

        const replacedImage = await postsApi.replacePostImage(
          post.id,
          imageId,
          replacement.file,
        );
        nextContent = [
          replacement.currentUrl,
          image.imageUrl,
          ...(image.previousImageUrls ?? []),
        ].reduce(
          (content, imageUrl) =>
            replaceImageUrlInMarkdown(
              content,
              imageUrl,
              replacedImage.imageUrl,
            ),
          nextContent,
        );
        const currentImage =
          (postImageOverrides.postId === post.id
            ? postImageOverrides.images[imageId]
            : undefined) ?? image;
        replacedImages[imageId] = {
          ...currentImage,
          ...replacedImage,
          previousImageUrls: [
            ...new Set([
              ...(currentImage.previousImageUrls ?? []),
              currentImage.imageUrl,
            ]),
          ],
        };
      }

      if (selectedImages.length > 0) {
        const uploaded = await postsApi.uploadPostImages(
          post.id,
          selectedImages,
        );
        setUploadedImages((current) => [...current, ...uploaded]);
        nextContent = appendImageMarkdown(
          nextContent,
          uploaded,
          selectedImages,
        );
      }

      const updateData: UpdatePostRequest = {
        categoryId,
        title: trimmedPostTitle,
        content: nextContent,
        status: "PUBLISHED",
        deleteImageIds: deletedImageIds,
      };
      await postsApi.updatePost(post.id, updateData);

      if (Object.keys(replacedImages).length > 0) {
        setPostImageOverrides((current) => ({
          postId: post.id,
          images: {
            ...(current.postId === post.id ? current.images : {}),
            ...replacedImages,
          },
        }));
      }

      revokeReplacementPreviews(replacementFiles);
      setReplacementFiles({});
      setSelectedImages([]);

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
        "이미지 교체 또는 게시글 저장에 실패했습니다. 다시 시도해주세요.",
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
      <S.DetailFrame>
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
                onSelectImages={(files, selectedImageUrl) => {
                  const file = files[0];
                  if (!file) {
                    return;
                  }

                  const invalidFile = files.find(
                    (candidate) =>
                      !ALLOWED_POST_IMAGE_TYPES.has(candidate.type) ||
                      candidate.size > MAX_POST_IMAGE_SIZE,
                  );
                  if (invalidFile && !ALLOWED_POST_IMAGE_TYPES.has(invalidFile.type)) {
                    setPostUpdateError(
                      "JPEG, PNG 또는 WebP 파일만 업로드할 수 있습니다.",
                    );
                    return;
                  }
                  if (invalidFile) {
                    setPostUpdateError(
                      "이미지 파일은 10MB 이하만 업로드할 수 있습니다.",
                    );
                    return;
                  }

                  if (!selectedImageUrl) {
                    setPostUpdateError(null);
                    setSelectedImages((current) => [...current, ...files]);
                    return;
                  }

                  const image = findPostImage(selectedImageUrl);
                  if (image?.id === undefined) {
                    setPostUpdateError(
                      "이미지 ID를 확인할 수 없어 교체할 수 없습니다.",
                    );
                    return;
                  }

                  setPostUpdateError(null);
                  const imageId = image.id;
                  const previewUrl = URL.createObjectURL(file);
                  const previousReplacement = replacementFiles[imageId];
                  if (previousReplacement) {
                    URL.revokeObjectURL(previousReplacement.previewUrl);
                  }

                  setEditingPostContent((currentContent) =>
                    replaceImageUrlInMarkdown(
                      currentContent,
                      selectedImageUrl,
                      previewUrl,
                    ),
                  );
                  setReplacementFiles((current) => ({
                    ...current,
                    [imageId]: {
                      file,
                      currentUrl: selectedImageUrl,
                      previewUrl,
                    },
                  }));
                }}
                onDeleteImage={(imageUrl) => {
                  // 에디터에서 삭제한 이미지의 ID와 URL을 찾아 기록한다.
                  const image = findPostImage(imageUrl);
                  handleImageDelete(image ?? { imageUrl });
                }}
                selectedImages={selectedImages}
                onRemoveImage={(index) =>
                  setSelectedImages((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                actions={
                  <S.PostEditActions>
                    <S.PostEditCancelButton
                      type="button"
                      variant="secondary"
                      disabled={isPostSaving}
                      onClick={() => {
                        revokeReplacementPreviews(replacementFiles);
                        setSelectedImages([]);
                        setReplacementFiles({});
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
                    src={
                      image.id === undefined
                        ? image.imageUrl
                        : replacementFiles[image.id]?.previewUrl ??
                          image.imageUrl
                    }
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
      </S.DetailFrame>
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
