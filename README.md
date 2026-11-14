# TrackPilot Hub — [trackpilot.fit](https://trackpilot.fit/)

> 🌐 **Site officiel :** [https://trackpilot.fit/](https://trackpilot.fit/)

Vitrine centrale et Hub d'accueil pour l'écosystème **TrackPilot** ([trackpilot.fit](https://trackpilot.fit/)), la suite web gratuite et sans abonnement pour transformer un simple fichier GPX ou FIT en véritable plan de route (cyclisme, gravel, trail, randonnée et marche).

---

## 🧭 L'Écosystème TrackPilot

- **TrackPilot Cycling** (`https://cycling.trackpilot.fit`) — *En production* : Préparation de sorties vélo et gravel, analyse de traces GPX/FIT, pacing dynamique, météo de vol vectorielle point par point, détection des fontaines d’eau et repères nutritionnels.
- **TrackPilot Trail** (`https://trail.trackpilot.fit`) — *Bientôt disponible* : L'outil outdoor pour le trail, la randonnée et la marche. Allure ajustée au dénivelé (GAP), estimation des temps de marche et de passage (Tobler), profils d'élévation précis, gestion de l'autonomie et points d'eau.

---

## ⚡ Stack Technique

- **Framework :** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Typage :** [TypeScript](https://www.typescriptlang.org/)
- **Style :** [Tailwind CSS](https://tailwindcss.com/) avec design tokens personnalisés (Palette 60-30-10, Dark Obsidian `#07080b`, accents émeraude néon `#00E676` / `#10b981`)
- **Icônes :** [Lucide React](https://lucide.dev/)
- **Data Craft :** Typographie tabulaire (`tabular-nums`), dédoublement hiérarchique Valeur/Unité, micro-bordures et surfaces en verre dépoli (`glass-panel`).
- **Hébergement :** Firebase Hosting (configuré dans `firebase.json`)

---

## 🚀 Démarrage Rapide

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement local
npm run dev

# Build de production (inclut le pré-rendu HTML et le JSON-LD)
npm run build

# Prévisualisation du build de production
npm run preview
```

---

## 🌐 Déploiement sur Firebase Hosting & Indexation

Le projet est pré-configuré avec `firebase.json` pour déployer le dossier `dist/` sur le domaine racine `trackpilot.fit` :

```bash
# Connexion Firebase (si nécessaire)
npx firebase login

# Build et déploiement sur l'hébergement
npm run build
npx firebase deploy --only hosting

# Notification immédiate des moteurs compatibles IndexNow (Bing, DuckDuckGo, Ecosia, Yandex…)
npm run indexnow
```
