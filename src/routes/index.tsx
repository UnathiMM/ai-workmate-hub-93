import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, Section } from "@/components/SiteLayout";
import logoUrl from "@/assets/ltsa-logo.jpg";
import {
  ArrowRight,
  Baby,
  Trophy,
  ShieldCheck,
  HeartHandshake,
  Waves,
  Star,
  Clock,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Love To Swim Academy — Mthatha's Swimming School of Choice" },
      { name: "description", content: "Confident, capable swimmers. Lessons for babies, kids, teens and adults in Mthatha. Small classes, qualified coaches, warm water." },
      { property: "og:title", content: "Love To Swim Academy" },
      { property: "og:description", content: "Mthatha's swimming school of choice — small classes, warm water, qualified coaches." },
    ],
  }),
  component: HomePage,
});

const programs = [
  { icon: Baby, name: "Babies & Tots", age: "6 months – 3 yrs", color: "from-sky-400 to-cyan-500" },
  { icon: Waves, name: "Learn to Swim", age: "4 – 12 yrs", color: "from-blue-500 to-indigo-500" },
  { icon: Trophy, name: "Stroke & Squad", age: "8 yrs +", color: "from-teal-500 to-emerald-500" },
  { icon: HeartHandshake, name: "Adult Lessons", age: "16 yrs +", color: "from-indigo-500 to-blue-600" },
];

const stats = [
  { value: "12+", label: "Years coaching Mthatha" },
  { value: "1.2k", label: "Swimmers taught" },
  { value: "1:6", label: "Coach-to-swimmer ratio" },
  { value: "30°C", label: "Heated indoor pool" },
];

const testimonials = [
  {
    quote: "My daughter went from clinging to the wall to swimming a width in one term. The coaches are patient and the pool is spotless.",
    name: "Nomvula M.",
    role: "Parent, Mthatha",
  },
  {
    quote: "Best decision we made. Our son loves swim days and his confidence in the water is incredible.",
    name: "Sipho & Lerato D.",
    role: "Parents",
  },
  {
    quote: "I learned to swim at 34. The adult class made me feel safe and never silly. Thank you LTSA!",
    name: "Andiswa K.",
    role: "Adult learner",
  },
];

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="ocean-gradient caustics relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 text-foam md:grid-cols-2 md:px-8 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-foam/90 ring-1 ring-white/15 backdrop-blur">
              <Star className="h-3.5 w-3.5" /> Mthatha's swim school of choice
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] text-foam md:text-6xl">
              Learn to swim with <span className="italic text-white">love</span>, taught with care.
            </h1>
            <p className="mt-5 max-w-xl text-base text-foam/85 md:text-lg">
              At Love To Swim Academy we build confident, capable swimmers — from first splashes to competitive
              strokes — in a warm, safe pool in the heart of Mthatha.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary shadow-lg shadow-black/20 transition hover:bg-foam"
              >
                Book a trial lesson <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-foam backdrop-blur transition hover:bg-white/10"
              >
                Explore programs
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                  <dt className="font-display text-2xl font-semibold text-foam">{s.value}</dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-wider text-foam/70">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-white/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/90 p-6 shadow-2xl">
              <img
                src={logoUrl}
                alt="Love To Swim Academy — Mthatha's Swimming School of Choice"
                className="mx-auto w-full max-w-sm object-contain"
              />
              <div className="mt-4 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3 text-primary">
                <span className="font-display text-sm font-semibold">New term enrolment open</span>
                <Link to="/contact" className="text-xs font-semibold underline-offset-4 hover:underline">
                  Enroll →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <Section
        eyebrow="Programs"
        title="A lane for every swimmer"
        description="Carefully structured stages so every learner — from cautious beginner to budding champion — moves at their own pace."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map(({ icon: Icon, name, age, color }) => (
            <Link
              to="/programs"
              key={name}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
            >
              <div className={`mb-5 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${color} text-white shadow-md`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold">{name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{age}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-80 transition-all group-hover:gap-2 group-hover:opacity-100">
                Learn more <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* WHY US */}
      <section className="bg-secondary/40">
        <Section
          eyebrow="Why LTSA"
          title="Safe, warm, and built around your child"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Qualified, vetted coaches",
                body: "Our team is certified in swim instruction, water safety, and child protection. Every coach is screened and lifeguard-trained.",
              },
              {
                icon: Users,
                title: "Small group sizes",
                body: "We cap classes at 1 coach per 6 swimmers (and smaller for tots), so every lesson is genuinely personal.",
              },
              {
                icon: Clock,
                title: "Flexible scheduling",
                body: "Weekday, after-school and Saturday slots. Make-up lessons available if you can't make a session.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* TESTIMONIALS */}
      <Section
        eyebrow="Parents & swimmers"
        title="Stories from our pool deck"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <div className="font-semibold">{t.name}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="px-4 pb-16 md:px-8 md:pb-24">
        <div className="ocean-gradient relative mx-auto flex max-w-7xl flex-col items-center gap-5 overflow-hidden rounded-3xl p-10 text-center text-foam md:p-16">
          <Waves className="h-8 w-8" />
          <h2 className="font-display text-3xl font-semibold md:text-4xl">Ready to make a splash?</h2>
          <p className="max-w-xl text-foam/85">
            Book your first lesson today. We'll match your swimmer to the right group and lane.
          </p>
          <Link
            to="/contact"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
