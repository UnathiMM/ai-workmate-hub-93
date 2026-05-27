import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";
import logoUrl from "@/assets/ltsa-logo.jpg";

const nav = [
  { to: "/", label: "Home" },
  { to: "/programs", label: "Programs" },
  { to: "/schedule", label: "Schedule" },
  { to: "/coaches", label: "Coaches" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header
        className={cn(
          "sticky top-0 z-40 transition-all",
          scrolled
            ? "border-b border-border bg-background/85 backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="Love To Swim Academy"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div className="leading-tight">
              <div className="font-display text-base font-semibold text-primary">Love to Swim Academy</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Mthatha, Eastern Cape
              </div>
            </div>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
            <Link
              to="/contact"
              className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Book a lesson
            </Link>
          </nav>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto grid h-10 w-10 place-items-center rounded-md text-foreground md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-border bg-background md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm",
                    path === n.to
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-secondary",
                  )}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-1 inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                Book a lesson
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-secondary/40">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="LTSA" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <div className="font-display text-lg font-semibold text-primary">Love to Swim Academy</div>
                <div className="text-xs text-muted-foreground">Mthatha's Swimming School of Choice</div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Confident, capable swimmers — from first splash to competitive stroke. Lessons for babies, kids,
              teens and adults in a warm, safe pool environment.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-full bg-card text-primary ring-1 ring-border hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center rounded-full bg-card text-primary ring-1 ring-border hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-foreground">Visit</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> Mthatha, Eastern Cape, South Africa</li>
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" /> +27 (0) 47 000 0000</li>
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" /> hello@lovetoswim.co.za</li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-foreground">Explore</div>
            <ul className="mt-3 space-y-2 text-sm">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-muted-foreground hover:text-primary">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground md:flex-row md:px-8">
            <span>© {new Date().getFullYear()} Love To Swim Academy. All rights reserved.</span>
            <span>Built with love in Mthatha.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Section({
  eyebrow,
  title,
  description,
  children,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <section className={cn("mx-auto w-full max-w-7xl px-4 py-16 md:px-8 md:py-24", className)}>
      {(eyebrow || title || description) && (
        <div className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center")}>
          {eyebrow && (
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
          )}
          {description && (
            <p className="mt-3 text-base text-muted-foreground md:text-lg">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
