import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import "../assets/TiptapEditor.scss";

export default function TiptapEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // disable duplicates
        underline: false,
        link: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[120px] p-2",
      },
      transformPastedHTML(html) {
        const doc = new DOMParser().parseFromString(html, "text/html");
        doc.body.querySelectorAll("*").forEach(el => {
          el.removeAttribute("style");
          el.removeAttribute("class");
        });
        return doc.body.innerHTML;
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  const Btn = ({ cmd, active, label }) => (
    <button
      type="button"
      onClick={cmd}
      className={`px-2 py-1 text-sm rounded ${
        active ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="border rounded bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b rounded p-1 bg-gray-50">
        <Btn
          cmd={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="B"
        />
        <Btn
          cmd={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="I"
        />
        <Btn
          cmd={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          label="U"
        />
        <Btn
          cmd={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="ul"
        />
        <Btn
          cmd={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="ol"
        />

        {/* Alignment Controls */}
        <Btn
          cmd={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          label="⬅"
        />
        <Btn
          cmd={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          label="⬌"
        />
        <Btn
          cmd={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          label="➡"
        />
        <Btn
          cmd={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
          label="☰"
        />

       {/* Headings */}
        <Btn
          cmd={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          label="H1"
        />
        <Btn
          cmd={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          label="H2"
        />
        <Btn
          cmd={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          label="H3"
        />

        {/* Undo / Redo */}
        <Btn
          cmd={() => editor.chain().focus().undo().run()}
          active={false}
          label="↶"
        />
        <Btn
          cmd={() => editor.chain().focus().redo().run()}
          active={false}
          label="↷"
        />

      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="tiptap-editor p-2 min-h-[120px]"  />
    </div>
  );
}
