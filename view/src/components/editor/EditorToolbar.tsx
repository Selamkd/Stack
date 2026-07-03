import { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import {
  Bold,
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  LucideIcon,
  Minus,
  Redo2,
  SquareCode,
  Strikethrough,
  Table,
  TextQuote,
  Undo2,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
}

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function ToolbarButton({
  icon: Icon,
  label,
  isActive,
  disabled,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:opacity-30 ${
        isActive
          ? 'bg-clay/15 text-clay'
          : 'text-zinc-400 hover:bg-custom-hover/60 hover:text-zinc-100'
      }`}
    >
      <Icon size={15} />
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-custom-border" />;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e || e.isDestroyed) {
        return {
          bold: false,
          italic: false,
          strike: false,
          code: false,
          highlight: false,
          h1: false,
          h2: false,
          h3: false,
          bulletList: false,
          orderedList: false,
          taskList: false,
          blockquote: false,
          codeBlock: false,
          canUndo: false,
          canRedo: false,
        };
      }
      return {
        bold: e.isActive('bold'),
        italic: e.isActive('italic'),
        strike: e.isActive('strike'),
        code: e.isActive('code'),
        highlight: e.isActive('highlight'),
        h1: e.isActive('heading', { level: 1 }),
        h2: e.isActive('heading', { level: 2 }),
        h3: e.isActive('heading', { level: 3 }),
        bulletList: e.isActive('bulletList'),
        orderedList: e.isActive('orderedList'),
        taskList: e.isActive('taskList'),
        blockquote: e.isActive('blockquote'),
        codeBlock: e.isActive('codeBlock'),
        canUndo: e.can().undo(),
        canRedo: e.can().redo(),
      };
    },
  });

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-custom-border bg-custom-surface/80 px-3 py-1.5 backdrop-blur-sm">
      <ToolbarButton
        icon={Undo2}
        label="Undo"
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <ToolbarButton
        icon={Redo2}
        label="Redo"
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      />
      <Divider />
      <ToolbarButton
        icon={Heading1}
        label="Heading 1"
        isActive={state.h1}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarButton
        icon={Heading2}
        label="Heading 2"
        isActive={state.h2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        icon={Heading3}
        label="Heading 3"
        isActive={state.h3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <Divider />
      <ToolbarButton
        icon={Bold}
        label="Bold (⌘B)"
        isActive={state.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={Italic}
        label="Italic (⌘I)"
        isActive={state.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={Strikethrough}
        label="Strikethrough"
        isActive={state.strike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <ToolbarButton
        icon={Highlighter}
        label="Highlight"
        isActive={state.highlight}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      />
      <ToolbarButton
        icon={Code}
        label="Inline code (⌘E)"
        isActive={state.code}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
      <Divider />
      <ToolbarButton
        icon={List}
        label="Bullet list"
        isActive={state.bulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon={ListOrdered}
        label="Numbered list"
        isActive={state.orderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        icon={CheckSquare}
        label="To-do list"
        isActive={state.taskList}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      />
      <Divider />
      <ToolbarButton
        icon={TextQuote}
        label="Quote"
        isActive={state.blockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        icon={SquareCode}
        label="Code block"
        isActive={state.codeBlock}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />
      <ToolbarButton
        icon={Table}
        label="Insert table"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      />
      <ToolbarButton
        icon={Minus}
        label="Divider"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />
    </div>
  );
}
