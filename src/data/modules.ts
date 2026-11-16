import { ModuleInfo, TechPillar } from '../types';

export const MODULES: ModuleInfo[] = [
  {
    id: 'cycling',
    title: 'TrackPilot Cycling',
    discipline: 'Cyclisme & Gravel',
    iconName: 'Bike',
    status: 'available',
    statusLabel: 'En ligne',
    tagline: 'Un plan de route complet et interactif pour préparer vos sorties vélo et gravel.',
    description: 'Partez d’un simple fichier GPX ou FIT - ou tracez votre parcours - pour charger un véritable plan de route : vent prévu au fil des kilomètres, repères de rythme adaptés et points d’eau réunis en une vue globale.',
    url: 'https://cycling.trackpilot.fit',
    highlights: [
      'Studio de traçage épuré cyclisme : routage magnétique instantané (route, gravel, voies douces) et profil altimétrique direct',
      'Guidage cintre ultra-épuré : lisibilité immédiate à vitesse élevée, vent relatif, pente et mode éco OLED sans réseau',
      'Plans de route stockés automatiquement en local pour une consultation et un guidage 100% hors-ligne',
      'Visualisation du vent relatif (face, côté, dos) calculé selon votre horaire de passage',
      'Repérage des fontaines et points d’eau potable utiles (données libres OSM)',
      'Conseils personnalisés d’hydratation, d’énergie et export rapide vers vos compteurs'
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
    description: 'Pensé pour transformer un simple GPX en plan de route pour toutes vos sorties à pied : allure ajustée au dénivelé (GAP), temps de marche (Tobler), gestion de l’eau et autonomie.',
    url: 'https://trail.trackpilot.fit',
    highlights: [
      'Outil de traçage épuré sentiers : tracé adapté aux chemins de montagne, courbes de niveau et calcul du relief D+/D-',
      'Guidage outdoor épuré : orientation immédiate aux intersections, D+ restant, refuges et zéro gigue GPS à la marche',
      'Double mode d’effort : Trail & Course (allure ajustée GAP) ou Randonnée & Marche (calcul Tobler & sac)',
      'Aide à l’estimation des temps de parcours et suivi des barrières horaires',
      'Repérage des sources naturelles, fontaines, refuges et abris en pleine nature'
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
    id: 'mapping',
    title: 'Tracé Support & Studio Vectoriel',
    subtitle: 'Dessiner la base de votre plan de route au mètre près',
    description: 'Un atelier de dessin cartographique épuré dans votre navigateur. Épaulé par BRouter et son aimantation magnétique intelligente (Snap), tracez votre itinéraire en quelques clics : il devient aussitôt la base de votre plan de route avec profil altimétrique calculé en temps réel.',
    iconName: 'Route',
    badge: 'Routage BRouter & Snap',
    technicalDetails: [
      'Aimantation magnétique adaptative : Route, Gravel, Sentiers de randonnée ou Tracé libre',
      'Profil altimétrique interactif et dénivelé cumulé (D+) calculés en direct à chaque point',
      'Fonctions d’atelier en 1 clic : rebouclage automatique, aller-retour, inversion et Undo/Redo infini',
      'Passerelle instantanée vers le Cockpit de vol ou export GPX haute précision'
    ]
  },
  {
    id: 'import',
    title: 'Du simple GPX au Plan de Route',
    subtitle: 'Un fichier GPX en entrée, un plan de route assaini en sortie',
    description: 'Dans TrackPilot, vous ne chargez pas une simple trace : un fichier GPX ou FIT suffit pour charger un plan de route complet sur votre compte. À l’import, vos données privées et biométriques (fréquence cardiaque, puissance, capteurs) sont purgées pour ne garder que l’essentiel géographique.',
    iconName: 'Layers',
    badge: 'Plan de Route Assaini',
    technicalDetails: [
      'Suppression automatique des métadonnées privées et des données biométriques (FC, watts, cadence)',
      'Conservation exclusive du tracé géographique utile et du profil altimétrique',
      'Stockage sécurisé associé à votre compte et synchronisation locale automatique pour un accès hors-ligne',
      'Compatible avec les exports de tous vos appareils habituels (Garmin, Wahoo, Strava, Komoot...)'
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
    id: 'guidance',
    title: 'Guidage Temps Réel & Cockpit Hors-Ligne',
    subtitle: 'Un guidage épuré sur votre smartphone',
    description: 'Pensé pour être lisible d’un coup d’œil au cintre ou sur une bretelle. Grâce à une projection directe sur le tracé (architecture sans état), le guidage reprend en 1 seconde après un redémarrage imprévu du smartphone, sans session à restaurer.',
    iconName: 'Navigation',
    badge: 'Stateless & Zéro Réseau',
    technicalDetails: [
      'Reprise instantanée en 1s après un redémarrage du smartphone, sans session à restaurer',
      'Stockage local automatique de vos plans de route pour un accès 100% hors-ligne',
      'Recalcul en direct de la distance restante, du D+ et des fontaines en aval',
      'Chargement des cartes au fil de l’avancée ou préchargement provisoire du plan de route via un bouton dans le guidage (IndexedDB)',
      'Maintien d’écran allumé automatique (Screen WakeLock API) et mode Fil d’Ariane éco-batterie OLED'
    ]
  },
  {
    id: 'water',
    title: 'Points d’Eau & Fontaines Collaboratives',
    subtitle: 'Savoir où faire le plein sereinement',
    description: 'Pour partir l’esprit tranquille sans craindre les bidons ou gourdes à sec, TrackPilot s’appuie sur les données ouvertes et collaboratives d’OpenStreetMap pour signaler les fontaines, sources et points d’eau proches de votre itinéraire.',
    iconName: 'Droplets',
    badge: 'Données libres OSM',
    technicalDetails: [
      'Données cartographiques partagées par la communauté OpenStreetMap',
      'Indication de l’écart éventuel par rapport à votre trace',
      'Un vrai coup de pouce bienveillant pour vos sorties estivales'
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
  }
];
