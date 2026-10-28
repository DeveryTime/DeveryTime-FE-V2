import { useEffect, useState } from "react";
import arrowIcon from "../../assets/arrowIcon.svg";
import getApiErrorMessage from "../../api/errorMessages";
import postsApi from "../../api/posts.api";
import type { PostListResponseItem } from "../../types/posts.types";
import {useNavigate} from "react-router-dom";
import S from "./infoContainer.style";

// 게시글 데이터 타입
type Post = {
  id: number;
  category: string;
  title: string;
  createdAt: string;
};
const formatPostDate = (dateString: string) => {
  const datePart = dateString.split("T")[0];

  return /^\d{4}-\d{2}-\d{2}$/.test(datePart)
    ? datePart.replaceAll("-", ".")
    : dateString;
};

const InfoContainer = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const fetchMyPosts = async () => {
      try {
        const response = await postsApi.getMyPosts({ page: 0, size: 5 });

        if (isActive) {
          setPosts(
            response.content
              .slice(0, 5)
              .map((post: PostListResponseItem) => ({
                id: post.id,
                category: post.categoryName,
                title: post.title,
                createdAt: formatPostDate(post.createdAt),
              })),
          );
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

  const recentPosts = posts.slice(0, 5);

  return (
    <S.WrContainer>
      {/* 제목과 이동 화살표 */}
      <S.SectionTitle>
        <p>내가 쓴 글</p>
        <S.Arrow src={arrowIcon} alt="이동"onClick={() => navigate("/mypostsPage")} />
      </S.SectionTitle>

      {/* 게시글 목록 */}
      <S.PostList>
        {isLoading && <S.Message>내가 쓴 글을 불러오는 중입니다...</S.Message>}
        {error && <S.Message role="alert">{error}</S.Message>}
        {!isLoading && !error && recentPosts.length === 0 && (
          <S.Message>작성한 글이 없습니다.</S.Message>
        )}
        {!isLoading &&
          !error &&
          recentPosts.map((post, index) => (
            <S.PostItem key={post.id}>
              <S.PostNumber>{index + 1}</S.PostNumber>
              <S.PostCategory>{post.category}</S.PostCategory>
              <S.PostContent>{post.title}</S.PostContent>
              <S.PostDate>{post.createdAt}</S.PostDate>
            </S.PostItem>
          ))}
      </S.PostList>
    </S.WrContainer>
  );
};

export default InfoContainer;
