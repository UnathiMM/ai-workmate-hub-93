import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, Section } from "@/components/SiteLayout";
import { Award, Heart, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/coaches")({
  head: () => ({
    meta: [
      { title: "Coaches — Love To Swim Academy" },
      { name: "description", content: "Meet the qualified, vetted swim coaches at LTSA — passionate about safety, technique and developing confident swimmers in Mthatha." },
      { property: "og:title", content: "Meet the LTSA coaches" },
      { property: "og:description", content: "Qualified, vetted, lifeguard-trained swim coaches in Mthatha." },
    ],
  }),
  component: CoachesPage,
});

const coaches = [
  {
    name: "Coach Thandi",
    role: "Head Coach & Founder",
    bio: "Former provincial swimmer with 12+ years coaching across all ages. ASA Level 2 certified.",
    initials: "TM",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    name: "Coach Sipho",
    role: "Learn to Swim Lead",
    bio: "Specialises in early-years confidence and stroke development. Lifeguard and first-aid certified.",
    initials: "SD",
    accent: "from-teal-500 to-emerald-500",
  },
  {
    name: "Coach Lerato",
    role: "Babies & Tots",
    bio: "Calm, patient and brilliant with little ones. Trained in infant aquatics and water safety.",
    initials: "LN",
    accent: "from-sky-500 to-indigo-500",
  },
  {
    name: "Coach Mandla",
    role: "Squad & Competitive",
    bio: "Race technique, starts and turns. Has coached swimmers to provincial and national meets.",
    initials: "MZ",
    accent: "from-indigo-500 to-blue-600",
  },
];

function CoachesPage() {
  return (
    <SiteLayout>
      <Section
        eyebrow="Our coaches"
        title="The team on deck"
        description="Every LTSA coach is qualified, vetted and lifeguard-trained — and chosen for warmth as much as technical skill."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {coaches.map((c) => (
            <article key={c.name} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className={`relative h-32 bg-gradient-to-br ${c.accent}`}>
                <div className="absolute -bottom-7 left-5 grid h-14 w-14 place-items-center rounded-full bg-card font-display text-lg font-semibold text-primary ring-4 ring-card">
                  {c.initials}
                </div>
              </div>
              <div className="px-5 pb-5 pt-9">
                <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                <div className="text-sm font-medium text-primary">{c.role}</div>
                <p className="mt-2 text-sm text-muted-foreground">{c.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <section className="bg-secondary/40">
        <Section
          eyebrow="Standards"
          title="What every LTSA coach commits to"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              { icon: ShieldCheck, t: "Child-safety vetted", b: "Background-checked and bound by our child protection policy." },
              { icon: Award, t: "Continuous training", b: "Annual CPD in swim instruction, first aid and lifeguard renewal." },
              { icon: Heart, t: "Warm & patient", b: "We hire for kindness first — technique can be taught, character can't." },
            ].map(({ icon: Icon, t, b }) => (
              <div key={t} className="rounded-2xl border border-border bg-card p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </Section>
      </section>
    </SiteLayout>
  );
}
