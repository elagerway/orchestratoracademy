"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code as CodeIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Undo,
  Redo,
  Play as YoutubeIcon,
  FileCode,
} from "lucide-react";

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex size-8 items-center justify-center rounded transition-colors ${
        active
          ? "bg-emerald-accent/20 text-emerald-accent"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-border" />;
}

export function RichEditor({ content, onChange, placeholder }: RichEditorProps) {
  const [sourceMode, setSourceMode] = useState(false);
  const [sourceValue, setSourceValue] = useState(content);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-emerald-accent underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full" },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing...",
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Youtube.configure({
        HTMLAttributes: { class: "w-full rounded-lg" },
        width: 0,
        height: 0,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none min-h-[400px] px-4 py-3 outline-none prose-headings:font-heading prose-p:leading-relaxed prose-a:text-emerald-accent",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setSourceValue(html);
    },
  });

  if (!editor) return null;

  function addLink() {
    const url = window.prompt("URL:");
    if (url) {
      editor!.chain().focus().setLink({ href: url }).run();
    }
  }

  function addImage() {
    const url = window.prompt("Image URL:");
    if (url) {
      editor!.chain().focus().setImage({ src: url }).run();
    }
  }

  function addYoutube() {
    const url = window.prompt("YouTube URL:");
    if (url) {
      editor!.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
    }
  }

  function toggleSource() {
    if (sourceMode) {
      // Switching from source to WYSIWYG — apply the HTML
      editor!.commands.setContent(sourceValue);
      onChange(sourceValue);
    } else {
      // Switching to source — grab current HTML
      setSourceValue(editor!.getHTML());
    }
    setSourceMode(!sourceMode);
  }

  function handleSourceChange(html: string) {
    setSourceValue(html);
    onChange(html);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5">
        {!sourceMode && (
          <>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              active={editor.isActive("heading", { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive("heading", { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor.isActive("heading", { level: 3 })}
              title="Heading 3"
            >
              <Heading3 className="size-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
              title="Bold"
            >
              <Bold className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
              title="Italic"
            >
              <Italic className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")}
              title="Underline"
            >
              <UnderlineIcon className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive("strike")}
              title="Strikethrough"
            >
              <Strikethrough className="size-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              active={editor.isActive({ textAlign: "left" })}
              title="Align left"
            >
              <AlignLeft className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              active={editor.isActive({ textAlign: "center" })}
              title="Align center"
            >
              <AlignCenter className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              active={editor.isActive({ textAlign: "right" })}
              title="Align right"
            >
              <AlignRight className="size-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
              title="Bullet list"
            >
              <List className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
              title="Numbered list"
            >
              <ListOrdered className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive("blockquote")}
              title="Blockquote"
            >
              <Quote className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive("codeBlock")}
              title="Code block"
            >
              <CodeIcon className="size-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal rule"
            >
              <Minus className="size-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Add link">
              <LinkIcon className="size-4" />
            </ToolbarButton>
            <ToolbarButton onClick={addImage} title="Add image">
              <ImageIcon className="size-4" />
            </ToolbarButton>
            <ToolbarButton onClick={addYoutube} title="Embed YouTube">
              <YoutubeIcon className="size-4" />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
              <Undo className="size-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
              <Redo className="size-4" />
            </ToolbarButton>
          </>
        )}

        <div className="ml-auto">
          <ToolbarButton onClick={toggleSource} active={sourceMode} title="HTML Source">
            <FileCode className="size-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor or Source */}
      <div className="bg-background">
        {sourceMode ? (
          <textarea
            value={sourceValue}
            onChange={(e) => handleSourceChange(e.target.value)}
            className="min-h-[400px] w-full resize-y bg-background px-4 py-3 font-mono text-sm leading-relaxed outline-none"
            spellCheck={false}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  );
}
