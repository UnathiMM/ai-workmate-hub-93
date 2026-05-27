import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { newThreadId } from "@/lib/chat-threads";

export const Route = createFileRoute("/chat/")({
  head: () => ({ meta: [{ title: "AI Chat — Workly AI" }] }),
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("workly_chat_threads_v1");
      const threads = raw ? (JSON.parse(raw) as Array<{ id: string; updatedAt: number }>) : [];
      const target = threads.sort((a, b) => b.updatedAt - a.updatedAt)[0]?.id ?? newThreadId();
      navigate({ to: "/chat/$threadId", params: { threadId: target }, replace: true });
    } catch {
      navigate({ to: "/chat/$threadId", params: { threadId: newThreadId() }, replace: true });
    }
  }, [navigate]);
  return <div className="p-8 text-sm text-muted-foreground">Opening chat…</div>;
}
