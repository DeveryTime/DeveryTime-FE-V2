import styled from "@emotion/styled";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

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
    return <EmptyMessage>검색 결과가 없습니다.</EmptyMessage>;
  }

  return (
    <>
      {/* 검색 결과 게시글 목록 */}
      <Table>
        <thead>
          <tr>
            <TableHeader>번호</TableHeader>
            <TableHeader>카테고리</TableHeader>
            <TableHeader>제목</TableHeader>
            <TableHeader>작성일</TableHeader>
          </tr>
        </thead>

        <tbody>
          {posts.map((post, index) => (
            <TableRow key={post.id}>
              {/* 현재 페이지를 기준으로 게시글 번호 표시 */}
              <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>

              <TableCell>{post.categoryName}</TableCell>

              {/* 제목 클릭 시 게시글 상세 페이지로 이동 */}
              <TableCell>
                {onPostClick ? (
                  <TitleButton
                    type="button"
                    onClick={() => onPostClick(post.id)}
                  >
                    {post.title}
                  </TitleButton>
                ) : (
                  post.title
                )}
              </TableCell>

              {/* 작성일 표시 */}
              <TableCell>{formatDate(post.createdAt)}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      {/* 검색 결과 페이지 이동 */}
      <Pagination aria-label="검색 결과 페이지 이동">
        {/* 첫 페이지로 이동 */}
        <PageButton
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="첫 페이지로 이동"
        >
          <FiChevronsLeft aria-hidden="true" />
        </PageButton>

        {/* 이전 페이지로 이동 */}
        <PageButton
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="이전 페이지"
        >
          <FiChevronLeft aria-hidden="true" />
        </PageButton>

        {/* 페이지 번호 표시 */}
        {pageNumbers.map((page) => (
          <PageButton
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </PageButton>
        ))}

        {/* 다음 페이지로 이동 */}
        <PageButton
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === safeTotalPages}
          aria-label="다음 페이지"
        >
          <FiChevronRight aria-hidden="true" />
        </PageButton>

        {/* 마지막 페이지로 이동 */}
        <PageButton
          type="button"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={currentPage === safeTotalPages}
          aria-label="마지막 페이지로 이동"
        >
          <FiChevronsRight aria-hidden="true" />
        </PageButton>
      </Pagination>
    </>
  );
}

// 검색 결과 테이블
const Table = styled.table`
  width: 100%;
  height: auto;
  table-layout: fixed;
  border-collapse: collapse;
  background-color: #ffffff;

  th:nth-of-type(1),
  td:nth-of-type(1) {
    width: 12%;
    padding-left: 16px;
  }

  th:nth-of-type(2),
  td:nth-of-type(2) {
    width: 20%;
  }

  th:nth-of-type(3),
  td:nth-of-type(3) {
    width: 48%;
  }

  th:nth-of-type(4),
  td:nth-of-type(4) {
    width: 20%;
  }
`;

// 테이블 헤더
const TableHeader = styled.th`
  padding: 6px 8px;
  border-top: 3px solid #000000;
  text-align: left;
  font-weight: 500;
`;

// 테이블 내용
const TableCell = styled.td`
  padding: 8px;
  border: none;
  text-align: left;
`;

// 테이블 행
const TableRow = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
`;

// 게시글 제목 버튼
const TitleButton = styled.button`
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid #577aed;
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

// 페이지네이션 영역
const Pagination = styled.nav`
  width: 360px;
  height: 22px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  margin: 32px auto 0;
  transform: translateX(-80px);
`;

// 페이지 이동 버튼
const PageButton = styled.button`
  width: 22px;
  height: 22px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #000000;
  font-size: 16px;
  line-height: 1;

  &:hover:not(:disabled) {
    color: #577aed;
  }

  &[aria-current="page"] {
    color: #577aed;
    font-weight: 700;
  }

  &:disabled {
    color: #b0b0b0;
    cursor: not-allowed;
  }
`;

// 검색 결과가 없을 때 표시되는 문구
const EmptyMessage = styled.p`
  padding: 56px 0;
  color: #6b7280;
  text-align: center;
`;
