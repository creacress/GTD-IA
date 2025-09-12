"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useEffect, useMemo } from "react";

// Types plus robustes
type Attack = {
  latitude: number;
  longitude: number;
  summary?: string | null;
  eventid: number | string;
  nkill?: number | string | null;
  city?: string | null;
  iyear: number | string;
  country_txt: string;
  gname?: string | null;
  attacktype1_txt?: string | null;
  weaptype1_txt?: string | null;
  targtype1_txt?: string | null;
  motive?: string | null;
};

type Props = {
  attacks: Attack[];
  icon: any;
  loadingMap: boolean;
  mapRef: React.MutableRefObject<any>;
  searchText: string;
  fullDetails: any;
  showDetails: (eventid: number | string) => void;
};

function SetMapRef({ mapRef }: { mapRef: React.MutableRefObject<any> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map]);
  return null;
}

function toNumberSafe(v: unknown, def = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

export default function MapClientWrapper({
  attacks,
  icon,
  loadingMap,
  mapRef,
  searchText,
  fullDetails,
  showDetails,
}: Props) {
  // Fix hot-reload container duplication
  useEffect(() => {
    const container = document.getElementById("leaflet-map");
    if (container && (container as any)._leaflet_id) {
      // @ts-ignore
      container._leaflet_id = null;
    }
  }, []);

  const filtered = useMemo(() => {
    if (!searchText) return attacks;
    const q = searchText.toLowerCase();
    return attacks.filter(
      (a) => (a.summary || "").toLowerCase().includes(q) || (a.city || "").toLowerCase().includes(q)
    );
  }, [attacks, searchText]);

  return (
    <MapContainer
      id="leaflet-map"
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom
      className="h-full w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
    >
      {/* Tiles OSM (stables + attribution implicite via leaflet) */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Overlay de style subtil pour look futuriste */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-50 [mask-image:radial-gradient(60%_50%_at_50%_40%,black,transparent)]"
        style={{
          background:
            "radial-gradient(900px 300px at 10% 15%, rgba(59,130,246,0.12), transparent), radial-gradient(900px 300px at 90% 20%, rgba(34,211,238,0.10), transparent)",
        }}
      />

      <SetMapRef mapRef={mapRef} />

      {icon && (
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={(z: number) => (z < 3 ? 80 : z < 6 ? 60 : 40)}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom
          polygonOptions={{
            color: "#22d3ee",
            weight: 1,
            opacity: 0.6,
          }}
        >
          {filtered.map((a) => (
            <Marker key={String(a.eventid)} position={[a.latitude, a.longitude]} icon={icon}>
              <Popup>
                <div className="text-xs sm:text-sm space-y-2 min-w-[220px]">
                  <header className="flex items-center justify-between">
                    <h3 className="font-bold bg-gradient-to-b from-black to-slate-700 bg-clip-text text-transparent">
                      {a.country_txt}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] border border-sky-400/30 bg-sky-400/10 text-sky-200">
                      {a.iyear}
                    </span>
                  </header>

                  {(a.city || a.attacktype1_txt) && (
                    <p className="text-slate-700"><span className="text-slate-500">Lieu :</span> {(a.city || "—").toString()}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-emerald-900">
                      <div className="text-[10px] uppercase tracking-wide opacity-70">Victimes</div>
                      <div className="text-sm font-semibold">{toNumberSafe(a.nkill)}</div>
                    </div>
                    <div className="rounded-lg border border-violet-400/20 bg-violet-400/10 px-2 py-1">
                      <div className="text-[10px] uppercase tracking-wide opacity-70">Type</div>
                      <div className="text-sm font-medium text-violet-900">{a.attacktype1_txt || "—"}</div>
                    </div>
                  </div>

                  {a.summary && (
                    <p className="text-slate-700 line-clamp-3">
                      <span className="text-slate-500">Résumé :</span> {a.summary}
                    </p>
                  )}

                  <button
                    onClick={() => showDetails(a.eventid)}
                    className="relative inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-semibold"
                  >
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500 opacity-90" />
                    <span className="relative text-white">+ de détails</span>
                  </button>

                  {fullDetails?.eventid === a.eventid && (
                    <div className="mt-2 rounded-xl border border-white/20 bg-white/50 p-2 text-[11px] text-slate-800 shadow-inner">
                      <p><span className="font-medium">Groupe :</span> {fullDetails.gname || "—"}</p>
                      <p><span className="font-medium">Arme :</span> {fullDetails.weaptype1_txt || "—"}</p>
                      <p><span className="font-medium">Cible :</span> {fullDetails.targtype1_txt || "—"}</p>
                      <p><span className="font-medium">Motif :</span> {fullDetails.motive || "—"}</p>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      )}

      {loadingMap && (
        <div className="absolute inset-0 flex items-center justify-center z-[9999] pointer-events-none">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/70 px-4 py-2 backdrop-blur-xl shadow-lg">
            <svg className="h-5 w-5 animate-spin text-cyan-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-medium text-slate-800">Chargement des données…</span>
          </div>
        </div>
      )}
    </MapContainer>
  );
}