import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";

const S = {
  EditorContainer: styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid ${colors.gray[200]};
    border-radius: 8px;
    background-color: ${colors.gray[0]};

    &:focus-within {
      border-color: ${colors.primary[500]};
    }
  `,

  Toolbar: styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    padding: 8px;
    border-bottom: 1px solid ${colors.gray[200]};
    background-color: ${colors.gray[50]};
  `,

  ToolbarButton: styled.button<{ $isActive?: boolean }>`
    min-width: 32px;
    height: 32px;
    padding: 0 8px;
    border: 0;
    border-radius: 6px;
    background-color: ${({ $isActive }) =>
    $isActive ? colors.gray[100] : "transparent"};
    color: ${({ $isActive }) =>
    $isActive ? colors.primary[600] : colors.gray[700]};
    cursor: pointer;
    font: inherit;
    font-size: 14px;
    font-weight: 600;

    &:not(:disabled):hover {
      background-color: ${colors.gray[100]};
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }
  `,

  Divider: styled.span`
    width: 1px;
    height: 22px;
    margin: 0 4px;
    background-color: ${colors.gray[200]};
  `,

  EditorArea: styled.div`
    min-height: 220px;
    padding: 12px;

    .tiptap {
      min-height: 196px;
      outline: none;
      overflow-wrap: anywhere;
    }

    .tiptap > :first-child {
      margin-top: 0;
    }

    .tiptap > :last-child {
      margin-bottom: 0;
    }

    .tiptap p {
      margin: 12px 0;
      line-height: 1.6;
    }

    .tiptap h1 {
      margin: 24px 0 12px;
      font-size: 28px;
    }

    .tiptap ul,
    .tiptap ol {
      margin: 12px 0;
      padding-left: 24px;
    }

    .tiptap blockquote {
      margin: 12px 0;
      padding-left: 16px;
      border-left: 4px solid ${colors.gray[400]};
      color: ${colors.gray[700]};
    }

    .tiptap img {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 16px 0;
      border-radius: 8px;
    }
  `,
};

export default S;
