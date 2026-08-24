"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";

type Props = {
  content?: string;
  onChange: (html: string) => void;
};

const btn =
  "rounded-full px-2.5 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 data-[active]:bg-red-50 data-[active]:text-red-700";

function Btn({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} data-active={active ? "" : undefined} className={btn}>
      {children}
    </button>
  );
}

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      // Tiptap v3: StarterKit sudah termasuk Link.
      StarterKit.configure({ link: { openOnClick: false } }),
      Image,
      Placeholder.configure({ placeholder: "Tulis artikel di sini…" }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return <div className="min-h-64 rounded-xl border border-gray-200 bg-gray-50" />;

  const addImage = () => {
    // ponytail: window.prompt cukup utk internal tool — upgrade path: modal upload+preview.
    const url = window.prompt("URL gambar (https://…)");
    if (!url) return;
    if (!/^https?:\/\/.+/.test(url)) {
      alert("URL harus dimulai dengan http(s)://");
      return;
    }
    editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt("URL link (https://…)");
    if (!url) return;
    if (!/^https?:\/\/.+/.test(url)) {
      alert("URL harus dimulai dengan http(s)://");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100">
      <div className="flex flex-wrap gap-1 border-b border-gray-100 p-2">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <b>B</b>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <i>I</i>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
          H2
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
          H3
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          • List
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          1. List
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
          &ldquo;&rdquo;
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>
          {"</>"}
        </Btn>
        <Btn onClick={addLink} active={editor.isActive("link")}>
          🔗
        </Btn>
        <Btn onClick={addImage}>🖼 Gambar</Btn>
      </div>
      <EditorContent editor={editor} className="prose prose-sm max-w-none px-4 py-3 [&_p]:my-2 min-h-64" />
    </div>
  );
}
