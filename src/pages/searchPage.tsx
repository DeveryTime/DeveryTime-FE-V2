import { useSearchParams } from "react-router-dom";
import S from "./searchPage.style";

interface SearchPost {
  id: number;
  title: string;
  categoryName: string;
  createdAt: string;
}

function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const posts: SearchPost[] = [];
  const totalElements = posts.length;

  const formatDate = (isoString: string) => {
    if (!isoString) return "";

    return isoString.split("T")[0].replace(/-/g, ".");
  };

  return (
    <S.PageContainer>
      <S.Title>'{keyword}' 검색 결과</S.Title>

      <S.Description>입력하신 키워드가 포함된 게시글 목록입니다.</S.Description>

      <S.CategoryMeta>검색 결과 {totalElements}개</S.CategoryMeta>

      {posts.length > 0 ? (
        <S.ListContainer>
          {posts.map((post) => (
            <S.PostCard key={post.id}>
              <S.PostTitle>{post.title}</S.PostTitle>

              <S.PostInfo>
                {post.categoryName} · {formatDate(post.createdAt)}
              </S.PostInfo>
            </S.PostCard>
          ))}
        </S.ListContainer>
      ) : (
        <S.EmptyMessage role="status">
          '{keyword}'에 대한 검색 결과가 없습니다.
        </S.EmptyMessage>
      )}
    </S.PageContainer>
  );
}

export default SearchPage;
