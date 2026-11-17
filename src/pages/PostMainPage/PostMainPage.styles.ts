import styled from "@emotion/styled";

const S = {
  PageContainer: styled.main`
    // 정렬 메뉴와 게시글 영역을 나란히 배치
    display: grid;
    grid-template-columns: 130px minmax(0, 1fr);
    column-gap: 56px;
    align-items: start;


    width: min(1479px, calc(100% - 48px));
    margin: 26px auto 0;
  `,

  SortMenuArea: styled.aside`
    // 정렬 메뉴의 상단 위치
    margin-top: 78px;

  `,

  Content: styled.section`
    // 게시글 목록 콘텐츠 영역
    min-width: 0;
  `,

  ContentHeader: styled.div`
    // 목록 제목과 글쓰기 버튼을 양쪽에 배치
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  `,

  Title: styled.h1`
    // 현재 정렬 기준 제목
    margin: 0 0 16px;
    font-size: 48px;
    font-weight: 600;
    line-height: 1.3;
  `,

  WriteButton: styled.button`
    // 게시글 작성 버튼
    flex: 0 0 auto;
    padding: 10px 18px;
    border: 0;
    border-radius: 20px;
    background: #3769ed;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background: #2f5edc;
    }

    &:focus-visible {
      outline: 2px solid #244fc1;
      outline-offset: 3px;
    }
  `,
};

export default S;
