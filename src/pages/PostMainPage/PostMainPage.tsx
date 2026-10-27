import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button/Button";
import PostSortMenu from "../../components/posts/PostSortMenu/PostSortMenu";
import PostTable from "../../components/posts/PostTable/PostTable";
import PostPagination from "../../components/posts/PostPagination/PostPagination";
import type {
  PostDetailData,
  PostListResponseItem,
  PostSort,
  PostTableItem,
} from "../../types/posts.types";
import S from "./PostMainPage.styles";
import PostDetailModal from "../../components/posts/PostDetailModal/PostDetailModal";
import PAGE_SIZE from "../../constants/pagination";
import postsApi from "../../api/posts.api";

interface PostMainPageProps {
  currentUserId: number;
}

const PostMainPage = ({ currentUserId }: PostMainPageProps) => {
  const navigate = useNavigate();
  // 현재 선택된 정렬 기준, 페이지, 게시글 목록, 상세 게시글을 관리한다.
  const [selectedSort, setSelectedSort] =
    useState<PostSort>("likeCount,desc");
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
  const detailRequestId = useRef(0);

  // 정렬 기준별로 화면 제목을 연결한다.
  const sortTitles: Record<PostSort, string> = {
    "createdAt,desc": "최신순",
    "viewCount,desc": "조회순",
    "likeCount,desc": "인기순",
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

        const nextTotalPages = Math.max(1, response.totalPages);
        setTotalPages(nextTotalPages);

        if (currentPage > nextTotalPages) {
          setCurrentPage(nextTotalPages);
          return;
        }

        setPosts(
          response.content.map(
            (post: PostListResponseItem, index: number) => ({
              id: post.id,
              number: response.number * response.size + index + 1,
              category: post.categoryName,
              title: post.title,
              createdAt: post.createdAt,
            }),
          ),
        );
      } catch {
        if (isActive) {
          setError("게시글을 불러오지 못했습니다.");
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

  // 삭제 성공 후 현재 목록을 갱신하고 상세 모달을 닫는다.
  const handlePostDelete = async (postId: number) => {
    detailRequestId.current += 1;
    setIsDetailLoading(false);

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
        <S.PageHeader>
          <S.Title>{sortTitles[selectedSort]}</S.Title>
          <Button
            type="button"
            onClick={() => navigate("/posts/new")}
            style={{ padding: "12px 20px", fontWeight: 600 }}
          >
            글쓰기
          </Button>
        </S.PageHeader>

        {isLoading && <p>게시글을 불러오는 중입니다...</p>}
        {error && <p role="alert">{error}</p>}

        {!isLoading && !error && (
          posts.length === 0 ? (
            <p>게시글이 없습니다.</p>
          ) : (
            <PostTable posts={posts} onPostClick={handlePostClick} />
          )
        )}

        {isDetailLoading && <p>게시글 상세 정보를 불러오는 중입니다...</p>}
        {detailError && <p role="alert">{detailError}</p>}

        {/* 게시글을 선택했을 때만 상세 모달을 표시한다. */}
        {selectedPost && (
          <PostDetailModal
            key={selectedPost.id}
            post={selectedPost}
            currentUserId={currentUserId}
            isMyPost={selectedPost.writerId === currentUserId}
            onClose={() => {
              detailRequestId.current += 1;
              setSelectedPost(null);
              setIsDetailLoading(false);
            }}
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
