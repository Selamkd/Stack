import { Content, Editor } from '@tiptap/core';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import EditorToolbar from './editor/EditorToolbar';
import { buildEditorExtensions } from './editor/extensions';

interface NoteEditorProps {
  content: string;
  onContentChange?: (content: string) => void;
}

export const EMPTY_DOC = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

function parseContent(content: string): Content {
  if (!content) return EMPTY_DOC;
  try {
    const parsed = JSON.parse(content);
    if (parsed && parsed.type === 'doc') return parsed;
    return EMPTY_DOC;
  } catch {
    return content;
  }
}

function EditorFooter({ editor }: { editor: Editor }) {
  const counts = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e || e.isDestroyed || !e.storage.characterCount) {
        return { words: 0, characters: 0 };
      }
      return {
        words: e.storage.characterCount.words(),
        characters: e.storage.characterCount.characters(),
      };
    },
  });

  return (
    <div className="flex items-center justify-end gap-3 border-t border-custom-border px-4 py-1.5 text-xs text-custom-text">
      <span>{counts.words} words</span>
      <span>·</span>
      <span>{counts.characters} characters</span>
    </div>
  );
}

export function NoteEditor({ content, onContentChange }: NoteEditorProps) {
  const editor = useEditor({
    extensions: buildEditorExtensions(),
    content: parseContent(content),
    editorProps: {
      attributes: {
        class: 'px-8 py-6 md:px-12 min-h-[60vh] focus:outline-none',
      },
    },
    onUpdate: ({ editor: e }) => {
      onContentChange?.(JSON.stringify(e.getJSON()));
    },
  });

  if (!editor) return null;

  return (
    <div className="flex h-full flex-col">
      <EditorToolbar editor={editor} />
      <div
        className="flex-1 cursor-text overflow-y-auto scrollbar-thin"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>
      <EditorFooter editor={editor} />
    </div>
  );
}
