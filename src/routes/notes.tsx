import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { PageHeader, AIDisclaimer } from "@/components/PageHeader";
import { summarizeNotes } from "@/lib/ai-tools.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/notes")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — Workly AI" }] }),
  component: NotesPage,
});

function NotesPage() {
  const fn = useServerFn(summarizeNotes);
  const [transcript, setTranscript] = useState("");
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onRun() {
    if (transcript.trim().length < 20) {
      toast.error("Paste at least a short transcript or notes");
      return;
    }
    setLoading(true);
    try {
      const res = await fn({ data: { transcript } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste a transcript or rough notes — get a clean TL;DR, decisions, action items, and open questions."
        icon={<FileText className="size-5" />}
      />
      <div className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg font-semibold">Transcript / notes</h2>
          <Textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Paste meeting transcript, raw notes, or call summary here…" rows={18} />
          <Button onClick={onRun} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="size-4 animate-spin" /> Summarizing…</> : "Summarize"}
          </Button>
        </div>
        <div className="space-y-3 rounded-xl border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Summary</h2>
            <div className="flex gap-1">
              {output && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)}>{editing ? "Preview" : "Edit"}</Button>
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                    <Copy className="size-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          {editing ? (
            <Textarea value={output} onChange={(e) => setOutput(e.target.value)} rows={18} className="font-mono text-sm" />
          ) : (
            <div className="prose prose-sm max-w-none min-h-[420px] rounded-md border bg-muted/30 p-4 dark:prose-invert">
              {output ? <ReactMarkdown>{output}</ReactMarkdown> : <p className="text-muted-foreground">Summary will appear here.</p>}
            </div>
          )}
          <AIDisclaimer />
        </div>
      </div>
    </div>
  );
}
