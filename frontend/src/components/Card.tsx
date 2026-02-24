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
      className={`bg-white border text-left border-gray-200 p-6 rounded-sm transition-transform duration-200 
      ${onClick ? "cursor-pointer" : ""} 
      ${className}`}
    >
      {children}
    </div>
  );
}
