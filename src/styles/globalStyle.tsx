import { Global, css } from "@emotion/react";

export const GlobalStyle = () => (
  <Global
    styles={css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: Pretendard, sans-serif;
      }

      a {
        text-decoration: none;
        color: inherit;
      }

      button {
        border: none;
        background: none;
        cursor: pointer;
      }
    `}
  />
);
