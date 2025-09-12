
export const metadata = {
  title: "GTD Visualizer - Analyse Terrorisme en Temps Réel",
  description: "Plateforme de visualisation intelligente du Global Terrorism Database.",
  openGraph: {
    title: "GTD Visualizer",
    description:
      "Explorez la base de données mondiale du terrorisme via des cartes et chronologies interactives.",
    images: ["/analyse-webcressontech.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTD Visualizer",
    description:
      "Exploration interactive du Global Terrorism Database avec cartes et timelines.",
    images: ["/analyse-webcressontech.jpg"],
  },
  themeColor: "#0B1021",
};

import AnimatedHero from "@/app/ui/AnimatedHero";
import Link from "next/link";

// Page d'accueil du projet GTD Visualizer
// Style modernisé: glassmorphism, gradients dynamiques, grille SVG, focus visible, et CTA.

export default function Home() {
  return (
    <div className="relative w-full min-h-screen text-white font-sans overflow-hidden bg-[#0a0f1f]">
      {/* Vidéo de fond FIXE (désactivée pour les utilisateurs qui préfèrent moins d'animations) */}
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

      {/* Gradient mesh subtil */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[-15] opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]"
        style={{
          background:
            "radial-gradient(1200px 600px at 20% 10%, #3b82f6 15%, transparent 60%), radial-gradient(900px 500px at 80% 20%, #22d3ee 10%, transparent 55%), radial-gradient(900px 600px at 50% 80%, #a78bfa 10%, transparent 55%)",
        }}
      />

      {/* Grille SVG futuriste */}
      <svg
        aria-hidden
        className="fixed inset-0 z-[-10] opacity-25 mix-blend-screen"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* grain léger pour le relief */}
      <div
        aria-hidden
        className="fixed inset-0 z-[-5] opacity-20"
        style={{ backgroundImage: "url('/noise.png')", backgroundSize: "auto 300px" }}
      />

      {/* Overlay sombre + blur global */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[-1]" />

      {/* Carte centrale en glassmorphism */}
      <main className="relative mx-auto max-w-6xl px-6 sm:px-10 py-24 md:py-28">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_1px_0_rgba(255,255,255,0.2),0_20px_60px_-30px_rgba(0,0,0,0.6)] p-6 sm:p-10">
          {/* Halo animé derrière le titre */}
          <div
            aria-hidden
            className="absolute -inset-x-10 -top-24 h-56 blur-3xl opacity-70"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, #22d3ee, #60a5fa, #a78bfa, #22d3ee)",
              maskImage: "radial-gradient(60% 50% at 50% 50%, black 40%, transparent 70%)",
            }}
          />

          {/* Contenu du hero existant (réutilisé pour le texte/CTA) */}
          <section className="relative">
            <header className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
                GTD Visualizer
              </h1>
              <p className="mt-4 text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
                Analyse en temps réel, exploration géospatiale et timelines interactives du Global Terrorism Database.
              </p>
            </header>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center px-5 py-3 rounded-xl font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400/70 ring-offset-[#0a0f1f]"
              >
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500 opacity-80 transition-opacity group-hover:opacity-100" />
                <span className="relative">Ouvrir le tableau de bord</span>
              </Link>

              <Link
                href="/search"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/40 ring-offset-[#0a0f1f]"
              >
                Explorer les données
              </Link>
            </div>

            {/* Badges / stats rapides */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs sm:text-sm">
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Cartes dynamiques</div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Détection d'anomalies</div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Filtrage avancé</div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Export & API</div>
            </div>

            {/* Slot pour votre composant animé existant */}
            <div className="mt-10">
              <AnimatedHero />
            </div>
          </section>
        </div>
      </main>

      {/* Accent bottom glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-[-30%] h-[40vh] opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(60%_60%_at_50%_10%, rgba(34,211,238,0.35), transparent 70%), radial-gradient(60%_60%_at_50%_40%, rgba(99,102,241,0.25), transparent 70%)",
        }}
      />
    </div>
  );
}