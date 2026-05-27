import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  ArrowRight,
  Clock,
  Zap,
  Shield,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

const stats = [
  { icon: Clock, label: "Hours saved per week", value: "8.5h" },
  { icon: Zap, label: "Faster response time", value: "12×" },
  { icon: Shield, label: "Editable & private", value: "100%" },
];

const tools = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft polished emails in seconds with tone control.",
    accent: "from-sky-500 to-blue-600",
  },
  {
    to: "/notes" as const,
    icon: FileText,
    title: "Meeting Notes Summarizer",
    desc: "Turn raw transcripts into decisions and action items.",
    accent: "from-fuchsia-500 to-purple-600",
  },
  {
    to: "/tasks" as const,
    icon: ListChecks,
    title: "AI Task Planner",
    desc: "Prioritize your day using urgency + importance.",
    accent: "from-pink-500 to-rose-600",
  },
  {
    to: "/research" as const,
    icon: Search,
    title: "Research Assistant",
    desc: "Outline topics with structured notes and sources.",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    to: "/chat" as const,
    icon: MessageSquare,
    title: "AI Chat",
    desc: "Ask anything — your everyday workplace copilot.",
    accent: "from-amber-500 to-orange-600",
  },
];

function DashboardPage() {
  return (
    <AppShell>
      <section className="hero-gradient relative overflow-hidden rounded-2xl border border-border p-8 md:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" />
            Powered by AI
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Your <span className="text-gradient-accent">AI workplace</span> assistant
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            Automate emails, summarize meetings, plan your week, and research smarter — all from one beautifully
            simple workspace.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-fuchsia-500 px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-95"
            >
              Start with Email <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur transition hover:bg-card"
            >
              Open AI Chat
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5"
          >
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/15 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-semibold leading-none">{value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{label}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight">Productivity tools</h2>
          <p className="text-sm text-muted-foreground">Pick a tool to get started.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map(({ to, icon: Icon, title, desc, accent }) => (
            <Link
              key={to}
              to={to}
              className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition hover:border-primary/40 hover:bg-card/80"
            >
              <div className={`mb-4 grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br ${accent} text-white shadow-md`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-90 group-hover:gap-2 group-hover:opacity-100 transition-all">
                Open tool <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
