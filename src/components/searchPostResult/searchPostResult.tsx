import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import S from "./searchPostResult.style";

// 검색 결과 게시글 타입
export interface SearchPostResultItem {
  id: number;
  title: string;
  categoryName: string;
  createdAt: string;
}

// 검색 결과 컴포넌트 Props
interface SearchPostResultProps {
  posts: SearchPostResultItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPostClick?: (postId: number) => void;
  pageSize?: number;
}

// 한 번에 보여줄 페이지 번호 개수
const PAGE_GROUP_SIZE = 10;

// 날짜 데이터를 화면에 표시할 형식으로 변환
function formatDate(createdAt: string) {
  return createdAt.split("T")[0]?.replace(/-/g, ".") ?? "";
}

export function SearchPostResult({
  posts,
  currentPage,
  totalPages,
  onPageChange,
  onPostClick,
  pageSize = 20,
}: SearchPostResultProps) {
  // 현재 페이지를 기준으로 페이지 번호 범위 계산
  const safeTotalPages = Math.max(1, totalPages);
  const currentGroup = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE);
  const firstPage = currentGroup * PAGE_GROUP_SIZE + 1;
  const lastPage = Math.min(firstPage + PAGE_GROUP_SIZE - 1, safeTotalPages);

  // 현재 페이지 그룹의 페이지 번호 생성
  const pageNumbers = Array.from(
    { length: lastPage - firstPage + 1 },
    (_, index) => firstPage + index,
  );

  // 검색 결과가 없는 경우 안내 문구 표시
  if (posts.length === 0) {
    return <S.EmptyMessage>검색 결과가 없습니다.</S.EmptyMessage>;
  }

  return (
    <>
      {/* 검색 결과 게시글 목록 */}
      <S.Table>
        <thead>
          <tr>
            <S.TableHeader>번호</S.TableHeader>
            <S.TableHeader>카테고리</S.TableHeader>
            <S.TableHeader>제목</S.TableHeader>
            <S.TableHeader>작성일</S.TableHeader>
          </tr>
        </thead>

        <tbody>
          {posts.map((post, index) => (
            <S.TableRow key={post.id}>
              {/* 현재 페이지를 기준으로 게시글 번호 표시 */}
              <S.TableCell>
                {(currentPage - 1) * pageSize + index + 1}
              </S.TableCell>

              <S.TableCell>{post.categoryName}</S.TableCell>

              {/* 제목 클릭 시 게시글 상세 페이지로 이동 */}
              <S.TableCell>
                {onPostClick ? (
                  <S.TitleButton
                    type="button"
                    onClick={() => onPostClick(post.id)}
                  >
                    {post.title}
                  </S.TitleButton>
                ) : (
                  post.title
                )}
              </S.TableCell>

              {/* 작성일 표시 */}
              <S.TableCell>{formatDate(post.createdAt)}</S.TableCell>
            </S.TableRow>
          ))}
        </tbody>
      </S.Table>

      {/* 검색 결과 페이지 이동 */}
      <S.Pagination aria-label="검색 결과 페이지 이동">
        {/* 첫 페이지로 이동 */}
        <S.PageButton
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="첫 페이지로 이동"
        >
          <FiChevronsLeft aria-hidden="true" />
        </S.PageButton>

        {/* 이전 페이지로 이동 */}
        <S.PageButton
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="이전 페이지"
        >
          <FiChevronLeft aria-hidden="true" />
        </S.PageButton>

        {/* 페이지 번호 표시 */}
        {pageNumbers.map((page) => (
          <S.PageButton
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            disabled={false}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </S.PageButton>
        ))}

        {/* 다음 페이지로 이동 */}
        <S.PageButton
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === safeTotalPages}
          aria-label="다음 페이지"
        >
          <FiChevronRight aria-hidden="true" />
        </S.PageButton>

        {/* 마지막 페이지로 이동 */}
        <S.PageButton
          type="button"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={currentPage === safeTotalPages}
          aria-label="마지막 페이지로 이동"
        >
          <FiChevronsRight aria-hidden="true" />
        </S.PageButton>
      </S.Pagination>
    </>
  );
}
