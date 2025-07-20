import { useCurrentEditor } from '@tiptap/react';
import { useEffect } from 'react';

export function EditorJSONPreview() {
  const { editor } = useCurrentEditor();

  return (
    <pre>
      {editor
        ? JSON.stringify(editor.getJSON(), null, 2)
        : 'Editor is not available'}
    </pre>
  );
}
