import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, AIDisclaimer } from "@/components/PageHeader";
import { generateEmail } from "@/lib/ai-tools.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — Workly AI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<"formal" | "friendly" | "concise" | "persuasive" | "apologetic">("friendly");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function onGenerate() {
    if (!recipient || !purpose) {
      toast.error("Recipient and purpose are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fn({ data: { recipient, purpose, tone, length, context: context || undefined } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Smart Email Generator"
        description="Tell Workly who you're writing to and the purpose — get a polished draft you can edit."
        icon={<Mail className="size-5" />}
      />
      <div className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg font-semibold">Prompt</h2>
          <div className="space-y-2">
            <Label>Recipient</Label>
            <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah, my product manager" />
          </div>
          <div className="space-y-2">
            <Label>Purpose</Label>
            <Textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="What do you want this email to accomplish?" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="apologetic">Apologetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={(v) => setLength(v as typeof length)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Extra context (optional)</Label>
            <Textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="Any background, prior thread, constraints, etc." rows={3} />
          </div>
          <Button onClick={onGenerate} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="size-4 animate-spin" />Generating…</> : "Generate email"}
          </Button>
        </div>

        <div className="space-y-3 rounded-xl border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Draft (editable)</h2>
            {output && (
              <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                <Copy className="size-4" /> Copy
              </Button>
            )}
          </div>
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} placeholder="Your generated email will appear here. You can edit it freely." rows={20} className="font-mono text-sm" />
          <AIDisclaimer />
        </div>
      </div>
    </div>
  );
}
