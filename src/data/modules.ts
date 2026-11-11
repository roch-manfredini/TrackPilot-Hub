import { ModuleInfo, TechPillar } from '../types';

export const MODULES: ModuleInfo[] = [
  {
    id: 'cycling',
    title: 'TrackPilot Cycling',
    discipline: 'Cyclisme & Gravel',
    iconName: 'Bike',
    status: 'available',
    statusLabel: 'En ligne',
    tagline: 'Le préparateur de sorties et de cyclosportives haute précision.',
    description: 'Importez votre parcours GPX ou FIT et obtenez instantanément le profil complet de votre sortie : météo du vent point par point, calcul de pacing dynamique, cibles glucidiques et détection des points d’eau.',
    url: 'https://cycling.trackpilot.fit',
    highlights: [
      'Analyse temps réel de la météo et du vent relatif le long du tracé',
      'Pacing dynamique W/kg et estimation du temps selon votre FTP',
      'Plan de ravitaillement glucidique (g/h) & hydratation personnalisés',
      'Détection automatique des fontaines d’eau potable et supérettes',
      'Exportation directe sur vos compteurs Garmin, Wahoo et Karoo'
    ],
    metrics: [
      { label: 'Calcul Météo', value: 'Point par point' },
      { label: 'Précision D+', value: '± 1.5 %' },
      { label: 'Statut', value: 'Production' }
    ]
  },
  {
    id: 'running',
    title: 'TrackPilot Running',
    discipline: 'Trail & Course à pied',
    iconName: 'Footprints',
    status: 'soon',
    statusLabel: 'Bientôt',
    tagline: 'L’art du pacing GAP et de la gestion d’effort sur dénivelé.',
    description: 'Spécialement développé pour le trail-running, le marathon et les ultras. Modélisez votre allure ajustée à la pente (GAP), anticipez les barrières horaires et gérez vos transitions de ravitaillement sans défaillir.',
    url: 'https://running.trackpilot.fit',
    highlights: [
      'Allure ajustée au dénivelé (Grade Adjusted Pace - GAP) dynamique',
      'Simulateur de barrières horaires pour courses et ultra-trails',
      'Régulation de l’effort en montée vs préservation musculaire en descente',
      'Gestion prédictive des réserves de glycogène et sodium'
    ],
    metrics: [
      { label: 'Algorithme', value: 'GAP Adaptatif' },
      { label: 'Focus', value: 'Trail & Ultra' },
      { label: 'Accès', value: 'T2 2025' }
    ]
  },
  {
    id: 'trekking',
    title: 'TrackPilot Trekking',
    discipline: 'Randonnée & Bivouac',
    iconName: 'Mountain',
    status: 'dev',
    statusLabel: 'En développement',
    tagline: 'L’autonomie totale pour le long cours et les treks d’altitude.',
    description: 'Conçu pour les traversées alpines, le GR20, la Haute Route et les bivouacs en autonomie. Cartographie topographique hors-ligne, calcul de la règle de Naismith corrigée et géolocalisation des sources naturelles pérennes.',
    url: 'https://trekking.trackpilot.fit',
    highlights: [
      'Calcul du temps de marche selon la règle de Naismith et la charge du sac',
      'Cartographie IGN / Swisstopo / OpenTopoMap avec cache hors-réseau',
      'Inventaire des points d’eau de montagne, cabanes non gardées et abris',
      'Alerte orageuse géolocalisée et prévisions isothème 0°C'
    ],
    metrics: [
      { label: 'Cartographie', value: 'Multi-fonds topo' },
      { label: 'Mode', value: '100% Hors-ligne' },
      { label: 'Accès', value: 'T3 2025' }
    ]
  }
];

export const TECH_PILLARS: TechPillar[] = [
  {
    id: 'import',
    title: 'Import Direct GPX & FIT',
    subtitle: 'Garmin, Wahoo, Strava, Komoot',
    description: 'Glissez-déposez n’importe quelle trace GPX ou FIT. Notre moteur web traite instantanément les coordonnées, l’altitude et les métadonnées sans envoyer vos données personnelles sur un serveur distant.',
    iconName: 'Layers',
    badge: 'Zéro-latence',
    technicalDetails: [
      'Traitement local dans le navigateur (Web Workers)',
      'Lissage barométrique adaptatif des profils d’élévation',
      'Support natif des fichiers multi-segments et laps'
    ]
  },
  {
    id: 'weather',
    title: 'Météo Prédictive',
    subtitle: 'Vent, pluie & rafales synchronisés',
    description: 'Une météo globale ne sert à rien sur un col 3 heures après votre départ. TrackPilot projette votre vitesse estimée et calcule la direction exacte du vent relatif, les rafales et les précipitations au moment précis où vous franchirez chaque point.',
    iconName: 'Wind',
    badge: 'Synchronisation horaire',
    technicalDetails: [
      'Calcul de l’angle du vent relatif (face, trois-quarts, dos)',
      'Modèles météo haute résolution (Météo-France AROME / GFS)',
      'Alerte thermique : sensation au vent & refroidissement éolien'
    ]
  },
  {
    id: 'nutrition',
    title: 'Stratégie Glucidique & Énergie',
    subtitle: 'Optimisation de la dépense calorique',
    description: 'Évitez la panne sèche (« l’hypo »). En croisant votre profil physiologique (FTP, poids, intensité) avec le profil de dénivelé, TrackPilot prescrit vos cibles de glucides horaires (40 à 90 g/h) adaptées à chaque portion.',
    iconName: 'Flame',
    badge: 'Physiologie appliquée',
    technicalDetails: [
      'Ratios optimaux Glucose / Fructose (1:0.8)',
      'Planification des prises alimentaires sur les replats',
      'Bilan hydrique ajusté à l’indice thermique et l’hygrométrie'
    ]
  },
  {
    id: 'water',
    title: 'Ravitaillements & Points d’Eau',
    subtitle: 'Détection intelligente le long de la trace',
    description: 'Ne roulez plus jamais avec deux bidons vides. TrackPilot scanne les abords de votre parcours (à moins de 150 mètres) pour identifier les fontaines publiques, cimetières avec eau potable, supérettes et refuges.',
    iconName: 'Droplets',
    badge: 'Sécurité outdoor',
    technicalDetails: [
      'Données croisées OpenStreetMap vérifiées par la communauté',
      'Calcul du détour nécessaire en mètres et secondes',
      'Espacement kilométrique recommandé entre chaque point'
    ]
  }
];
