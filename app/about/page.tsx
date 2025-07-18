import React from 'react';
import NeonTitle from "@/app/ui/NeonTitle";
import NeonDivider from "@/app/ui/NeonDivider";

// Page About
// Cette page présente l'application GTD Visualizer, son but, ses technologies et comment contribuer.

export default function AboutPage() {
    return (
        <main className="px-6 py-10 max-w-4xl mx-auto text-white bg-black">
            <NeonTitle as="h1" className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">À propos de GTD Visualizer</NeonTitle>

            <NeonDivider />

            <p className="mb-4">
                <strong>GTD Visualizer</strong> est une application conçue pour offrir une visualisation intuitive des modèles d’IA et de leurs processus d'entraînement.
            </p>

            <p className="mb-4">
                Inspirée par les principes de la méthode GTD (Getting Things Done), l'application permet de structurer, explorer et analyser facilement les données et modèles utilisés dans vos projets de Machine Learning.
            </p>

            <NeonTitle as="h2" className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">Notre mission</NeonTitle>

            <NeonDivider />

            <p className="mb-4">
                Offrir aux développeurs, chercheurs et curieux une interface claire, puissante et modulaire pour organiser leurs modèles IA, suivre leurs performances, et mieux comprendre leur fonctionnement.
            </p>
            <NeonTitle as="h3" className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">Technologies utilisées</NeonTitle>
            <NeonDivider />
            <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Next.js 15 (App Router)</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Prisma & SQLite</li>
                <li>Ollama / OpenAI / HuggingFace pour la gestion des modèles IA</li>
                <li>MLflow pour le suivi d’entraînement</li>
            </ul>

            <NeonTitle as="h3" className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">En savoir plus</NeonTitle>
            <NeonDivider />

            <p className="mb-4">
                Ce projet est en développement actif. Vous pouvez suivre l'évolution sur GitHub ou contribuer à l'amélioration de l’outil !
            </p>

            <a
                href="https://github.com/creacress/GTD-IA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-400 hover:underline"
            >
                Voir le repo GitHub →
            </a>
        </main>
    );
}
