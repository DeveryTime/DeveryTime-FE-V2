import { useState } from "react";
import arrowIcon from "../../assets/arrowIcon.svg";
import S from "./infoContainer.style";

// 게시글 데이터 타입
type Post = {
  id: number;
  category: string;
  title: string;
  createdAt: string;
};

const InfoContainer = () => {
  // 내가 작성한 게시글
  const [posts] = useState<Post[]>([
    {
      id: 1,
      category: "일상",
      title: "오늘 학교 급식 맛있었나요?",
      createdAt: "2026-09-09",
    },
    {
      id: 2,
      category: "교과",
      title: "이번 주 시험 일정 정리",
      createdAt: "2026-09-08",
    },
    {
      id: 3,
      category: "전공",
      title: "프론트엔드 공부 어떻게 시작하나요?",
      createdAt: "2026-09-07",
    },
    {
      id: 4,
      category: "일상",
      title: "동아리 활동 같이 하실 분!",
      createdAt: "2026-09-06",
    },
    {
      id: 5,
      category: "일상",
      title: "학교 행사 일정 알려드립니다",
      createdAt: "2026-09-05",
    },
  ]);

  // 최신 글부터 정렬하고 최대 5개까지 가져옴
  const recentPosts = [...posts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <S.WrContainer>
      {/* 제목과 이동 화살표 */}
      <S.SectionTitle>
        <p>내가 쓴 글</p>
        <S.Arrow src={arrowIcon} alt="이동" />
      </S.SectionTitle>

      {/* 게시글 목록 */}
      <S.PostList>
        {recentPosts.map((post, index) => (
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
