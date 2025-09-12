"use client";
import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

// Types sûrs
type Event = {
  eventid: number | string;
  iyear: number | string;
  country_txt: string;
  gname: string;
  nkill: number | string | null;
};

export default function TimelinePage() {
  const [years, setYears] = useState<number[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [minKills, setMinKills] = useState<number>(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingYear, setLoadingYear] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charge les années + le total par année
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/filters");
        if (!res.ok) throw new Error("Impossible de charger les années");
        const data = await res.json();
        const uniqueYears = Array.from(new Set(data.years as number[]))
          .filter((y): y is number => typeof y === "number" && !isNaN(y))
          .sort((a, b) => a - b);
        setYears(uniqueYears);

        // récupère le total par année (via entête x-total-count)
        const yearCounts: Record<number, number> = {};
        for (const y of uniqueYears) {
          const r = await fetch(`/api/attacks?year=${y}&limit=1`); // limit 1: on veut juste le count
          const count = parseInt(r.headers.get("x-total-count") || "0", 10);
          yearCounts[y] = Number.isFinite(count) ? count : 0;
        }
        setCounts(yearCounts);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Charge les événements de l'année sélectionnée
  useEffect(() => {
    if (!selectedYear) return;
    (async () => {
      try {
        setLoadingYear(true);
        const r = await fetch(`/api/attacks?year=${selectedYear}&limit=1000`);
        if (!r.ok) throw new Error("Chargement des événements impossible");
        const json = (await r.json()) as Event[];
        setEvents(json);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingYear(false);
      }
    })();
  }, [selectedYear]);

  // Données du graphique
  const chartData = useMemo(() => {
    if (years.length === 0 || Object.keys(counts).length === 0) return null;
    return {
      labels: years,
      datasets: [
        {
          label: "Nombre d'attentats",
          data: years.map((y) => counts[y] || 0),
          backgroundColor: (ctx: any) => {
            const c = ctx.chart.ctx;
            const g = c.createLinearGradient(0, 0, 0, 300);
            g.addColorStop(0, "rgba(56,189,248,0.9)"); // cyan-400
            g.addColorStop(1, "rgba(99,102,241,0.35)"); // indigo-500
            return g;
          },
          borderRadius: 6,
          hoverBackgroundColor: "rgba(56,189,248,1)",
        },
      ],
    };
  }, [years, counts]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const year = years[index];
        setSelectedYear(year);
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15,23,42,0.9)",
        titleColor: "#fff",
        bodyColor: "#e5e7eb",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
      },
      title: {
        display: true,
        text: "Chronologie des attentats (clic pour détailler)",
        color: "#e2e8f0",
        padding: 16,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "rgba(255,255,255,0.8)", maxRotation: 0 },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "rgba(255,255,255,0.8)" },
      },
    },
  }), [years]);

  // Filtrage local dans le modal
  const filteredEvents = events.filter((e) => {
    const g = (e.gname || "").toLowerCase();
    const c = (e.country_txt || "").toLowerCase();
    const kills = Number(e.nkill);
    return (
      g.includes(groupFilter.toLowerCase()) &&
      c.includes(countryFilter.toLowerCase()) &&
      (Number.isFinite(kills) ? kills : 0) >= minKills
    );
  });

  // Modal futuriste
  const modal = selectedYear ? (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative mx-auto mt-10 mb-10 w-[min(96vw,1100px)] rounded-3xl border border-white/10 bg-[#0b1021]/90 text-white p-6 shadow-[0_0_1px_0_rgba(255,255,255,0.2),0_40px_80px_-40px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-b from-white to-cyan-200 bg-clip-text text-transparent">
            Attentats en {selectedYear}
          </h2>
          <button
            onClick={() => setSelectedYear(null)}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
          >
            Fermer ✕
          </button>
        </div>

        {/* Filtres locaux */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            placeholder="Filtrer par groupe"
            className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2"
          />
          <input
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            placeholder="Filtrer par pays"
            className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2"
          />
          <input
            type="number"
            min={0}
            value={minKills}
            onChange={(e) => setMinKills(parseInt(e.target.value || "0", 10))}
            placeholder="Morts min"
            className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2"
          />
          <button
            onClick={() => {
              setGroupFilter("");
              setCountryFilter("");
              setMinKills(0);
            }}
            className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-2"
          >
            Réinitialiser
          </button>
        </div>

        {loadingYear ? (
          <div className="text-center py-8 text-white/80">Chargement…</div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((e) => (
              <div
                key={String(e.eventid)}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 hover:bg-white/10 transition-colors"
              >
                <p className="text-sm"><span className="text-white/60">Pays :</span> {e.country_txt || "—"}</p>
                <p className="text-sm"><span className="text-white/60">Groupe :</span> {e.gname || "—"}</p>
                <p className="text-sm"><span className="text-white/60">Morts :</span> {Number(e.nkill) || 0}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/70">Aucune donnée disponible pour cette année.</p>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative min-h-screen text-white bg-[#0a0f1f]">
      {/* BG accents */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[-1] opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]"
        style={{
          background:
            "radial-gradient(1200px 600px at 20% 10%, #3b82f6 15%, transparent 60%), radial-gradient(900px 500px at 80% 20%, #22d3ee 10%, transparent 55%), radial-gradient(900px 600px at 50% 80%, #a78bfa 10%, transparent 55%)",
        }}
      />

      <main className="mx-auto max-w-7xl px-6 sm:px-10 py-10 md:py-14 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-cyan-200 bg-clip-text text-transparent">
            Chronologie des attentats
          </h1>
        </header>

        {/* panneau filtre global (affiche aussi l'état) */}
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sm:p-5">
          {loading ? (
            <div className="text-sm text-white/70">Chargement des années…</div>
          ) : (
            <div className="text-sm text-white/70">
              {Object.values(counts).reduce((a, b) => a + b, 0).toLocaleString("fr-FR")} événements au total
            </div>
          )}
        </section>

        {/* Chart */}
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 sm:p-5">
          {error && <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-200 text-sm">{error}</div>}
          {!loading && !chartData && (
            <div className="text-white/80 text-center py-10">Aucune donnée disponible pour le moment.</div>
          )}
          {chartData && (
            <div className="h-[420px]">
              <Bar data={chartData} options={options} />
            </div>
          )}
        </section>
      </main>

      {modal}

      {selectedYear && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500 text-white px-4 py-2 rounded-xl shadow-lg hover:opacity-90 transition"
          >
            ↑ Haut
          </button>
        </div>
      )}
    </div>
  );
}