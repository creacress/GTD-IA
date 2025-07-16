# GTD Visualizer

**GTD Visualizer** est une application web développée avec Next.js permettant de visualiser et interagir avec les données du **Global Terrorism Database (GTD)**.

## 🌐 À propos du projet

Ce projet a pour but de rendre accessible et exploitable la base de données du **Global Terrorism Database**, en proposant une interface intuitive de visualisation par carte, chronologie et filtres.

La base de données GTD contient des informations détaillées sur plus de 200 000 incidents terroristes survenus dans le monde depuis 1970.  
👉 Données disponibles sur le site officiel :  
🔗 https://www.start.umd.edu/gtd/

⚠️ Les données présentées sont à but informatif uniquement. Le projet ne soutient ni ne promeut aucun acte ou idéologie terroriste.

## 🚀 Fonctionnalités

- Visualisation des attentats sur une carte interactive
- Timeline filtrable par groupe, pays ou nombre de victimes
- Exploration des détails par événements
- Interface claire, rapide et minimaliste

## 🧑‍💻 Technologies utilisées

- **Next.js 15** avec App Router
- **React** + **TypeScript**
- **Tailwind CSS**
- **Prisma** + **SQLite** pour l’accès aux données
- **Leaflet** pour la carte
- **Chart.js** pour la visualisation temporelle (à venir)

## ▶️ Démarrage rapide

1. Clonez ce repo :
   ```bash
   git clone https://github.com/webcressontech/gtd-visualizer.git
   cd gtd-visualizer
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Données

Les données GTD utilisées proviennent de l’archive publique distribuée par le projet START :  
https://www.start.umd.edu/gtd/

Le fichier `.csv` est converti en base SQLite via un script de transformation (à venir dans `scripts/`).

## 🔭 Roadmap

- 🔍 Filtres avancés par type d’attaque, cible ou revendication
- 📈 Ajout de graphiques statistiques dynamiques
- 💾 Intégration en temps réel de nouvelles données
- 👥 Comptes utilisateurs (bookmarks, analyses, export)

## 🤝 Contribuer

Toute contribution est la bienvenue !

- Forkez ce repo
- Créez une branche : `git checkout -b ma-feature`
- Poussez votre branche : `git push origin ma-feature`
- Ouvrez une Pull Request

## 📄 Licence

Ce projet est open-source sous licence MIT.  
Les données GTD sont la propriété de START, University of Maryland, et sont utilisées selon leurs conditions d’usage.

---
**Projet développé par [WebCressonTech](https://github.com/webcressontech)** – 2025
