import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from 'lucide-react';

const COLOUR_SWATCHES = [
  // Row 1 — Blacks and greys
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#ffffff',
  // Row 2 — Reds and pinks
  '#ff0000', '#ff4444', '#ff6d6d', '#ea4335', '#c0392b', '#e74c3c', '#ff6b6b', '#ff8a80',
  // Row 3 — Oranges and yellows
  '#ff6600', '#ff9900', '#ffab40', '#ffd740', '#ffff00', '#f9a825', '#ff8f00', '#e65100',
  // Row 4 — Greens
  '#00ff00', '#00cc00', '#2ecc71', '#27ae60', '#1e8449', '#00695c', '#004d40', '#006400',
  // Row 5 — Blues
  '#0000ff', '#1565c0', '#1976d2', '#2196f3', '#03a9f4', '#00bcd4', '#0097a7', '#006064',
  // Row 6 — Purples and brand
  '#9c27b0', '#673ab7', '#3f51b5', '#7b1fa2', '#4a148c', '#2b5ac7', '#1a237e', '#880e4f',
];

interface ColorPickerProps {
  currentColor: string | null;
  onChange: (color: string | null) => void;
}

function ColorPicker({ currentColor, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref} id="editor-color-picker-wrapper">
      {/* Trigger button */}
      <button
        id="editor-btn-color-picker"
        type="button"
        title="Text Colour"
        onClick={() => setOpen(!open)}
        className="flex flex-col items-center justify-center p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-all"
      >
        <span className="text-xs font-extrabold text-slate-700 leading-none">A</span>
        <span
          className="block w-4 h-1 rounded-full mt-0.5"
          style={{ backgroundColor: currentColor || '#000000' }}
        />
      </button>

      {/* Dropdown palette */}
      {open && (
        <div id="editor-color-picker-dropdown" className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-3 w-[200px]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Text Colour</p>

          {/* Colour swatches grid */}
          <div className="grid grid-cols-8 gap-1 mb-3">
            {COLOUR_SWATCHES.map((colour) => (
              <button
                key={colour}
                id={`editor-color-swatch-${colour.replace('#', '')}`}
                type="button"
                title={colour}
                onClick={() => {
                  onChange(colour);
                  setOpen(false);
                }}
                className={`w-5 h-5 rounded cursor-pointer border-2 transition-all hover:scale-110 ${
                  currentColor === colour ? 'border-brand-primary scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: colour }}
              />
            ))}
          </div>

          {/* Remove colour */}
          <button
            id="editor-btn-color-remove"
            type="button"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className="w-full text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 py-1.5 rounded-lg transition-all cursor-pointer border border-slate-200 flex items-center justify-center space-x-1"
          >
            <span>✕</span>
            <span>Remove colour</span>
          </button>
        </div>
      )}
    </div>
  );
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-primary underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[280px] px-4 py-3 text-slate-700 text-sm leading-relaxed',
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
    id,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
    id: string;
  }) => (
    <button
      id={id}
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
        active
          ? 'bg-brand-primary text-white'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div id="rich-text-editor-container" className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-brand-primary transition-colors bg-white">
      {/* Toolbar */}
      <div id="rich-text-editor-toolbar" className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-100 bg-slate-50">

        {/* History */}
        <ToolbarButton id="editor-btn-undo" onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton id="editor-btn-redo" onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Headings */}
        <ToolbarButton
          id="editor-btn-h2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          id="editor-btn-h3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Text formatting */}
        <ToolbarButton
          id="editor-btn-bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          id="editor-btn-italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          id="editor-btn-underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          id="editor-btn-highlight"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive('highlight')}
          title="Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </ToolbarButton>

        {/* Text colour palette */}
        <ColorPicker
          currentColor={editor.getAttributes('textStyle').color || null}
          onChange={(color) => {
            if (color === null) {
              editor.chain().focus().unsetColor().run();
            } else {
              editor.chain().focus().setColor(color).run();
            }
          }}
        />

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Lists */}
        <ToolbarButton
          id="editor-btn-bullet"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          id="editor-btn-ordered"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Alignment */}
        <ToolbarButton
          id="editor-btn-align-left"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          id="editor-btn-align-center"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          id="editor-btn-align-right"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Link */}
        <ToolbarButton
          id="editor-btn-link"
          onClick={addLink}
          active={editor.isActive('link')}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div id="rich-text-editor-workspace" className="relative min-h-[280px]">
        {editor.isEmpty && placeholder && (
          <p className="absolute top-3 left-4 text-slate-400 text-sm pointer-events-none select-none">
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>

      {/* Character count */}
      <div id="rich-text-editor-footer" className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex justify-end">
        <span className="text-[10px] font-semibold text-slate-400">
          {editor.getText().length} characters
        </span>
      </div>
    </div>
  );
}
