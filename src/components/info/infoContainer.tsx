import { useEffect, useState } from "react";
import arrowIcon from "../../assets/arrowIcon.svg";
import postsApi from "../../api/posts.api";
import getApiErrorMessage from "../../api/errorMessages";
import type { MyPostListResponseItem } from "../../api/posts/posts.types";
import S from "./infoContainer.style";

const InfoContainer = () => {
  const [posts, setPosts] = useState<MyPostListResponseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const fetchMyPosts = async () => {
      try {
        const response = await postsApi.getMyPosts({ page: 0, size: 5 });

        if (isActive) {
          setPosts(response.content);
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            getApiErrorMessage(
              requestError,
              "내가 쓴 글을 불러오지 못했습니다.",
            ),
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void fetchMyPosts();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <S.WrContainer>
      {/* 제목과 이동 화살표 */}
      <S.SectionTitle>
        <p>내가 쓴 글</p>
        <S.Arrow src={arrowIcon} alt="이동" />
      </S.SectionTitle>

      {/* 게시글 목록 */}
      {isLoading && <p>내가 쓴 글을 불러오는 중입니다...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && posts.length === 0 && (
        <p>작성한 게시글이 없습니다.</p>
      )}
      {!isLoading && !error && posts.length > 0 && (
        <S.PostList>
          {posts.map((post, index) => (
            <S.PostItem key={post.id}>
              <S.PostNumber>{index + 1}</S.PostNumber>
              <S.PostCategory>{post.categoryName}</S.PostCategory>
              <S.PostContent>{post.title}</S.PostContent>
              <S.PostDate>{post.createdAt.split("T")[0]}</S.PostDate>
            </S.PostItem>
          ))}
        </S.PostList>
      )}
    </S.WrContainer>
  );
};

export default InfoContainer;
