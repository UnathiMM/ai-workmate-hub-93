import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Disclaimer, PageHeader } from "@/components/PageHeader";
import { Field, OutputCard, Select } from "./email";
import { useState } from "react";
import { Wand2 } from "lucide-react";

export const Route = createFileRoute("/research")({
  component: ResearchPage,
});

function brief(topic: string, audience: string, depth: string) {
  if (!topic.trim()) return "";
  const t = topic.trim();
  const lines = [
    `Research brief: ${t}`,
    audience ? `Audience: ${audience}` : null,
    "",
    "1. Background",
    `   • What ${t} is, where it came from, and why it matters now.`,
    `   • Key terms and concepts that an informed reader should know.`,
    "",
    "2. Current landscape",
    `   • Major players, products, or schools of thought in ${t}.`,
    `   • Recent trends, debates or shifts in the last 12 months.`,
    "",
    "3. Opportunities & risks",
    `   • Where ${t} creates value or unlocks new workflows.`,
    `   • Risks, ethical considerations, and known failure modes.`,
    depth === "Deep" ? "" : null,
    depth === "Deep" ? "4. Deep dive" : null,
    depth === "Deep" ? `   • Quantitative signals to track around ${t}.` : null,
    depth === "Deep" ? `   • Comparative analysis vs. adjacent topics.` : null,
    depth === "Deep" ? `   • Suggested experts, papers and sources to verify.` : null,
    "",
    "Suggested next steps",
    "   • Validate facts with primary sources before sharing.",
    "   • Capture 3–5 cited quotes or stats you'll reuse.",
    "   • Draft a one-paragraph summary for stakeholders.",
  ].filter(Boolean);
  return lines.join("\n");
}

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [depth, setDepth] = useState("Standard");
  const [out, setOut] = useState("");
  const run = () => setOut(brief(topic, audience, depth));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Research Assistant"
        title="Outline any topic in seconds"
        description="Give a topic and audience — Workly produces a structured research outline you can fill in."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="grid gap-4">
            <Field label="Topic">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Vector databases for RAG"
                className="input"
              />
            </Field>
            <Field label="Audience (optional)">
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Non-technical executives"
                className="input"
              />
            </Field>
            <Field label="Depth">
              <Select value={depth} onChange={setDepth} options={["Standard", "Deep"]} />
            </Field>
            <button
              onClick={run}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-fuchsia-500 px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20"
            >
              <Wand2 className="h-4 w-4" /> Generate outline
            </button>
          </div>
        </div>
        <OutputCard
          value={out}
          onChange={setOut}
          onRegenerate={run}
          placeholder="Your structured research outline will appear here."
        />
      </div>

      <Disclaimer />
    </AppShell>
  );
}
