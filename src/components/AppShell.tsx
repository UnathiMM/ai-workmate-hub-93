import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  PanelLeft,
  Sun,
  Moon,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Notes Summarizer", icon: FileText },
  { to: "/tasks", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research", icon: Search },
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const [light, setLight] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  // close sidebar on mobile by default
  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) setOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 z-40 h-screen shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width,transform] duration-200",
          open ? "w-64 translate-x-0" : "w-64 -translate-x-full md:w-0 md:translate-x-0",
        )}
      >
        <div className={cn("flex h-full flex-col overflow-hidden", !open && "md:hidden")}>
          <div className="flex items-center gap-3 px-5 py-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500/70 shadow-lg shadow-primary/20">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12a8 8 0 1 0 16 0 8 8 0 1 0 -16 0" />
                <path d="M8 12h8M12 8v8" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold">Workly AI</div>
              <div className="text-xs text-muted-foreground">by Lovable</div>
            </div>
          </div>

          <div className="px-3 pb-2 pt-1">
            <div className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Workspace
            </div>
            <nav className="flex flex-col gap-1">
              {nav.map(({ to, label, icon: Icon }) => {
                const active = path === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active && "text-primary")} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3 text-xs text-muted-foreground">
              <div className="font-medium text-foreground/90">Responsible AI</div>
              <p className="mt-1 leading-relaxed">
                Outputs may be inaccurate. Always review before sending or sharing.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
          <button
            aria-label="Toggle sidebar"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground sm:flex">
            <AlertCircle className="h-3.5 w-3.5 text-primary" />
            AI-generated content may require human review
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              aria-label="Toggle theme"
              onClick={() => setLight((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
