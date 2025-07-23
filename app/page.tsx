export const metadata = {
  title: "GTD Visualizer - Analyse Terrorisme en Temps Réel",
  description: "Plateforme de visualisation intelligente du Global Terrorism Database.",
  openGraph: {
    title: "GTD Visualizer",
    description: "Explorez la base de données mondiale du terrorisme via des cartes et chronologies interactives.",
    images: ["/analyse-webcressontech.jpg"],
    type: "website",
  },
};

import AnimatedHero from "@/app/ui/AnimatedHero";

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
        poster="/fallback.jpg"
        playsInline
      >
        <source src="/istock.mp4" type="video/mp4" />
      </video>

      {/* Overlay sombre */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-5]" />

      {/* Contenu centré */}
      <AnimatedHero />
    </div>
  );
}