import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Box, Button, Flex } from "@chakra-ui/react";

const RichTextEditor = ({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <Box border="1px solid #ccc" borderRadius="md" p="4">
      <Flex gap="2" mb="4">
        <Button onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </Button>
        <Button onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </Button>
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          Bullet List
        </Button>
      </Flex>
      <EditorContent editor={editor} />
    </Box>
  );
};

export default RichTextEditor;
