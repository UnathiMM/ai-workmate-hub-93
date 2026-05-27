import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, Section } from "@/components/SiteLayout";
import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Book a Lesson — Love To Swim Academy" },
      { name: "description", content: "Book a trial swim lesson at LTSA in Mthatha. Contact our team for enrolment, class availability and pricing." },
      { property: "og:title", content: "Book a swim lesson — LTSA" },
      { property: "og:description", content: "Get in touch to book a trial lesson at Love To Swim Academy in Mthatha." },
    ],
  }),
  component: ContactPage,
});

type Form = {
  parent: string;
  swimmer: string;
  age: string;
  email: string;
  phone: string;
  program: string;
  message: string;
};

function ContactPage() {
  const [form, setForm] = useState<Form>({
    parent: "",
    swimmer: "",
    age: "",
    email: "",
    phone: "",
    program: "Learn to Swim",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const update = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app this would post to a server function / inbox.
    setSent(true);
  };

  return (
    <SiteLayout>
      <Section
        eyebrow="Get in touch"
        title="Book a trial lesson"
        description="Tell us a bit about your swimmer and we'll come back to you with availability and the best class match."
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-semibold">Thanks, {form.parent || "friend"}!</h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  We've received your enquiry and a coach will be in touch within one working day to confirm a
                  trial slot.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-3 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Parent / guardian name">
                  <input required value={form.parent} onChange={update("parent")} className="input" placeholder="e.g. Nomvula Mhlongo" />
                </Field>
                <Field label="Swimmer's name">
                  <input required value={form.swimmer} onChange={update("swimmer")} className="input" placeholder="e.g. Amahle" />
                </Field>
                <Field label="Swimmer's age">
                  <input required value={form.age} onChange={update("age")} className="input" placeholder="e.g. 7" />
                </Field>
                <Field label="Program">
                  <select value={form.program} onChange={update("program")} className="input">
                    <option>Babies & Tots</option>
                    <option>Learn to Swim</option>
                    <option>Stroke & Squad</option>
                    <option>Adult Lessons</option>
                  </select>
                </Field>
                <Field label="Email">
                  <input required type="email" value={form.email} onChange={update("email")} className="input" placeholder="you@example.com" />
                </Field>
                <Field label="Phone / WhatsApp">
                  <input required value={form.phone} onChange={update("phone")} className="input" placeholder="+27 ..." />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Tell us a bit more (optional)">
                    <textarea rows={4} value={form.message} onChange={update("message")} className="input resize-y" placeholder="Preferred days/times, swim experience, special needs..." />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 sm:w-auto"
                  >
                    <Send className="h-4 w-4" /> Send enquiry
                  </button>
                </div>
              </form>
            )}
          </div>

          <aside className="space-y-4">
            <InfoCard icon={MapPin} title="Visit us">
              Mthatha, Eastern Cape<br />South Africa
            </InfoCard>
            <InfoCard icon={Phone} title="Call or WhatsApp">
              <a href="tel:+27470000000" className="hover:text-primary">+27 (0) 47 000 0000</a>
            </InfoCard>
            <InfoCard icon={Mail} title="Email">
              <a href="mailto:hello@lovetoswim.co.za" className="hover:text-primary">hello@lovetoswim.co.za</a>
            </InfoCard>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="font-display text-base font-semibold">Office hours</div>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li className="flex justify-between"><span>Mon – Fri</span><span>08:00 – 18:00</span></li>
                <li className="flex justify-between"><span>Saturday</span><span>08:00 – 13:00</span></li>
                <li className="flex justify-between"><span>Sunday</span><span>Closed</span></li>
              </ul>
            </div>
          </aside>
        </div>
      </Section>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-display text-base font-semibold">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
