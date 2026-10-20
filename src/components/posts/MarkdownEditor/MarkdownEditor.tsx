import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Markdown } from "@tiptap/markdown";
import S from "./MarkdownEditor.styles";

interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  disabled?: boolean;
}

const MarkdownEditor = ({
  value,
  onChange,
  disabled = false,
}: MarkdownEditorProps) => {
  const latestValueRef = useRef(value);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Markdown,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image,
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
      <S.Toolbar aria-label="게시글 본문 서식">
        <S.ToolbarButton
          type="button"
          $isActive={editor.isActive("bold")}
          aria-label="굵게"
          aria-pressed={editor.isActive("bold")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </S.ToolbarButton>
        <S.ToolbarButton
          type="button"
          $isActive={editor.isActive("italic")}
          aria-label="기울임"
          aria-pressed={editor.isActive("italic")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </S.ToolbarButton>
        <S.ToolbarButton
          type="button"
          $isActive={editor.isActive("underline")}
          aria-label="밑줄"
          aria-pressed={editor.isActive("underline")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <u>U</u>
        </S.ToolbarButton>
        <S.ToolbarButton
          type="button"
          $isActive={editor.isActive("strike")}
          aria-label="취소선"
          aria-pressed={editor.isActive("strike")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <s>S</s>
        </S.ToolbarButton>
        <S.Divider />
        <S.ToolbarButton
          type="button"
          $isActive={editor.isActive({ textAlign: "left" })}
          aria-label="왼쪽 정렬"
          aria-pressed={editor.isActive({ textAlign: "left" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          좌
        </S.ToolbarButton>
        <S.ToolbarButton
          type="button"
          $isActive={editor.isActive({ textAlign: "center" })}
          aria-label="가운데 정렬"
          aria-pressed={editor.isActive({ textAlign: "center" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          중
        </S.ToolbarButton>
        <S.ToolbarButton
          type="button"
          $isActive={editor.isActive({ textAlign: "right" })}
          aria-label="오른쪽 정렬"
          aria-pressed={editor.isActive({ textAlign: "right" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          우
        </S.ToolbarButton>
        <S.Divider />
        <S.ToolbarButton
          type="button"
          $isActive={editor.isActive("bulletList")}
          aria-label="글머리 목록"
          aria-pressed={editor.isActive("bulletList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • 목록
        </S.ToolbarButton>
        <S.ToolbarButton
          type="button"
          $isActive={editor.isActive("orderedList")}
          aria-label="번호 목록"
          aria-pressed={editor.isActive("orderedList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. 목록
        </S.ToolbarButton>
        <S.ToolbarButton
          type="button"
          $isActive={editor.isActive("blockquote")}
          aria-label="인용문"
          aria-pressed={editor.isActive("blockquote")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          인용
        </S.ToolbarButton>
        <S.ToolbarButton
          type="button"
          $isActive={editor.isActive("link")}
          aria-label="링크 추가 또는 제거"
          aria-pressed={editor.isActive("link")}
          disabled={disabled}
          onClick={handleLink}
        >
          링크
        </S.ToolbarButton>
        <S.ToolbarButton
          type="button"
          aria-label="이미지 URL 추가"
          disabled={disabled}
          onClick={handleImage}
        >
          이미지
        </S.ToolbarButton>
      </S.Toolbar>

      <S.EditorArea>
        <EditorContent editor={editor} />
      </S.EditorArea>
    </S.EditorContainer>
  );
};

export default MarkdownEditor;
