import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import { IoArrowBack, IoImageOutline, IoLinkOutline } from "react-icons/io5";
import { Markdown } from "@tiptap/markdown";
import axios from "axios";
import client from "../../api/client";
import getApiErrorMessage from "../../api/errorMessages";
import categoriesApi from "../../api/categories/categories.api";
import type { Category } from "../../api/categories/categories.types";
import postsApi from "../../api/posts/posts.api";
import type { CreatePostRequest } from "../../api/posts/request/posts.request";
import type {
  CreatePostResponse,
  UploadPostImageErrorResponse,
} from "../../api/posts/response/posts.response";

import S from "./PostEditorStyle";

interface PostEditorProps {
  userId: number;
  onClose: () => void;
}

interface PostWriteDraft {
  categoryId: number | "";
  title: string;
  content: JSONContent;
}

interface PendingLinkSelection {
  from: number;
  to: number;
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
        (typeof draft.categoryId !== "number" || !Number.isInteger(draft.categoryId)))
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
  const [categoryId, setCategoryId] = useState<number | "">(
    initialDraft?.categoryId ?? "",
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [areCategoriesLoading, setAreCategoriesLoading] = useState(true);
  const [categoryLoadError, setCategoryLoadError] = useState<string | null>(null);
  const [categoryLoadAttempt, setCategoryLoadAttempt] = useState(0);
  const hasCategoryLoadError = categoryLoadError !== null;
  const [title, setTitle] = useState(initialDraft?.title ?? "");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isLinkActive, setIsLinkActive] = useState(false);
  const [linkHref, setLinkHref] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPostId, setCreatedPostId] = useState<number | null>(null);
  const [postCreationCompleted, setPostCreationCompleted] = useState(false);
  const [uploadedImageIndexes, setUploadedImageIndexes] = useState<Set<number>>(() => new Set());
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const linkDialogRef = useRef<HTMLDivElement>(null);
  const linkSelectionRef = useRef<PendingLinkSelection | null>(null);
  const linkDialogOpenRef = useRef(false);
  const backHandlerRef = useRef<() => void>(onClose);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    let isActive = true;

    void (async () => {
      try {
        const nextCategories = await categoriesApi.getCategories();
        if (!isActive) return;

        if (
          !Array.isArray(nextCategories) ||
          !nextCategories.every(
            (category) =>
              category !== null &&
              Number.isSafeInteger(category.id) &&
              typeof category.name === "string",
          )
        ) {
          throw new Error("카테고리 API 응답 형식이 올바르지 않습니다.");
        }

        setCategories(nextCategories);
        setCategoryId((currentCategoryId) =>
          currentCategoryId !== "" &&
          nextCategories.some((category) => category.id === currentCategoryId)
            ? currentCategoryId
            : "",
        );
      } catch (error: unknown) {
        if (!isActive) return;
        setCategoryLoadError(
          error instanceof Error && error.message === "카테고리 API 응답 형식이 올바르지 않습니다."
            ? error.message
            : getApiErrorMessage(error, "카테고리를 불러오지 못했습니다."),
        );
      } finally {
        if (isActive) setAreCategoriesLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [categoryLoadAttempt, userId]);

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

  useEffect(() => {
    latestDraftRef.current = { userId, categoryId, title, editor };
  }, [categoryId, editor, title, userId]);

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
    linkDialogOpenRef.current = isLinkDialogOpen;
  }, [isLinkDialogOpen]);

  const closeLinkDialog = useCallback(() => {
    setIsLinkDialogOpen(false);
    setIsLinkActive(false);
    linkSelectionRef.current = null;
    requestAnimationFrame(() => editor?.commands.focus());
  }, [editor]);

  useEffect(() => {
    editor?.setEditable(!postCreationCompleted);
  }, [editor, postCreationCompleted]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    titleInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (linkDialogOpenRef.current) {
          closeLinkDialog();
          return;
        }
        backHandlerRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const focusScope = linkDialogOpenRef.current
        ? linkDialogRef.current
        : dialogRef.current;
      if (!focusScope) return;

      const elements = focusScope.querySelectorAll<HTMLElement>(
        'button:not([disabled]):not([hidden]), input:not([disabled]):not([hidden]):not([type="hidden"]), select:not([disabled]):not([hidden]), [contenteditable="true"]',
      );
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first || !last) {
        event.preventDefault();
        focusScope.focus();
      } else if (!focusScope.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
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
  }, [closeLinkDialog, editor, onClose]);

  if (!editor) return null;

  const handleLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const selection = editor.state.selection;
    linkSelectionRef.current = {
      from: selection.from,
      to: selection.to,
    };
    setIsLinkActive(editor.isActive("link"));
    setLinkHref(typeof previousUrl === "string" ? previousUrl : "https://");
    setIsLinkDialogOpen(true);
  };

  const handleLinkSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selection = linkSelectionRef.current;
    const rawHref = linkHref.trim();
    const href = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(rawHref)
      || rawHref.includes("://")
      ? rawHref
      : `https://${rawHref}`;
    if (!selection || !rawHref) return;

    if (selection.from !== selection.to) {
      editor.chain().focus().setTextSelection({ from: selection.from, to: selection.to }).setLink({ href }).run();
    } else if (isLinkActive) {
      editor.chain().focus().setTextSelection(selection.from).extendMarkRange("link").setLink({ href }).run();
    } else {
      editor
        .chain()
        .focus()
        .setTextSelection(selection.from)
        .insertContent({
          type: "text",
          text: href,
          marks: [{ type: "link", attrs: { href } }],
        })
        .run();
    }

    closeLinkDialog();
  };

  const handleLinkRemove = () => {
    const selection = linkSelectionRef.current;
    if (!selection) return;
    const chain = editor.chain().focus();
    if (isLinkActive) {
      chain.setTextSelection(selection.from).extendMarkRange("link").unsetLink().run();
    } else {
      chain.setTextSelection({ from: selection.from, to: selection.to }).unsetLink().run();
    }
    closeLinkDialog();
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    if (postCreationCompleted) {
      event.currentTarget.value = "";
      return;
    }
    const files = Array.from(event.currentTarget.files ?? []);
    if (files.length > 0) {
      setSelectedImages((current) => [...current, ...files]);
    }
    event.currentTarget.value = "";
  };

  const handleSubmit = () => {
    if (isSubmitting) return;

    if (!postCreationCompleted) {
      if (categoryId === "") {
        alert("카테고리를 선택해주세요.");
        return;
      }
      if (!categories.some((category) => category.id === categoryId)) {
        alert("카테고리를 선택해주세요.");
        return;
      }
      if (!title.trim()) {
        alert("제목을 입력해주세요.");
        return;
      }
      const editorContent = editor.getJSON();
      const content = editor.getMarkdown().trim();
      if (!content && !hasMeaningfulContent(editorContent)) {
        alert("게시글 내용을 입력해주세요.");
        return;
      }
    }

    setIsSubmitting(true);
    void (async () => {
      try {
        let postId = createdPostId;
        if (!postCreationCompleted) {
          if (typeof categoryId !== "number") {
            throw new Error("카테고리를 선택해주세요.");
          }

          const createPostRequest: CreatePostRequest = {
            title: title.trim(),
            content: editor.getMarkdown().trim(),
            categoryId,
            status: "PUBLISHED",
          };
          const response = await client.post<CreatePostResponse>("/posts", createPostRequest);
          const responseBody = response.data;
          postId = "data" in responseBody
            ? typeof responseBody.data === "number"
              ? responseBody.data
              : responseBody.data.id
            : responseBody.id;

          setPostCreationCompleted(true);
          hasSubmittedRef.current = true;
          removeDraft(userId);
          if (postId) setCreatedPostId(postId);
        }

        if (selectedImages.length > 0 && !postId) {
          alert("게시글은 등록됐지만 응답에서 게시글 ID를 찾지 못해 이미지를 업로드하지 못했습니다. 게시글 중복 등록을 막기 위해 다시 등록하지 않습니다.");
          return;
        }

        let failedImageCount = 0;
        let firstImageErrorMessage: string | undefined;
        const uploadedIndexes = new Set(uploadedImageIndexes);
        for (const [sortOrder, file] of selectedImages.entries()) {
          if (uploadedIndexes.has(sortOrder)) continue;
          try {
            await postsApi.uploadPostImage(postId as number, { file, sortOrder });
            uploadedIndexes.add(sortOrder);
            setUploadedImageIndexes(new Set(uploadedIndexes));
          } catch (error: unknown) {
            failedImageCount += 1;
            if (!firstImageErrorMessage && axios.isAxiosError<UploadPostImageErrorResponse>(error)) {
              firstImageErrorMessage = error.response?.data?.error?.message;
            }
          }
        }

        if (failedImageCount > 0) {
          const errorDetails = firstImageErrorMessage ? `\n${firstImageErrorMessage}` : "";
          alert(`게시글은 등록됐지만 이미지 ${failedImageCount}장을 업로드하지 못했습니다. 게시글을 중복 생성하지 않고 실패한 이미지만 다시 시도할 수 있습니다.${errorDetails}`);
          return;
        }

        alert("게시글이 작성되었습니다.");
        onClose();
      } catch (error: unknown) {
        const message = axios.isAxiosError<{ error?: { message?: string } }>(error)
          ? error.response?.data?.error?.message
          : undefined;
        alert(message ?? "게시글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setIsSubmitting(false);
      }
    })();
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
            onChange={(event) => setCategoryId(event.target.value === "" ? "" : Number(event.target.value))}
            disabled={isSubmitting || postCreationCompleted || areCategoriesLoading || hasCategoryLoadError || categories.length === 0}
            aria-busy={areCategoriesLoading}
          >
            <option value="">
              {areCategoriesLoading
                ? "카테고리를 불러오는 중입니다..."
                : hasCategoryLoadError
                  ? "카테고리를 불러오지 못했습니다"
                  : categories.length === 0
                    ? "등록된 카테고리가 없습니다"
                    : "카테고리를 선택해주세요"}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </S.CategorySelect>
        </S.CategoryField>
        {categoryLoadError && (
          <S.CategoryError role="alert">
            <span>{categoryLoadError}</span>
            <button
              type="button"
              onClick={() => {
                setAreCategoriesLoading(true);
                setCategoryLoadError(null);
                setCategoryLoadAttempt((attempt) => attempt + 1);
              }}
              disabled={areCategoriesLoading}
            >
              다시 시도
            </button>
          </S.CategoryError>
        )}

        <S.TitleInput
          ref={titleInputRef}
          type="text"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isSubmitting || postCreationCompleted}
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
        {selectedImages.length > 0 && (
          <S.SelectedImageList aria-label="업로드할 이미지">
            {selectedImages.map((file, index) => (
              <S.SelectedImageItem key={`${file.name}-${file.lastModified}-${index}`}>
                <span>{file.name}</span>
                <button
                  type="button"
                  aria-label={`${file.name} 제거`}
                  disabled={isSubmitting || postCreationCompleted}
                  onClick={() => setSelectedImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                >
                  ×
                </button>
              </S.SelectedImageItem>
            ))}
          </S.SelectedImageList>
        )}
        <S.Footer>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleImageSelection}
          />
          <S.ImageButton type="button" aria-label="이미지 파일 추가" onClick={() => imageInputRef.current?.click()} disabled={isSubmitting || postCreationCompleted}><IoImageOutline /></S.ImageButton>
          <S.SubmitButton type="button" onClick={handleSubmit} disabled={isSubmitting || (postCreationCompleted && !createdPostId)}>
            {isSubmitting ? (postCreationCompleted ? "이미지 업로드 중..." : "게시 중...") : postCreationCompleted ? "이미지 다시 시도" : "게시"}
          </S.SubmitButton>
        </S.Footer>
      </S.EditorWrapper>
      {isLinkDialogOpen && (
        <S.LinkDialogOverlay ref={linkDialogRef}>
          <S.LinkDialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-link-dialog-title"
            onSubmit={handleLinkSubmit}
          >
            <h3 id="post-link-dialog-title">링크 추가</h3>
            <label htmlFor="post-link-url">링크 주소</label>
            <input
              id="post-link-url"
              type="text"
              autoFocus
              placeholder="https://example.com"
              value={linkHref}
              onChange={(event) => setLinkHref(event.target.value)}
            />
            <S.LinkDialogActions>
              {isLinkActive && (
                <button type="button" onClick={handleLinkRemove}>링크 제거</button>
              )}
              <span />
              <button type="button" onClick={closeLinkDialog}>취소</button>
              <button type="submit" disabled={!linkHref.trim()}>적용</button>
            </S.LinkDialogActions>
          </S.LinkDialog>
        </S.LinkDialogOverlay>
      )}
    </S.ModalOverlay>
  );
};
export default PostEditor;
