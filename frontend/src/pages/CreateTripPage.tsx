import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { TripForm } from "../components/TripForm";

export function CreateTripPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-tg-page">
      <PageHeader
        variant="brand"
        title="Create a Trip"
        subtitle="Define your budget, season and interests. We'll help you fill in the rest."
      />

      <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-12 flex justify-center">
        <div className="w-full max-w-2xl mt-4">
          <TripForm onCreated={(id) => navigate(`/trip/${id}`)} />
        </div>
      </div>
    </div>
  );
}
