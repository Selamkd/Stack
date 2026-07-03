import { Editor, Extension, Range } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion, { SuggestionProps } from '@tiptap/suggestion';
import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  LucideIcon,
  Minus,
  Table,
  Text,
  TextQuote,
} from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

export interface SlashItem {
  title: string;
  description: string;
  searchTerms: string[];
  icon: LucideIcon;
  command: (props: { editor: Editor; range: Range }) => void;
}

const SLASH_ITEMS: SlashItem[] = [
  {
    title: 'Text',
    description: 'Plain paragraph text.',
    searchTerms: ['p', 'paragraph'],
    icon: Text,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setParagraph().run(),
  },
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    searchTerms: ['title', 'h1', 'big'],
    icon: Heading1,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    searchTerms: ['subtitle', 'h2'],
    icon: Heading2,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    searchTerms: ['h3', 'small'],
    icon: Heading3,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run(),
  },
  {
    title: 'To-do List',
    description: 'Checklist with checkboxes.',
    searchTerms: ['todo', 'task', 'check', 'checkbox'],
    icon: CheckSquare,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: 'Bullet List',
    description: 'Simple bullet list.',
    searchTerms: ['unordered', 'ul', 'point'],
    icon: List,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Ordered list with numbers.',
    searchTerms: ['ordered', 'ol', 'numbers'],
    icon: ListOrdered,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: 'Code Block',
    description: 'Syntax-highlighted code.',
    searchTerms: ['code', 'codeblock', 'snippet'],
    icon: Code,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: 'Quote',
    description: 'Capture a quote or callout.',
    searchTerms: ['blockquote', 'quote'],
    icon: TextQuote,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: 'Table',
    description: '3×3 table with a header row.',
    searchTerms: ['table', 'grid', 'rows'],
    icon: Table,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
  {
    title: 'Divider',
    description: 'Horizontal rule.',
    searchTerms: ['hr', 'divider', 'line', 'separator'],
    icon: Minus,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
];

interface SlashMenuHandle {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

const SlashMenu = forwardRef<SlashMenuHandle, SuggestionProps<SlashItem>>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
      setSelectedIndex(0);
    }, [props.items]);

    const selectItem = (index: number) => {
      const item = props.items[index];
      if (item) {
        props.command(item);
      }
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex(
            (selectedIndex + props.items.length - 1) % props.items.length
          );
          return true;
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % props.items.length);
          return true;
        }
        if (event.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    if (props.items.length === 0) {
      return (
        <div className="panel-raised shadow-2xl w-72 p-3 text-sm text-custom-text">
          No results
        </div>
      );
    }

    return (
      <div className="panel-raised shadow-2xl w-72 max-h-80 overflow-y-auto scrollbar-thin p-1.5">
        {props.items.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              onClick={() => selectItem(index)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                index === selectedIndex
                  ? 'bg-custom-hover/60 text-white'
                  : 'text-zinc-300'
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-custom-border bg-custom-surface text-zinc-400">
                <Icon size={16} />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-zinc-100">
                  {item.title}
                </span>
                <span className="block truncate text-xs text-custom-text">
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    );
  }
);

SlashMenu.displayName = 'SlashMenu';

function positionMenu(
  clientRect: (() => DOMRect | null) | null | undefined,
  element: HTMLElement
) {
  const rect = clientRect?.();
  if (!rect) return;

  element.style.position = 'absolute';
  element.style.zIndex = '100';
  element.style.left = `${rect.left + window.scrollX}px`;

  const menuHeight = element.offsetHeight || 320;
  const spaceBelow = window.innerHeight - rect.bottom;

  if (spaceBelow < menuHeight + 12 && rect.top > menuHeight + 12) {
    element.style.top = `${rect.top + window.scrollY - menuHeight - 6}px`;
  } else {
    element.style.top = `${rect.bottom + window.scrollY + 6}px`;
  }
}

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashItem>({
        editor: this.editor,
        char: '/',
        command: ({ editor, range, props }) => props.command({ editor, range }),
        items: ({ query }) => {
          const q = query.toLowerCase();
          return SLASH_ITEMS.filter(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              item.searchTerms.some((term) => term.includes(q))
          ).slice(0, 10);
        },
        render: () => {
          let component: ReactRenderer<SlashMenuHandle> | null = null;

          return {
            onStart: (props) => {
              component = new ReactRenderer(SlashMenu, {
                props,
                editor: props.editor,
              });
              document.body.appendChild(component.element);
              positionMenu(props.clientRect, component.element as HTMLElement);
            },
            onUpdate: (props) => {
              component?.updateProps(props);
              if (component) {
                positionMenu(
                  props.clientRect,
                  component.element as HTMLElement
                );
              }
            },
            onKeyDown: (props) => {
              if (props.event.key === 'Escape') {
                component?.element.remove();
                component?.destroy();
                component = null;
                return true;
              }
              return component?.ref?.onKeyDown(props.event) ?? false;
            },
            onExit: () => {
              component?.element.remove();
              component?.destroy();
              component = null;
            },
          };
        },
      }),
    ];
  },
});
