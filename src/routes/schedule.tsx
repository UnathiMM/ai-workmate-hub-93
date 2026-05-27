import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, Section } from "@/components/SiteLayout";
import { CalendarDays } from "lucide-react";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Class Schedule — Love To Swim Academy" },
      { name: "description", content: "Weekly LTSA class schedule for Babies, Learn to Swim, Stroke & Squad, and Adult lessons in Mthatha." },
      { property: "og:title", content: "Class Schedule — LTSA" },
      { property: "og:description", content: "See when each LTSA class runs and book your spot." },
    ],
  }),
  component: SchedulePage,
});

type Slot = { time: string; class: string; tone: "tots" | "kids" | "squad" | "adult" };
const toneMap: Record<Slot["tone"], string> = {
  tots: "bg-sky-100 text-sky-800 ring-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:ring-sky-700/40",
  kids: "bg-blue-100 text-blue-800 ring-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:ring-blue-700/40",
  squad: "bg-teal-100 text-teal-800 ring-teal-200 dark:bg-teal-900/40 dark:text-teal-200 dark:ring-teal-700/40",
  adult: "bg-indigo-100 text-indigo-800 ring-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:ring-indigo-700/40",
};

const week: { day: string; slots: Slot[] }[] = [
  {
    day: "Monday",
    slots: [
      { time: "09:00", class: "Babies & Tots", tone: "tots" },
      { time: "15:30", class: "Learn to Swim L1–L2", tone: "kids" },
      { time: "16:30", class: "Learn to Swim L3–L4", tone: "kids" },
      { time: "17:30", class: "Stroke & Squad", tone: "squad" },
    ],
  },
  {
    day: "Tuesday",
    slots: [
      { time: "15:30", class: "Learn to Swim L1–L2", tone: "kids" },
      { time: "16:30", class: "Learn to Swim L5–L6", tone: "kids" },
      { time: "18:00", class: "Adult Lessons", tone: "adult" },
    ],
  },
  {
    day: "Wednesday",
    slots: [
      { time: "09:00", class: "Babies & Tots", tone: "tots" },
      { time: "15:30", class: "Learn to Swim L3–L4", tone: "kids" },
      { time: "17:30", class: "Stroke & Squad", tone: "squad" },
    ],
  },
  {
    day: "Thursday",
    slots: [
      { time: "15:30", class: "Learn to Swim L1–L2", tone: "kids" },
      { time: "16:30", class: "Learn to Swim L5–L6", tone: "kids" },
      { time: "18:00", class: "Adult Lessons", tone: "adult" },
    ],
  },
  {
    day: "Friday",
    slots: [
      { time: "15:30", class: "Learn to Swim L1–L2", tone: "kids" },
      { time: "16:30", class: "Stroke & Squad", tone: "squad" },
    ],
  },
  {
    day: "Saturday",
    slots: [
      { time: "08:00", class: "Babies & Tots", tone: "tots" },
      { time: "09:00", class: "Learn to Swim L1–L2", tone: "kids" },
      { time: "10:00", class: "Learn to Swim L3–L4", tone: "kids" },
      { time: "11:00", class: "Stroke & Squad", tone: "squad" },
      { time: "12:00", class: "Adult Lessons", tone: "adult" },
    ],
  },
];

function SchedulePage() {
  return (
    <SiteLayout>
      <Section
        eyebrow="Weekly schedule"
        title="When we're in the water"
        description="A typical term timetable. Specific lanes and coaches are confirmed at enrolment — contact us to reserve a slot."
      >
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
          {[
            ["Babies & Tots", "tots"],
            ["Learn to Swim", "kids"],
            ["Stroke & Squad", "squad"],
            ["Adult", "adult"],
          ].map(([label, tone]) => (
            <span
              key={label}
              className={`inline-flex items-center rounded-full px-2.5 py-1 font-medium ring-1 ${toneMap[tone as Slot["tone"]]}`}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {week.map((d, i) => (
            <div
              key={d.day}
              className={`grid grid-cols-[110px_1fr] gap-4 px-4 py-4 md:grid-cols-[140px_1fr] md:px-6 ${i !== 0 ? "border-t border-border" : ""}`}
            >
              <div className="flex items-start gap-2 pt-1">
                <CalendarDays className="hidden h-4 w-4 text-primary md:block" />
                <div className="font-display text-base font-semibold">{d.day}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {d.slots.map((s, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${toneMap[s.tone]}`}
                  >
                    <span className="font-mono tabular-nums opacity-80">{s.time}</span>
                    <span>{s.class}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Public holidays and school holiday hours vary — please contact us to confirm your session.
        </p>
      </Section>
    </SiteLayout>
  );
}
