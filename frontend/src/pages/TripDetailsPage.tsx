import { useEffect, useState } from "react";

type Trip = {
  id: number;
  name: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  budget?: number | null;
  season?: string | null;
  interests?: string | null;
};

type Destination = {
  id: number;
  name: string;
  description?: string | null;
  country?: string | null;
  city?: string | null;
  arrival_date?: string | null;
  departure_date?: string | null;
};

type TripDetailsPageProps = {
  tripId: number;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export function TripDetailsPage({ tripId }: TripDetailsPageProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tripRes, destRes] = await Promise.all([
          fetch(`${API_BASE}/trips/${tripId}`),
          fetch(`${API_BASE}/trips/${tripId}/destinations`)
        ]);

        if (tripRes.status === 404) {
          throw new Error("Trip not found.");
        }
        if (!tripRes.ok) {
          throw new Error(`Failed to load trip (HTTP ${tripRes.status})`);
        }
        if (!destRes.ok) {
          throw new Error(
            `Failed to load destinations (HTTP ${destRes.status})`
          );
        }

        const tripData: Trip = await tripRes.json();
        const destData: Destination[] = await destRes.json();

        setTrip(tripData);
        setDestinations(destData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId]);

  const refreshDestinations = async () => {
    try {
      const res = await fetch(`${API_BASE}/trips/${tripId}/destinations`);
      if (!res.ok) {
        throw new Error(`Failed to load destinations (HTTP ${res.status})`);
      }
      const data: Destination[] = await res.json();
      setDestinations(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleGenerateAiDestinations = async () => {
    if (!trip) return;

    setAiLoading(true);
    setAiError(null);

    const payload = {
      budget: trip.budget ?? 1000,
      season: trip.season || "any",
      interests: trip.interests || "sightseeing"
    };

    try {
      const res = await fetch(
        `${API_BASE}/trips/${tripId}/destinations/ai-generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        const body = await res.text();
        throw new Error(
          `AI generation failed (HTTP ${res.status})${
            body ? `: ${body}` : ""
          }`
        );
      }

      await refreshDestinations();
    } catch (err) {
      setAiError((err as Error).message);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-slate-300">
        Loading trip…
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

  if (!trip) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-300">
        Trip not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {trip.name}
            </h1>
            {trip.season && (
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                {trip.season}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleGenerateAiDestinations}
            disabled={aiLoading}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm shadow-indigo-500/40 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {aiLoading ? "Generating…" : "Generate AI destinations"}
          </button>
        </div>

        {aiError && (
          <p className="mt-2 text-xs text-red-300">{aiError}</p>
        )}
        {trip.interests && (
          <p className="mt-2 text-xs text-slate-300">
            Interests: {trip.interests}
          </p>
        )}
        {trip.description && (
          <p className="mt-4 text-sm text-slate-200">{trip.description}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
          {trip.start_date && trip.end_date && (
            <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1">
              {new Date(trip.start_date).toLocaleDateString()} –{" "}
              {new Date(trip.end_date).toLocaleDateString()}
            </span>
          )}
          {trip.budget != null && (
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-200">
              Budget: ${trip.budget.toLocaleString()}
            </span>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Destinations
          </h2>
          <span className="text-xs text-slate-400">
            {destinations.length} destination
            {destinations.length === 1 ? "" : "s"}
          </span>
        </div>

        {destinations.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-300">
            No destinations for this trip yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest) => (
              <article
                key={dest.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/60 p-5"
              >
                <header className="mb-1">
                  <h3 className="text-base font-medium tracking-tight">
                    {dest.name}
                  </h3>
                  {(dest.city || dest.country) && (
                    <p className="mt-1 text-xs text-slate-400">
                      {[dest.city, dest.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                </header>

                {dest.description && (
                  <p className="mb-3 text-sm text-slate-300">
                    {dest.description}
                  </p>
                )}

                {dest.arrival_date && dest.departure_date && (
                  <p className="mt-auto text-xs text-slate-400">
                    {new Date(dest.arrival_date).toLocaleDateString()} –{" "}
                    {new Date(dest.departure_date).toLocaleDateString()}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

