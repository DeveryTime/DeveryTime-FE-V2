import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";

const S = {
  Dialog: styled.dialog`
    width: min(640px, calc(100vw - 32px));
    max-height: calc(100vh - 32px);

    margin: auto;
    padding: 0;
    border: none;
    background-color: ${colors.gray[0]};

    position: relative;
    overflow: hidden;

    &::backdrop {
      background-color: ${colors.alpha.black45};
    }
  `,

  CloseButton: styled.button`
    position: absolute;
    top: 15px;
    right: 30px;
    z-index: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    background: transparent;
    cursor: pointer;
  `,
};

export default S;
