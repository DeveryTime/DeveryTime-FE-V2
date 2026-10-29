import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";

const S = {
  Input: styled.input`
    box-sizing: border-box;
    width: 100%;
    border: 1px solid ${colors.gray[200]};
    border-radius: 8px;
    background-color: ${colors.gray[0]};
    outline: none;
    font: inherit;

    &:focus {
      border-color: ${colors.primary[500]};
    }
  `,
};

export default S;
