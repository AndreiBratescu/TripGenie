import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  variant?: "default" | "brand" | "highlight";
  actions?: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  variant = "default",
  actions
}: PageHeaderProps) {
  const base = "px-6 py-12 md:px-12 md:py-20 md:flex md:items-end md:justify-between gap-8";

  const variants: Record<typeof variant, string> = {
    default: "bg-white text-tg-dark",
    brand: "bg-tg-brand text-white",
    highlight: "bg-tg-highlight text-tg-dark"
  };

  return (
    <section className={`${base} ${variants[variant]}`}>
      <div className="max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className={`text-lg md:text-xl font-medium ${variant === 'default' ? 'text-tg-muted' : 'text-current opacity-80'}`}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="mt-8 md:mt-0 flex flex-shrink-0 items-center gap-4">
          {actions}
        </div>
      )}
    </section>
  );
}
