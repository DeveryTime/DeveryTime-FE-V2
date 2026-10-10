import styled from "@emotion/styled";

export const S = {
  // 내가 쓴 글 전체 영역
  WrContainer: styled.div`
    position: relative;
    width: 918px;
    min-height: 300px;
    padding: 12px 20px;
    box-sizing: border-box;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  `,

  // 제목과 화살표 영역
  SectionTitle: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    p {
      margin: 0;

      font-size: 15px;
      font-weight: 500;
    }
  `,

  // 화살표
  Arrow: styled.img`
    cursor: pointer;
  `,

  // 게시글 목록
  PostList: styled.div`
    display: flex;
    flex-direction: column;
  `,

  // 게시글 하나의 영역
  PostItem: styled.div`
    display: flex;
    align-items: center;
    min-height: 36px;
    font-size: 16px;
    font-weight: 500;
  `,

  // 게시글 번호
  PostNumber: styled.p`
    width: 70px;
    margin: 0;
    font-size: 17px;
    font-weight: 500;
  `,

  // 게시글 카테고리
  PostCategory: styled.p`
    width: 85px;
    margin: 0;
  `,

  // 게시글 제목
  PostContent: styled.p`
    flex: 1;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  // 작성 날짜
  PostDate: styled.p`
    width: 90px;
    margin: 0;
    text-align: right;
    font-size: 16px;
    font-weight: 500;
  `,
};

export default S;
