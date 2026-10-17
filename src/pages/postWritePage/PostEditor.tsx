import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import { IoClose, IoImageOutline, IoLinkOutline } from "react-icons/io5";
import { Markdown } from "@tiptap/markdown";

import S from "./PostEditorStyle";

interface PostEditorProps {
  onClose: () => void;
}

type EditorNode = {
  type?: string;
  text?: string;
  content?: EditorNode[];
};

const hasMeaningfulContent = (node: EditorNode): boolean => {
  if (node.type === "image" || node.text?.trim()) return true;
  return node.content?.some(hasMeaningfulContent) ?? false;
};

const PostEditor = ({ onClose }: PostEditorProps) => {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true },
      }),
      Markdown,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image,
      Placeholder.configure({ placeholder: "내용을 입력해주세요." }),
    ],
    content: "",
    editorProps: {
      attributes: { class: "tiptap-editor" },
    },
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    titleInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const elements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [contenteditable="true"]',
      );
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first || !last) {
        event.preventDefault();
        dialogRef.current.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  if (!editor) return null;

  const handleLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("링크를 입력해주세요.", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  const handleImage = () => {
    const url = window.prompt("이미지 URL을 입력해주세요.");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    const content = editor.getJSON();
    if (!hasMeaningfulContent(content)) {
      alert("게시글 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    // JSON은 정렬 속성, 이미지 등 Markdown에 없는 정보를 보존합니다.
    console.log("게시글 제목:", title.trim());
    console.log("게시글 내용:", content);
    alert("게시글이 작성되었습니다.");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <S.ModalOverlay onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <S.EditorWrapper
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-editor-title"
        tabIndex={-1}
      >
        <S.Header>
          <S.Title id="post-editor-title">글쓰기</S.Title>
          <S.CloseButton type="button" aria-label="닫기" onClick={onClose}>
            <IoClose />
          </S.CloseButton>
        </S.Header>

        <S.TitleInput
          ref={titleInputRef}
          type="text"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <S.Toolbar>
          <S.ToolButton type="button" $active={editor.isActive("bold")} aria-label="굵게" onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></S.ToolButton>
          <S.ToolButton type="button" $active={editor.isActive("italic")} aria-label="기울임" onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></S.ToolButton>
          <S.ToolButton type="button" $active={editor.isActive("underline")} aria-label="밑줄" onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></S.ToolButton>
          <S.ToolButton type="button" $active={editor.isActive("strike")} aria-label="취소선" onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></S.ToolButton>
          <S.Divider />
          <S.ToolButton type="button" $active={editor.isActive({ textAlign: "left" })} aria-label="왼쪽 정렬" onClick={() => editor.chain().focus().setTextAlign("left").run()}>≡</S.ToolButton>
          <S.ToolButton type="button" $active={editor.isActive({ textAlign: "center" })} aria-label="가운데 정렬" onClick={() => editor.chain().focus().setTextAlign("center").run()}>≡</S.ToolButton>
          <S.ToolButton type="button" $active={editor.isActive({ textAlign: "right" })} aria-label="오른쪽 정렬" onClick={() => editor.chain().focus().setTextAlign("right").run()}>≡</S.ToolButton>
          <S.Divider />
          <S.ToolButton type="button" $active={editor.isActive("bulletList")} aria-label="글머리 기호 목록" onClick={() => editor.chain().focus().toggleBulletList().run()}>•</S.ToolButton>
          <S.ToolButton type="button" $active={editor.isActive("orderedList")} aria-label="번호 목록" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</S.ToolButton>
          <S.ToolButton type="button" $active={editor.isActive("blockquote")} aria-label="인용" onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</S.ToolButton>
          <S.ToolButton type="button" $active={editor.isActive("link")} aria-label="링크 추가" onClick={handleLink}><IoLinkOutline /></S.ToolButton>
        </S.Toolbar>

        <S.ContentArea><EditorContent editor={editor} /></S.ContentArea>
        <S.Footer>
          <S.ImageButton type="button" aria-label="이미지 추가" onClick={handleImage}><IoImageOutline /></S.ImageButton>
          <S.SubmitButton type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "게시 중..." : "게시"}
          </S.SubmitButton>
        </S.Footer>
      </S.EditorWrapper>
    </S.ModalOverlay>
  );
};
export default PostEditor;