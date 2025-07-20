import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const extensions = [StarterKit];

const content = '<p>Type here....</p>';

export function TipTap() {
  return (
    <EditorProvider extensions={extensions} content={content}></EditorProvider>
  );
}
