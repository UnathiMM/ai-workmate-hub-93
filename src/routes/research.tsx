import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { PageHeader, AIDisclaimer } from "@/components/PageHeader";
import { research } from "@/lib/ai-tools.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — Workly AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(research);
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState<"executive" | "technical" | "general" | "beginner">("executive");
  const [depth, setDepth] = useState<"overview" | "detailed" | "deep-dive">("detailed");
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onRun() {
    if (!topic.trim()) return toast.error("Enter a topic");
    setLoading(true);
    try {
      const res = await fn({ data: { topic, audience, depth } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }

  return (
    <div>
      <PageHeader title="AI Research Assistant" description="Get a structured briefing on any workplace topic, tailored to your audience." icon={<Search className="size-5" />} />
      <div className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg font-semibold">Research brief</h2>
          <div className="space-y-2"><Label>Topic</Label><Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Hybrid work policies in mid-size SaaS companies" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={(v) => setAudience(v as typeof audience)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={(v) => setDepth(v as typeof depth)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="deep-dive">Deep dive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={onRun} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="size-4 animate-spin" /> Researching…</> : "Generate briefing"}
          </Button>
        </div>
        <div className="space-y-3 rounded-xl border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Briefing</h2>
            {output && (
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)}>{editing ? "Preview" : "Edit"}</Button>
                <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}><Copy className="size-4" /></Button>
              </div>
            )}
          </div>
          {editing ? (
            <Textarea rows={20} value={output} onChange={(e) => setOutput(e.target.value)} className="font-mono text-sm" />
          ) : (
            <div className="prose prose-sm max-w-none min-h-[420px] rounded-md border bg-muted/30 p-4 dark:prose-invert">
              {output ? <ReactMarkdown>{output}</ReactMarkdown> : <p className="text-muted-foreground">Your briefing will appear here.</p>}
            </div>
          )}
          <AIDisclaimer />
        </div>
      </div>
    </div>
  );
}
