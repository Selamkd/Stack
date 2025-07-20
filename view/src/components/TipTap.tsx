import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { InnerEditorUI } from './InnerEditor';

const extensions = [StarterKit];
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
      <EditorProvider extensions={extensions} content={content}>
        <InnerEditorUI />
      </EditorProvider>
    </div>
  );
}
