import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Markdown } from "@tiptap/markdown";

const MAX_CONSECUTIVE_COMBINING_MARKS = 3;

// 일반 유니코드는 유지하고, 화면을 세로로 무너뜨리는 결합 문자 반복만 제한한다.
const normalizeDisplayContent = (content: string) =>
  content
    .normalize("NFC")
    .replace(/\p{M}{4,}/gu, (marks) =>
      marks.slice(0, MAX_CONSECUTIVE_COMBINING_MARKS),
    );

const PostMarkdown = ({ content }: { content: string }) => {
  const normalizedContent = normalizeDisplayContent(content);
  const editor = useEditor({
    extensions: [StarterKit, Markdown, Image],
    content: normalizedContent,
    contentType: "markdown",
    editable: false,
  });

  useEffect(() => {
    if (editor && editor.getMarkdown() !== normalizedContent) {
      editor.commands.setContent(normalizedContent, {
        contentType: "markdown",
        emitUpdate: false,
      });
    }
  }, [editor, normalizedContent]);

  return <EditorContent editor={editor} />;
};

export default PostMarkdown;
