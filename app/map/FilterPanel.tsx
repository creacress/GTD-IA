"use client";
import React from "react";

type Props = {
  searchText: string;
  setSearchText: (val: string) => void;
  yearFilter: number | null;
  setYearFilter: (val: number | null) => void;
  countryFilter: string | null;
  setCountryFilter: (val: string | null) => void;
  groupFilter: string | null;
  setGroupFilter: (val: string | null) => void;
  victimFilter: number;
  setVictimFilter: (val: number) => void;
  filters: {
    years: number[];
    countries: string[];
    groups: string[];
  };
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function FilterPanel({
  searchText,
  setSearchText,
  yearFilter,
  setYearFilter,
  countryFilter,
  setCountryFilter,
  groupFilter,
  setGroupFilter,
  victimFilter,
  setVictimFilter,
  filters,
  page,
  totalPages,
  setPage,
}: Props) {
  return (
    <div
      className="absolute z-[1000] bg-white bg-opacity-90 text-black p-4 rounded-lg top-4 left-4 shadow-lg space-y-3 max-w-[300px]"
      role="region"
      aria-label="Filtres de la carte"
    >
      <div className="text-sm text-gray-800 font-medium">
        Filtres de visualisation
      </div>

      <label htmlFor="search-text" className="sr-only">Recherche résumé</label>
      <input
        id="search-text"
        type="text"
        placeholder="Recherche résumé..."
        className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <label htmlFor="year-select" className="sr-only">Filtrer par année</label>
      <select
        id="year-select"
        className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setYearFilter(Number(e.target.value) || null)}
        value={yearFilter ?? ""}
      >
        <option value="">Filtrer par année</option>
        {filters.years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <label htmlFor="country-select" className="sr-only">Filtrer par pays</label>
      <select
        id="country-select"
        className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setCountryFilter(e.target.value || null)}
        value={countryFilter ?? ""}
      >
        <option value="">Filtrer par pays</option>
        {filters.countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label htmlFor="group-select" className="sr-only">Filtrer par groupe</label>
      <select
        id="group-select"
        className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setGroupFilter(e.target.value || null)}
        value={groupFilter ?? ""}
      >
        <option value="">Filtrer par groupe</option>
        {filters.groups.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <div>
        <label htmlFor="victims" className="block text-sm font-medium text-gray-700">
          Nombre de victimes : {victimFilter}+
        </label>
        <input
          type="range"
          id="victims"
          min="0"
          max="100"
          step="1"
          value={victimFilter}
          onChange={(e) => setVictimFilter(Number(e.target.value))}
          className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between items-center text-sm pt-1">
        <button
          disabled={page <= 1}
          onClick={() => {
            setPage((p: number) => p - 1);
          }}
          className="bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
        >
          ← Page
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => {
            setPage((p: number) => p + 1);
          }}
          className="bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
        >
          Page →
        </button>
      </div>
    </div>
  );
}