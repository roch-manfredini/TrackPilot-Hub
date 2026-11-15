export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'vent-parcours-gpx',
    question: 'Comment TrackPilot calcule-t-il le vent le long d’une trace GPX ?',
    answer:
      'Plutôt qu’une météo générale à un point fixe, TrackPilot croise le cap de votre trace GPX avec votre horaire estimé de passage kilomètre par kilomètre. Vous visualisez ainsi si le vent sera de face, de côté ou de dos tout au long de votre sortie, avec les rafales et la température ressentie.',
  },
  {
    id: 'gpx-vs-fit',
    question: 'Quelle différence entre importer un fichier GPX ou un fichier FIT ?',
    answer:
      'TrackPilot accepte indifféremment les exports GPX et FIT issus de vos compteurs et montres (Garmin, Wahoo, Strava, Komoot…). Lors de l’import, vos données privées et biométriques (fréquence cardiaque, puissance, cadence) sont automatiquement purgées pour ne conserver que le tracé géographique et le profil altimétrique.',
  },
  {
    id: 'points-eau-osm',
    question: 'D’où viennent les fontaines et points d’eau affichés sur le plan de route ?',
    answer:
      'Le repérage des fontaines, sources et points d’eau potable s’appuie sur les données ouvertes et collaboratives d’OpenStreetMap. TrackPilot identifie les points situés sur ou à proximité de votre itinéraire en précisant l’écart éventuel par rapport à la trace.',
  },
  {
    id: 'guidage-hors-ligne',
    question: 'Le guidage fonctionne-t-il hors-ligne quand il n’y a plus de réseau ?',
    answer:
      'Oui. Vos plans de route sont stockés automatiquement en local et les tuiles cartographiques peuvent être mises en cache dans votre navigateur (IndexedDB). Grâce à une architecture sans état (stateless), le guidage reprend en 1 seconde après une coupure de batterie, sans session corrompue.',
  },
  {
    id: 'gratuite-modele',
    question: 'TrackPilot est-il vraiment gratuit, sans abonnement ni publicité ?',
    answer:
      'Oui. Les applications TrackPilot sont 100 % gratuites, sans abonnement, sans mur payant et sans publicité, et vouées à le rester. Autonomes, elles fonctionnent sans avoir besoin de passer par le site web. Le projet repose sur des briques open source et des données ouvertes (OpenStreetMap, BRouter, prévisions météo ouvertes). Si la communauté grandit fortement et génère des coûts d’hébergement importants, un financement léger (don facultatif type « café » ou bandeau publicitaire discret) pourra être ajouté uniquement sur ce site web (le Hub), jamais dans les applications.',
  },
  {
    id: 'cycling-vs-trail',
    question: 'Quelle est la différence entre TrackPilot Cycling et TrackPilot Trail ?',
    answer:
      'TrackPilot Cycling (en ligne sur cycling.trackpilot.fit) est conçu pour le vélo de route et le gravel, avec guidage cintre haute lisibilité et vent relatif. TrackPilot Trail (bientôt sur trail.trackpilot.fit) est dédié au trail, à la randonnée et à la marche, avec allure ajustée au dénivelé (GAP), temps de marche Tobler, refuges et barrières horaires.',
  },
];
