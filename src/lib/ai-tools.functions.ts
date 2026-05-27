import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { getLovableModel } from "./ai-gateway.server";

const EmailInput = z.object({
  recipient: z.string().min(1).max(200),
  purpose: z.string().min(1).max(2000),
  tone: z.enum(["formal", "friendly", "concise", "persuasive", "apologetic"]),
  length: z.enum(["short", "medium", "long"]),
  context: z.string().max(4000).optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getLovableModel(),
      system:
        "You are an expert workplace communications writer. Output ONLY the email body (no preamble, no 'Here is your email:'). Start with a subject line as 'Subject: ...' on the first line, then a blank line, then the email itself with greeting, body paragraphs, and sign-off placeholder [Your name].",
      prompt: `Write a ${data.length} ${data.tone} email to ${data.recipient}.\n\nPurpose: ${data.purpose}${data.context ? `\n\nAdditional context: ${data.context}` : ""}`,
    });
    return { text };
  });

const NotesInput = z.object({
  transcript: z.string().min(20).max(20000),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NotesInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getLovableModel(),
      system:
        "You summarize meeting transcripts for busy professionals. Output clean markdown with these sections in order: ## TL;DR (2-3 sentences), ## Key Decisions (bulleted), ## Action Items (bulleted with owner in **bold** if mentioned, otherwise '**Unassigned**'), ## Open Questions (bulleted). Be specific, no filler.",
      prompt: `Meeting transcript / notes:\n\n${data.transcript}`,
    });
    return { text };
  });

const TasksInput = z.object({
  goal: z.string().min(3).max(2000),
  deadline: z.string().max(200).optional(),
  context: z.string().max(2000).optional(),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TasksInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getLovableModel(),
      system:
        "You are a productivity coach who breaks goals into actionable plans using the Eisenhower matrix. Output markdown with these sections: ## Plan Overview (1-2 sentences), ## Today (urgent + important), ## This Week (important, not urgent), ## Delegate (urgent, not important), ## Backlog (neither). Each task: short imperative line, optional duration estimate in (parentheses).",
      prompt: `Goal: ${data.goal}${data.deadline ? `\nDeadline: ${data.deadline}` : ""}${data.context ? `\nContext: ${data.context}` : ""}`,
    });
    return { text };
  });

const ResearchInput = z.object({
  topic: z.string().min(3).max(500),
  audience: z.enum(["executive", "technical", "general", "beginner"]),
  depth: z.enum(["overview", "detailed", "deep-dive"]),
});

export const research = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getLovableModel(),
      system:
        "You are a senior research analyst. Produce a structured briefing in markdown for the requested audience. Sections: ## Executive Summary, ## Background, ## Key Findings (bulleted), ## Implications, ## Recommended Next Steps, ## Open Questions. Be concrete; cite reasoning, not made-up sources.",
      prompt: `Topic: ${data.topic}\nAudience: ${data.audience}\nDepth: ${data.depth}`,
    });
    return { text };
  });
