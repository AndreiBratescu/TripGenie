import { FormEvent, useState } from "react";

type TripFormValues = {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  budget: string;
  season: string;
  interests: string;
};

type TripFormProps = {
  onCreated?: () => void;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export function TripForm({ onCreated }: TripFormProps) {
  const [values, setValues] = useState<TripFormValues>({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    budget: "",
    season: "",
    interests: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): string | null => {
    if (!values.name.trim()) return "Name is required.";

    if (values.budget) {
      const num = Number(values.budget);
      if (Number.isNaN(num) || num < 0) {
        return "Budget must be a non-negative number.";
      }
    }

    if (values.start_date && values.end_date) {
      if (new Date(values.start_date) > new Date(values.end_date)) {
        return "End date must be after start date.";
      }
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      name: values.name.trim(),
      description: values.description.trim() || null,
      start_date: values.start_date || null,
      end_date: values.end_date || null,
      budget: values.budget ? Number(values.budget) : null,
      season: values.season.trim() || null,
      interests: values.interests.trim() || null
    };

    try {
      const res = await fetch(`${API_BASE}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(
          `Failed to create trip (HTTP ${res.status})${
            body ? `: ${body}` : ""
          }`
        );
      }

      setValues({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        budget: "",
        season: "",
        interests: ""
      });

      if (onCreated) onCreated();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6"
    >
      <h2 className="text-lg font-semibold tracking-tight">Create a trip</h2>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-100">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-200">
            Name<span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
            placeholder="Summer in Italy"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-200">
            Start date
          </label>
          <input
            type="date"
            name="start_date"
            value={values.start_date}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-200">
            End date
          </label>
          <input
            type="date"
            name="end_date"
            value={values.end_date}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-200">
            Budget (USD)
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            name="budget"
            value={values.budget}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
            placeholder="1500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-200">
            Season
          </label>
          <input
            type="text"
            name="season"
            value={values.season}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
            placeholder="summer, winter, ..."
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-200">
          Interests
        </label>
        <input
          type="text"
          name="interests"
          value={values.interests}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
          placeholder="beach, food, history"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-200">
          Description
        </label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
          placeholder="Short summary of the trip."
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-500/40 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Creating..." : "Create trip"}
      </button>
    </form>
  );
}

