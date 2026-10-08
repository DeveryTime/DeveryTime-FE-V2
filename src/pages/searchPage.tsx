import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import S from "./searchPage.style";
import { SearchPostResult } from "../components/searchPostResult";

interface SearchPost {
  id: number;
  title: string;
  categoryName: string;
  createdAt: string;
}

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [currentPage, setCurrentPage] = useState(1);

  const posts: SearchPost[] = [];
  const totalElements = posts.length;
  const totalPages = 1;

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
        />
      ) : (
        <S.EmptyMessage role="status">
          '{keyword}'에 대한 검색 결과가 없습니다.
        </S.EmptyMessage>
      )}
    </S.PageContainer>
  );
}

export default SearchPage;
