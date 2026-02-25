import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

type LayoutProps = {
  title?: string;
  children: ReactNode;
};

export function Layout({ title = "TripGenie", children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-tg-page text-tg-dark font-sans selection:bg-tg-highlight selection:text-tg-dark flex flex-col">
      <header className="sticky top-0 z-50 shadow-md bg-gradient-to-r from-tg-brand via-tg-action to-tg-dark">
        <div className="mx-auto max-w-6xl px-6 py-3 md:px-12">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="group flex items-center gap-3 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-tg-surface text-tg-brand text-lg font-bold tracking-tighter rounded-xl shadow-md group-hover:bg-tg-highlight group-hover:text-tg-dark transition-colors">
                TG
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold text-white tracking-wide">
                  TripGenie
                </span>
                <span className="text-xs text-white/70">
                  Plan smarter, travel better
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 backdrop-blur border border-white/20">
                <span className="hidden md:inline text-[11px] uppercase tracking-wide text-white/70 px-3">
                  Trips
                </span>
                <nav className="flex overflow-hidden rounded-full border border-white/25 text-xs sm:text-sm font-semibold">
                  <Link
                    to="/"
                    className={`inline-flex items-center justify-center px-4 py-1.5 transition-all duration-200 ease-out border-r border-white/25 ${
                      location.pathname === "/"
                        ? "bg-tg-surface text-tg-brand shadow-sm"
                        : "text-white/90 hover:bg-white/10"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/create"
                    className={`inline-flex items-center justify-center px-4 py-1.5 transition-all duration-200 ease-out ${
                      location.pathname === "/create"
                        ? "bg-tg-surface text-tg-action shadow-sm"
                        : "text-white/90 hover:bg-white/10"
                    }`}
                  >
                    Create Trip
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto relative z-10">
        <div className="w-full h-full">{children}</div>
      </main>

      <footer className="bg-tg-surface border-tg-border border-t text-tg-muted">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-12 text-xs font-medium">
          {title} © {new Date().getFullYear()} • Material-inspired layout
        </div>
      </footer>
    </div>
  );
}
