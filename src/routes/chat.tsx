import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Disclaimer, PageHeader } from "@/components/PageHeader";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
});

type Msg = { id: string; role: "user" | "assistant"; content: string };

function reply(prompt: string): string {
  const p = prompt.toLowerCase();
  if (/email|draft/.test(p)) {
    return "I can help you draft that. Try the Smart Email Generator from the sidebar — paste the recipient and key points, and I'll produce a polished draft you can edit.";
  }
  if (/summar/.test(p)) {
    return "For meeting transcripts, the Notes Summarizer extracts decisions and action items. Paste your notes there for a structured summary.";
  }
  if (/plan|task|todo/.test(p)) {
    return "Open the AI Task Planner to add your tasks with urgency and importance — I'll group them into Do now / Schedule / Delegate / Eliminate.";
  }
  if (/research|outline|topic/.test(p)) {
    return "Use the Research Assistant for a structured outline on any topic. Add an audience to tailor the tone.";
  }
  return `Here's how I'd think about that:\n\n1. Clarify the goal in one sentence.\n2. List 3 inputs you already have and 3 you'd want.\n3. Pick the smallest first step you can take in the next 15 minutes.\n\nWant me to draft an email, summarize notes, or build a plan around this?`;
}

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "w",
      role: "assistant",
      content:
        "Hi! I'm your AI workplace assistant. Ask me about drafting an email, summarizing a meeting, or planning your day.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    const aiMsg: Msg = { id: crypto.randomUUID(), role: "assistant", content: reply(text) };
    setMessages((m) => [...m, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="AI Chat"
        title="Your everyday copilot"
        description="Ask anything about your work. Replies stream locally for this demo."
      />

      <div className="flex h-[calc(100vh-220px)] min-h-[480px] flex-col overflow-hidden rounded-xl border border-border bg-card">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
              <div
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                  m.role === "assistant"
                    ? "bg-gradient-to-br from-primary to-fuchsia-500 text-white"
                    : "bg-accent text-foreground",
                )}
              >
                {m.role === "assistant" ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "assistant"
                    ? "rounded-tl-sm bg-background/60 text-foreground"
                    : "rounded-tr-sm bg-primary/15 text-foreground",
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>
        <form
          className="flex items-center gap-2 border-t border-border p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything — e.g. Help me reply to a delayed-shipment email"
            className="input flex-1"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-fuchsia-500 px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" /> Send
          </button>
        </form>
      </div>

      <Disclaimer />
    </AppShell>
  );
}
