/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      colors: {
        "tg-page": "#F9FAFB",     // Gray 50
        "tg-surface": "#FFFFFF",  // White
        "tg-brand": "#4F46E5",    // Indigo 600
        "tg-action": "#F43F5E",   // Rose 500
        "tg-dark": "#111827",     // Gray 900
        "tg-muted": "#6B7280",    // Gray 500
        "tg-border": "#E5E7EB",   // Gray 200
        "tg-danger": "#EF4444",   // Red 500
        "tg-highlight": "#FBBF24" // Amber 400
      }
    }
  },
  plugins: []
};
