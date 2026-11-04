import styled from "@emotion/styled";
import colors from "../../../styles/tokens/colors";

const S = {
  EditorContainer: styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    background-color: ${colors.gray[0]};
  `,

  Toolbar: styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px;
    padding: 4px 12px;
    border-top: 1px solid ${colors.gray[200]};
    border-bottom: 1px solid ${colors.gray[200]};
    background-color: ${colors.gray[0]};
  `,

  ToolbarButton: styled.button<{ $isActive?: boolean }>`
    width: 28px;
    height: 28px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
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
    height: 18px;
    margin: 0 5px;
    background-color: ${colors.gray[200]};
  `,

  EditorArea: styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 18px;

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
