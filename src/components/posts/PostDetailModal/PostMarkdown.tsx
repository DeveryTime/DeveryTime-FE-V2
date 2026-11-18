import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Markdown } from "@tiptap/markdown";
import { normalizeDisplayText } from "../../../utils/normalizeDisplayText";

const PostMarkdown = ({ content }: { content: string }) => {
  const normalizedContent = normalizeDisplayText(content);
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
