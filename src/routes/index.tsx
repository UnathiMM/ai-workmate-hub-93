import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessageSquare, ArrowUpRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workly AI" },
      { name: "description", content: "Your AI workplace productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { url: "/email", title: "Smart Email Generator", desc: "Draft professional emails with tone and length controls.", icon: Mail },
  { url: "/notes", title: "Meeting Notes Summarizer", desc: "Turn transcripts into decisions and action items.", icon: FileText },
  { url: "/tasks", title: "AI Task Planner", desc: "Break goals into an Eisenhower-style action plan.", icon: ListChecks },
  { url: "/research", title: "AI Research Assistant", desc: "Structured briefings tailored to your audience.", icon: Search },
  { url: "/chat", title: "AI Chatbot", desc: "Ask anything — multi-thread conversations saved locally.", icon: MessageSquare },
];

function Dashboard() {
  return (
    <div>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 brand-gradient opacity-[0.08]" />
        <div className="relative mx-auto max-w-6xl px-6 py-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3 text-primary" />
            Powered by Lovable AI
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Your <span className="text-gradient-brand">AI workplace</span> assistant
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Automate the busywork. Workly drafts emails, summarizes meetings, plans your day,
            researches topics, and chats — all in one clean workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to="/chat" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90">
              Start chatting <ArrowUpRight className="size-4" />
            </Link>
            <Link to="/email" className="inline-flex items-center gap-1.5 rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-accent">
              Draft an email
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">Productivity tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.url}
              to={t.url}
              className="group relative flex flex-col gap-3 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft hover:border-primary/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <t.icon className="size-5" />
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <div>
                <div className="font-display font-semibold">{t.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-xl border bg-muted/40 p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Responsible AI:</strong> Workly uses AI models that can be wrong.
          Treat all outputs as drafts, review them carefully, and never paste secrets or private personal data
          that you wouldn't share with a third-party tool.
        </div>
      </section>
    </div>
  );
}
