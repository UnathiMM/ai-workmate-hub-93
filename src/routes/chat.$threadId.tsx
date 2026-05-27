import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageSquare, Plus, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputTextarea, PromptInputSubmit, PromptInputFooter } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useThreads, newThreadId, type Thread } from "@/lib/chat-threads";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({ meta: [{ title: "AI Chat — Workly AI" }] }),
  component: ChatThread,
});

function ChatThread() {
  const { threadId } = useParams({ from: "/chat/$threadId" });
  const navigate = useNavigate();
  const { threads, upsert, remove, get } = useThreads();
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    const existing = get(threadId);
    setInitialMessages(existing?.messages ?? []);
    if (!existing) upsert(threadId, { title: "New chat", messages: [] });
  }, [threadId, get, upsert]);

  if (initialMessages === null) {
    return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <ChatLayout
      key={threadId}
      threadId={threadId}
      initialMessages={initialMessages}
      threads={threads}
      onNew={() => {
        const id = newThreadId();
        upsert(id, { title: "New chat", messages: [] });
        navigate({ to: "/chat/$threadId", params: { threadId: id } });
      }}
      onDelete={(id) => {
        remove(id);
        if (id === threadId) {
          const next = threads.find((t) => t.id !== id);
          if (next) navigate({ to: "/chat/$threadId", params: { threadId: next.id } });
          else {
            const fresh = newThreadId();
            upsert(fresh, { title: "New chat", messages: [] });
            navigate({ to: "/chat/$threadId", params: { threadId: fresh } });
          }
        }
      }}
      onPersist={(msgs) => {
        const title = inferTitle(msgs) ?? "New chat";
        upsert(threadId, { title, messages: msgs });
      }}
    />
  );
}

function inferTitle(messages: UIMessage[]): string | null {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return null;
  const txt = firstUser.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ")
    .trim();
  if (!txt) return null;
  return txt.length > 48 ? txt.slice(0, 48) + "…" : txt;
}

function ChatLayout({
  threadId,
  initialMessages,
  threads,
  onNew,
  onDelete,
  onPersist,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  threads: Thread[];
  onNew: () => void;
  onDelete: (id: string) => void;
  onPersist: (msgs: UIMessage[]) => void;
}) {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => console.error(e),
  });
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId]);

  useEffect(() => {
    if (status !== "streaming") onPersist(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, status, threadId]);

  const isLoading = status === "submitted" || status === "streaming";

  function handleSubmit(message: { text?: string }) {
    const value = (message.text ?? input).trim();
    if (!value || isLoading) return;
    setInput("");
    sendMessage({ text: value });
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar md:flex">
        <div className="p-3">
          <Button onClick={onNew} className="w-full justify-start gap-2" variant="secondary">
            <Plus className="size-4" /> New chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {threads.length === 0 && (
            <div className="px-2 py-4 text-xs text-muted-foreground">No conversations yet.</div>
          )}
          <ul className="space-y-1">
            {threads.map((t) => (
              <li key={t.id} className="group flex items-center gap-1">
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  className={cn(
                    "flex-1 truncate rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent",
                    t.id === threadId && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                  )}
                >
                  {t.title || "New chat"}
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(t.id)}
                  className="rounded p-1 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  aria-label="Delete chat"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <Conversation>
          <ConversationContent className="mx-auto w-full max-w-3xl">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-8" />}
                title="Ask Workly anything"
                description="Draft an email, summarize a meeting, brainstorm — your messages stay in this browser."
              />
            ) : (
              messages.map((m) => {
                const text = m.parts
                  .filter((p): p is { type: "text"; text: string } => p.type === "text")
                  .map((p) => p.text)
                  .join("");
                return (
                  <Message key={m.id} from={m.role}>
                    <MessageContent>
                      {m.role === "assistant" ? <MessageResponse>{text}</MessageResponse> : text}
                    </MessageContent>
                  </Message>
                );
              })
            )}
            {status === "submitted" && (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer>Thinking…</Shimmer>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t bg-background p-4">
          <div className="mx-auto w-full max-w-3xl">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Workly…"
                disabled={isLoading}
              />
              <PromptInputFooter className="justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="size-3 text-primary" /> Review AI output before acting.
                </div>
                <PromptInputSubmit status={status} disabled={!input.trim() || isLoading} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}
