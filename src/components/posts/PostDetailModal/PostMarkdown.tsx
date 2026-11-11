import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Markdown } from "@tiptap/markdown";

// Use the same Markdown dialect as the post editors, including ++underline++.
const PostMarkdown = ({ content }: { content: string }) => {
  const editor = useEditor({
    extensions: [StarterKit, Markdown, Image],
    content,
    contentType: "markdown",
    editable: false,
  });

  useEffect(() => {
    if (editor && editor.getMarkdown() !== content) {
      editor.commands.setContent(content, { contentType: "markdown", emitUpdate: false });
    }
  }, [editor, content]);

  return <EditorContent editor={editor} />;
};

export default PostMarkdown;
