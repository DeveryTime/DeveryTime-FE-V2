import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";

interface ButtonStyleProps {
  $variant: "primary" | "secondary" | "ghost" | "danger";
}

const S = {
  Button: styled.button<ButtonStyleProps>`
    border: none;
    border-radius: 8px;
    font: inherit;
    cursor: pointer;

    ${({ $variant }) => {
    switch ($variant) {
      case "secondary":
        return `
          border: 1px solid ${colors.gray[200]};
          background-color: ${colors.gray[0]};
          color: ${colors.gray[700]};
        `;
      case "ghost":
        return `
          background-color: transparent;
          color: ${colors.gray[700]};
        `;
      case "danger":
        return `
          background-color: ${colors.red[600]};
          color: ${colors.gray[0]};
        `;
      case "primary":
      default:
        return `
          background-color: ${colors.primary[500]};
          color: ${colors.gray[0]};
        `;
    }
  }}

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &:not(:disabled):hover {
      filter: brightness(0.96);
    }
  `,
};

export default S;
