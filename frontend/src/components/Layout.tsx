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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="mx-auto flex flex-wrap max-w-6xl items-center justify-between px-6 py-4 md:px-12 gap-4">
          <Link to="/" className="group flex items-center transition-transform hover:-translate-y-0.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-tg-brand text-white text-lg font-bold tracking-tighter rounded-sm group-hover:bg-tg-action transition-colors">
              TG
            </div>
          </Link>

          <nav className="flex items-center gap-16 sm:gap-24 overflow-x-auto whitespace-nowrap">
            <Link
              to="/"
              className={`inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-black rounded-sm transition-transform duration-200 ease-in-out hover:-translate-y-0.5 border ${location.pathname === '/'
                ? 'bg-tg-brand border-tg-brand shadow-sm text-black'
                : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
            >
              Dashboard
            </Link>
            <Link
              to="/create"
              className={`inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-black rounded-sm transition-transform duration-200 ease-in-out hover:-translate-y-0.5 border ${location.pathname === '/create'
                ? 'bg-tg-action border-tg-action shadow-sm text-black'
                : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
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
