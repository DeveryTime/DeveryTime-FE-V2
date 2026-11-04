import { useEffect, useRef, type ReactNode } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Markdown } from "@tiptap/markdown";
import S from "./MarkdownEditor.styles";
import WriteStyles from "../../../pages/postWritePage/PostEditorStyle";
import { IoImageOutline, IoLinkOutline } from "react-icons/io5";

interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  disabled?: boolean;
  actions?: ReactNode;
}

const MarkdownEditor = ({
  value,
  onChange,
  disabled = false,
  actions,
}: MarkdownEditorProps) => {
  const latestValueRef = useRef(value);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          autolink: true,
        },
      }),
      Markdown,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    contentType: "markdown",
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "tiptap",
      },
    },
    onUpdate: ({ editor: updatedEditor }) => {
      const nextMarkdown = updatedEditor.getMarkdown();

      latestValueRef.current = nextMarkdown;
      onChange(nextMarkdown);
    },
  });
  const toolbarState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      isBold: currentEditor.isActive("bold"),
      isItalic: currentEditor.isActive("italic"),
      isUnderline: currentEditor.isActive("underline"),
      isStrike: currentEditor.isActive("strike"),
      isBulletList: currentEditor.isActive("bulletList"),
      isOrderedList: currentEditor.isActive("orderedList"),
      isBlockquote: currentEditor.isActive("blockquote"),
      isLink: currentEditor.isActive("link"),
      isAlignLeft: currentEditor.isActive({ textAlign: "left" }),
      isAlignCenter: currentEditor.isActive({ textAlign: "center" }),
      isAlignRight: currentEditor.isActive({ textAlign: "right" }),
    }),
  });

  //외부 Markdown 값이 바뀔 때 에디터 내용을 동기화하는 useEffect
  useEffect(() => {
    if (!editor || value === latestValueRef.current) {
      return;
    }

    editor.commands.setContent(value, {
      contentType: "markdown",
      emitUpdate: false,
    });
    latestValueRef.current = value;
  }, [editor, value]);

  //disabled 상태를 에디터에 반영하는 useEffect
  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) {
    return null;
  }

  //링크 입력 처리
  const handleLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt(
      "링크 주소를 입력해주세요.",
      previousUrl ?? "https://",
    );

    if (url === null) {
      return;
    }
    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url.trim() }).run();
  };

  //이미지 URL 입력 처리
  const handleImage = () => {
    const imageUrl = window.prompt("이미지 URL을 입력해주세요.");

    if (!imageUrl?.trim()) {
      return;
    }

    editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
  };

  return (
    <S.EditorContainer>
      <WriteStyles.Toolbar aria-label="게시글 본문 서식">
        <WriteStyles.ToolButton
          type="button"
          $active={toolbarState.isBold}
          aria-label="굵게"
          aria-pressed={toolbarState.isBold}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </WriteStyles.ToolButton>
        <WriteStyles.ToolButton
          type="button"
          $active={toolbarState.isItalic}
          aria-label="기울임"
          aria-pressed={toolbarState.isItalic}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </WriteStyles.ToolButton>
        <WriteStyles.ToolButton
          type="button"
          $active={toolbarState.isUnderline}
          aria-label="밑줄"
          aria-pressed={toolbarState.isUnderline}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <u>U</u>
        </WriteStyles.ToolButton>
        <WriteStyles.ToolButton
          type="button"
          $active={toolbarState.isStrike}
          aria-label="취소선"
          aria-pressed={toolbarState.isStrike}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <s>S</s>
        </WriteStyles.ToolButton>
        <WriteStyles.Divider />
        <WriteStyles.ToolButton type="button" $active={toolbarState.isAlignLeft} aria-label="왼쪽 정렬" aria-pressed={toolbarState.isAlignLeft} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <span aria-hidden="true">≡</span>
        </WriteStyles.ToolButton>
        <WriteStyles.ToolButton type="button" $active={toolbarState.isAlignCenter} aria-label="가운데 정렬" aria-pressed={toolbarState.isAlignCenter} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <span aria-hidden="true">≡</span>
        </WriteStyles.ToolButton>
        <WriteStyles.ToolButton type="button" $active={toolbarState.isAlignRight} aria-label="오른쪽 정렬" aria-pressed={toolbarState.isAlignRight} disabled={disabled} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <span aria-hidden="true">≡</span>
        </WriteStyles.ToolButton>
        <WriteStyles.Divider />
        <WriteStyles.ToolButton
          type="button"
          $active={toolbarState.isBulletList}
          aria-label="글머리 목록"
          aria-pressed={toolbarState.isBulletList}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <span aria-hidden="true">•</span>
        </WriteStyles.ToolButton>
        <WriteStyles.ToolButton
          type="button"
          $active={toolbarState.isOrderedList}
          aria-label="번호 목록"
          aria-pressed={toolbarState.isOrderedList}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <span aria-hidden="true">1.</span>
        </WriteStyles.ToolButton>
        <WriteStyles.ToolButton
          type="button"
          $active={toolbarState.isBlockquote}
          aria-label="인용문"
          aria-pressed={toolbarState.isBlockquote}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <span aria-hidden="true">❝</span>
        </WriteStyles.ToolButton>
        <WriteStyles.ToolButton
          type="button"
          $active={toolbarState.isLink}
          aria-label="링크 추가 또는 제거"
          aria-pressed={toolbarState.isLink}
          disabled={disabled}
          onClick={handleLink}
        >
          <IoLinkOutline aria-hidden="true" />
        </WriteStyles.ToolButton>
      </WriteStyles.Toolbar>

      <S.EditorArea>
        <EditorContent editor={editor} />
      </S.EditorArea>
      <WriteStyles.Footer>
        <WriteStyles.ImageButton type="button" aria-label="이미지 URL 추가" disabled={disabled} onClick={handleImage}>
          <IoImageOutline />
        </WriteStyles.ImageButton>
        {actions}
      </WriteStyles.Footer>
    </S.EditorContainer>
  );
};

export default MarkdownEditor;
