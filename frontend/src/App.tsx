import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { CreateTripPage } from "./pages/CreateTripPage";
import { TripDetailsPage } from "./pages/TripDetailsPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/create" element={<CreateTripPage />} />
        <Route path="/trip/:id" element={<TripDetailsPage />} />
      </Routes>
    </Layout>
  );
}

