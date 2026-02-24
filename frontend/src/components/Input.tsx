import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";

type BaseFieldProps = {
  label: string;
  hint?: string;
  error?: string;
};

type TextInputProps = BaseFieldProps &
  InputHTMLAttributes<HTMLInputElement>;

const baseInput = "mt-2 w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm font-medium text-tg-dark placeholder:text-gray-400 outline-none transition-colors duration-200 focus:bg-white focus:border-tg-brand focus:ring-1 focus:ring-tg-brand rounded-sm";

export function TextInput({ label, hint, error, className = "", ...props }: TextInputProps) {
  return (
    <label className="block text-sm font-semibold text-tg-dark">
      {label}
      <input
        className={`${baseInput} ${className}`}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-xs font-medium text-tg-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-tg-danger">{error}</p>}
    </label>
  );
}

type SelectInputProps = BaseFieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    children: ReactNode;
  };

export function SelectInput({
  label,
  hint,
  error,
  children,
  className = "",
  ...props
}: SelectInputProps) {
  return (
    <label className="block text-sm font-semibold text-tg-dark">
      {label}
      <select
        className={`${baseInput} appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
      {hint && !error && <p className="mt-1 text-xs font-medium text-tg-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-tg-danger">{error}</p>}
    </label>
  );
}

type TextAreaInputProps = BaseFieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaInput({
  label,
  hint,
  error,
  className = "",
  ...props
}: TextAreaInputProps) {
  return (
    <label className="block text-sm font-semibold text-tg-dark">
      {label}
      <textarea
        className={`${baseInput} resize-y min-h-[120px] ${className}`}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-xs font-medium text-tg-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-tg-danger">{error}</p>}
    </label>
  );
}
