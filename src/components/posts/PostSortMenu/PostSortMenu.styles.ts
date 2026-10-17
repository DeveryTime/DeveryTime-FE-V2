import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";

interface SortButtonStyleProps {
  $isSelected: boolean;
}

const S = {
  SortNav: styled.nav`
    position: relative;
    left: 10px;
    width: 80px;
    padding-top: 8px;
    border-top: 3px solid ${colors.gray[900]};
  `,

  SortList: styled.ul`
    list-style: none;

    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  SortButton: styled.button<SortButtonStyleProps>`
    width: 100%;
    padding: 0;

    text-align: left;
    font-size: 22px;
    font-weight: ${({ $isSelected }) => ($isSelected ? 700 : 500)};
  `,
};

export default S;
