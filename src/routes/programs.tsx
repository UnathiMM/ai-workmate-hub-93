import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, Section } from "@/components/SiteLayout";
import { Baby, Waves, Trophy, HeartHandshake, Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Swimming Programs — Love To Swim Academy" },
      { name: "description", content: "Babies, Learn to Swim, Stroke & Squad, and Adult lessons. Structured swim programs for every age and ability in Mthatha." },
      { property: "og:title", content: "Programs — Love To Swim Academy" },
      { property: "og:description", content: "Swim programs for babies, kids, teens and adults in Mthatha." },
    ],
  }),
  component: ProgramsPage,
});

const programs = [
  {
    icon: Baby,
    name: "Babies & Tots",
    age: "6 months – 3 years",
    accent: "from-sky-400 to-cyan-500",
    blurb: "Parent-and-child water familiarisation through song, play and gentle submersions.",
    points: ["Warm 30°C water", "Parent in pool", "30-minute classes", "Max 6 pairs per class"],
    price: "from R650 / month",
  },
  {
    icon: Waves,
    name: "Learn to Swim",
    age: "4 – 12 years",
    accent: "from-blue-500 to-indigo-500",
    blurb: "From floating and breathing to all four strokes. Structured stages with clear milestones.",
    points: ["6 progressive levels", "Coach in water (beginners)", "45-minute classes", "Term reports"],
    price: "from R780 / month",
  },
  {
    icon: Trophy,
    name: "Stroke & Squad",
    age: "8 years +",
    accent: "from-teal-500 to-emerald-500",
    blurb: "Stroke refinement, endurance, starts and turns — preparing swimmers for galas and squads.",
    points: ["Race technique", "Strength and conditioning", "60-minute sessions", "Inter-school galas"],
    price: "from R950 / month",
  },
  {
    icon: HeartHandshake,
    name: "Adult Lessons",
    age: "16 years +",
    accent: "from-indigo-500 to-blue-600",
    blurb: "Private and small-group lessons for absolute beginners, fitness swimmers and triathletes.",
    points: ["Judgement-free space", "Private or pairs", "Flexible scheduling", "Fitness or technique focus"],
    price: "from R350 / lesson",
  },
];

function ProgramsPage() {
  return (
    <SiteLayout>
      <Section
        eyebrow="Programs"
        title="Swim lessons for every age & stage"
        description="Each LTSA program follows a clear curriculum so swimmers know what they're working toward — and parents see real progress."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {programs.map((p) => (
            <article key={p.name} className="overflow-hidden rounded-3xl border border-border bg-card">
              <div className={`h-2 w-full bg-gradient-to-r ${p.accent}`} />
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${p.accent} text-white shadow-md`}>
                    <p.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-2xl font-semibold">{p.name}</h2>
                    <div className="mt-0.5 text-sm text-muted-foreground">{p.age}</div>
                  </div>
                  <div className="hidden text-right text-sm sm:block">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Tuition</div>
                    <div className="font-display text-lg font-semibold text-primary">{p.price}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">{p.blurb}</p>
                <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" /> {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground sm:hidden">
                    <span className="font-display text-base font-semibold text-primary">{p.price}</span>
                  </div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Enquire <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <section className="bg-secondary/40">
        <Section
          eyebrow="Learn to Swim levels"
          title="6 stages from first kick to confident swimmer"
          description="Our Learn to Swim curriculum is broken into achievable stages with badge milestones at each level."
        >
          <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Stage 1", "Water confidence, submersion, blowing bubbles."],
              ["Stage 2", "Floating, gliding and assisted kicking."],
              ["Stage 3", "Front and back paddle, breathing rhythm."],
              ["Stage 4", "Freestyle and backstroke over 10m."],
              ["Stage 5", "Breaststroke, butterfly intro, 25m strokes."],
              ["Stage 6", "All four strokes, turns, dives, 50m+."],
            ].map(([title, body], i) => (
              <li key={title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-lg font-semibold">{title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </Section>
      </section>
    </SiteLayout>
  );
}
