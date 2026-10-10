import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";

// 게시글 목록 테이블의 레이아웃과 번호·카테고리·제목·작성일 열의 너비 설정
const S = {
  Table: styled.table`
    width: 100%;
    height: auto;
    table-layout: fixed;
    border-collapse: collapse;
    background-color: ${colors.gray[0]};

    //첫번째 열: 게시글 번호
    th:nth-of-type(1),
    td:nth-of-type(1) {
      width: 12%;
      padding-left: 16px;
    }

    //두번째 열: 카테고리
    th:nth-of-type(2),
    td:nth-of-type(2) {
      width: 20%;
    }

    //세번째 열 : 게시글 제목
    th:nth-of-type(3),
    td:nth-of-type(3) {
      width: 48%;
    }

    //네번째 열: 작성일
    th:nth-of-type(4),
    td:nth-of-type(4) {
      width: 20%;
    }
  `,

  TableHeader: styled.th`
    padding: 6px 8px;
    border-top: 3px solid ${colors.gray[1000]};
    text-align: left;
    font-weight: 500;
  `,

  TableCell: styled.td`
    padding: 8px;
    border: none;
    text-align: left;
  `,

  TableRow: styled.tr`
    cursor: pointer;

    &:hover {
      background-color: ${colors.gray[50]};
    }
  `,
};

export default S;
