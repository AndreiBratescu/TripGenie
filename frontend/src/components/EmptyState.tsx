import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 bg-tg-surface border border-tg-border px-8 py-20 text-center text-tg-dark rounded-xl shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center bg-gray-100 text-3xl rounded-full mb-2 shadow-sm">
        {icon ?? "✈️"}
      </div>
      <div className="max-w-md">
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm font-medium text-tg-muted">
          {description}
        </p>
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
