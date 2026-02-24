import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/ToastProvider";
import { Card } from "../components/Card";

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

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

type RouteParams = {
  id?: string;
};

export function TripDetailsPage() {
  const { id } = useParams<RouteParams>();
  const tripId = Number(id);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (!tripId) return;

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

    const proceed = window.confirm(
      "Generate AI destinations for this trip? Existing destinations will be kept."
    );
    if (!proceed) return;

    setAiLoading(true);

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
          `AI generation failed (HTTP ${res.status})${body ? `: ${body}` : ""
          }`
        );
      }

      await refreshDestinations();
      showToast("AI destinations generated.", "success");
    } catch (err) {
      const message = (err as Error).message;
      showToast(message, "error");
    } finally {
      setAiLoading(false);
    }
  };

  const handleDeleteDestination = async (destinationId: number) => {
    if (!window.confirm("Delete this destination? This cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/trips/${tripId}/destinations/${destinationId}`,
        {
          method: "DELETE"
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to delete destination (HTTP ${res.status})`);
      }
      setDestinations((prev) => prev.filter((d) => d.id !== destinationId));
      showToast("Destination deleted.", "success");
    } catch (err) {
      const message = (err as Error).message;
      showToast(message, "error");
    }
  };

  if (!tripId || Number.isNaN(tripId)) {
    return (
      <div className="bg-red-50 border border-red-200 px-6 py-6 text-sm font-medium text-tg-danger m-12 rounded-sm">
        Invalid trip id.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-lg font-medium text-tg-muted text-center">
        Loading trip...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 px-6 py-6 text-sm font-medium text-tg-danger m-12 rounded-sm">
        {error}
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="bg-white border border-gray-200 px-6 py-6 text-sm font-medium text-tg-dark m-12 rounded-sm">
        Trip not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* TRiP INFO SECTION */}
      <section className="bg-tg-brand text-white px-6 py-12 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 max-w-4xl">
            {trip.name}
          </h1>

          <div className="flex flex-wrap gap-3 mt-6">
            {trip.season && (
              <span className="bg-white/20 px-3 py-1.5 text-xs font-semibold tracking-wide rounded-sm uppercase">
                {trip.season}
              </span>
            )}
            {trip.start_date && trip.end_date && (
              <span className="bg-white/20 px-3 py-1.5 text-xs font-semibold tracking-wide rounded-sm uppercase">
                {new Date(trip.start_date).toLocaleDateString()} –{" "}
                {new Date(trip.end_date).toLocaleDateString()}
              </span>
            )}
            {trip.budget != null && (
              <span className="bg-tg-highlight text-tg-dark px-3 py-1.5 text-xs font-semibold tracking-wide rounded-sm uppercase">
                Budget: ${trip.budget.toLocaleString()}
              </span>
            )}
          </div>

          {(trip.description || trip.interests) && (
            <div className="mt-8 grid gap-8 md:grid-cols-2 max-w-4xl bg-white text-tg-dark p-6 md:p-8 rounded-sm">
              {trip.description && (
                <div>
                  <h3 className="text-xs font-bold tracking-widest text-tg-muted uppercase mb-1">Description</h3>
                  <p className="text-base font-medium text-tg-dark/90 leading-relaxed">{trip.description}</p>
                </div>
              )}
              {trip.interests && (
                <div>
                  <h3 className="text-xs font-bold tracking-widest text-tg-muted uppercase mb-1">Interests</h3>
                  <p className="text-base font-medium text-tg-dark/90 leading-relaxed">{trip.interests}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* GENERATE AI SUGGESTIONS SECTION */}
      <section className="bg-tg-action text-white px-6 py-16 md:px-12 md:py-24 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 max-w-2xl leading-tight">
          Enhance this trip with AI
        </h2>
        <p className="text-lg md:text-xl font-medium text-white/90 mb-8 max-w-2xl">
          Get custom destination recommendations tailored specifically to your budget and interests.
        </p>
        <Button
          size="lg"
          variant="secondary"
          loading={aiLoading}
          onClick={handleGenerateAiDestinations}
          className="bg-white text-tg-action hover:bg-gray-100 hover:-translate-y-1 shadow-sm"
        >
          {aiLoading ? "GENERATING DESTINATIONS..." : "GENERATE SUGGESTIONS"}
        </Button>
      </section>

      {/* DESTINATIONS SECTION */}
      <section className="bg-tg-page px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-end justify-between border-b border-gray-200 pb-4">
            <h2 className="text-3xl font-bold tracking-tight text-tg-dark">
              Destinations
            </h2>
            <span className="text-sm font-semibold text-tg-muted bg-gray-100 px-3 py-1 rounded-sm">
              {destinations.length} destination{destinations.length === 1 ? "" : "s"}
            </span>
          </div>

          {destinations.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="No destinations yet"
                description="Click generation above, or build your own itinerary."
              />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((dest) => (
                <Card key={dest.id} className="flex flex-col min-h-[250px]">
                  <header className="mb-3">
                    <h3 className="text-xl font-bold tracking-tight mb-1 text-tg-dark">
                      {dest.name}
                    </h3>
                    {(dest.city || dest.country) && (
                      <p className="text-sm font-semibold text-tg-muted">
                        {[dest.city, dest.country].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </header>

                  {dest.description && (
                    <p className="mb-6 text-sm font-normal text-tg-muted flex-1 leading-relaxed">
                      {dest.description}
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
                    {dest.arrival_date && dest.departure_date && (
                      <p className="text-xs font-semibold tracking-wide text-tg-muted">
                        {new Date(dest.arrival_date).toLocaleDateString()} –{" "}
                        {new Date(dest.departure_date).toLocaleDateString()}
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleDeleteDestination(dest.id)}
                      className="text-tg-danger bg-red-50 hover:bg-red-100 w-full"
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
