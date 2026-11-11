import styled from "@emotion/styled";

import colors from "../../../styles/tokens/colors";

const S = {
  PaginationContainer: styled.nav`
    width: fit-content;
    min-height: 22px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    margin: 32px auto 0;
  `,

  PageButton: styled.button`
    width: 22px;
    height: 22px;
    padding: 0;
    border: none;
    background: transparent;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #000000;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;

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

  PageSummary: styled.p`
    margin: 8px 0 0;
    color: ${colors.gray[1000]};
    font-size: 12px;
    line-height: 18px;
    text-align: center;
  `,
};

export default S;
