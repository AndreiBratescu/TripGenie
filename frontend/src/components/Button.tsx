import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "action" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tg-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:-translate-y-0.5 shadow-sm hover:shadow-md active:shadow-sm active:translate-y-0";

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-3 py-1.5 text-xs rounded-full",
    md: "px-5 py-2.5 text-sm rounded-full",
    lg: "px-6 py-3.5 text-base rounded-full",
    xl: "px-10 py-4 text-lg rounded-full"
  };

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-tg-brand text-white hover:bg-indigo-500 active:bg-indigo-600",
    secondary:
      "bg-tg-surface text-tg-dark border border-tg-border hover:bg-gray-50",
    action:
      "bg-tg-action text-white hover:bg-rose-500 active:bg-rose-600",
    danger:
      "bg-tg-danger text-white hover:bg-red-500 active:bg-red-600",
    ghost:
      "bg-transparent text-tg-dark hover:bg-gray-100"
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      <span>{children}</span>
    </button>
  );
}
