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
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Event = {
  eventid: number;
  iyear: number;
  country_txt: string;
  gname: string;
  nkill: number;
};

export default function TimelinePage() {
  const [years, setYears] = useState<number[]>([]);
  const [counts, setCounts] = useState<{ [year: number]: number }>({});
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [minKills, setMinKills] = useState<number>(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/filters")
      .then(res => res.json())
      .then(async (data) => {
        setYears(data.years);
        console.log("Années récupérées:", data.years);
        const yearCounts: { [key: number]: number } = {};
  
        await Promise.all(
          data.years.map(async (year: number) => {
            const res = await fetch(`/api/attacks?year=${year}&limit=1`);
            const count = res.headers.get("x-total-count") || "0";
            yearCounts[year] = parseInt(count, 10);
          })
        );
  
        setCounts(yearCounts);
        console.log("Nombre d'attentats par année:", yearCounts);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetch(`/api/attacks?year=${selectedYear}&limit=1000`)
        .then(res => res.json())
        .then(setEvents);
    }
  }, [selectedYear]);

  const chartData = useMemo(() => {
    if (years.length === 0 || Object.keys(counts).length === 0) return null;

    return {
      labels: years,
      datasets: [
        {
          label: "Nombre d'attentats",
          data: years.map(y => counts[y] || 0),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    };
  }, [years, counts]);

  const options = {
    onClick: (_: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const year = years[index];
        setSelectedYear(year);
      }
    },
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  const filteredEvents = events.filter(e =>
    e.gname.toLowerCase().includes(groupFilter.toLowerCase()) &&
    e.country_txt.toLowerCase().includes(countryFilter.toLowerCase()) &&
    (e.nkill ?? 0) >= minKills
  );

  const modal = selectedYear ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-5xl w-full mt-10 mb-10 mx-auto space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-600">Attentats en {selectedYear}</h2>
          <button
            onClick={() => setSelectedYear(null)}
            className="text-red-500 font-semibold text-sm"
          >
            Fermer ✕
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((e) => (
            <div
              key={e.eventid}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <p className="text-sm text-white/80"><strong>Pays :</strong> {e.country_txt}</p>
              <p className="text-sm text-white/80"><strong>Groupe :</strong> {e.gname}</p>
              <p className="text-sm text-white/80"><strong>Morts :</strong> {e.nkill ?? 0}</p>
            </div>
          ))}
        </div>
        {filteredEvents.length === 0 && (
          <p className="text-center text-white/80 text-sm mt-4">
            Aucun attentat trouvé pour ces filtres.
          </p>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="p-8 space-y-6 min-h-screen overflow-y-scroll">
      <h1 className="text-xl font-bold text-white">Chronologie des attentats</h1>
      
      <div className="flex items-center space-x-4">
        <label className="text-sm text-white font-medium">Filtrer par groupe :</label>
        <input
          type="text"
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          placeholder="ex: Taliban"
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        />
        <button
          onClick={() => setGroupFilter("")}
          className="text-blue-400 text-sm underline"
        >
          Réinitialiser
        </button>
      </div>
      
      <div className="flex items-center space-x-4 mt-2">
        <label className="text-sm text-white font-medium">Filtrer par pays :</label>
        <input
          type="text"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          placeholder="ex: Iraq"
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        />
        <label className="text-sm text-white font-medium">Nombre minimum de morts :</label>
        <input
          type="number"
          value={minKills}
          onChange={(e) => setMinKills(parseInt(e.target.value || "0", 10))}
          className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
        />
      </div>
      
      {loading && (
        <div className="text-center py-4">
          <span className="text-white/80 animate-pulse">Chargement des données...</span>
        </div>
      )}
      
      {chartData && (
        <div className="h-[400px]">
          <Bar data={chartData} options={options} />
        </div>
      )}
      
      {modal}
      
      {selectedYear && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-600 transition"
          >
            ↑ Haut
          </button>
        </div>
      )}
    </div>
  );
}