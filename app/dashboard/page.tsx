// app/dashboard/page.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

// ---- Types ----
type Attack = {
  eventid: string | number;
  latitude: number | null;
  longitude: number | null;
  iyear: number | string;
  country_txt: string | null;
  gname: string | null;
  nkill: number | string | null;
};

// ---- Helpers ----
const fmt = new Intl.NumberFormat("fr-FR");

// Simple equirectangular projection for a canvas map
function project(lat: number, lon: number, w: number, h: number) {
  const x = ((lon + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return [x, y];
}

// ---- Neon UI atoms (inline to avoid extra files) ----
function Kpi({ label, value, sub }: { label: string; value: string | number; sub?: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sm:p-5 shadow-[0_0_1px_0_rgba(255,255,255,0.2),0_20px_60px_-30px_rgba(0,0,0,0.6)]">
      <div className="absolute -inset-x-2 -top-2 h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      <div className="text-xs uppercase tracking-wide text-white/60">{label}</div>
      <div className="mt-1 text-2xl sm:text-3xl font-extrabold bg-gradient-to-b from-white to-cyan-200 bg-clip-text text-transparent">
        {value}
      </div>
      {sub ? <div className="mt-2 text-xs text-white/60">{sub}</div> : null}
    </div>
  );
}

function Spark({ series }: { series: number[] }) {
  const path = useMemo(() => {
    if (!series.length) return null as any;
    const w = 160;
    const h = 40;
    const max = Math.max(...series);
    const min = Math.min(...series);
    const norm = (v: number) => (max === min ? h / 2 : h - ((v - min) / (max - min)) * (h - 6) - 3);
    const dx = w / (series.length - 1 || 1);
    let d = `M 0 ${norm(series[0])}`;
    for (let i = 1; i < series.length; i++) d += ` L ${i * dx} ${norm(series[i])}`;
    return { d, w, h };
  }, [series]);
  if (!path) return null;
  return (
    <svg width={path.w} height={path.h} className="block">
      <path d={path.d} fill="none" stroke="currentColor" className="text-cyan-400" strokeWidth={2} />
    </svg>
  );
}

function YearBars({ counts }: { counts: Record<number, number> }) {
  const entries = useMemo(() => Object.entries(counts).map(([y, c]) => [Number(y), c as number]).sort((a,b)=>a[0]-b[0]), [counts]);
  const max = useMemo(() => Math.max(1, ...entries.map(([, c]) => c as number)), [entries]);
  return (
    <div className="grid grid-cols-12 gap-2 items-end h-40">
      {entries.map(([y, c]) => (
        <div key={y} className="flex flex-col items-center gap-1">
          <div className="w-3 sm:w-4 rounded-t-md bg-gradient-to-t from-cyan-500 to-sky-300" style={{ height: `${(c / max) * 100}%` }} />
          <span className="text-[10px] text-white/60">{y}</span>
        </div>
      ))}
    </div>
  );
}

function CanvasMap({ points }: { points: { lat: number; lon: number }[] }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    // background grid glow
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    for (let x = 0; x < w; x += 40) for (let y = 0; y < h; y += 40) ctx.fillRect(x, y, 1, 1);
    // points
    for (const p of points) {
      const [x, y] = project(p.lat, p.lon, w, h);
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56,189,248,0.95)";
      ctx.shadowColor = "rgba(56,189,248,0.85)";
      ctx.shadowBlur = 10;
      ctx.fill();
    }
  }, [points]);
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-2 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40" style={{
        background:
          "radial-gradient(1000px 300px at 10% 10%, rgba(59,130,246,0.15), transparent), radial-gradient(900px 300px at 90% 20%, rgba(34,211,238,0.12), transparent)",
      }} />
      <canvas ref={ref} width={1000} height={420} className="w-full h-[320px] sm:h-[380px]" />
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // années (depuis /api/filters) + données brutes (depuis /api/attacks)
  const [years, setYears] = useState<number[]>([]);
  const [data, setData] = useState<Attack[]>([]);

  // filtres
  const [year, setYear] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [minVictims, setMinVictims] = useState<number>(0);

  async function fetchYears() {
    const res = await fetch("/api/filters");
    if (!res.ok) throw new Error("Impossible de charger les années");
    const json = await res.json();
    const ys = Array.from(new Set(json.years as number[]))
      .filter((y): y is number => typeof y === "number" && Number.isFinite(y))
      .sort((a, b) => a - b);
    setYears(ys);
  }

  async function fetchAttacks() {
    const params = new URLSearchParams();
    if (year) params.set("year", year);
    if (country) params.set("country", country);
    if (minVictims) params.set("victims", String(minVictims));
    // comme timeline: on ne charge pas tout; limite haute mais raisonnable
    params.set("limit", "30000");
    const res = await fetch(`/api/attacks?${params.toString()}`);
    if (!res.ok) throw new Error("Impossible de charger les événements");
    const json = (await res.json()) as Attack[];
    setData(json);
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchYears();
        await fetchAttacks();
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await fetchAttacks();
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [year, country, minVictims]);

  const perYear = useMemo(() => {
    const m: Record<number, number> = {};
    for (const d of data) {
      const y = Number(d.iyear);
      if (Number.isFinite(y)) m[y] = (m[y] || 0) + 1;
    }
    return m;
  }, [data]);

  const yearList = useMemo(() => years, [years]);

  const sparkSeries = useMemo(() => {
    return yearList.map((y) => perYear[y] || 0);
  }, [perYear, yearList]);

  const kpis = useMemo(() => {
    const total = data.length;
    const deaths = data.reduce((s, d) => {
      const v = Number(d.nkill);
      return s + (Number.isFinite(v) ? v : 0);
    }, 0);
    const countries = new Set(data.map(d => d.country_txt).filter(Boolean)).size;
    const groups = new Set(data.map(d => d.gname).filter(Boolean)).size;
    return { total, deaths, countries, groups };
  }, [data]);

  const points = useMemo(() =>
    data.filter(d => d.latitude != null && d.longitude != null).map(d => ({ lat: Number(d.latitude), lon: Number(d.longitude) })),
  [data]);

  const applyFilters = async () => {
    await fetchAttacks();
  };

  return (
    <div className="relative min-h-screen text-white bg-[#0a0f1f]">
      {/* bg accents */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[-1] opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]" style={{
        background:
          "radial-gradient(1200px 600px at 20% 10%, #3b82f6 15%, transparent 60%), radial-gradient(900px 500px at 80% 20%, #22d3ee 10%, transparent 55%), radial-gradient(900px 600px at 50% 80%, #a78bfa 10%, transparent 55%)",
      }} />

      <main className="mx-auto max-w-7xl px-6 sm:px-10 py-10 md:py-14">
        <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-cyan-200 bg-clip-text text-transparent drop-shadow">Dashboard GTD</h1>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="underline text-white/70 hover:text-white">Accueil</Link>
          </div>
        </header>

        {/* Filtres */}
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sm:p-5 mb-6">
          <div className="mb-3 text-xs text-white/70">{loading ? "Chargement…" : `${fmt.format(kpis.total)} événements chargés`}</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <select className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2" value={year} onChange={e=>setYear(e.target.value)}>
              <option value="">Année (toutes)</option>
              {yearList.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <input className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2" value={country} onChange={e=>setCountry(e.target.value)} placeholder="Pays (texte exact)" />
            <input className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2" type="number" min={0} value={minVictims} onChange={e=>setMinVictims(Number(e.target.value))} placeholder="Victimes min" />
            <div className="flex gap-2">
              <button onClick={applyFilters} className="flex-1 relative inline-flex items-center justify-center px-4 py-2 rounded-xl font-medium">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500 opacity-90" />
                <span className="relative">Appliquer</span>
              </button>
              <button onClick={()=>{setYear("");setCountry("");setMinVictims(0);}} className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10">Effacer</button>
            </div>
          </div>
        </section>

        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Kpi label="Événements" value={loading?"…":fmt.format(kpis.total)} sub={<Spark series={sparkSeries} />} />
          <Kpi label="Victimes" value={loading?"…":fmt.format(kpis.deaths)} />
          <Kpi label="Pays touchés" value={loading?"…":fmt.format(kpis.countries)} />
          <Kpi label="Groupes" value={loading?"…":fmt.format(kpis.groups)} />
        </section>

        {/* Map + Bars */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <h2 className="mb-3 text-sm uppercase tracking-wider text-white/70">Carte (échantillon optimisé)</h2>
            <CanvasMap points={points} />
            <div className="mt-2 text-xs text-white/60">{fmt.format(points.length)} points affichés (limités pour les perfs)</div>
          </div>
          <div>
            <h2 className="mb-3 text-sm uppercase tracking-wider text-white/70">Événements par année</h2>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
              <YearBars counts={perYear} />
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">{error}</div>
        )}
      </main>
    </div>
  );
}
