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
      'Oui. Vos plans de route sont stockés automatiquement en local. Inutile de télécharger la carte d’une région ou d’un pays entier avant de partir : les zones traversées se chargent au fur et à mesure, et dès que vous ouvrez un plan de route chez vous, un simple bouton dans le guidage permet de précharger provisoirement ses tuiles (en cache local IndexedDB) pour anticiper les passages sans réseau. Grâce à une architecture sans état (stateless), le guidage reprend en 1 seconde après un redémarrage imprévu du smartphone.',
  },
  {
    id: 'cycling-vs-trail',
    question: 'Quelle est la différence entre TrackPilot Cycling et TrackPilot Trail ?',
    answer:
      'TrackPilot Cycling (en ligne sur cycling.trackpilot.fit) est conçu pour préparer vos sorties vélo, avec guidage cintre haute lisibilité et vent relatif. TrackPilot Trail (bientôt sur trail.trackpilot.fit) est dédié au trail, à la randonnée et à la marche, avec allure ajustée au dénivelé (GAP), temps de marche Tobler, refuges et barrières horaires.',
  },
];
