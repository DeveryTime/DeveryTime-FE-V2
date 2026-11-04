import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import S from "./searchPage.style";
import { SearchPostResult } from "../../components/searchPostResult/searchPostResult";
import type {SearchPost} from "../../types/search.types.ts";
import {searchApi} from "../../api/search/search.api.ts";

const PAGE_SIZE = 10;

export function SearchPage() {
  // URL의 검색어 가져오기
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(1);

  // 검색 결과 데이터
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);


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
        const {content, totalElements, totalPages} = res.data.posts;
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
          pageSize={PAGE_SIZE}
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
