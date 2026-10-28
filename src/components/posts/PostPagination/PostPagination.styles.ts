import styled from "@emotion/styled";

import colors from "../../../styles/tokens/colors";

const S = {
  PaginationContainer: styled.nav`
    width: fit-content;
    height: clamp(12px, 1.6vw, 22px);

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;

    margin: clamp(33px, 3.8vw, 52px) auto 0;
  `,

  PageButton: styled.button`
    width: clamp(11px, 1.6vw, 22px);
    height: clamp(12px, 1.6vw, 22px);
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    color: ${colors.gray[0]};
    background-color: ${colors.gray[1000]};
    font-size: clamp(8px, 1.1vw, 15px);
    line-height: 1;
    border-radius: 0;

    &:hover:not(:disabled) {
      background-color: ${colors.gray[700]};
    }

    &[aria-current="page"] {
      color: ${colors.gray[0]};
      font-weight: 700;
    }

    &:disabled {
      color: ${colors.gray[0]};
      background-color: ${colors.gray[1000]};
      cursor: default;
    }

    svg {
      width: 70%;
      height: 70%;
    }
  `,

  PageSummary: styled.p`
    display: none;
    margin: 8px 0 0;
    color: ${colors.gray[1000]};
    font-size: 12px;
    line-height: 18px;
    text-align: center;
  `,
};

export default S;
