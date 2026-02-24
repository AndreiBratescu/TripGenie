import { useEffect, useState } from "react";

type Trip = {
  id: number;
  name: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  budget?: number | null;
  season?: string | null;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export function TripsGrid() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/trips`);
        if (!res.ok) {
          throw new Error(`Failed to load trips (HTTP ${res.status})`);
        }
        const data: Trip[] = await res.json();
        setTrips(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-slate-300">
        Loading trips…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
        {error}
      </div>
    );
  }

  if (!trips.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-300">
        No trips found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <article
          key={trip.id}
          className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/50 p-5 shadow-sm shadow-black/40"
        >
          <header className="mb-2">
            <h2 className="text-lg font-semibold tracking-tight">
              {trip.name}
            </h2>
            {trip.season && (
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                {trip.season}
              </p>
            )}
          </header>

          {trip.description && (
            <p className="mb-3 text-sm text-slate-300">{trip.description}</p>
          )}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div>
              {trip.start_date && trip.end_date && (
                <span>
                  {new Date(trip.start_date).toLocaleDateString()} –{" "}
                  {new Date(trip.end_date).toLocaleDateString()}
                </span>
              )}
            </div>
            {trip.budget != null && (
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-200">
                Budget: ${trip.budget.toLocaleString()}
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

