# TrackPilot Hub — trackpilot.fit

Vitrine centrale et Hub d'accueil pour l'écosystème **TrackPilot** (`trackpilot.fit`), la suite web d'orientation, d'analyse et de préparation sportive GPS de haute précision (endurance et outdoor).

---

## 🧭 L'Écosystème TrackPilot

- **TrackPilot Cycling** (`https://cycling.trackpilot.fit`) — *En production* : Préparation de sorties vélo, analyse de traces GPX/FIT, pacing dynamique, météo de vol vectorielle point par point, détection des fontaines d’eau et cibles glucidiques.
- **TrackPilot Running** (`https://running.trackpilot.fit`) — *Bientôt disponible* : Allure ajustée au dénivelé (GAP), simulation de barrières horaires trail et gestion des réserves énergétiques.
- **TrackPilot Trekking** (`https://trekking.trackpilot.fit`) — *En développement* : Randonnée au long cours, profils d'élévation, gestion de l'autonomie et cartographie hors-piste.

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

# Build de production
npm run build

# Prévisualisation du build de production
npm run preview
```

---

## 🌐 Déploiement sur Firebase Hosting

Le projet est pré-configuré avec `firebase.json` pour déployer le dossier `dist/` sur le domaine racine `trackpilot.fit` :

```bash
# Connexion Firebase (si nécessaire)
npx firebase login

# Déploiement sur l'hébergement
npx firebase deploy --only hosting
```
