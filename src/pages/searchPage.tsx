import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchApi } from "../api/search/search.api";
import { SearchPostResult } from "../components/searchPostResult";
import type { SearchData, SearchErrorResponse } from "../types/search.types";
import S from "./searchPage.style";

const PAGE_SIZE = 10;
const SORT = "createdAt,desc";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<SearchErrorResponse>(error)) {
    return error.response?.data?.error?.message ?? "검색 중 오류가 발생했습니다.";
  }

  return "검색 중 오류가 발생했습니다.";
}

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword")?.trim() ?? "";
  const [pagination, setPagination] = useState({ keyword, page: 1 });
  const currentPage = pagination.keyword === keyword ? pagination.page : 1;
  const [data, setData] = useState<SearchData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!keyword) {
      setData(null);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setErrorMessage(null);

    searchApi(
      {
        keyword,
        page: currentPage - 1,
        size: PAGE_SIZE,
        sort: SORT,
      },
      controller.signal,
    )
      .then((response) => {
        if (!response.success) {
          setData(null);
          setErrorMessage(response.error.message);
          return;
        }

        setData(response.data);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setData(null);
        setErrorMessage(getErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [keyword, currentPage]);

  const posts = data?.posts;
  const handlePageChange = (page: number) => setPagination({ keyword, page });

  return (
    <S.PageContainer>
      <S.Title>'{keyword}' 검색 결과</S.Title>
      <S.Description>입력하신 키워드가 포함된 사용자와 게시글입니다.</S.Description>

      {!keyword ? (
        <S.EmptyMessage role="status">검색어를 입력해주세요.</S.EmptyMessage>
      ) : isLoading ? (
        <S.EmptyMessage role="status">검색 중입니다.</S.EmptyMessage>
      ) : errorMessage ? (
        <S.EmptyMessage role="alert">{errorMessage}</S.EmptyMessage>
      ) : data ? (
        <>
          <S.CategoryMeta>
            사용자 {data.users.length}명 · 게시글 {posts?.totalElements ?? 0}개
          </S.CategoryMeta>

          {data.users.length > 0 && (
            <S.ResultSection aria-labelledby="search-users-heading">
              <S.SectionTitle id="search-users-heading">사용자</S.SectionTitle>
              <S.UserList>
                {data.users.map((user) => (
                  <S.UserItem key={user.id}>
                    <S.UserNickname>{user.nickname}</S.UserNickname>
                    <S.UserUsername>@{user.username}</S.UserUsername>
                  </S.UserItem>
                ))}
              </S.UserList>
            </S.ResultSection>
          )}

          {posts && posts.totalElements > 0 ? (
            <S.ResultSection aria-labelledby="search-posts-heading">
              <S.SectionTitle id="search-posts-heading">게시글</S.SectionTitle>
              <SearchPostResult
                posts={posts.content}
                currentPage={currentPage}
                totalPages={posts.totalPages}
                pageSize={posts.size}
                onPageChange={handlePageChange}
              />
            </S.ResultSection>
          ) : data.users.length > 0 ? (
            <S.ResultSection aria-labelledby="search-posts-heading">
              <S.SectionTitle id="search-posts-heading">게시글</S.SectionTitle>
              <S.EmptyMessage role="status">
                검색된 게시글이 없습니다.
              </S.EmptyMessage>
            </S.ResultSection>
          ) : (
            <S.EmptyMessage role="status">
              '{keyword}'에 대한 검색 결과가 없습니다.
            </S.EmptyMessage>
          )}
        </>
      ) : null}
    </S.PageContainer>
  );
}

export default SearchPage;
