"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import FilterPanel from "./FilterPanel";

type Filters = {
  years: number[];
  countries: string[];
  groups: string[];
};

// Imports dynamiques SSR-safe
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });
const MarkerClusterGroup = dynamic(() => import("react-leaflet-cluster"), { ssr: false });

const MapClientWrapper = dynamic(() => import('./MapClientWrapper'), { ssr: false });

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

  const [loadingMap, setLoadingMap] = useState(false);

  const detailsCache = useRef<Map<number, any>>(new Map());
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
        setTotalPages(parseInt(res.headers.get("x-total-pages") || "1", 10));
        return res.json();
      })
      .then(setAttacks)
      .catch(() => {
        setAttacks([]);
        setTotalPages(1);
      })
      .finally(() => setLoadingMap(false));
  }, [yearFilter, countryFilter, groupFilter, victimFilter, page]);

  const showDetails = (eventid: number) => {
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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
        <span className="ml-4 text-lg">Chargement de la carte...</span>
      </div>
    );
  }

  const mapKey = `${yearFilter ?? "all"}-${countryFilter ?? "all"}-${groupFilter ?? "all"}-${victimFilter}-${page}`;

  return (
    <div className="w-full h-screen relative">

      {attacks.length === 0 && !loadingMap && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white text-black px-4 py-2 rounded shadow text-sm">
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
        className="absolute z-[1000] bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white text-sm shadow"
      >
        Exporter CSV
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
    </div>
  );
}