import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Disclaimer, PageHeader } from "@/components/PageHeader";
import { useMemo, useState } from "react";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});

type Task = {
  id: string;
  title: string;
  urgency: 1 | 2 | 3 | 4 | 5;
  importance: 1 | 2 | 3 | 4 | 5;
  done: boolean;
};

function quadrant(t: Task) {
  const u = t.urgency >= 4;
  const i = t.importance >= 4;
  if (u && i) return "Do now";
  if (!u && i) return "Schedule";
  if (u && !i) return "Delegate";
  return "Eliminate";
}

const COLORS: Record<string, string> = {
  "Do now": "from-rose-500 to-red-600",
  Schedule: "from-emerald-500 to-teal-600",
  Delegate: "from-amber-500 to-orange-600",
  Eliminate: "from-slate-500 to-slate-700",
};

function TasksPage() {
  const [title, setTitle] = useState("");
  const [urg, setUrg] = useState<3 | number>(3);
  const [imp, setImp] = useState<3 | number>(3);
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Reply to Q3 sponsorship email", urgency: 5, importance: 4, done: false },
    { id: "2", title: "Draft team OKRs for next quarter", urgency: 2, importance: 5, done: false },
    { id: "3", title: "Update CRM with last week's leads", urgency: 4, importance: 2, done: false },
  ]);

  const add = () => {
    if (!title.trim()) return;
    setTasks((t) => [
      ...t,
      { id: crypto.randomUUID(), title: title.trim(), urgency: urg as 1, importance: imp as 1, done: false },
    ]);
    setTitle("");
    setUrg(3);
    setImp(3);
  };

  const groups = useMemo(() => {
    const g: Record<string, Task[]> = { "Do now": [], Schedule: [], Delegate: [], Eliminate: [] };
    [...tasks]
      .sort((a, b) => b.urgency + b.importance - (a.urgency + a.importance))
      .forEach((t) => g[quadrant(t)].push(t));
    return g;
  }, [tasks]);

  const planSummary = useMemo(() => {
    if (!tasks.length) return "";
    return `Top focus today (${groups["Do now"].length} urgent + important):\n${
      groups["Do now"].map((t) => `• ${t.title}`).join("\n") || "• (none)"
    }\n\nSchedule for this week:\n${
      groups.Schedule.map((t) => `• ${t.title}`).join("\n") || "• (none)"
    }\n\nDelegate if possible:\n${
      groups.Delegate.map((t) => `• ${t.title}`).join("\n") || "• (none)"
    }`;
  }, [tasks, groups]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="AI Task Planner"
        title="Plan your day, smarter"
        description="Add tasks with urgency and importance — Workly groups them using the Eisenhower matrix."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-medium">Add a task</div>
          <div className="mt-4 grid gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Review pricing proposal"
              className="input"
            />
            <div className="grid grid-cols-2 gap-3">
              <Slider label="Urgency" value={urg as number} onChange={setUrg} />
              <Slider label="Importance" value={imp as number} onChange={setImp} />
            </div>
            <button
              onClick={add}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-fuchsia-500 px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20"
            >
              <Plus className="h-4 w-4" /> Add task
            </button>
          </div>

          <div className="mt-6 rounded-lg border border-dashed border-border bg-background/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" /> AI plan
            </div>
            <pre className="whitespace-pre-wrap text-xs text-muted-foreground">{planSummary || "Add tasks to generate a plan."}</pre>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(Object.keys(groups) as Array<keyof typeof groups>).map((k) => (
            <div key={k} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className={`inline-block h-2 w-2 rounded-full bg-gradient-to-r ${COLORS[k]}`} />
                <div className="text-sm font-medium">{k}</div>
                <div className="ml-auto text-xs text-muted-foreground">{groups[k].length}</div>
              </div>
              <ul className="space-y-2">
                {groups[k].length === 0 && (
                  <li className="text-xs text-muted-foreground">No tasks here.</li>
                )}
                {groups[k].map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-2 rounded-md border border-border bg-background/40 p-2"
                  >
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() =>
                        setTasks((all) => all.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))
                      }
                      className="h-4 w-4 accent-primary"
                    />
                    <span className={cn("flex-1 text-sm", t.done && "line-through text-muted-foreground")}>
                      {t.title}
                    </span>
                    <button
                      onClick={() => setTasks((all) => all.filter((x) => x.id !== t.id))}
                      className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Disclaimer />
    </AppShell>
  );
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-medium text-foreground">{value}/5</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </label>
  );
}
