"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useEffect } from "react";

type Attack = {
  latitude: number;
  longitude: number;
  summary: string;
  eventid: number;
  nkill: number;
  city?: string;
  iyear: number;
  country_txt: string;
  gname: string;
  attacktype1_txt: string;
  weaptype1_txt: string;
  targtype1_txt: string;
  motive?: string;
};

type Props = {
  attacks: Attack[];
  icon: any;
  loadingMap: boolean;
  mapRef: React.MutableRefObject<any>;
  searchText: string;
  fullDetails: any;
  showDetails: (eventid: number) => void;
};

function SetMapRef({ mapRef }: { mapRef: React.MutableRefObject<any> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map]);
  return null;
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
  useEffect(() => {
    const container = document.getElementById("leaflet-map");
    if (container && (container as any)._leaflet_id) {
      // @ts-ignore
      container._leaflet_id = null;
    }
  }, []);

  return (
    <MapContainer
      id="leaflet-map"
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <SetMapRef mapRef={mapRef} />

      {icon && (
        <MarkerClusterGroup chunkedLoading>
          {attacks
            .filter(
              (a) =>
                !searchText ||
                (a.summary &&
                  a.summary.toLowerCase().includes(searchText.toLowerCase()))
            )
            .map((a) => (
              <Marker
                key={a.eventid}
                position={[a.latitude, a.longitude]}
                icon={icon}
              >
                <Popup>
                  <div className="text-sm space-y-1">
                    <p className="font-bold text-blue-700">{a.country_txt}</p>
                    <p>
                      {a.city ? `${a.city} - ` : ""}
                      {a.iyear}
                    </p>
                    <p className="text-red-600">Victimes : {a.nkill}</p>
                    <button
                      onClick={() => showDetails(a.eventid)}
                      className="text-xs mt-1 underline text-blue-500 hover:text-blue-700"
                    >
                      + de détails
                    </button>
                    {fullDetails?.eventid === a.eventid && (
                      <div className="mt-2 text-left text-xs bg-gray-100 p-2 rounded shadow-inner space-y-1">
                        <p>
                          <span className="font-medium">Résumé:</span>{" "}
                          {fullDetails.summary || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Groupe:</span>{" "}
                          {fullDetails.gname}
                        </p>
                        <p>
                          <span className="font-medium">Type d'attaque:</span>{" "}
                          {fullDetails.attacktype1_txt}
                        </p>
                        <p>
                          <span className="font-medium">Arme:</span>{" "}
                          {fullDetails.weaptype1_txt}
                        </p>
                        <p>
                          <span className="font-medium">Cible:</span>{" "}
                          {fullDetails.targtype1_txt}
                        </p>
                        <p>
                          <span className="font-medium">Motif:</span>{" "}
                          {fullDetails.motive || "N/A"}
                        </p>
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
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500" />
            <span className="text-sm text-gray-700">Chargement des données...</span>
          </div>
        </div>
      )}
    </MapContainer>
  );
}