import type { ReactNode } from "react";

type LayoutProps = {
  title?: string;
  children: ReactNode;
};

export function Layout({ title = "TripGenie", children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400" />
            <span className="font-semibold tracking-tight">{title}</span>
          </div>
          <nav className="text-sm text-slate-300">
            <a className="hover:text-white" href="/">
              Home
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-slate-400">
          TripGenie • FastAPI + React
        </div>
      </footer>
    </div>
  );
}

