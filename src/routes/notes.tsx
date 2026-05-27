import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Disclaimer, PageHeader } from "@/components/PageHeader";
import { Field, OutputCard, Select } from "./email";
import { useState } from "react";
import { Wand2 } from "lucide-react";

export const Route = createFileRoute("/notes")({
  component: NotesPage,
});

function summarize(input: string, style: string) {
  const text = input.trim();
  if (!text) return "";
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  const top = sentences.slice(0, Math.min(5, sentences.length));
  const actionRegex = /\b(will|should|need to|must|let's|plan to|todo|action|assign|by friday|by monday|deadline)\b/i;
  const decisionRegex = /\b(decided|agreed|approved|confirmed|chose|selected)\b/i;
  const actions = sentences.filter((s) => actionRegex.test(s)).slice(0, 6);
  const decisions = sentences.filter((s) => decisionRegex.test(s)).slice(0, 6);

  const bullets = (arr: string[]) => (arr.length ? arr.map((s) => `• ${s.trim()}`).join("\n") : "• (none detected)");

  if (style === "Bullet list") {
    return `Summary\n${top.map((s) => `• ${s.trim()}`).join("\n")}\n\nDecisions\n${bullets(decisions)}\n\nAction items\n${bullets(actions)}`;
  }
  if (style === "Executive brief") {
    return `Executive brief\n\n${top.join(" ")}\n\nKey decisions:\n${bullets(decisions)}\n\nNext steps:\n${bullets(actions)}`;
  }
  return `Meeting summary\n\n${top.join(" ")}\n\nAction items:\n${bullets(actions)}\n\nDecisions:\n${bullets(decisions)}`;
}

function NotesPage() {
  const [transcript, setTranscript] = useState("");
  const [style, setStyle] = useState("Meeting summary");
  const [out, setOut] = useState("");
  const run = () => setOut(summarize(transcript, style));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Notes Summarizer"
        title="Summarize meeting notes"
        description="Paste raw meeting notes or a transcript — Workly extracts decisions and action items."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <Field label="Transcript or raw notes">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={14}
              placeholder="Paste your meeting transcript here…"
              className="input resize-y"
            />
          </Field>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label="Format">
              <Select
                value={style}
                onChange={setStyle}
                options={["Meeting summary", "Bullet list", "Executive brief"]}
              />
            </Field>
            <div className="flex items-end">
              <button
                onClick={run}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-fuchsia-500 px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20"
              >
                <Wand2 className="h-4 w-4" /> Summarize
              </button>
            </div>
          </div>
        </div>
        <OutputCard
          value={out}
          onChange={setOut}
          onRegenerate={run}
          placeholder="Summary, decisions, and action items will appear here."
        />
      </div>

      <Disclaimer />
    </AppShell>
  );
}
