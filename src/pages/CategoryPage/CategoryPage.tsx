import { useEffect, useState } from "react";
import S from "./CategoryPage.styles";

import PostSortMenu from "../../components/posts/PostSortMenu/PostSortMenu";
import PostTable from "../../components/posts/PostTable/PostTable";
import PostPagination from "../../components/posts/PostPagination/PostPagination";
import PostDetailModal from "../../components/posts/PostDetailModal/PostDetailModal";
import type { PostListResponseItem } from "../../types/posts.types";

import type {
  PostDetailData,
  PostSort,
  PostTableItem,
} from "../../types/posts.types";
import PAGE_SIZE from "../../constants/pagination";
import postsApi from "../../api/posts.api";
import getApiErrorMessage from "../../api/errorMessages";

interface CategoryPageProps {
  categoryId: number;
  categoryName: string;
}

const CategoryPage = ({ categoryId, categoryName }: CategoryPageProps) => {
  const [selectedSort, setSelectedSort] = useState<PostSort>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<PostTableItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] =
    useState<PostDetailData | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // 카테고리, 정렬 기준, 페이지가 바뀌면 서버 목록을 다시 조회한다.
  useEffect(() => {
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
        setTotalPages(Math.max(1, response.totalPages));
      } catch (error) {
        if (isActive) {
          setError(
            getApiErrorMessage(
              error,
              "카테고리 게시글을 불러오지 못했습니다.",
            ),
          );
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

  //게시글 삭제 함수
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

  //수정 성공한 후에 상태 갱신하는 로직
  const handlePostUpdate = (
    postId: number,
    title: string,
    content: string,
  ) => {
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
            onClose={() => setSelectedPost(null)}
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
}

export default CategoryPage;
