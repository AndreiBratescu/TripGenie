import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

type ToastVariant = "success" | "error";

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      setToasts((prev) => [...prev, { id: Date.now(), message, variant }]);
    },
    []
  );

  useEffect(() => {
    if (!toasts.length) return;

    const timer = setInterval(() => {
      setToasts((prev) => prev.slice(1));
    }, 3500);

    return () => clearInterval(timer);
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center sm:justify-end sm:pr-4">
        <div className="flex w-full max-w-sm flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-lg border px-3 py-2 text-xs shadow ${
                toast.variant === "success"
                  ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-100 shadow-emerald-500/30"
                  : "border-red-400/40 bg-red-500/15 text-red-100 shadow-red-500/30"
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

