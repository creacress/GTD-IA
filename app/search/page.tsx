"use client";

import React, { useState, useEffect } from 'react';
import NeonTitle from '@/app/ui/NeonTitle';
import NeonDivider from '@/app/ui/NeonDivider';

// Page de recherche
// Permet de filtrer les données GTD par pays, année, type d'attaque, type d'arme, nombre de tués et blessés.

const SearchPage = () => {
  const [filters, setFilters] = useState({
    country: '',
    year: '',
    attackType: '',
    weaponType: '',
    nkill: '',
    nwound: '',
  });

  const [options, setOptions] = useState<{
    countries: string[];
    attackTypes: string[];
    weaponTypes: string[];
    years: number[];
  }>({
    countries: [],
    attackTypes: [],
    weaponTypes: [],
    years: []
  });

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Carousel design & auto-scroll
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

    const pause = () => { isPaused = true; };
    const resume = () => { isPaused = false; };

    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);

    frameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
    };
  }, [results]);

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await fetch('/api/search/options');
      const data = await res.json();
      // Nettoyage des années pour uniformiser et éviter doublons/problèmes de type
      const cleanYears = (Array.from(new Set(data.years as number[])))
        .filter((y): y is number => typeof y === 'number' && !isNaN(y))
        .sort((a, b) => a - b);

      setOptions({
        countries: data.countries,
        attackTypes: data.attackTypes,
        weaponTypes: data.weaponTypes,
        years: cleanYears
      });
    };

    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    const query = new URLSearchParams();

    if (filters.country) query.append('country', filters.country);
    if (filters.year) query.append('year', filters.year);
    if (filters.attackType) query.append('attackType', filters.attackType);
    if (filters.weaponType) query.append('weaponType', filters.weaponType);
    if (filters.nkill) query.append('nkill', filters.nkill);
    if (filters.nwound) query.append('nwound', filters.nwound);

    const res = await fetch(`/api/search?${query.toString()}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
    <NeonTitle as="h1" className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">Recherche dans les données GTD</NeonTitle>
        <NeonDivider />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select name="country" value={filters.country} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2">
          <option value="">Pays</option>
          {options.countries.map((c: string) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select name="year" value={filters.year} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2">
          <option value="">Année</option>
          {(options.years as number[]).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select name="attackType" value={filters.attackType} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2">
          <option value="">Type d'attaque</option>
          {options.attackTypes.map((a: string) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <select name="weaponType" value={filters.weaponType} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2">
          <option value="">Type d'arme</option>
          {options.weaponTypes.map((w: string) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Rechercher
      </button>

      <div className="mt-8">
      <NeonTitle as="h2" className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">Résultat</NeonTitle>
      <NeonDivider />
      {loading ? (
          <p className="text-gray-500 italic">Chargement...</p>
        ) : results.length === 0 ? (
          <p className="text-gray-500 italic">Aucun résultat</p>
        ) : (
          <div
            ref={carouselRef}
            className="overflow-x-auto whitespace-nowrap scroll-smooth"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex space-x-6 pb-4">
              {results.map((res) => (
                <div
                  key={res.eventid}
                  className="min-w-[320px] bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="font-bold text-lg text-blue-800 mb-2">{res.country_txt} - {res.iyear}</h3>
                  <p className="text-gray-700"><strong>Attaque :</strong> {res.attacktype1_txt}</p>
                  <p className="text-gray-700"><strong>Arme :</strong> {res.weaptype1_txt}</p>
                  <p className="text-gray-700"><strong>Victimes :</strong> {res.nkill ?? 0} tués, {res.nwound ?? 0} blessés</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;