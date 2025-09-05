import { EditorContent, EditorRoot, JSONContent } from 'novel';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckSquare } from 'lucide-react';
import { defaultExtensions } from './extensions';
import './editor.css';

const defaultTaskContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: {
            checked: false,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Daily Task 1',
                },
              ],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            checked: false,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Daily Task 2',
                },
              ],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            checked: true,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Daily Task 2',
                },
              ],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            checked: false,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: "Plan tomorrow's priorities",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

interface DailyTodosProps {
  onContentChange?: (content: string) => void;
  initialContent?: string;
}

export default function DailyTodos({
  onContentChange,
  initialContent,
}: DailyTodosProps) {
  const [editorContent, setEditorContent] = useState<JSONContent | null>(null);

  const taskExtensions = defaultExtensions;

  useEffect(() => {
    if (!initialContent) {
      setEditorContent(defaultTaskContent);
      return;
    }

    try {
      const parsed = JSON.parse(initialContent);
      if (parsed && parsed.type === 'doc') {
        setEditorContent(parsed);
      } else {
        console.error('Invalid JSON structure');
        setEditorContent(defaultTaskContent);
      }
    } catch (error) {
      console.log('Error parsing content', error);
      setEditorContent(defaultTaskContent);
    }
  }, [initialContent]);

  const handleContentChange = (newContent: JSONContent) => {
    setEditorContent(newContent);
    onContentChange?.(JSON.stringify(newContent));
  };

  return (
    <div className="group relative border border-custom-border blue-glass rounded-xl p-0 overflow-hidden transition-all duration-300 max-h-[600px]">
      <div className="flex items-center gap-3 p-4 pb-3 border-b border-custom-border">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-indigo-200/60" />
          <div>
            <h2 className="text-lg font-semibold text-white">Daily Tasks</h2>
            <p className="text-sm text-zinc-400">{format(new Date(), 'PPP')}</p>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        <EditorRoot>
          <EditorContent
            extensions={taskExtensions}
            initialContent={editorContent || defaultTaskContent}
            onUpdate={({ editor }) => {
              const json = editor.getJSON();
              handleContentChange(json);
            }}
            className="daily-todos-editor"
            editorProps={{
              attributes: {
                class:
                  'prose prose-invert max-w-none focus:outline-none p-4 daily-todos-content',
                placeholder: 'Add a new task...',
              },
            }}
          />
        </EditorRoot>
      </div>
    </div>
  );
}
