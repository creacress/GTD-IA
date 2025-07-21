"use client";
import Link from "next/link";
import NeonTitle from "@/app/ui/NeonTitle";
import NeonDivider from "@/app/ui/NeonDivider";

// Page d'accueil du projet GTD Visualizer
// Présente le projet, les fonctionnalités et les liens vers les pages principales

export default function Home() {
  return (
    <div className="relative w-full h-screen text-white font-sans overflow-hidden">
      {/* Vidéo de fond FIXE */}
      <video
        className="fixed top-0 left-0 w-full h-full object-cover z-[-10]"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/istock.mp4" type="video/mp4" />
      </video>

      {/* Overlay sombre */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-5]" />

      {/* Contenu centré */}
      <div className="flex flex-col items-center justify-center h-full text-center px-4 z-10 animate-fade-in">
        <NeonTitle as="h1" className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">GTD Visualizer</NeonTitle>
        <NeonDivider />
        <NeonTitle as="h2" className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">Plateforme de visualisation des données du Global Terrorism Database.
        </NeonTitle>
        <NeonDivider />
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/map">
            <span className="px-5 py-2 bg-red-700 hover:bg-red-800 rounded-full text-white font-semibold uppercase tracking-wide text-sm">
              Carte Interactive
            </span>
          </Link>
          <Link href="/timeline">
            <span className="px-5 py-2 bg-blue-700 hover:bg-blue-800 rounded-full text-white font-semibold uppercase tracking-wide text-sm">
              Chronologie
            </span>
          </Link>
          <Link href="/search">
            <span className="px-5 py-2 bg-gray-700 hover:bg-gray-800 rounded-full text-white font-semibold uppercase tracking-wide text-sm">
              Rechercher
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}