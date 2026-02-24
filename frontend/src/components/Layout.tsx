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
      <header className="bg-tg-brand text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-12">
          <Link to="/" className="group flex items-center gap-4 transition-transform hover:scale-105">
            <div className="flex h-12 w-12 items-center justify-center bg-white text-tg-brand text-xl font-bold tracking-tighter rounded-sm">
              TG
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="text-sm font-semibold tracking-wider text-white/80">
                TRIPGENIE
              </span>
              <span className="mt-1 text-xl font-bold">
                {title}
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold tracking-wide hover:text-tg-highlight transition-colors ${location.pathname === '/' ? 'text-tg-highlight' : 'text-white'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/create"
              className={`text-sm font-semibold tracking-wide hover:text-tg-highlight transition-colors ${location.pathname === '/create' ? 'text-tg-highlight' : 'text-white'}`}
            >
              Create Trip
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto relative z-10">
        <div className="w-full h-full">{children}</div>
      </main>

      <footer className="bg-tg-dark text-white">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-12 text-sm font-medium text-white/50">
          TripGenie © {new Date().getFullYear()} • Flat Design Edition
        </div>
      </footer>
    </div>
  );
}
