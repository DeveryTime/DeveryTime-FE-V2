import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";

// 게시글 목록 테이블의 레이아웃과 번호·카테고리·제목·작성일 열의 너비 설정
const S = {
  Table: styled.table`
    // 게시글 목록 전체의 테이블 기본 스타일
    width: 100%;
    height: auto;
    table-layout: fixed;
    border-collapse: collapse;
    background-color: transparent;
    color: ${colors.gray[1000]};
    font-size: clamp(12px, 1.18vw, 16px);
    line-height: 1.25;

    // 첫 번째 열: 게시글 번호
    th:nth-of-type(1),
    td:nth-of-type(1) {
      width: 16.5%;
    }

    // 두 번째 열: 카테고리
    th:nth-of-type(2),
    td:nth-of-type(2) {
      width: 27.5%;
    }

    // 세 번째 열: 게시글 제목
    th:nth-of-type(3),
    td:nth-of-type(3) {
      width: 40.5%;
    }

    // 네 번째 열: 작성일
    th:nth-of-type(4),
    td:nth-of-type(4) {
      width: 15.5%;
    }
  `,

  TableHeader: styled.th`
    // 테이블 헤더의 여백과 강조 스타일
    padding: clamp(5px, 0.6vw, 8px) 12px;
    border-top: 2px solid ${colors.gray[1000]};
    background-color: transparent;
    text-align: left;
    font-size: clamp(11px, 1.1vw, 16px);
    font-weight: 500;

  `,

  TableCell: styled.td`
    // 셀 내용이 길어질 때 말줄임 처리
    padding: clamp(5px, 0.6vw, 8px) 12px;
    border: none;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  TableSpacerRow: styled.tr`
    // 헤더와 본문 사이 간격
    height: 8px;
  `,

  TableSpacerCell: styled.td`
    height: 8px;
    padding: 0;
    background-color: transparent;
  `,

  TableRow: styled.tr`
    // 클릭 가능한 게시글 행의 상호작용 스타일
    cursor: pointer;

    &:hover {
      background-color: ${colors.gray[50]};
    }

    &:focus-visible {
      outline: 2px solid ${colors.blue[500]};
      outline-offset: -2px;
    }
  `,
};

export default S;
