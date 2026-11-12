import { ModuleInfo, TechPillar } from '../types';

export const MODULES: ModuleInfo[] = [
  {
    id: 'cycling',
    title: 'TrackPilot Cycling',
    discipline: 'Cyclisme & Gravel',
    iconName: 'Bike',
    status: 'available',
    statusLabel: 'En ligne',
    tagline: 'Un carnet de route interactif pour préparer vos sorties vélo et gravel.',
    description: 'Glissez simplement votre fichier GPX ou FIT pour découvrir les points clés de votre itinéraire : le vent prévu au fil des kilomètres, des repères de rythme adaptés à votre niveau et l’emplacement des points d’eau.',
    url: 'https://cycling.trackpilot.fit',
    highlights: [
      'Visualisation du vent relatif (face, côté, dos) le long du parcours',
      'Repères d’allure et d’effort selon votre forme et vos habitudes',
      'Conseils simples pour l’hydratation et les apports d’énergie',
      'Repérage des fontaines et points d’eau potable utiles',
      'Export facile vers vos compteurs habituels (Garmin, Wahoo, Karoo...)'
    ],
    metrics: [
      { label: 'Météo', value: 'Sur le parcours' },
      { label: 'Format', value: 'GPX & FIT' },
      { label: 'Accès', value: 'Libre & Gratuit' }
    ]
  },
  {
    id: 'trail',
    title: 'TrackPilot Trail',
    discipline: 'Trail, Randonnée & Marche',
    iconName: 'Mountain',
    status: 'soon',
    statusLabel: 'Bientôt',
    tagline: 'Pour le trail, la randonnée et la marche : dompter le dénivelé et les sentiers.',
    description: 'Pensé pour toutes vos sorties à pied en pleine nature, en marchant ou en courant. Allure ajustée au dénivelé (GAP), estimations des temps de parcours et de marche (Tobler), gestion de l’eau et de votre autonomie.',
    url: 'https://trail.trackpilot.fit',
    highlights: [
      'Double mode : Trail & Course (allure ajustée GAP) ou Randonnée & Marche (Tobler & sac)',
      'Profil altimétrique précis avec dénivelé et pourcentages point par point',
      'Aide à l’estimation des temps de parcours et des barrières horaires',
      'Repérage des fontaines, sources naturelles, refuges et abris',
      'Gestion équilibrée de l’hydratation et de l’énergie selon l’effort'
    ],
    metrics: [
      { label: 'Discipline', value: 'Trail & Rando' },
      { label: 'Projet', value: 'En co-création' },
      { label: 'Accès', value: 'Bientôt disponible' }
    ]
  }
];

export const TECH_PILLARS: TechPillar[] = [
  {
    id: 'import',
    title: 'Import Simple GPX & FIT',
    subtitle: 'Pensé pour s’intégrer avec vos appareils habituels',
    description: 'Glissez votre trace directement dans le navigateur. Vos données restent chez vous, sur votre ordinateur ou votre téléphone : aucun compte obligatoire, aucun envoi de vos parcours personnels sur un serveur tiers.',
    iconName: 'Layers',
    badge: 'Vie privée respectée',
    technicalDetails: [
      'Traitement local directement dans votre navigateur web',
      'Compatible avec les exports de vos applications préférées (Garmin, Strava, Komoot...)',
      'Zéro traçage, vos fichiers personnels restent les vôtres'
    ]
  },
  {
    id: 'weather',
    title: 'Vent & Météo le Long du Parcours',
    subtitle: 'Anticiper les conditions réelles à votre passage',
    description: 'Plutôt qu’une météo générale à un endroit fixe, TrackPilot croise votre horaire estimé de passage avec les prévisions pour vous indiquer si le vent sera de face, de côté ou de dos au fil des kilomètres.',
    iconName: 'Wind',
    badge: 'Repères utiles',
    technicalDetails: [
      'Direction du vent relatif calculée selon le cap de votre tracé',
      'Données météo ouvertes et prévisions actualisées',
      'Température ressentie et indication des rafales pour bien s’équiper'
    ]
  },
  {
    id: 'nutrition',
    title: 'Repères d’Énergie & d’Hydratation',
    subtitle: 'Des conseils simples pour doser son effort',
    description: 'Pour éviter le coup de pompe sur les sorties longues, TrackPilot vous donne des repères indicatifs simples de glucides et d’eau par heure, adaptés au dénivelé et à la durée de votre parcours.',
    iconName: 'Flame',
    badge: 'Bons réflexes',
    technicalDetails: [
      'Repères d’apports faciles à mémoriser pour chaque heure',
      'Aide pour anticiper les sections plus exigeantes',
      'Conseils d’hydratation ajustés aux conditions météo'
    ]
  },
  {
    id: 'water',
    title: 'Points d’Eau & Fontaines Collaboratives',
    subtitle: 'Savoir où faire le plein sereinement',
    description: 'Pour partir l’esprit tranquille sans craindre les bidons à sec, TrackPilot s’appuie sur les données ouvertes et collaboratives d’OpenStreetMap pour signaler les fontaines publiques et points d’eau proches de votre itinéraire.',
    iconName: 'Droplets',
    badge: 'Données libres OSM',
    technicalDetails: [
      'Données cartographiques partagées par la communauté OpenStreetMap',
      'Indication de l’écart éventuel par rapport à votre trace',
      'Un vrai coup de pouce bienveillant pour vos sorties estivales'
    ]
  }
];
