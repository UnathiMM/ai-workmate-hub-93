import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Disclaimer, PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { Copy, Wand2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/email")({
  component: EmailPage,
});

const tones = ["Professional", "Friendly", "Concise", "Persuasive", "Apologetic"] as const;
const lengths = ["Short", "Medium", "Long"] as const;

function generateEmail({
  recipient,
  topic,
  context,
  tone,
  length,
}: {
  recipient: string;
  topic: string;
  context: string;
  tone: string;
  length: string;
}) {
  const greeting = recipient ? `Hi ${recipient.split(/[ ,]/)[0]},` : "Hi there,";
  const intros: Record<string, string> = {
    Professional: `I hope this message finds you well. I'm writing regarding ${topic || "our recent discussion"}.`,
    Friendly: `Hope you're having a great week! Just wanted to reach out about ${topic || "something quick"}.`,
    Concise: `Quick note on ${topic || "the topic"}.`,
    Persuasive: `I wanted to share an opportunity around ${topic || "this initiative"} that I believe will be worth your time.`,
    Apologetic: `Thank you for your patience. I'm writing to follow up — and apologize for the delay — regarding ${topic || "the matter at hand"}.`,
  };
  const body = context
    ? `\n\n${context.trim()}`
    : `\n\nHere's a brief overview of the key points and next steps so we can move forward efficiently.`;
  const longExtra =
    length === "Long"
      ? `\n\nTo provide a bit more context: this aligns with priorities we've previously discussed, and I'd be happy to share supporting material or set up a quick call to walk through the details.`
      : "";
  const shortened = length === "Short" ? "" : body + longExtra;
  const cta =
    tone === "Persuasive"
      ? "Would you be open to a 15-minute call this week to discuss?"
      : tone === "Apologetic"
        ? "Please let me know if there's anything I can do to make this right."
        : "Let me know your thoughts when you have a moment.";
  return `Subject: ${topic ? topic.replace(/\s+/g, " ").trim() : "Quick note"}\n\n${greeting}\n\n${intros[tone] ?? intros.Professional}${shortened}\n\n${cta}\n\nBest regards,\n[Your name]`;
}

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<string>("Professional");
  const [length, setLength] = useState<string>("Medium");
  const [output, setOutput] = useState("");

  const run = () => setOutput(generateEmail({ recipient, topic, context, tone, length }));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Smart Email Generator"
        title="Draft your next email"
        description="Provide the recipient, topic and a few notes — Workly will compose a polished draft you can edit."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="grid gap-4">
            <Field label="Recipient">
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Alex Johnson"
                className="input"
              />
            </Field>
            <Field label="Topic / Subject">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Project Atlas — status update"
                className="input"
              />
            </Field>
            <Field label="Context & key points">
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={5}
                placeholder="Mention the timeline shift, blockers on data import, and ask for sign-off by Friday."
                className="input resize-y"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tone">
                <Select value={tone} onChange={setTone} options={[...tones]} />
              </Field>
              <Field label="Length">
                <Select value={length} onChange={setLength} options={[...lengths]} />
              </Field>
            </div>
            <button
              onClick={run}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-fuchsia-500 px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20"
            >
              <Wand2 className="h-4 w-4" /> Generate email
            </button>
          </div>
        </div>

        <OutputCard
          value={output}
          onChange={setOutput}
          onRegenerate={run}
          placeholder="Your generated email will appear here. You can edit it freely before copying."
        />
      </div>

      <Disclaimer />
    </AppShell>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="input">
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function OutputCard({
  value,
  onChange,
  onRegenerate,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onRegenerate?: () => void;
  placeholder?: string;
}) {
  const copy = () => {
    if (value) navigator.clipboard?.writeText(value);
  };
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium text-foreground/80">AI output (editable)</div>
        <div className="flex items-center gap-1">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Regenerate
            </button>
          )}
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input min-h-[320px] flex-1 resize-y whitespace-pre-wrap font-mono text-[13px] leading-relaxed"
      />
    </div>
  );
}
