import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import S from "./searchPage.style";
import { SearchPostResult } from "../components/searchPostResult";

// 검색 결과 게시글 타입
interface SearchPost {
  id: number;
  title: string;
  categoryName: string;
  createdAt: string;
}

export function SearchPage() {
  // URL의 검색어 가져오기
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(1);

  // 검색 결과 데이터
  const posts: SearchPost[] = [];

  // 검색 결과 개수와 전체 페이지 수
  const totalElements = posts.length;
  const totalPages = 1;

  return (
    <S.PageContainer>
      <S.Title>'{keyword}' 검색 결과</S.Title>
      <S.Description>입력하신 키워드가 포함된 게시글 목록입니다.</S.Description>
      <S.CategoryMeta>검색 결과 {totalElements}개</S.CategoryMeta>
      // 검색 결과가 있으면 목록 표시
      {posts.length > 0 ? (
        <SearchPostResult
          posts={posts}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      ) : (
        // 검색 결과가 없으면 안내 문구 표시
        <S.EmptyMessage role="status">
          '{keyword}'에 대한 검색 결과가 없습니다.
        </S.EmptyMessage>
      )}
    </S.PageContainer>
  );
}

export default SearchPage;
