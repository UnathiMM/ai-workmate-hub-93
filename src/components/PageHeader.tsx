import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  icon,
  actions,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b bg-card/40 px-6 py-5 md:flex-row md:items-end md:justify-between">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg brand-gradient text-primary-foreground shadow-soft">
            {icon}
          </div>
        )}
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function AIDisclaimer() {
  return (
    <p className="text-xs text-muted-foreground">
      AI-generated. Review and edit before using. Do not share confidential data you wouldn't paste into a third-party tool.
    </p>
  );
}
