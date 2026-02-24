import { useEffect, useState } from "react";
import { Card } from "./Card";
import { EmptyState } from "./EmptyState";
import { Button } from "./Button";

type Trip = {
  id: number;
  name: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  budget?: number | null;
  season?: string | null;
};

type TripsGridProps = {
  onTripClick?: (id: number) => void;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export function TripsGrid({ onTripClick }: TripsGridProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this trip? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/trips/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        throw new Error(`Failed to delete trip (HTTP ${res.status})`);
      }
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-lg font-medium text-tg-muted text-center">
        Loading trips...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 px-6 py-6 text-sm font-medium text-tg-danger rounded-sm">
        {error}
      </div>
    );
  }

  if (!trips.length) {
    return (
      <EmptyState
        title="No trips yet"
        description="Start by creating your first trip. We'll help you fill it with smart suggestions."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <Card
          key={trip.id}
          onClick={() => onTripClick?.(trip.id)}
          className="flex flex-col min-h-[220px]"
        >
          <header className="mb-3 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-tg-dark">
                {trip.name}
              </h2>
              {trip.season && (
                <div className="mt-2 inline-block bg-tg-highlight/20 text-tg-dark px-2 py-0.5 text-xs font-semibold tracking-wide rounded-sm">
                  {trip.season.toUpperCase()}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                void handleDelete(trip.id);
              }}
              loading={deletingId === trip.id}
              className="text-tg-muted hover:text-tg-danger"
            >
              {deletingId === trip.id ? "..." : "✕"}
            </Button>
          </header>

          {trip.description && (
            <p className="mb-4 line-clamp-3 text-sm font-normal text-tg-muted">
              {trip.description}
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-tg-muted">
            {trip.start_date && trip.end_date && (
              <span className="text-xs font-semibold">
                {new Date(trip.start_date).toLocaleDateString("en-GB")} –{" "}
                {new Date(trip.end_date).toLocaleDateString("en-GB")}
              </span>
            )}
            {trip.budget != null && (
              <span className="text-xs font-semibold text-tg-brand bg-tg-brand/10 px-2 py-1 rounded-sm">
                ${trip.budget.toLocaleString()}
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
