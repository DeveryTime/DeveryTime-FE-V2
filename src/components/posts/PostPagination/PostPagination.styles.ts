import styled from "@emotion/styled";

import colors from "../../../styles/tokens/colors";

const S = {
  PaginationContainer: styled.nav`
    width: fit-content;
    min-height: 36px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    margin: 28px auto 0;
  `,

  PageButton: styled.button`
    width: 36px;
    height: 36px;
    padding: 0;
    border: none;
    background: transparent;

    display: flex;
    align-items: center;
    justify-content: center;

    color: ${colors.gray[700]};
    font-size: 16px;
    line-height: 1;
    border-radius: 8px;
    cursor: pointer;

    &:hover:not(:disabled) {
      background-color: ${colors.primary[500]};
      color: ${colors.gray[0]};
    }

    &[aria-current="page"] {
      background-color: ${colors.primary[500]};
      color: ${colors.gray[0]};
      font-weight: 700;
    }

    &:disabled {
      color: ${colors.gray[400]};
      cursor: not-allowed;
    }

    svg {
      width: 18px;
      height: 18px;
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
