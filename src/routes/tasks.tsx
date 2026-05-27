import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { PageHeader, AIDisclaimer } from "@/components/PageHeader";
import { planTasks } from "@/lib/ai-tools.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner — Workly AI" }] }),
  component: TasksPage,
});

function TasksPage() {
  const fn = useServerFn(planTasks);
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onRun() {
    if (!goal.trim()) return toast.error("Describe your goal");
    setLoading(true);
    try {
      const res = await fn({ data: { goal, deadline: deadline || undefined, context: context || undefined } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }

  return (
    <div>
      <PageHeader title="AI Task Planner" description="Describe a goal — get a prioritized Eisenhower-matrix action plan." icon={<ListChecks className="size-5" />} />
      <div className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg font-semibold">What do you want to get done?</h2>
          <div className="space-y-2"><Label>Goal</Label><Textarea rows={3} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Launch the v2 onboarding flow by end of month" /></div>
          <div className="space-y-2"><Label>Deadline (optional)</Label><Input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="e.g. Friday, or Nov 15" /></div>
          <div className="space-y-2"><Label>Context (optional)</Label><Textarea rows={3} value={context} onChange={(e) => setContext(e.target.value)} placeholder="Team size, constraints, dependencies…" /></div>
          <Button onClick={onRun} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="size-4 animate-spin" /> Planning…</> : "Generate plan"}
          </Button>
        </div>
        <div className="space-y-3 rounded-xl border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Plan</h2>
            {output && (
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)}>{editing ? "Preview" : "Edit"}</Button>
                <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}><Copy className="size-4" /></Button>
              </div>
            )}
          </div>
          {editing ? (
            <Textarea rows={18} value={output} onChange={(e) => setOutput(e.target.value)} className="font-mono text-sm" />
          ) : (
            <div className="prose prose-sm max-w-none min-h-[420px] rounded-md border bg-muted/30 p-4 dark:prose-invert">
              {output ? <ReactMarkdown>{output}</ReactMarkdown> : <p className="text-muted-foreground">Your plan will appear here.</p>}
            </div>
          )}
          <AIDisclaimer />
        </div>
      </div>
    </div>
  );
}
