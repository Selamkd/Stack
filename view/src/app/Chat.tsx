import {
  BotMessageSquare,
  Check,
  Copy,
  MessageSquarePlus,
  Pencil,
  Save,
  SendHorizonal,
  Trash2,
  X,
} from 'lucide-react';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSearchParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatDistanceToNow } from 'date-fns';
import { IChatMessage } from '../../../back/src/models/conversation.model';
import SnippetModal from '../components/SnippetModal';
import APIService from '../service/api.service';

interface IConversationListItem {
  _id: string;
  title: string;
  updatedAt?: string;
}

const STARTER_PROMPTS = [
  'Explain TypeScript generics with a real MERN example',
  'When do I reach for useCallback vs useMemo?',
  'Walk me through a JWT auth flow in Express, step by step',
  'Common Mongoose mistakes that bite you in production',
];

type MdComponents = ComponentProps<typeof ReactMarkdown>['components'];

export default function Chat() {
  const [conversations, setConversations] = useState<IConversationListItem[]>(
    []
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [snippetDraft, setSnippetDraft] = useState<{
    code: string;
    language: string;
  } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchConversations();
    const q = searchParams.get('q');
    if (q) {
      setInput(q);
      setSearchParams({}, { replace: true });
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchConversations() {
    try {
      const res = await APIService.get('conversations');
      setConversations(res || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }

  async function openConversation(id: string) {
    if (isStreaming) return;
    try {
      const conversation = await APIService.get(`conversations/${id}`);
      setActiveId(id);
      setMessages(conversation.messages || []);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  }

  function newConversation() {
    if (isStreaming) return;
    setActiveId(null);
    setMessages([]);
    inputRef.current?.focus();
  }

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || isStreaming) return;

    setInput('');
    setIsStreaming(true);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content },
      { role: 'assistant', content: '' },
    ]);

    try {
      const conversationId = await APIService.stream(
        `conversations/${activeId || 'new'}/messages`,
        { content },
        (chunk) => {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            next[next.length - 1] = {
              ...last,
              content: last.content + chunk,
            };
            return next;
          });
        }
      );
      if (!activeId && conversationId) setActiveId(conversationId);
      fetchConversations();
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = {
          ...last,
          content:
            last.content ||
            'Something went wrong — check that the backend is running and BOT_KEY is set.',
        };
        return next;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  async function renameConversation(id: string) {
    const title = renameValue.trim();
    if (!title) return;
    try {
      await APIService.patch(`conversations/${id}`, { title });
      setConversations((prev) =>
        prev.map((c) => (c._id === id ? { ...c, title } : c))
      );
      setRenamingId(null);
    } catch (error) {
      console.error('Error renaming conversation:', error);
    }
  }

  async function deleteConversation(id: string) {
    if (confirmingDelete !== id) {
      setConfirmingDelete(id);
      setTimeout(() => setConfirmingDelete(null), 2500);
      return;
    }
    try {
      await APIService.delete(`conversations/${id}`);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      setConfirmingDelete(null);
      if (activeId === id) {
        setActiveId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }

  return (
    <div className="flex h-[calc(100vh-57px)]">
      <div className="flex w-64 shrink-0 flex-col border-r border-custom-border">
        <div className="p-3">
          <button
            onClick={newConversation}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-clay/10 px-3 py-2.5 text-sm font-medium text-clay transition-colors hover:bg-clay/20"
          >
            <MessageSquarePlus size={15} />
            New chat
          </button>
        </div>

        <div className="flex-1 space-y-0.5 overflow-y-auto scrollbar-thin px-3 pb-4">
          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => openConversation(conversation._id)}
              className={`group cursor-pointer rounded-lg border px-3 py-2 transition-all ${
                activeId === conversation._id
                  ? 'border-custom-active bg-custom-raised'
                  : 'border-transparent hover:border-custom-border hover:bg-custom-surface'
              }`}
            >
              {renamingId === conversation._id ? (
                <div className="flex items-center gap-1.5">
                  <input
                    value={renameValue}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') renameConversation(conversation._id);
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                    className="input-base w-full px-2 py-1 text-xs"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenamingId(null);
                    }}
                    className="shrink-0 text-zinc-500 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-1">
                    <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">
                      {conversation.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenamingId(conversation._id);
                        setRenameValue(conversation.title);
                      }}
                      className="shrink-0 rounded p-0.5 text-custom-text opacity-0 transition-all hover:text-zinc-200 group-hover:opacity-100"
                    >
                      <Pencil size={11} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation._id);
                      }}
                      className={`shrink-0 rounded p-0.5 transition-all ${
                        confirmingDelete === conversation._id
                          ? 'text-red-400 opacity-100'
                          : 'text-custom-text opacity-0 hover:text-red-400 group-hover:opacity-100'
                      }`}
                    >
                      {confirmingDelete === conversation._id ? (
                        <Check size={11} />
                      ) : (
                        <Trash2 size={11} />
                      )}
                    </button>
                  </div>
                  {conversation.updatedAt && (
                    <span className="text-[10px] text-custom-text">
                      {formatDistanceToNow(new Date(conversation.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
          {conversations.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-custom-text">
              No conversations yet
            </p>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {messages.length === 0 ? (
            <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-6 p-6">
              <div className="text-center">
                <BotMessageSquare className="mx-auto mb-3 h-10 w-10 text-clay/70" />
                <h2 className="text-lg font-semibold text-white">
                  Your dev mentor, on tap
                </h2>
                <p className="mt-1 text-sm text-custom-text">
                  Ask anything — answers stream in with code you can save
                  straight to your snippets
                </p>
              </div>
              <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => send(prompt)}
                    className="bg-custom-surface rounded-xl border border-custom-border p-3.5 text-left text-sm text-zinc-300 transition-all hover:border-custom-active hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 p-6">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                  isStreaming={
                    isStreaming &&
                    index === messages.length - 1 &&
                    message.role === 'assistant'
                  }
                  onSaveSnippet={(code, language) =>
                    setSnippetDraft({ code, language })
                  }
                />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="border-t border-custom-border p-4">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={Math.min(6, Math.max(1, input.split('\n').length))}
              placeholder={
                isStreaming ? 'Thinking…' : 'Ask your mentor… (Shift+Enter for newline)'
              }
              disabled={isStreaming}
              className="input-base w-full resize-none px-4 py-3 text-sm disabled:opacity-60"
            />
            <button
              onClick={() => send()}
              disabled={isStreaming || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-clay/15 text-clay transition-colors hover:bg-clay/25 disabled:opacity-40"
            >
              <SendHorizonal size={16} />
            </button>
          </div>
        </div>
      </div>

      <SnippetModal
        open={snippetDraft !== null}
        onClose={() => setSnippetDraft(null)}
        initial={
          snippetDraft
            ? { code: snippetDraft.code, language: snippetDraft.language }
            : undefined
        }
        onSaved={() => setSnippetDraft(null)}
      />
    </div>
  );
}

interface ChatMessageProps {
  message: IChatMessage;
  isStreaming: boolean;
  onSaveSnippet: (code: string, language: string) => void;
}

function ChatMessage({ message, isStreaming, onSaveSnippet }: ChatMessageProps) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-custom-raised px-4 py-2.5 text-sm text-zinc-100">
          {message.content}
        </div>
      </div>
    );
  }

  const components: MdComponents = {
    pre({ children }) {
      return <>{children}</>;
    },
    code({ className, children }) {
      const code = String(children).replace(/\n$/, '');
      const match = /language-(\w+)/.exec(className || '');
      const isBlock = Boolean(match) || code.includes('\n');

      if (!isBlock) {
        return (
          <code className="rounded bg-custom-raised px-1.5 py-0.5 font-mono text-[0.85em] text-clay">
            {code}
          </code>
        );
      }

      const language = match?.[1] || 'text';
      return (
        <CodeBlock
          code={code}
          language={language}
          onSave={() => onSaveSnippet(code, language)}
        />
      );
    },
  };

  return (
    <div className="flex gap-3">
      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-clay/10">
        <BotMessageSquare size={14} className="text-clay" />
      </span>
      <div className="prose prose-invert min-w-0 max-w-none flex-1 prose-p:my-2 prose-pre:my-0 prose-pre:bg-transparent prose-pre:p-0 text-sm">
        {message.content ? (
          <ReactMarkdown components={components}>
            {message.content}
          </ReactMarkdown>
        ) : (
          isStreaming && (
            <span className="inline-flex items-center gap-2 text-custom-text">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-b-2 border-clay/70" />
              Thinking…
            </span>
          )
        )}
      </div>
    </div>
  );
}

function CodeBlock({
  code,
  language,
  onSave,
}: {
  code: string;
  language: string;
  onSave: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Error copying code:', error);
    }
  }

  return (
    <div className="not-prose my-3 overflow-hidden rounded-xl border border-custom-border bg-custom-base">
      <div className="flex items-center justify-between border-b border-custom-border px-3.5 py-1.5">
        <span className="font-mono text-[11px] text-custom-text">
          {language}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={copy}
            className={`flex items-center gap-1 rounded px-1.5 py-1 text-[11px] transition-colors ${
              copied
                ? 'text-clay'
                : 'text-custom-text hover:bg-custom-hover/60 hover:text-zinc-200'
            }`}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={onSave}
            title="Save to snippets"
            className="flex items-center gap-1 rounded px-1.5 py-1 text-[11px] text-custom-text transition-colors hover:bg-custom-hover/60 hover:text-sand"
          >
            <Save size={11} />
            Snippet
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '0.9rem',
          background: 'transparent',
          fontSize: '0.8rem',
          lineHeight: '1.6',
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
