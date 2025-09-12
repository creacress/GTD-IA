"use client";

import React, { useState, useEffect } from "react";
import NeonTitle from "@/app/ui/NeonTitle";
import NeonDivider from "@/app/ui/NeonDivider";
import Link from "next/link";

// Page de recherche modernisée (neo-glass, gradients, loader, carousel amélioré)

type SearchResult = {
  eventid: string;
  country_txt?: string;
  iyear?: number | string;
  attacktype1_txt?: string;
  weaptype1_txt?: string;
  nkill?: number | string | null;
  nwound?: number | string | null;
};

const SearchPage = () => {
  const [filters, setFilters] = useState({
    country: "",
    year: "",
    attackType: "",
    weaponType: "",
    nkill: "",
    nwound: "",
  });

  const [options, setOptions] = useState<{
    countries: string[];
    attackTypes: string[];
    weaponTypes: string[];
    years: number[];
  }>({ countries: [], attackTypes: [], weaponTypes: [], years: [] });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carousel auto-scroll (pause on hover)
  const carouselRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (results.length === 0) return;
    const container = carouselRef.current;
    if (!container) return;
    let frameId: number;
    let isPaused = false;
    const scroll = () => {
      if (!container) return;
      if (!isPaused) {
        container.scrollLeft += 1;
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0;
        }
      }
      frameId = requestAnimationFrame(scroll);
    };
    const pause = () => {
      isPaused = true;
    };
    const resume = () => {
      isPaused = false;
    };
    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);
    frameId = requestAnimationFrame(scroll);
    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
    };
  }, [results]);

  // Fetch select options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setError(null);
        const res = await fetch("/api/search/options");
        if (!res.ok) throw new Error("Impossible de charger les options");
        const data = await res.json();
        const cleanYears = Array.from(new Set(data.years as number[]))
          .filter((y): y is number => typeof y === "number" && !isNaN(y))
          .sort((a, b) => a - b);
        setOptions({
          countries: data.countries || [],
          attackTypes: data.attackTypes || [],
          weaponTypes: data.weaponTypes || [],
          years: cleanYears,
        });
      } catch (e: any) {
        setError(e.message);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (filters.country) query.append("country", filters.country);
      if (filters.year) query.append("year", filters.year);
      if (filters.attackType) query.append("attackType", filters.attackType);
      if (filters.weaponType) query.append("weaponType", filters.weaponType);
      if (filters.nkill) query.append("nkill", filters.nkill);
      if (filters.nwound) query.append("nwound", filters.nwound);
      const res = await fetch(`/api/search?${query.toString()}`);
      if (!res.ok) throw new Error("Recherche impossible");
      const data = (await res.json()) as SearchResult[];
      setResults(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFilters({ country: "", year: "", attackType: "", weaponType: "", nkill: "", nwound: "" });
    setResults([]);
  };

  // Allow ENTER to search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filters]);

  return (
    <div className="relative min-h-screen text-white bg-[#0a0f1f]">
      {/* gradient bg accents */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[-1] opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]"
        style={{
          background:
            "radial-gradient(1200px 600px at 20% 10%, #3b82f6 15%, transparent 60%), radial-gradient(900px 500px at 80% 20%, #22d3ee 10%, transparent 55%), radial-gradient(900px 600px at 50% 80%, #a78bfa 10%, transparent 55%)",
        }}
      />

      <main className="mx-auto max-w-7xl px-6 sm:px-10 py-10 md:py-14">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-cyan-200 bg-clip-text text-transparent">Recherche GTD</h1>
          <Link href="/" className="text-sm underline text-white/70 hover:text-white">Accueil</Link>
        </header>

        {/* FILTRES */}
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sm:p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <select name="country" value={filters.country} onChange={handleChange} className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2">
              <option value="">Pays (tous)</option>
              {options.countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select name="year" value={filters.year} onChange={handleChange} className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2">
              <option value="">Année (toutes)</option>
              {options.years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select name="attackType" value={filters.attackType} onChange={handleChange} className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2">
              <option value="">Type d'attaque</option>
              {options.attackTypes.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <select name="weaponType" value={filters.weaponType} onChange={handleChange} className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2">
              <option value="">Type d'arme</option>
              {options.weaponTypes.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            <input name="nkill" value={filters.nkill} onChange={handleChange} type="number" min={0} placeholder="min tués" className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2" />
            <input name="nwound" value={filters.nwound} onChange={handleChange} type="number" min={0} placeholder="min blessés" className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2" />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleSearch} className="relative inline-flex items-center justify-center px-5 py-2 rounded-xl font-medium">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500 opacity-90" />
              <span className="relative">Rechercher</span>
            </button>
            <button onClick={reset} className="px-5 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10">Effacer</button>
          </div>
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </section>

        {/* RESULTATS */}
        <section>
          <NeonTitle as="h2" className="text-2xl sm:text-3xl font-bold mb-2">Résultats</NeonTitle>
          <NeonDivider />

          {loading ? (
            // skeleton loader
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 animate-pulse">
                  <div className="h-5 w-40 bg-white/10 rounded mb-3" />
                  <div className="h-4 w-56 bg-white/10 rounded mb-2" />
                  <div className="h-4 w-44 bg-white/10 rounded mb-2" />
                  <div className="h-4 w-64 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="mt-6 text-white/70 italic">Aucun résultat</p>
          ) : (
            <div>
              <div className="mb-3 text-sm text-white/70">{results.length.toLocaleString("fr-FR")} résultats</div>
              <div
                ref={carouselRef}
                className="overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar"
                style={{ scrollbarWidth: "none" }}
              >
                <div className="flex space-x-4 pb-4">
                  {results.map((res) => {
                    const killed = Number(res.nkill);
                    const wounded = Number(res.nwound);
                    const kills = Number.isFinite(killed) ? killed : 0;
                    const wounds = Number.isFinite(wounded) ? wounded : 0;
                    return (
                      <article
                        key={res.eventid}
                        className="min-w-[320px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 hover:shadow-[0_0_1px_0_rgba(255,255,255,0.25),0_20px_60px_-30px_rgba(0,0,0,0.7)] transition-shadow"
                      >
                        <header className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-base sm:text-lg bg-gradient-to-b from-white to-cyan-200 bg-clip-text text-transparent">
                            {res.country_txt ?? "—"} — {res.iyear ?? "—"}
                          </h3>
                          <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/10">
                            {res.attacktype1_txt || "?"}
                          </span>
                        </header>
                        <div className="text-white/85 text-sm">
                          <p className="mb-1"><span className="text-white/60">Arme :</span> {res.weaptype1_txt ?? "—"}</p>
                          <p><span className="text-white/60">Victimes :</span> {kills} tués, {wounds} blessés</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SearchPage;