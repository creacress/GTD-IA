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
    <header className="relative z-20 bg-black/80 text-white px-6 py-4 flex justify-between items-center shadow-md backdrop-blur">
      <Link href="/">
        <div className="text-xl font-bold tracking-wider">GTD Visualizer</div>
      </Link>
      <nav className="space-x-6">
        <Link href="/map" className="hover:underline">Carte</Link>
        <Link href="/timeline" className="hover:underline">Chronologie</Link>
        <Link href="/search" className="hover:underline">Données</Link>
        <Link href="/about" className="hover:underline">À propos</Link>
      </nav>
    </header>
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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <Script
          id="cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="5c42e1ec4-d052-42e2-ac42-94611f88f757"
          data-blockingmode="auto"
          type="text/javascript"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          id="cookie-declaration"
          src="https://consent.cookiebot.com/5c42e1ec4-d052-42e2-ac42-94611f88f757/cd.js"
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
