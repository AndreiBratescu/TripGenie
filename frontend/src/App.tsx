import { Layout } from "./components/Layout";
import { TripForm } from "./components/TripForm";
import { TripsGrid } from "./components/TripsGrid";

export default function App() {
  return (
    <Layout>
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-[minmax(0,_1.2fr)_minmax(0,_1.5fr)]">
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h1 className="text-2xl font-semibold tracking-tight">Trips</h1>
            <p className="text-sm text-slate-300">
              Create trips and view them in a responsive grid backed by your
              FastAPI API.
            </p>
          </div>

          <TripForm />
        </section>

        <TripsGrid />
      </div>
    </Layout>
  );
}

