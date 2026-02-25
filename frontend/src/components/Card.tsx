import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-tg-surface text-left border border-tg-border/70 p-6 rounded-xl shadow-sm transition-all duration-200 ease-out
      ${onClick ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : ""} 
      ${className}`}
    >
      {children}
    </div>
  );
}
