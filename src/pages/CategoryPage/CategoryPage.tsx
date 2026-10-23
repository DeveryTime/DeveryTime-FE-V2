import { useEffect, useRef, useState } from "react";
import S from "./CategoryPage.styles";

import PostSortMenu from "../../components/posts/PostSortMenu/PostSortMenu";
import PostTable from "../../components/posts/PostTable/PostTable";
import PostPagination from "../../components/posts/PostPagination/PostPagination";
import PostDetailModal from "../../components/posts/PostDetailModal/PostDetailModal";

import type {
  PostDetailResponseData,
  PostListResponseItem,
  PostSort,
  PostTableItem,
} from "../../types/posts.types";
import PAGE_SIZE from "../../constants/pagination";
import postsApi from "../../api/posts.api";

interface CategoryPageProps {
  categoryId: number;
  categoryName: string;
  currentUserId: number;
}

const CategoryPage = ({
  categoryId,
  categoryName,
  currentUserId,
}: CategoryPageProps) => {
  const [selectedSort, setSelectedSort] = useState<PostSort>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const previousCategoryId = useRef(categoryId);
  const [posts, setPosts] = useState<PostTableItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] =
    useState<PostDetailResponseData | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const detailRequestId = useRef(0);

  // 카테고리, 정렬 기준, 페이지가 바뀌면 서버 목록을 다시 조회한다.
  useEffect(() => {
    if (previousCategoryId.current !== categoryId) {
      previousCategoryId.current = categoryId;

      if (currentPage !== 1) {
        // 카테고리가 바뀌면 첫 페이지부터 보여주는 의도적인 상태 초기화다.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
        return;
      }
    }

    let isActive = true;

    const fetchCategoryPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await postsApi.getPosts({
          page: currentPage - 1,
          size: PAGE_SIZE,
          sort: selectedSort,
          categoryId,
        });

        if (!isActive) {
          return;
        }

        setPosts(
          response.content.map(
            (post: PostListResponseItem, index: number) => ({
              id: post.id,
              number: response.page * response.size + index + 1,
              category: post.category,
              title: post.title,
              createdAt: post.createdAt,
            }),
          ),
        );
        const nextTotalPages = Math.max(1, response.totalPages);
        setTotalPages(nextTotalPages);
        setCurrentPage((page) => Math.min(page, nextTotalPages));
      } catch {
        if (isActive) {
          setError("카테고리 게시글을 불러오지 못했습니다.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void fetchCategoryPosts();

    return () => {
      isActive = false;
    };
  }, [categoryId, currentPage, reloadKey, selectedSort]);

  const handlePostClick = async (postId: number) => {
    const requestId = ++detailRequestId.current;
    setIsDetailLoading(true);
    setDetailError(null);

    try {
      const postDetail = await postsApi.getPost(postId);
      if (requestId !== detailRequestId.current) {
        return;
      }

      setSelectedPost(postDetail);
    } catch {
      if (requestId !== detailRequestId.current) {
        return;
      }

      setDetailError("게시글 상세 정보를 불러오지 못했습니다.");
    } finally {
      if (requestId === detailRequestId.current) {
        setIsDetailLoading(false);
      }
    }
  };

  //게시글 삭제 함수
  const handlePostDelete = async (postId: number) => {
    try {
      await postsApi.deletePost(postId);
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId),
      );
      setSelectedPost(null);
      setReloadKey((current) => current + 1);
    } catch {
      setDetailError("게시글을 삭제하지 못했습니다.");
    }
  };

  //수정 성공한 후에 상태 갱신하는 로직
  const handlePostUpdate = (postId: number, title: string, content: string) => {
    setPosts((currentPage) =>
      currentPage.map((currentPost) =>
        currentPost.id === postId ? { ...currentPost, title } : currentPost,
      ),
    );

    setSelectedPost((currentPost) =>
      currentPost && currentPost.id === postId
        ? { ...currentPost, title, content }
        : currentPost,
    );
  };

  return (
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
        <S.Title>{categoryName}</S.Title>
        <S.Description>{categoryName} 전공 게시판입니다.</S.Description>
        <S.CategoryMeta>게시글 {posts.length}개</S.CategoryMeta>

        {isLoading && <p>카테고리 게시글을 불러오는 중입니다...</p>}
        {error && <p role="alert">{error}</p>}

        {!isLoading && !error && posts.length > 0 ? (
          <PostTable posts={posts} onPostClick={handlePostClick} />
        ) : (
          !isLoading &&
          !error && (
            <S.EmptyMessage role="status">
              아직 등록된 게시글이 없습니다.
            </S.EmptyMessage>
          )
        )}

        {isDetailLoading && <p>게시글 상세 정보를 불러오는 중입니다...</p>}
        {detailError && <p role="alert">{detailError}</p>}

        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            currentUserId={currentUserId}
            isMyPost={selectedPost.writer.userId === currentUserId}
            onClose={() => {
              detailRequestId.current += 1;
              setSelectedPost(null);
              setIsDetailLoading(false);
            }}
            onDelete={handlePostDelete}
            onUpdate={handlePostUpdate}
          />
        )}

        {!isLoading && !error && (
          <PostPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
        )}
      </S.Content>
    </S.PageContainer>
  );
};

export default CategoryPage;
