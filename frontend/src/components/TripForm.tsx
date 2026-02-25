import { FormEvent, useState } from "react";
import { useToast } from "./ToastProvider";
import { Button } from "./Button";
import { TextInput, SelectInput, TextAreaInput } from "./Input";

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
  onCreated?: (tripId: number) => void;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

function inferSeasonFromDateString(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  const month = d.getMonth() + 1; // 1-12

  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter"; // Dec, Jan, Feb
}

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
  const [seasonTouched, setSeasonTouched] = useState(false);
  const { showToast } = useToast();

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "season") {
        setSeasonTouched(true);
        return next;
      }

      // Auto-select season based on dates if user hasn't manually chosen one.
      if ((name === "start_date" || name === "end_date") && !seasonTouched) {
        const sourceDate = next.start_date || next.end_date;
        const inferred = inferSeasonFromDateString(sourceDate);
        if (inferred) {
          next.season = inferred;
        }
      }

      return next;
    });
  };

  const validate = (): string | null => {
    if (!values.name.trim()) return "Title is required.";

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
          `Failed to create trip (HTTP ${res.status})${body ? `: ${body}` : ""
          }`
        );
      }

      const created: { id: number } = await res.json();

      setValues({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        budget: "",
        season: "",
        interests: ""
      });

      showToast("Trip created successfully.", "success");
      if (onCreated) onCreated(created.id);
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white border border-gray-200 p-8 md:p-10 rounded-sm"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-tg-dark">
          Trip Details
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-tg-danger rounded-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <TextInput
            label="Title"
            name="name"
            required
            placeholder="Summer in Italy"
            value={values.name}
            onChange={handleChange}
          />
        </div>

        <TextInput
          label="Start date"
          type="date"
          name="start_date"
          value={values.start_date}
          onChange={handleChange}
        />

        <TextInput
          label="End date"
          type="date"
          name="end_date"
          value={values.end_date}
          onChange={handleChange}
        />

        <TextInput
          label="Budget (USD)"
          type="number"
          min={0}
          step="0.01"
          name="budget"
          placeholder="1500"
          value={values.budget}
          onChange={handleChange}
        />

        <SelectInput
          label="Season"
          name="season"
          value={values.season}
          onChange={handleChange}
        >
          <option value="">Select season</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="autumn">Autumn</option>
          <option value="winter">Winter</option>
        </SelectInput>
      </div>

      <TextInput
        label="Interests"
        name="interests"
        placeholder="beach, food, history"
        value={values.interests}
        onChange={handleChange}
        hint="Comma separated keywords"
      />

      <TextAreaInput
        label="Description"
        name="description"
        rows={3}
        placeholder="Short summary of the trip."
        value={values.description}
        onChange={handleChange}
      />

      <div className="pt-6">
        <Button size="lg" type="submit" loading={submitting} className="w-full text-center">
          CREATE ITINERARY
        </Button>
      </div>
    </form>
  );
}
