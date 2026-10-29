import styled from "@emotion/styled";

export const S = {
  // 전체 페이지
  PageContainer: styled.div`
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;
  `,

  // 제목
  Title: styled.h1`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  `,

  // 설명
  Description: styled.p`
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
  `,

  // 검색 결과 개수
  CategoryMeta: styled.div`
    font-size: 13px;
    color: #888;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
    margin-bottom: 20px;
  `,

  // 게시글 목록
  ListContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  // 게시글 카드
  PostCard: styled.div`
    padding: 16px 20px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: #cbd5e1;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
  `,

  // 게시글제목
  PostTitle: styled.div`
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 6px;
  `,

  // 게시글 정보
  PostInfo: styled.div`
    font-size: 13px;
    color: #94a3b8;
  `,

  // 검색 결과 없음
  EmptyMessage: styled.div`
    padding: 60px 0;
    text-align: center;
    color: #94a3b8;
    font-size: 15px;
  `,
};

export default S;
