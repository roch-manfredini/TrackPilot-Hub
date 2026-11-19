export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'trackpilot-vs-autres-applis',
    question: 'TrackPilot fait-il mieux que les autres ?',
    answer:
      'TrackPilot ne cherche pas à faire « mieux », il fait différemment. Là où les applications GPS tout-en-un visent la polyvalence multi-sports et l’enregistrement complet de vos activités, leur densité d’écrans amène souvent à laisser le smartphone dans la poche ou le sac sur le terrain. TrackPilot concentre tout son travail sur deux disciplines ciblées (le vélo et le trail/randonnée) en poussant l’ergonomie mobile au maximum : en simplifiant volontairement les fonctionnalités pour ne garder que l’essentiel, l’écran devient vraiment agréable à garder sur le cintre ou à la main. En résumé : les applis tout-en-un excellent pour enregistrer et archiver votre pratique ; TrackPilot se distingue par son ergonomie terrain, sa lisibilité immédiate et son confort d’utilisation en mouvement.',
  },
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
    id: 'creation-sans-gpx',
    question: 'Faut-il déjà avoir un fichier GPX pour utiliser TrackPilot ?',
    answer:
      'Non. Si vous n’avez pas encore de trace, le studio de traçage intégré (épaulé par BRouter) vous permet de créer votre parcours en quelques clics grâce à l’aimantation magnétique sur route, piste ou chemin, avec profil altimétrique en direct, rebouclage automatique et export GPX vers vos compteurs.',
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
    id: 'sync-pc-smartphone',
    question: 'Faut-il transférer ses parcours entre l’ordinateur et le smartphone ?',
    answer:
      'Non, tout se fait automatiquement sans rien toucher. Dès que vous créez ou enregistrez un parcours sur votre PC, vous le retrouvez instantanément sur votre smartphone dans votre compte, sans câble ni manipulation, avec la possibilité de le mettre en favoris pour y accéder en un geste.',
  },
  {
    id: 'cycling-vs-trail',
    question: 'Quelle est la différence entre TrackPilot Cycling et TrackPilot Trail ?',
    answer:
      'TrackPilot Cycling (en ligne sur cycling.trackpilot.fit) est conçu pour préparer vos sorties vélo, avec guidage cintre haute lisibilité et vent relatif. TrackPilot Trail (bientôt sur trail.trackpilot.fit) est dédié au trail, à la randonnée et à la marche, avec allure ajustée au dénivelé (GAP), temps de marche Tobler, refuges et barrières horaires.',
  },
  {
    id: 'compteur-gps-complementaire',
    question: 'TrackPilot remplace-t-il mon compteur vélo ou ma montre GPS ?',
    answer:
      'Non, il les complète. Votre compteur ou votre montre reste idéal pour enregistrer votre sortie et vos capteurs (fréquence cardiaque, puissance, historique). TrackPilot vous aide à préparer le plan de route complet en amont (vent relatif, fontaines, nutrition) et vous permet soit d’exporter le GPX vers votre appareil, soit d’utiliser votre smartphone comme écran de guidage épuré.',
  },
];
