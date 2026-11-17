import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";

interface SortButtonStyleProps {
  $isSelected: boolean;
}

const S = {
  SortNav: styled.nav`
    // 게시글 정렬 메뉴의 위치와 상단 경계
    position: relative;
    left: 10px;
    width: 80px;
    padding-top: 8px;
    border-top: 3px solid ${colors.gray[900]};
  `,

  SortList: styled.ul`
    // 정렬 항목을 세로로 배치
    list-style: none;

    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  SortButton: styled.button<SortButtonStyleProps>`
    // 선택된 정렬 기준을 굵게 표시
    width: 100%;
    padding: 0;

    text-align: left;
    font-size: 22px;
    font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 500)};
  `,
};

export default S;
