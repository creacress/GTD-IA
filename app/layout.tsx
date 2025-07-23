import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "./component/ErrorBoundary";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GTD Visualizer",
  description: "Visualisation des données GTD - Global Terrorism Database",
  keywords: [
    "terrorisme",
    "GTD",
    "Global Terrorism Database",
    "analyse IA",
    "OSINT",
    "cartographie attentats",
    "visualisation données",
    "machine learning",
    "prévision attentats",
    "intelligence artificielle"
  ],
  authors: [{ name: "WebCressonTech", url: "https://webcresson.com" }],
  openGraph: {
    title: "GTD Visualizer",
    description: "Exploration des données du terrorisme mondial grâce à l'intelligence artificielle.",
    url: "https://gtd.webcresson.com",
    siteName: "GTD Visualizer",
    images: [
      {
        url: "/analyse-webcressontech.jpg",
        width: 1200,
        height: 630,
        alt: "Aperçu GTD Visualizer",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTD Visualizer",
    description: "Analyse IA et cartographie du terrorisme mondial via la base GTD.",
    creator: "@WebCressonTech",
    images: ["/analyse-webcressontech.jpg"],
  },
  metadataBase: new URL("https://gtd.webcresson.com"),
};

function Header() {
  return (
    <div className="relative">
      <input id="menu-toggle" type="checkbox" className="hidden peer" />
      <header className="z-30 bg-black/80 text-white px-4 py-3 flex justify-between items-center shadow-md backdrop-blur">
        <Link href="/" className="text-lg font-extrabold tracking-widest uppercase">GTD</Link>

        <label htmlFor="menu-toggle" className="block cursor-pointer md:hidden z-50">
          <div className="w-6 h-0.5 bg-white mb-1"></div>
          <div className="w-6 h-0.5 bg-white mb-1"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </label>

        <nav className="fixed top-0 right-0 w-3/4 h-full bg-black/90 text-white flex flex-col justify-center items-center gap-6 text-xl font-semibold translate-x-full peer-checked:translate-x-0 transition-transform duration-300 md:static md:translate-x-0 md:flex-row md:items-center md:justify-end md:gap-6 md:bg-transparent md:text-base md:relative z-30">
          <Link href="/map" className="hover:text-cyan-400 transition">Carte</Link>
          <Link href="/timeline" className="hover:text-cyan-400 transition">Chronologie</Link>
          <Link href="/search" className="hover:text-cyan-400 transition">Données</Link>
          <Link href="/about" className="hover:text-cyan-400 transition">À propos</Link>
        </nav>
      </header>
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative z-20 bg-black/80 text-white text-sm text-center py-4 border-t border-neutral-700 backdrop-blur">
      <p>
        Données © <a href="https://start.umd.edu/gtd" className="underline">Global Terrorism Database</a> | Projet IA by WebCressonTech —
        <a
          href="javascript:Cookiebot.show();"
          className="underline ml-1"
        >
          Gestion des cookies
        </a>
      </p>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="auto" translate="yes">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <Script
          id="cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="5c421ec4-d052-42e2-ac42-94611f88f757"
          data-blockingmode="auto"
          type="text/javascript"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
  id="CookieDeclaration"
  src="https://consent.cookiebot.com/5c421ec4-d052-42e2-ac42-94611f88f757/cd.js"
  type="text/javascript"
  strategy="afterInteractive"
/>
        <Script
          id="ga-consent"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function gtag(){dataLayer.push(arguments);}
              window.dataLayer = window.dataLayer || [];
              window.addEventListener("CookiebotOnConsentReady", function() {
                if (window.Cookiebot?.consents?.given?.g1) {
                  gtag('js', new Date());
                  gtag('config', 'G-7MK517N0RB');
                }
              });
            `,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7MK517N0RB"
          strategy="afterInteractive"
        />
        <div className="relative flex flex-col min-h-screen bg-black text-white w-full">
          <Header />
          <main className="flex-1 w-full relative z-10 overflow-auto">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
