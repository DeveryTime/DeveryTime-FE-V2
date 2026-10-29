import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";

// 게시글 목록 테이블의 레이아웃과 번호·카테고리·제목·작성일 열의 너비 설정
const S = {
  Table: styled.table`
    width: 100%;
    height: auto;
    table-layout: fixed;
    border-collapse: collapse;
    background-color: transparent;
    color: ${colors.gray[1000]};
    font-size: clamp(12px, 1.18vw, 16px);
    line-height: 1.25;

    //첫번째 열: 게시글 번호
    th:nth-of-type(1),
    td:nth-of-type(1) {
      width: 16.5%;
    }

    //두번째 열: 카테고리
    th:nth-of-type(2),
    td:nth-of-type(2) {
      width: 27.5%;
    }

    //세번째 열 : 게시글 제목
    th:nth-of-type(3),
    td:nth-of-type(3) {
      width: 40.5%;
    }

    //네번째 열: 작성일
    th:nth-of-type(4),
    td:nth-of-type(4) {
      width: 15.5%;
    }
  `,

  TableHeader: styled.th`
    padding: clamp(5px, 0.6vw, 8px) 12px;
    border-top: 2px solid ${colors.gray[1000]};
    background-color: transparent;
    text-align: left;
    font-size: clamp(11px, 1.1vw, 16px);
    font-weight: 500;

  `,

  TableCell: styled.td`
    padding: clamp(5px, 0.6vw, 8px) 12px;
    border: none;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  TableSpacerRow: styled.tr`
    height: 8px;
  `,

  TableSpacerCell: styled.td`
    height: 8px;
    padding: 0;
    background-color: transparent;
  `,

  TableRow: styled.tr`
    cursor: pointer;

    &:hover {
      background-color: transparent;
    }

    &:focus-visible {
      outline: 2px solid ${colors.blue[500]};
      outline-offset: -2px;
    }
  `,
};

export default S;
