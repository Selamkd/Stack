import { useCurrentEditor } from '@tiptap/react';
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus';

export function InnerEditorUI() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <FloatingMenu
        editor={editor}
        className="bg-custom-surface border border-custom-border rounded-lg shadow-lg p-2 flex gap-1"
      >
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-3 py-1 text-sm rounded transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-custom-active text-white'
              : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
          }`}
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1 text-sm rounded transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-custom-active text-white'
              : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-custom-active text-white'
              : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
          }`}
        >
          List
        </button>
      </FloatingMenu>

      <BubbleMenu
        editor={editor}
        className="bg-custom-surface border border-custom-border rounded-lg shadow-lg p-2 flex gap-1"
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            editor.isActive('bold')
              ? 'bg-custom-active text-white'
              : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            editor.isActive('italic')
              ? 'bg-custom-active text-white'
              : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            editor.isActive('strike')
              ? 'bg-custom-active text-white'
              : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
          }`}
        >
          Strike
        </button>
      </BubbleMenu>

      <div className="relative">
        <div
          className="prose prose-lg max-w-none p-6 min-h-[400px] focus-within:outline-none"
          style={{
            color: '#a1a1aa',
          }}
        />
      </div>

      <div className="border-t border-custom-border bg-custom-base p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`px-3 py-2 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              editor.isActive('bold')
                ? 'bg-custom-active text-white'
                : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
            }`}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`px-3 py-2 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              editor.isActive('italic')
                ? 'bg-custom-active text-white'
                : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
            }`}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`px-3 py-2 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              editor.isActive('strike')
                ? 'bg-custom-active text-white'
                : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
            }`}
          >
            Strike
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={`px-3 py-2 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              editor.isActive('code')
                ? 'bg-custom-active text-white'
                : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
            }`}
          >
            Code
          </button>
          <div className="w-px bg-custom-border mx-2" />
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`px-3 py-2 text-sm rounded transition-colors ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-custom-active text-white'
                : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
            }`}
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`px-3 py-2 text-sm rounded transition-colors ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-custom-active text-white'
                : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
            }`}
          >
            H2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`px-3 py-2 text-sm rounded transition-colors ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-custom-active text-white'
                : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
            }`}
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              editor.isActive('paragraph')
                ? 'bg-custom-active text-white'
                : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
            }`}
          >
            P
          </button>
          <div className="w-px bg-custom-border mx-2" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              editor.isActive('bulletList')
                ? 'bg-custom-active text-white'
                : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
            }`}
          >
            Bullet List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              editor.isActive('orderedList')
                ? 'bg-custom-active text-white'
                : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
            }`}
          >
            Ordered List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              editor.isActive('codeBlock')
                ? 'bg-custom-active text-white'
                : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
            }`}
          >
            Code Block
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              editor.isActive('blockquote')
                ? 'bg-custom-active text-white'
                : 'text-zinc-400 hover:bg-custom-hover hover:text-white'
            }`}
          >
            Quote
          </button>
          <div className="w-px bg-custom-border mx-2" />
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="px-3 py-2 text-sm rounded transition-colors text-zinc-400 hover:bg-custom-hover hover:text-white"
          >
            Horizontal Rule
          </button>
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="px-3 py-2 text-sm rounded transition-colors text-zinc-400 hover:bg-custom-hover hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="px-3 py-2 text-sm rounded transition-colors text-zinc-400 hover:bg-custom-hover hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Redo
          </button>
        </div>
      </div>
    </>
  );
}
