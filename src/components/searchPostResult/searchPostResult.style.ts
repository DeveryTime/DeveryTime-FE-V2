import styled from "@emotion/styled";

// 검색 결과 테이블
const S = {
  Table: styled.table`
    width: 100%;
    height: auto;
    table-layout: fixed;
    border-collapse: collapse;
    background-color: #ffffff;

    th:nth-of-type(1),
    td:nth-of-type(1) {
      width: 12%;
      padding-left: 16px;
    }

    th:nth-of-type(2),
    td:nth-of-type(2) {
      width: 20%;
    }

    th:nth-of-type(3),
    td:nth-of-type(3) {
      width: 48%;
    }

    th:nth-of-type(4),
    td:nth-of-type(4) {
      width: 20%;
    }
  `,
  // 테이블 헤더
  TableHeader: styled.th`
    padding: 6px 8px;
    border-top: 3px solid #000000;
    text-align: left;
    font-weight: 500;
  `,
  // 테이블 내용
  TableCell: styled.td`
    padding: 8px;
    border: none;
    text-align: left;
  `,
  // 테이블 행
  TableRow: styled.tr`
    &:hover {
      background-color: #f5f5f5;
    }
  `,

  // 게시글 제목 버튼
  TitleButton: styled.button`
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }

    &:focus-visible {
      outline: 2px solid #577aed;
      outline-offset: 2px;
      border-radius: 2px;
    }
  `,

  // 페이지네이션 영역
  Pagination: styled.nav`
    width: 360px;
    height: 22px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    margin: 32px auto 0;
    transform: translateX(-80px);
  `,

  // 페이지 이동 버튼
  PageButton: styled.button`
    width: 22px;
    height: 22px;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #000000;
    font-size: 16px;
    line-height: 1;

    &:hover:not(:disabled) {
      color: #577aed;
    }

    &[aria-current="page"] {
      color: #577aed;
      font-weight: 700;
    }

    &:disabled {
      color: #b0b0b0;
      cursor: not-allowed;
    }
  `,

  // 검색 결과가 없을 때 표시되는 문구
  EmptyMessage: styled.p`
    padding: 56px 0;
    color: #6b7280;
    text-align: center;
  `,
};

export default S;
