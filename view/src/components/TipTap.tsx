import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { InnerEditorUI } from './InnerEditor';

const extensions = [StarterKit, Highlight];
const content = '<p>Type here....</p>';

interface ITipTap {
  initialContent?: string;
  onUpdate?: (content: string) => void;
  className?: string;
}
export function TipTap(props: ITipTap) {
  const { className, onUpdate, initialContent } = props;
  return (
    <div className={`${className}`}>
      <EditorProvider
        extensions={extensions}
        content={initialContent}
        onUpdate={({ editor, transaction }) => {
          // This should handle all changes including paste
          if (onUpdate && transaction.docChanged) {
            const html = editor.getHTML();
            console.log('Content updated:', html);
            onUpdate(html);
          }
        }}
        onContentError={({ error }) => {
          console.error('TipTap content error:', error);
        }}
        editorProps={{
          attributes: {
            class: 'prose prose-lg max-w-none mx-5 focus:outline-none',
          },

          handlePaste: (view, event) => {
            setTimeout(() => {
              if (onUpdate) {
                const html = view.dom.innerHTML;

                console.log(html);
                onUpdate(html);
              }
            }, 0);
            return false;
          },
        }}
        autofocus={'start'}
        injectCSS={false}
      >
        <InnerEditorUI />
      </EditorProvider>
    </div>
  );
}
