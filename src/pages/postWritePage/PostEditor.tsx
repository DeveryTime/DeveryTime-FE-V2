import { useCallback, useEffect, useRef, useState } from "react";
import type { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import { IoArrowBack, IoImageOutline, IoLinkOutline } from "react-icons/io5";
import { Markdown } from "@tiptap/markdown";
import axios from "axios";
import { createPostApi } from "../../api/postApi";
import type { CreatePostErrorResponse } from "../../types/posts.types";

import S from "./PostEditorStyle";

interface PostEditorProps {
  userId: number;
  onClose: () => void;
}

const POST_CATEGORIES = [
  { id: 1, name: "전공" },
  { id: 2, name: "일상" },
  { id: 3, name: "교과" },
  { id: 4, name: "급식" },
  { id: 5, name: "프로젝트" },
  { id: 6, name: "기숙사" },
  { id: 7, name: "분실물" },
] as const;

type PostCategoryId = (typeof POST_CATEGORIES)[number]["id"];

interface PostWriteDraft {
  categoryId: PostCategoryId | "";
  title: string;
  content: JSONContent;
}

const getPostWriteDraftKey = (userId: number) => `post-write-draft:${userId}`;

const readPostWriteDraft = (userId: number): PostWriteDraft | null => {
  try {
    const rawDraft = localStorage.getItem(getPostWriteDraftKey(userId));
    if (!rawDraft) return null;

    const draft: unknown = JSON.parse(rawDraft);
    if (
      typeof draft !== "object" ||
      draft === null ||
      !("title" in draft) ||
      typeof draft.title !== "string" ||
      !("content" in draft) ||
      typeof draft.content !== "object" ||
      draft.content === null ||
      !("categoryId" in draft) ||
      (draft.categoryId !== "" &&
        !POST_CATEGORIES.some((category) => category.id === draft.categoryId))
    ) {
      return null;
    }

    return draft as PostWriteDraft;
  } catch {
    return null;
  }
};

type EditorNode = {
  type?: string;
  text?: string;
  content?: EditorNode[];
};

const hasMeaningfulContent = (node: EditorNode): boolean => {
  if (node.type === "image" || node.text?.trim()) return true;
  return node.content?.some(hasMeaningfulContent) ?? false;
};

const PostEditor = ({ userId, onClose }: PostEditorProps) => {
  const [initialDraft] = useState(() => readPostWriteDraft(userId));
  const [categoryId, setCategoryId] = useState<PostCategoryId | "">(
    initialDraft?.categoryId ?? "",
  );
  const [title, setTitle] = useState(initialDraft?.title ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const backHandlerRef = useRef<() => void>(onClose);
  const hasSubmittedRef = useRef(false);

  const saveDraft = (draft: PostWriteDraft, draftUserId: number) => {
    try {
      localStorage.setItem(getPostWriteDraftKey(draftUserId), JSON.stringify(draft));
    } catch {
      // Draft storage is best-effort; it must not block navigation or submit success.
    }
  };
  const removeDraft = (draftUserId: number) => {
    try {
      localStorage.removeItem(getPostWriteDraftKey(draftUserId));
    } catch {
      // Draft cleanup must not block navigation or submit success.
    }
  };

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
    content: initialDraft?.content ?? "",
    editorProps: {
      attributes: { class: "tiptap-editor" },
    },
  });
  const latestDraftRef = useRef({ userId, categoryId, title, editor });
  latestDraftRef.current = { userId, categoryId, title, editor };

  const handleBack = useCallback(() => {
    if (isSubmitting) return;

    if (editor && (categoryId || title.trim() || hasMeaningfulContent(editor.getJSON()))) {
      const draft: PostWriteDraft = {
        categoryId,
        title,
        content: editor.getJSON(),
      };

      saveDraft(draft, userId);
    } else {
      removeDraft(userId);
    }

    onClose();
  }, [categoryId, editor, isSubmitting, onClose, title, userId]);

  useEffect(() => () => {
    if (hasSubmittedRef.current) return;
    const latest = latestDraftRef.current;
    const currentContent = latest.editor?.getJSON();
    if (!currentContent) return;
    if (latest.categoryId || latest.title.trim() || hasMeaningfulContent(currentContent)) {
      saveDraft({ categoryId: latest.categoryId, title: latest.title, content: currentContent }, latest.userId);
    } else {
      removeDraft(latest.userId);
    }
  }, []);

  useEffect(() => {
    backHandlerRef.current = handleBack;
  }, [handleBack]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    titleInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        backHandlerRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const elements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [contenteditable="true"]',
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

  const handleSubmit = async () => {
    if (!categoryId) {
      alert("카테고리를 선택해주세요.");
      return;
    }
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
    try {
      // JSON은 정렬 속성, 이미지 등 Markdown에 없는 정보를 보존합니다.
      const response = await createPostApi({
        title: title.trim(),
        content,
        categoryId,
      });
      if (!response.success) {
        alert(response.message || "게시글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      hasSubmittedRef.current = true;
      removeDraft(userId);
      alert("게시글이 작성되었습니다.");
      onClose();
    } catch (error: unknown) {
      const message = axios.isAxiosError<CreatePostErrorResponse>(error)
        ? error.response?.data?.error?.message
        : undefined;
      alert(message ?? "게시글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <S.ModalOverlay onMouseDown={(event) => {
      if (event.target === event.currentTarget) handleBack();
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
          <S.BackButton type="button" aria-label="뒤로가기" onClick={handleBack} disabled={isSubmitting}>
            <IoArrowBack />
          </S.BackButton>
        </S.Header>

        <S.CategoryField>
          <S.CategoryLabel htmlFor="post-category">카테고리</S.CategoryLabel>
          <S.CategorySelect
            id="post-category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value === "" ? "" : (Number(event.target.value) as PostCategoryId))}
            disabled={isSubmitting}
          >
            <option value="">카테고리를 선택해주세요</option>
            {POST_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </S.CategorySelect>
        </S.CategoryField>

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
