export type CatalogApp = 'cycling' | 'trail';

export type CatalogDiscipline =
  | 'road'
  | 'gravel'
  | 'mtb'
  | 'trail'
  | 'hike'
  | 'walk';

export interface CatalogSummaryItem {
  id: string;
  app: CatalogApp;
  discipline: CatalogDiscipline;
  name: string;
  totalDistanceKm: number;
  totalElevationGain: number;
  minAltitude: number;
  maxAltitude: number;
  createdAt: string;
  updatedAt: string;
  startLat?: number;
  startLng?: number;
}

export interface CatalogIndexDoc {
  updatedAt: string;
  count: number;
  items: CatalogSummaryItem[];
}

export interface ElevationSample {
  d: number; // distance in km
  e: number; // elevation in meters
}

export interface PublicPreviewDoc {
  id: string;
  app: CatalogApp;
  discipline: CatalogDiscipline;
  name: string;
  totalDistanceKm: number;
  totalElevationGain: number;
  minAltitude: number;
  maxAltitude: number;
  createdAt: string;
  updatedAt: string;
  pathPolyline: string;
  /** Flat array [d0, e0, d1, e1, ...] keeping irregular LTTB spacing compact */
  elevationSamples: number[];
  startLat?: number;
  startLng?: number;
}
