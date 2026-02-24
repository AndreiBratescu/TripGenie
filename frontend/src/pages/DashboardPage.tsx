import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/Button";
import { TripsGrid } from "../components/TripsGrid";

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-tg-page">
      <PageHeader
        variant="highlight"
        title="Your Trips"
        subtitle="Browse and manage your trips. Open one to generate AI suggestions."
        actions={
          <Button size="lg" variant="primary" onClick={() => navigate("/create")}>
            Create Trip
          </Button>
        }
      />

      <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-12">
        <TripsGrid onTripClick={(id) => navigate(`/trip/${id}`)} />
      </div>
    </div>
  );
}
