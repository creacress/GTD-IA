"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import FilterPanel from "./FilterPanel";
const MapClientWrapper = dynamic(() => import('./MapClientWrapper').then(m => m.default), { ssr: false });

type Filters = {
  years: number[];
  countries: string[];
  groups: string[];
};

function parseIntSafe(v: string | null, def = 0) {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : def;
}

function LoaderOverlay({ message = "Chargement de la carte…" }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative w-[min(92vw,480px)] rounded-2xl border border-white/10 bg-white/10 p-6 text-white shadow-[0_0_1px_0_rgba(255,255,255,0.25),0_20px_60px_-30px_rgba(0,0,0,0.7)]">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
          <svg className="h-9 w-9 animate-spin text-cyan-400" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <div className="text-center text-sm uppercase tracking-wider text-white/80">{message}</div>
      </div>
    </div>
  );
}

export default function MapPage() {
  const [attacks, setAttacks] = useState<any[]>([]);
  const [fullDetails, setFullDetails] = useState<any | null>(null);
  const [icon, setIcon] = useState<any>(null);

  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [groupFilter, setGroupFilter] = useState<string | null>(null);
  const [victimFilter, setVictimFilter] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");

  const [filters, setFilters] = useState<Filters>({ years: [], countries: [], groups: [] });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [loadingMap, setLoadingMap] = useState(false);

  const detailsCache = useRef<Map<string | number, any>>(new Map());
  const mapRef = useRef<any>(null);

  const resetFilters = () => {
    setYearFilter(null);
    setCountryFilter(null);
    setGroupFilter(null);
    setVictimFilter(0);
    setSearchText("");
  };

  useEffect(() => {
    fetch("/api/filters")
      .then(res => res.json())
      .then(setFilters);
  }, []);

  useEffect(() => {
    import("leaflet").then(L => {
      const customIcon = L.divIcon({
        html: '<div class="bg-red-600 w-4 h-4 rounded-full border-2 border-white shadow"></div>',
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      setIcon(customIcon);
    });
  }, []);

  useEffect(() => {
    // Quand un filtre change, on repart page 1
    setPage(1);
  }, [yearFilter, countryFilter, groupFilter, victimFilter]);

  useEffect(() => {
    setLoadingMap(true);
    const params = new URLSearchParams();
    if (yearFilter) params.set("year", String(yearFilter));
    if (countryFilter) params.set("country", countryFilter);
    if (groupFilter) params.set("group", groupFilter);
    if (victimFilter) params.set("victims", String(victimFilter));
    params.set("page", String(page));
    let baseLimit = 500;
    if (yearFilter) baseLimit = 10000;
    if (yearFilter && (groupFilter || countryFilter)) baseLimit = 2000;

    const zoom = mapRef.current?.getZoom?.();
    if (zoom && zoom > 5) {
      baseLimit += 1000;
    }

    params.set("limit", String(baseLimit));

    if (
      mapRef.current &&
      typeof mapRef.current.getBounds === "function" &&
      mapRef.current._container &&
      mapRef.current._container._leaflet_pos
    ) {
      try {
        const bounds = mapRef.current.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        params.set("bbox", `${sw.lng},${sw.lat},${ne.lng},${ne.lat}`);
      } catch (err) {
        console.warn("Erreur lors de l'accès aux bounds de la carte :", err);
      }
    }

    fetch(`/api/attacks?${params.toString()}`)
      .then(res => {
        const total = parseIntSafe(res.headers.get("x-total-count"), 0);
        if (Number.isFinite(total) && total >= 0) {
          setTotalCount(total);
          const pages = Math.max(1, Math.ceil(total / baseLimit));
          setTotalPages(pages);
          // Si la page demandée dépasse le total, on revient à la dernière page
          if (page > pages) setPage(pages);
        }
        return res.json();
      })
      .then(setAttacks)
      .catch(() => {
        setTotalCount(0);
        setAttacks([]);
        setTotalPages(1);
      })
      .finally(() => setLoadingMap(false));
  }, [yearFilter, countryFilter, groupFilter, victimFilter, page]);

  const showDetails = (eventid: string | number) => {
    const cached = detailsCache.current.get(eventid);
    if (cached) {
      setFullDetails(cached);
      return;
    }

    fetch(`/api/attacks?id=${eventid}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.eventid) {
          detailsCache.current.set(eventid, data);
          setFullDetails(data);
        } else {
          setFullDetails(null);
        }
      })
      .catch(() => setFullDetails(null));
  };

  if (!icon) {
    return <LoaderOverlay message="Initialisation de la carte…" />;
  }

  const mapKey = `${yearFilter ?? "all"}-${countryFilter ?? "all"}-${groupFilter ?? "all"}-${victimFilter}-${page}`;

  return (
    <div className="w-full h-screen relative text-white bg-[#0a0f1f]">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[0] opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]" style={{
        background:
          "radial-gradient(1200px 600px at 20% 10%, #3b82f6 15%, transparent 60%), radial-gradient(900px 500px at 80% 20%, #22d3ee 10%, transparent 55%), radial-gradient(900px 600px at 50% 80%, #a78bfa 10%, transparent 55%)",
      }} />
      <div className="absolute top-4 left-4 z-[1000] rounded-xl border border-white/10 bg-white/10 backdrop-blur-xl px-3 py-1.5 text-xs">
        {loadingMap ? "Chargement…" : `${attacks.length.toLocaleString('fr-FR')} / ${totalCount.toLocaleString('fr-FR')} événements`}
      </div>

      {attacks.length === 0 && !loadingMap && (
        <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-white/10 bg-white/10 backdrop-blur-xl px-4 py-2 text-sm">
          Aucun événement trouvé pour ces filtres.
        </div>
      )}

      <FilterPanel
        searchText={searchText}
        setSearchText={setSearchText}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
        groupFilter={groupFilter}
        setGroupFilter={setGroupFilter}
        victimFilter={victimFilter}
        setVictimFilter={setVictimFilter}
        filters={filters}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />

      <button
        onClick={() => {
          const headers = ["eventid", "iyear", "country_txt", "gname", "nkill", "summary"];
          const rows = attacks.map((a) =>
            headers.map((h) => JSON.stringify(a[h] ?? "")).join(",")
          );
          const csv = [headers.join(","), ...rows].join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "attacks_export.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        className="absolute z-[1000] bottom-4 right-4 group"
      >
        <span className="relative inline-flex items-center justify-center px-4 py-2 rounded-xl font-medium">
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500 opacity-90 transition-opacity group-hover:opacity-100" />
          <span className="relative">Exporter CSV</span>
        </span>
      </button>

      <MapClientWrapper
        key={mapKey}
        attacks={attacks}
        icon={icon}
        loadingMap={loadingMap}
        mapRef={mapRef}
        searchText={searchText}
        fullDetails={fullDetails}
        showDetails={showDetails}
      />
      {loadingMap && <LoaderOverlay message="Chargement des événements…" />}
    </div>
  );
}