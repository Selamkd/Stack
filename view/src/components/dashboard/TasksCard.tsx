import { Editor, JSONContent } from '@tiptap/core';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import { CheckSquare, ListX } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';
import APIService from '../../service/api.service';
import { buildEditorExtensions } from '../editor/extensions';

const DOC_KEY = 'daily-tasks';

const DEFAULT_DOC: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [{ type: 'paragraph' }],
        },
      ],
    },
  ],
};

function taskItemFromText(text: string, checked: boolean): JSONContent {
  return {
    type: 'taskItem',
    attrs: { checked },
    content: [
      { type: 'paragraph', content: [{ type: 'text', text }] },
    ],
  };
}

function stripCheckedTasks(node: JSONContent): JSONContent | null {
  if (node.type === 'taskItem' && node.attrs?.checked) return null;
  if (!node.content) return node;
  const content = node.content
    .map(stripCheckedTasks)
    .filter((child): child is JSONContent => child !== null);
  if (node.type === 'taskList' && content.length === 0) return null;
  return { ...node, content };
}

export default function TasksCard() {
  const [initialContent, setInitialContent] = useState<JSONContent | null>(
    null
  );

  useEffect(() => {
    async function load() {
      try {
        const doc = await APIService.get(`board-docs/${DOC_KEY}`);
        const parsed = JSON.parse(doc.content);
        setInitialContent(
          parsed && parsed.type === 'doc' ? parsed : DEFAULT_DOC
        );
      } catch {
        try {
          const todos: { text: string; done: boolean }[] =
            await APIService.get('todos');
          if (todos && todos.length > 0) {
            setInitialContent({
              type: 'doc',
              content: [
                {
                  type: 'taskList',
                  content: todos.map((t) => taskItemFromText(t.text, t.done)),
                },
              ],
            });
            return;
          }
        } catch (error) {
          console.error('Error seeding tasks:', error);
        }
        setInitialContent(DEFAULT_DOC);
      }
    }
    load();
  }, []);

  if (!initialContent) {
    return (
      <div className="panel flex h-full min-h-[320px] animate-pulse flex-col p-4">
        <div className="mb-4 h-4 w-32 rounded bg-custom-hover/40" />
        <div className="mb-2 h-3 w-3/4 rounded bg-custom-hover/30" />
        <div className="h-3 w-1/2 rounded bg-custom-hover/30" />
      </div>
    );
  }

  return <TasksEditor initialContent={initialContent} />;
}

function TasksEditor({ initialContent }: { initialContent: JSONContent }) {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>(
    'idle'
  );

  const persist = useDebouncedCallback((content: string) => {
    APIService.post('board-docs', { key: DOC_KEY, content })
      .then(() => setSaveState('saved'))
      .catch((error) => console.error('Error saving tasks:', error));
  }, 700);

  const editor = useEditor({
    extensions: buildEditorExtensions(
      "Today's tasks — type [] + space, or / for blocks…"
    ),
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'px-4 py-3 min-h-[240px] text-sm focus:outline-none',
      },
    },
    onUpdate: ({ editor: e }) => {
      setSaveState('saving');
      persist(JSON.stringify(e.getJSON()));
    },
  });

  const progress = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e || e.isDestroyed) return { total: 0, done: 0 };
      let total = 0;
      let done = 0;
      e.state.doc.descendants((node) => {
        if (node.type.name === 'taskItem') {
          total++;
          if (node.attrs.checked) done++;
        }
        return true;
      });
      return { total, done };
    },
  });

  function clearCompleted(e: Editor | null) {
    if (!e) return;
    const cleaned = stripCheckedTasks(e.getJSON());
    e.commands.setContent(
      cleaned && cleaned.content && cleaned.content.length > 0
        ? cleaned
        : DEFAULT_DOC
    );
    setSaveState('saving');
    persist(JSON.stringify(e.getJSON()));
  }

  if (!editor) return null;

  return (
    <div className="panel flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-custom-border px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <CheckSquare size={15} className="text-clay/80" />
          Tasks
          <span className="font-normal text-custom-text">
            {format(new Date(), 'EEE, MMM d')}
          </span>
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-custom-text">
            {saveState === 'saving'
              ? 'Saving…'
              : progress.total > 0
              ? `${progress.done}/${progress.total} done`
              : ''}
          </span>
          {progress.done > 0 && (
            <button
              onClick={() => clearCompleted(editor)}
              title="Clear completed"
              className="flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-custom-text transition-colors hover:bg-custom-hover/60 hover:text-zinc-200"
            >
              <ListX size={13} />
              Clear done
            </button>
          )}
        </div>
      </div>
      <div
        className="max-h-[380px] flex-1 cursor-text overflow-y-auto scrollbar-thin"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
