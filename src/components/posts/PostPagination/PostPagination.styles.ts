import styled from "@emotion/styled";
import { colors } from "../../../styles/tokens/colors";

const S = {
  PaginationContainer: styled.nav`
    width: 360px;
    height: 22px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    margin: 32px auto 0;

    transform: translateX(-80px);
  `,

  PageButton: styled.button`
    width: 22px;
    height: 22px;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    color: ${colors.gray[1000]};
    font-size: 16px;
    line-height: 1;

    &:hover:not(:disabled) {
      color: ${colors.blue[500]};
    }

    &[aria-current="page"] {
      color: ${colors.blue[500]};
      font-weight: 700;
    }

    &:disabled {
      color: ${colors.gray[400]};
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
