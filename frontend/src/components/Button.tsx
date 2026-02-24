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
    "inline-flex items-center justify-center gap-2 font-semibold transition-transform duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tg-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:-translate-y-0.5";

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-3 py-1.5 text-xs rounded-sm",
    md: "px-5 py-2.5 text-sm rounded-sm",
    lg: "px-6 py-4 text-base rounded-sm",
    xl: "px-10 py-5 text-lg rounded-sm"
  };

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-tg-brand text-white",
    secondary:
      "bg-gray-100 text-tg-dark hover:bg-gray-200",
    action:
      "bg-tg-action text-white",
    danger:
      "bg-tg-danger text-white",
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
