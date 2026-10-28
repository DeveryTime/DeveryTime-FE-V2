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
    border: none;
    background: transparent;

    display: flex;
    align-items: center;
    justify-content: center;

    color: ${colors.gray[1000]};
    font-size: clamp(8px, 1.1vw, 15px);
    line-height: 1;
    border-radius: 0;

    &:hover:not(:disabled) {
      color: ${colors.blue[500]};
    }

    &[aria-current="page"] {
      color: ${colors.blue[500]};
      font-weight: 700;
    }

    &:disabled {
      color: ${colors.gray[400]};
      background: transparent;
      cursor: not-allowed;
    }

    svg {
      width: 70%;
      height: 70%;
    }
  `,

};

export default S;
