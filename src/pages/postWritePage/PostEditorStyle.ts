import styled from "@emotion/styled";

interface ToolButtonProps {
  $active?: boolean;
}

const S = {
  ModalOverlay: styled.div`
    position: fixed; inset: 0; display: flex; align-items: center;
    justify-content: center; background: rgba(0, 0, 0, 0.2); z-index: 9999;
  `,
  EditorWrapper: styled.div`
    width: min(700px, calc(100vw - 32px));
    height: min(600px, calc(100vh - 32px));
    display: flex; flex-direction: column; background: #fff; border-radius: 3px;
    box-shadow: 0 10px 40px rgba(0,0,0,.2); overflow: hidden; outline: none;
  `,
  Header: styled.div`
    position: relative; height: 60px; flex: 0 0 60px; display: flex;
    align-items: center; justify-content: center; border-bottom: 1px solid #e5e5e5;
  `,
  Title: styled.h2`
    margin: 0; font-size: 18px; font-weight: 700; color: #222;
  `,
  BackButton: styled.button`
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    width: 30px; height: 30px; display: flex; align-items: center;
    justify-content: center; padding: 0; border: 0; background: transparent;
    font-size: 20px; cursor: pointer; color: #333;
    &:hover { color: #000; }
    &:disabled { color: #aaa; cursor: not-allowed; }
  `,
  CategoryField: styled.div`
    display: flex; align-items: center; gap: 12px; padding: 12px 18px 0;
  `,
  CategoryLabel: styled.label`
    flex: 0 0 auto; color: #555; font-size: 14px; font-weight: 600;
  `,
  CategorySelect: styled.select`
    min-width: 0; padding: 9px 34px 9px 12px;
    border: 1px solid #d8d8d8; border-radius: 6px;
    background: #fff; color: #222; font: inherit; font-size: 14px;
    cursor: pointer;
    &:focus-visible { outline: 2px solid #3769ed; outline-offset: 2px; }
    &:disabled { color: #888; cursor: not-allowed; }
  `,
  TitleInput: styled.input`
    width: 100%; box-sizing: border-box; padding: 14px 18px; border: 0;
    outline: none; font-size: 20px; font-weight: 700; color: #222;
    &::placeholder { color: #aaa; }
  `,
  Toolbar: styled.div`
    height: 38px; flex: 0 0 38px; display: flex; align-items: center;
    padding: 0 12px; gap: 2px; border-top: 1px solid #eee;
    border-bottom: 1px solid #ddd; background: #fff;
  `,
  ToolButton: styled.button<ToolButtonProps>`
    width: 28px; height: 28px; display: flex; align-items: center;
    justify-content: center; padding: 0; border: 0; border-radius: 3px;
    background: ${({ $active }) => ($active ? "#e8e8e8" : "transparent")};
    color: #333; font-size: 14px; cursor: pointer;
    &:hover { background: #eee; }
    svg { width: 16px; height: 16px; }
  `,
  Divider: styled.div`
    width: 1px; height: 18px; margin: 0 5px; background: #ddd;
  `,
  ContentArea: styled.div`
    flex: 1; overflow-y: auto; padding: 18px; scrollbar-width: thin;
    .tiptap-editor { min-height: 430px; outline: none; font-size: 15px; line-height: 1.7; color: #222; }
    .tiptap-editor p { margin: 0 0 8px; }
    .tiptap-editor h1 { margin: 16px 0 8px; font-size: 28px; font-weight: 700; }
    .tiptap-editor h2 { margin: 14px 0 8px; font-size: 22px; font-weight: 700; }
    .tiptap-editor h3 { margin: 12px 0 8px; font-size: 18px; font-weight: 700; }
    .tiptap-editor ul, .tiptap-editor ol { padding-left: 24px; }
    .tiptap-editor blockquote { margin: 10px 0; padding-left: 14px; border-left: 3px solid #ddd; color: #666; }
    .tiptap-editor a { color: #36c; text-decoration: underline; cursor: pointer; }
    .tiptap-editor img { max-width: 100%; height: auto; margin: 10px 0; border-radius: 4px; }
    .tiptap-editor p.is-editor-empty:first-child::before {
      content: attr(data-placeholder); float: left; height: 0;
      pointer-events: none; color: #aaa;
    }
  `,
  Footer: styled.div`
    height: 58px; flex: 0 0 58px; display: flex; align-items: center;
    justify-content: space-between; padding: 0 18px; border-top: 1px solid #eee;
    background: #fff;
  `,
  ImageButton: styled.button`
    width: 32px; height: 32px; display: flex; align-items: center;
    justify-content: center; padding: 0; border: 0; background: transparent;
    color: #444; font-size: 21px; cursor: pointer;
    &:hover { color: #000; }
  `,
  SubmitButton: styled.button`
    width: 72px; height: 34px; border: 0; border-radius: 5px;
    background: #3769ed; color: #fff; font-size: 13px; font-weight: 600;
    cursor: pointer; &:hover { background: #2f5edc; }
    &:disabled { background: #aeb9d5; cursor: not-allowed; }
  `,
};
export default S;
