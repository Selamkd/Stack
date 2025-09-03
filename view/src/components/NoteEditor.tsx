import {
  EditorBubble,
  EditorCommand,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  JSONContent,
} from 'novel';
import { useEffect, useState } from 'react';
import { defaultExtensions } from './extensions';
import { slashCommand, suggestionItems } from './SlashCommand';
import '../styles/editor.css';
import { NodeSelector } from './selectors/nodeSelector';

interface NoteEditorProps {
  content: string;
  noteId: string;
  onContentChange?: (content: string) => void;
}

export const defaultContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Start typing or press / for commands...',
        },
      ],
    },
  ],
};

export function NoteEditor({
  content,
  onContentChange,
  noteId,
}: NoteEditorProps) {
  const [editorContent, setEditorContent] = useState<JSONContent | null>(null);
  const extensions = [...defaultExtensions, slashCommand];
  const contentHash = content ? btoa(content).slice(0, 10) : 'empty';
  const [openNode, setOpenNode] = useState(false);
  const hashKey = `editor-${noteId}-${contentHash}`;
  const [showBubbleMenu, setShowBubbleMenu] = useState(false);

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
    <div className="h-full bg-custom-base">
      <EditorRoot>
        <EditorContent
          key={`content-${hashKey}`}
          extensions={extensions}
          initialContent={editorContent ? editorContent : defaultContent}
          onUpdate={({ editor }) => {
            const json = editor.getJSON();
            setEditorContent(json);
            onContentChange?.(JSON.stringify(json));
            useEffect(() => {
              if (!editor) return;

              const update = () => {
                const { from, to, empty } = editor.state.selection;
                setShowBubbleMenu(!empty && from !== to);
              };

              editor.on('selectionUpdate', update);
              return () => {
                editor.off('selectionUpdate', update);
              };
            }, [editor]);
          }}
          className="prose prose-invert max-w-none p-6 focus:outline-none min-h-full"
          editorProps={{
            attributes: {
              class:
                'prose prose-invert max-w-none focus:outline-none min-h-full px-10 py-6 text-white bg-custom-base',
              style:
                'color: white; background-color: var(--custom-base, #0a0a0a);',
            },
          }}
        />
        <EditorBubble
          tippyOptions={{
            placement: 'top',
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl"
        >
          <NodeSelector open={showBubbleMenu} onOpenChange={setOpenNode} />
        </EditorBubble>
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-lg border border-custom-border bg-custom-surface shadow-lg transition-all">
          <EditorCommandList className="p-2">
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className="flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-left text-sm text-white hover:bg-custom-hover/20 hover:text-white aria-selected:bg-custom-hover/30 aria-selected:text-white cursor-pointer transition-all duration-150 border border-transparent hover:border-custom-hover/20"
                key={item.title}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-custom-border bg-custom-surface/50 text-custom-text-400">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-custom-text-400 truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
      </EditorRoot>
    </div>
  );
}
