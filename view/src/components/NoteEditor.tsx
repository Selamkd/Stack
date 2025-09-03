import { EditorContent, EditorRoot, JSONContent } from 'novel';
import { useEffect, useState } from 'react';
import { defaultExtensions } from './extensions';

interface NoteEditorProps {
  content: string;
  noteId: string;
  onContentChange?: (content: string) => void;
}
export const defaultContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'text',
      text: 'Start Typing or / for commands',
    },
  ],
};
export function NoteEditor({
  content,
  onContentChange,
  noteId,
}: NoteEditorProps) {
  const [editorContent, setEditorContent] = useState<JSONContent | null>(null);
  const extensions = [...defaultExtensions];

  const contentHash = content ? btoa(content).slice(0, 10) : 'empty';
  const hashKey = `editor-${noteId}-${contentHash}`;
  useEffect(() => {
    if (!content) {
      setEditorContent(defaultContent);
      return;
    }

    try {
      const parsed = JSON.parse(content);
      if (parsed && parsed.type === 'doc') {
        setEditorContent(parsed);
      } else {
        console.error('Invalid JSON structure');
        setEditorContent(defaultContent);
      }
    } catch (error) {
      console.log('Error parsing content', error);
      setEditorContent(defaultContent);
    }
  }, [content]);

  return (
    <div className="h-full">
      <EditorRoot>
        <EditorContent
          key={`content-${hashKey}`}
          extensions={extensions}
          initialContent={editorContent ? editorContent : defaultContent}
          onUpdate={({ editor }) => {
            const json = editor.getJSON();
            setEditorContent(json);
            onContentChange?.(JSON.stringify(json));
          }}
          className="prose prose-invert max-w-none p-6 focus:outline-none"
          editorProps={{
            attributes: {
              class:
                'prose prose-invert max-w-none focus:outline-none min-h-full p-4',
            },
          }}
        />
      </EditorRoot>
    </div>
  );
}
