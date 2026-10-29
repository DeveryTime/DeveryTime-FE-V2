import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import postsApi from "../../api/posts.api";
import getApiErrorMessage from "../../api/errorMessages";
import PostDetailModal from "../../components/posts/PostDetailModal/PostDetailModal";
import PostPagination from "../../components/posts/PostPagination/PostPagination";
import PostTable from "../../components/posts/PostTable/PostTable";
import type {
  PostDetailData,
  PostListResponseItem,
  PostTableItem,
} from "../../types/posts.types";
import S from "./MyPostsPage.styles";

const MY_POSTS_PAGE_SIZE = 10;

interface MyPostsPageProps {
  onBack?: () => void;
}

const formatPostDate = (dateString: string) => {
  const datePart = dateString.split("T")[0];

  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return datePart.replaceAll("-", ".");
  }

  return dateString;
};

const MyPostsPage = ({ onBack }: MyPostsPageProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<PostTableItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostDetailData | null>(
    null,
  );
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const detailRequestId = useRef(0);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  useEffect(() => {
    let isActive = true;

    const fetchMyPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await postsApi.getMyPosts({
          page: currentPage - 1,
          size: MY_POSTS_PAGE_SIZE,
        });

        if (!isActive) {
          return;
        }

        const responsePage = response.number;
        const nextTotalPages = Math.max(1, response.totalPages);

        setPosts(
          response.content.map(
            (post: PostListResponseItem, index: number) => ({
              id: post.id,
              number: responsePage * response.size + index + 1,
              category: post.categoryName,
              title: post.title,
              createdAt: formatPostDate(post.createdAt),
            }),
          ),
        );
        setTotalPages(nextTotalPages);
        setCurrentPage((page) => Math.min(page, nextTotalPages));
      } catch (requestError) {
        if (isActive) {
          setError(
            getApiErrorMessage(
              requestError,
              "내가 쓴 글을 불러오지 못했습니다.",
            ),
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void fetchMyPosts();

    return () => {
      isActive = false;
    };
  }, [currentPage]);

  const handlePostClick = async (postId: number) => {
    const requestId = ++detailRequestId.current;
    setIsDetailLoading(true);
    setDetailError(null);

    try {
      const postDetail = await postsApi.getPost(postId);

      if (requestId === detailRequestId.current) {
        setSelectedPost(postDetail);
      }
    } catch (requestError) {
      if (requestId === detailRequestId.current) {
        setDetailError(
          getApiErrorMessage(
            requestError,
            "게시글 상세 정보를 불러오지 못했습니다.",
          ),
        );
      }
    } finally {
      if (requestId === detailRequestId.current) {
        setIsDetailLoading(false);
      }
    }
  };

  const handlePostDelete = async (postId: number) => {
    try {
      await postsApi.deletePost(postId);
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId),
      );
      setSelectedPost(null);
    } catch (requestError) {
      setDetailError(
        getApiErrorMessage(requestError, "게시글을 삭제하지 못했습니다."),
      );
    }
  };

  const handlePostUpdate = (
    postId: number,
    title: string,
    content: string,
  ) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, title } : post,
      ),
    );
    setSelectedPost((post) =>
      post && post.id === postId ? { ...post, title, content } : post,
    );
  };

  return (
    <S.PageContainer>
      <S.PageHeader>
        <S.BackButton type="button" aria-label="뒤로가기" onClick={handleBack}>
          &lt; 뒤로 가기
        </S.BackButton>
        <S.Title>내가 쓴 글</S.Title>
      </S.PageHeader>

      {isLoading && (
        <S.StatusMessage role="status">
          내가 쓴 글을 불러오는 중입니다...
        </S.StatusMessage>
      )}
      {error && <S.ErrorMessage role="alert">{error}</S.ErrorMessage>}

      {!isLoading && !error && (
        <>
          <PostTable posts={posts} onPostClick={handlePostClick} />
          <PostPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
        </>
      )}

      {isDetailLoading && (
        <S.StatusMessage role="status">
          게시글 상세 정보를 불러오는 중입니다...
        </S.StatusMessage>
      )}
      {detailError && <S.ErrorMessage role="alert">{detailError}</S.ErrorMessage>}

      {selectedPost && (
        <PostDetailModal
          key={selectedPost.id}
          post={selectedPost}
          currentUserId={selectedPost.writerId}
          isMyPost
          isLikeEnabled={false}
          onClose={() => {
            detailRequestId.current += 1;
            setSelectedPost(null);
            setIsDetailLoading(false);
          }}
          onDelete={handlePostDelete}
          onUpdate={handlePostUpdate}
        />
      )}
    </S.PageContainer>
  );
};

export default MyPostsPage;
