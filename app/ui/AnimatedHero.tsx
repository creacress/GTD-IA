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
      className="flex flex-col items-center justify-center h-full text-center px-4 z-10"
    >
      <NeonTitle as="h1" className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">GTD Visualizer</NeonTitle>
      <NeonDivider />
      <NeonTitle as="h2" className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">Plateforme de visualisation des données du Global Terrorism Database.</NeonTitle>
      <NeonDivider />
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/map" aria-label="Accéder à la carte interactive">
          <span className="px-5 py-2 bg-red-700 hover:bg-red-800 rounded-full text-white font-semibold uppercase tracking-wide text-sm focus:outline-none focus:ring-4 focus:ring-white">
            Carte Interactive
          </span>
        </Link>
        <Link href="/timeline" aria-label="Accéder à la chronologie des attentats">
          <span className="px-5 py-2 bg-blue-700 hover:bg-blue-800 rounded-full text-white font-semibold uppercase tracking-wide text-sm focus:outline-none focus:ring-4 focus:ring-white">
            Chronologie
          </span>
        </Link>
        <Link href="/search" aria-label="Accéder à la recherche d'événements">
          <span className="px-5 py-2 bg-gray-700 hover:bg-gray-800 rounded-full text-white font-semibold uppercase tracking-wide text-sm focus:outline-none focus:ring-4 focus:ring-white">
            Rechercher
          </span>
        </Link>
      </div>
      <NeonDivider />

      <div className="mt-12 max-w-3xl text-center text-gray-200">
        <NeonTitle as="h3" className="text-2xl sm:text-3xl font-bold mb-4">
          Pourquoi ce projet ?
        </NeonTitle>
        <p className="mb-6 text-lg text-white/80 leading-relaxed">
          Ce visualiseur d'attentats permet d'analyser les tendances et configurations liées au terrorisme à l’échelle mondiale. Il s’appuie sur la base GTD et des algorithmes d’intelligence artificielle.
        </p>
        <NeonDivider />
        <Link href="/about" aria-label="En savoir plus sur le projet">
          <span className="px-4 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition focus:outline-none focus:ring-4 focus:ring-white">
            En savoir plus
          </span>
        </Link>
      </div>
    </motion.div>
  );
}