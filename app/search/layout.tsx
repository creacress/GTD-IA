

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recherche GTD - Predint",
  description: "Recherchez des attentats dans la base de données GTD avec des filtres dynamiques.",
  alternates: {
    canonical: "https://www.predint.fr/search",
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}