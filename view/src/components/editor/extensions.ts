import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';
import { SlashCommand } from './slash-command';

const lowlight = createLowlight(common);

export function buildEditorExtensions(placeholder?: string) {
  return [
    StarterKit.configure({
      codeBlock: false,
      link: {
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
        },
      },
    }),
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: 'typescript',
    }),
    Highlight,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Table.configure({
      resizable: false,
    }),
    TableRow,
    TableHeader,
    TableCell,
    CharacterCount,
    Placeholder.configure({
      placeholder: placeholder || "Start writing, or press '/' for blocks…",
    }),
    SlashCommand,
  ];
}
