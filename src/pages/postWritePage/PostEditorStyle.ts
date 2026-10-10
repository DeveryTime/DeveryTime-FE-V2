import styled from "@emotion/styled";

interface ToolButtonProps {
  $active?: boolean;
}

const S = {
  ModalOverlay: styled.div`
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.2);
    z-index: 9999;
  `,

  EditorWrapper: styled.div`
    width: 700px;
    height: 600px;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 3px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  `,

  Header: styled.div`
    position: relative;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #e5e5e5;
  `,

  Title: styled.h2`
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #222222;
  `,

  CloseButton: styled.button`
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: transparent;
    font-size: 20px;
    cursor: pointer;
    color: #333333;

    &:hover {
      color: #000000;
    }
  `,

  TitleInput: styled.input`
    width: 100%;
    box-sizing: border-box;
    padding: 14px 18px;
    border: none;
    outline: none;
    font-size: 20px;
    font-weight: 700;
    color: #222222;

    &::placeholder {
      color: #aaaaaa;
    }
  `,

  Toolbar: styled.div`
    height: 38px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 2px;
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #dddddd;
    background: #ffffff;
  `,

  ToolButton: styled.button<ToolButtonProps>`
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: 3px;
    background: ${({ $active }) => ($active ? "#e8e8e8" : "transparent")};
    color: #333333;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      background: #eeeeee;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  `,

  Divider: styled.div`
    width: 1px;
    height: 18px;
    margin: 0 5px;
    background: #dddddd;
  `,

  ContentArea: styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 18px;
    scrollbar-width: thin;

    .tiptap-editor {
      min-height: 430px;
      outline: none;
      font-size: 15px;
      line-height: 1.7;
      color: #222222;
    }

    .tiptap-editor p {
      margin: 0 0 8px;
    }

    .tiptap-editor h1 {
      margin: 16px 0 8px;
      font-size: 28px;
      font-weight: 700;
    }

    .tiptap-editor h2 {
      margin: 14px 0 8px;
      font-size: 22px;
      font-weight: 700;
    }

    .tiptap-editor h3 {
      margin: 12px 0 8px;
      font-size: 18px;
      font-weight: 700;
    }

    .tiptap-editor ul,
    .tiptap-editor ol {
      padding-left: 24px;
    }

    .tiptap-editor blockquote {
      margin: 10px 0;
      padding-left: 14px;
      border-left: 3px solid #dddddd;
      color: #666666;
    }

    .tiptap-editor a {
      color: #3366cc;
      text-decoration: underline;
      cursor: pointer;
    }

    .tiptap-editor img {
      max-width: 100%;
      height: auto;
      margin: 10px 0;
      border-radius: 4px;
    }

    .tiptap-editor p.is-editor-empty:first-child::before {
      content: "내용을 입력해주세요.";
      float: left;
      height: 0;
      pointer-events: none;
      color: #aaaaaa;
    }
  `,

  Footer: styled.div`
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    border-top: 1px solid #eeeeee;
    background: #ffffff;
  `,

  ImageButton: styled.button`
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: transparent;
    color: #444444;
    font-size: 21px;
    cursor: pointer;

    &:hover {
      color: #000000;
    }
  `,

  SubmitButton: styled.button`
    width: 72px;
    height: 34px;
    border: none;
    border-radius: 5px;
    background: #3769ed;
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background: #2f5edc;
    }

    &:disabled {
      background: #aeb9d5;
      cursor: not-allowed;
    }
  `,
};

export default S;
