// app/ui/AnimatedHero.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import NeonTitle from "./NeonTitle";
import NeonDivider from "./NeonDivider";

export default function AnimatedHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-full text-center px-6 sm:px-8 z-10"
    >
      {/* Hero titles with glow */}
      <NeonTitle as="h1" className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
        GTD Visualizer
      </NeonTitle>
      <NeonDivider />
      <NeonTitle as="h2" className="text-xl sm:text-2xl md:text-3xl font-medium mb-6 text-white/80">
        Plateforme de visualisation des données du Global Terrorism Database
      </NeonTitle>

      {/* CTA buttons with glassmorphism */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/map" aria-label="Accéder à la carte interactive">
          <span className="relative inline-flex items-center px-5 py-2 rounded-xl font-semibold text-sm uppercase tracking-wide overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity rounded-xl" />
            <span className="relative text-white">Carte Interactive</span>
          </span>
        </Link>

        <Link href="/terror" aria-label="Accéder à la veille terrorisme">
          <span className="relative inline-flex items-center px-5 py-2 rounded-xl font-semibold text-sm uppercase tracking-wide overflow-hidden border border-white/15 bg-white/5 backdrop-blur-md hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
            <span className="relative text-white">Veille Terrorisme</span>
          </span>
        </Link>

        <Link href="/timeline" aria-label="Accéder à la chronologie des attentats">
          <span className="relative inline-flex items-center px-5 py-2 rounded-xl font-semibold text-sm uppercase tracking-wide overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70">
            <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-80 transition-opacity rounded-xl" />
            <span className="relative text-white">Chronologie</span>
          </span>
        </Link>

        <Link href="/search" aria-label="Accéder à la recherche d'événements">
          <span className="relative inline-flex items-center px-5 py-2 rounded-xl font-semibold text-sm uppercase tracking-wide overflow-hidden border border-white/15 bg-white/5 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
            <span className="relative text-white">Rechercher</span>
          </span>
        </Link>
      </div>

      <NeonDivider />

      {/* Project description with glow */}
      <div className="mt-12 max-w-3xl text-center text-gray-200">
        <NeonTitle as="h3" className="text-2xl sm:text-3xl font-bold mb-4">
          Pourquoi ce projet ?
        </NeonTitle>
        <p className="mb-6 text-lg text-white/80 leading-relaxed">
          Ce visualiseur d'attentats permet d'analyser les tendances et configurations liées au terrorisme à l’échelle mondiale. Il s’appuie sur la base GTD et des algorithmes d’intelligence artificielle.
        </p>
        <NeonDivider />
        <Link href="/about" aria-label="En savoir plus sur le projet">
          <span className="relative inline-flex items-center px-5 py-2 rounded-xl font-semibold text-sm uppercase tracking-wide overflow-hidden border border-white/15 bg-white/5 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
            <span className="relative text-white">En savoir plus</span>
          </span>
        </Link>
      </div>
    </motion.div>
  );
}