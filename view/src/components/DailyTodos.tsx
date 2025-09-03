import { TipTap } from './TipTap';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import Paragraph from '@tiptap/extension-paragraph';
import { EditorContent, useEditor } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import { format } from 'date-fns';
import { CheckSquare } from 'lucide-react';
import '../components/editor.css';
export default function DailyTodos() {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: `
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="false">Task 1</li>
        <li data-type="taskItem" data-checked="true">Task 2</li>
        <li data-type="taskItem" data-checked="false">Task 3</li>
      
      </ul>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none p-4 ',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="group relative border border-custom-border bg-custom-surface rounded-xl p-0 overflow-hidden transition-all duration-300 max-h-[600px]">
      <div className="flex items-center gap-3 p-4 pb-3 border-b border-custom-border">
        <div>
          <h2 className="text-lg font-semibold text-white">Daily Tasks</h2>
          <p className="text-sm text-zinc-400">{format(new Date(), 'PPP')}</p>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        <EditorContent editor={editor} className="daily-todos-editor" />
      </div>
    </div>
  );
}
