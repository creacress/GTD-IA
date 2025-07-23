"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 bg-black/80 text-white px-4 py-3 shadow-md backdrop-blur min-h-[60px]">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="text-lg font-extrabold tracking-widest uppercase">
          GTD
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-6 text-sm font-semibold">
          <Link href="/map" className="hover:text-cyan-400 transition">Carte</Link>
          <Link href="/timeline" className="hover:text-cyan-400 transition">Chronologie</Link>
          <Link href="/search" className="hover:text-cyan-400 transition">Données</Link>
          <Link href="/about" className="hover:text-cyan-400 transition">À propos</Link>
        </nav>

        {/* Burger Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center z-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <div className="w-6 h-0.5 bg-white mb-1"></div>
          <div className="w-6 h-0.5 bg-white mb-1"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black/60 z-30" onClick={() => setIsOpen(false)} />}

      <div
        className={`md:hidden fixed top-0 right-0 w-3/4 h-full bg-black/90 flex flex-col justify-center items-center gap-6 text-lg font-semibold z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Link href="/map" className="hover:text-cyan-400" onClick={() => setIsOpen(false)}>Carte</Link>
        <Link href="/timeline" className="hover:text-cyan-400" onClick={() => setIsOpen(false)}>Chronologie</Link>
        <Link href="/search" className="hover:text-cyan-400" onClick={() => setIsOpen(false)}>Données</Link>
        <Link href="/about" className="hover:text-cyan-400" onClick={() => setIsOpen(false)}>À propos</Link>
      </div>
    </header>
  );
}