import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carte des attentats - Predint",
  description: "Visualisez les attaques à travers une carte interactive avec filtres dynamiques.",
  alternates: {
    canonical: "https://www.predint.fr/map",
  },
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}