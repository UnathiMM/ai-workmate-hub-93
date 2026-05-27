import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        {eyebrow && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-2.5 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}

export function Disclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mt-6 rounded-lg border border-dashed border-border bg-card/40 p-3 text-xs text-muted-foreground",
        className,
      )}
    >
      <strong className="text-foreground/80">Responsible AI:</strong> Outputs are AI-generated and may contain
      errors or bias. Please review and edit before sharing externally.
    </div>
  );
}
