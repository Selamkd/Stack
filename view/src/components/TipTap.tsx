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
        onUpdate={
          onUpdate ? ({ editor }) => onUpdate(editor.getHTML()) : undefined
        }
        autofocus={'start'}
        injectCSS={false}
      >
        <InnerEditorUI />
      </EditorProvider>
    </div>
  );
}
