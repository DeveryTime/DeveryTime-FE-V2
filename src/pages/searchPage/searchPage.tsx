import {useEffect, useState, useRef} from "react";
import postsApi from "../../api/posts/posts.api.ts";
import type { PostDetailData } from "../../types/posts.types.ts"
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import S from "./searchPage.style";
import { SearchPostResult } from "../../components/searchPostResult/searchPostResult";
import type {SearchPost} from "../../types/search.types.ts";
import {searchApi} from "../../api/search/search.api.ts";
import PostDetailModal from "../../components/posts/PostDetailModal/PostDetailModal.tsx";
import {hasStoredAccessToken} from "../../api/authSession.ts";
import profileApi from "../../api/profile/profile.api.ts";

const PAGE_SIZE = 10;

export function SearchPage() {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(hasStoredAccessToken);

  useEffect(() => {
    let isActive = true;
    if (!hasStoredAccessToken()) return;
    const fetchCurrentUser = async () => {
      try {
        const profile = await profileApi.getMyProfile();
        if (isActive) {
          setCurrentUserId(profile.id);
        }
      } catch {
      } finally {
        if (isActive) setIsProfileLoading(false);
      }
    };
    void fetchCurrentUser();
    return () => {
      isActive = false;
    };
  }, []);
  // URL의 검색어 가져오기
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(1);

  // 검색 결과 데이터
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedPost, setSelectedPost] = useState<PostDetailData | null>(null);
const [isDetailLoading, setIsDetailLoading] = useState(false);
const [detailError, setDetailError] = useState<string | null>(null);
const detailRequestId = useRef(0)

  useEffect(() => {
    setCurrentPage(1);
  },[keyword]);

  useEffect(() => {
    if(!keyword) {
      setTotalPages(1);
      setTotalElements(0);
      setPosts([]);
      return;
    }
    const controller = new AbortController();

    searchApi(
      {
        keyword,
        page: currentPage - 1, // 서버는 0부터 시작
        size: PAGE_SIZE,
        sort: "createdAt,desc",
      },
      controller.signal, )
      .then((res) => {
        if (!res.success) {
          setPosts([]);
          setTotalPages(1);
          setTotalElements(0);
          return;
        }
        const {content,totalPages} = res.data.posts;
        setPosts(content);
        setTotalPages(Math.max(totalPages,1));
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error(err);
        setPosts([]);
        setTotalPages(1);
        setTotalElements(0);
      });
    return () => controller.abort();
  }, [keyword, currentPage]);

  const handlePostClick = async (postId: number) => {
    if(!hasStoredAccessToken()) {
      navigate("/login");
      return;
    }
    if (currentUserId === null) {
      setDetailError(
        isProfileLoading
        ? "사용자 정보를 확인하는 중입니다. 잠시 후 다시 시도해 주세요."
          : "사용자 정보를 불러오지 못했습니다. 다시 로그인해 주세요."
      );
      return;
    }
    const requestId = ++detailRequestId.current;
    setIsDetailLoading(true);
    setDetailError(null);

    try {
      const postDetail = await postsApi.getPost(postId);
      if (requestId !== detailRequestId.current) return;
      setSelectedPost(postDetail);
    } catch {
      if (requestId !== detailRequestId.current) return;
      setDetailError("게시글 상세 정보를 불러오지 못했습니다.");
    } finally {
      if (requestId === detailRequestId.current) {
        setIsDetailLoading(false);
      }
    }
  };

  const handlePostDelete = async (postId: number) => {
    detailRequestId.current += 1;
    setIsDetailLoading(false);

    try {
      await postsApi.deletePost(postId);
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId),
      );
      setSelectedPost(null);
    } catch {
      throw new Error("게시글을 삭제하지 못했습니다.");
    }
  };

  const handlePostUpdate = (postId: number, title: string, content: string) => {
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
    <S.PageContainer>
      <S.Title>'{keyword}' 검색 결과</S.Title>
      <S.Description>입력하신 키워드가 포함된 게시글 목록입니다.</S.Description>
      <S.CategoryMeta>검색 결과 {totalElements}개</S.CategoryMeta>
      {posts.length > 0 ? (
        <SearchPostResult
          posts={posts}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPostClick={handlePostClick}
          pageSize={PAGE_SIZE}
        />
      ) : (
        // 검색 결과가 없으면 안내 문구 표시
        <S.EmptyMessage role="status">
          '{keyword}'에 대한 검색 결과가 없습니다.
        </S.EmptyMessage>
      )}
      {isDetailLoading && <p>게시글 상세 정보를 불러오는 중입니다...</p>}
      {detailError && <p role="alert">{detailError}</p>}

      {selectedPost && currentUserId !== null && (
        <PostDetailModal
          key={selectedPost.id}
          post={selectedPost}
          currentUserId={currentUserId}
          isMyPost={selectedPost.writerId === currentUserId}
          onClose={() => {
            detailRequestId.current += 1;
            setSelectedPost(null);
            setIsDetailLoading(false);
            setDetailError(null);
          }}
          onDelete={handlePostDelete}
          onUpdate={handlePostUpdate}
        />
      )}
    </S.PageContainer>
  );
}

export default SearchPage;
