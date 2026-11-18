import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Markdown } from "@tiptap/markdown";

// 일반 유니코드는 유지하고, 화면을 무너뜨리는 과도한 결합 문자만 제거한다.
const normalizeDisplayContent = (content: string) => {
  const normalizedContent = content.normalize("NFC");
  const combiningMarks = [...normalizedContent.matchAll(/\p{M}/gu)];
  const hasExcessiveCombiningMarks =
    combiningMarks.length > 3 || /\p{M}{4,}/u.test(normalizedContent);

  return hasExcessiveCombiningMarks
    ? normalizedContent.replace(/\p{M}/gu, "")
    : normalizedContent;
};

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
