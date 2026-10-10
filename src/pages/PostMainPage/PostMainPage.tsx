import { useEffect, useState } from "react";
import PostSortMenu from "../../components/posts/PostSortMenu/PostSortMenu";
import PostTable from "../../components/posts/PostTable/PostTable";
import PostPagination from "../../components/posts/PostPagination/PostPagination";
import type { PostDetailData, PostSort, PostTableItem } from "../../types/posts.types";
import S from "./PostMainPage.styles";
import PostDetailModal from "../../components/posts/PostDetailModal/PostDetailModal";
import PAGE_SIZE from "../../constants/pagination";
import postsApi from "../../api/posts.api";
import getApiErrorMessage from "../../api/errorMessages";

const PostMainPage = () => {
  // 현재 선택된 정렬 기준, 페이지, 게시글 목록, 상세 게시글을 관리한다.
  const [selectedSort, setSelectedSort] = useState<PostSort>("likes");
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
  const [reloadKey, setReloadKey] = useState(0);

  // 정렬 기준별로 화면 제목을 연결한다.
  const sortTitles: Record<PostSort, string> = {
    likes: "인기순",
    latest: "최신순",
    views: "조회순",
  };

  // 정렬 기준과 페이지가 바뀌면 서버에서 해당 목록을 다시 조회한다.
  useEffect(() => {
    let isActive = true;

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await postsApi.getPosts({
          page: currentPage - 1,
          size: PAGE_SIZE,
          sort: selectedSort,
        });

        if (!isActive) {
          return;
        }

        setPosts(
          response.content.map((post, index) => ({
            id: post.id,
            number: response.page * response.size + index + 1,
            category: post.category,
            title: post.title,
            createdAt: post.createdAt,
          })),
        );
        setTotalPages(Math.max(1, response.totalPages));
      } catch (error) {
        if (isActive) {
          setError(
            getApiErrorMessage(error, "게시글을 불러오지 못했습니다."),
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void fetchPosts();

    return () => {
      isActive = false;
    };
  }, [currentPage, reloadKey, selectedSort]);

  // 표의 게시글을 선택하면 상세 정보를 조회한다.
  const handlePostClick = async (postId: number) => {
    setIsDetailLoading(true);
    setDetailError(null);

    try {
      const postDetail = await postsApi.getPost(postId);
      setSelectedPost(postDetail);
    } catch (error) {
      setDetailError(
        getApiErrorMessage(error, "게시글 상세 정보를 불러오지 못했습니다."),
      );
    } finally {
      setIsDetailLoading(false);
    }
  };

  // 삭제 성공 후 현재 목록을 갱신하고 상세 모달을 닫는다.
  const handlePostDelete = async (postId: number, userId: number) => {
    try {
      await postsApi.deletePost(postId, userId);
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId),
      );
      setSelectedPost(null);
      setReloadKey((current) => current + 1);
    } catch (error) {
      setDetailError(
        getApiErrorMessage(error, "게시글을 삭제하지 못했습니다."),
      );
    }
  };

  // 수정 성공 후 목록 제목과 열린 상세 게시글을 함께 갱신한다.
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
    setSelectedPost((currentPost) =>
      currentPost && currentPost.id === postId
        ? { ...currentPost, title, content }
        : currentPost,
    );
  };

  return (
    // 정렬 메뉴, 게시글 목록, 상세 모달, 페이지네이션을 배치한다.
      <S.PageContainer>
      <S.SortMenuArea>
        <PostSortMenu
          selectedSort={selectedSort}
          onChange={(sort) => {
            setSelectedSort(sort);
            setCurrentPage(1);
          }}
        />
      </S.SortMenuArea>

      <S.Content>
        {/* 현재 정렬 기준에 따른 게시글 목록 제목 */}
        <S.Title>{sortTitles[selectedSort]}</S.Title>

        {isLoading && <p>게시글을 불러오는 중입니다...</p>}
        {error && <p role="alert">{error}</p>}

        {!isLoading && !error && (
          <PostTable posts={posts} onPostClick={handlePostClick} />
        )}

        {isDetailLoading && <p>게시글 상세 정보를 불러오는 중입니다...</p>}
        {detailError && <p role="alert">{detailError}</p>}

        {/* 게시글을 선택했을 때만 상세 모달을 표시한다. */}
        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onDelete={handlePostDelete}
            onUpdate={handlePostUpdate}
          />
        )}

        {/* 게시글 페이지 이동 */}
        <PostPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
        />
      </S.Content>
    </S.PageContainer>
  );
}

export default PostMainPage;
