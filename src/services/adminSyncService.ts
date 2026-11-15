import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
  writeBatch,
  type DocumentData,
} from 'firebase/firestore';
import { getHubAuth, getHubDb, isAllowedAdminUser } from '../config/firebase';
import type {
  CatalogApp,
  CatalogDiscipline,
  CatalogIndexDoc,
  CatalogSummaryItem,
  PublicPreviewDoc,
} from '../types/catalog';
import { buildCompactTrackSummary } from '../utils/trackGeometry';

const CYCLING_SOURCE_CONFIG: FirebaseOptions = {
  apiKey: 'AIzaSyBFZjmZZxRRSiTZbnS-FuV0edD7KadaIJc',
  authDomain: 'trackpilot-cycling.firebaseapp.com',
  projectId: 'trackpilot-cycling',
  storageBucket: 'trackpilot-cycling.firebasestorage.app',
  messagingSenderId: '1035620019013',
  appId: '1:1035620019013:web:5a9a0dc33a86263a85ac2c',
};

export interface SyncReport {
  totalActiveCount: number;
  syncedCount: number;
  unchangedCount: number;
  deletedCount: number;
  skippedCount: number;
  updatedAt: string;
}

function getSecondaryApp(name: string, config: FirebaseOptions): FirebaseApp {
  return getApps().some((app) => app.name === name)
    ? getApp(name)
    : initializeApp(config, name);
}

function toIsoDateString(val: unknown, fallbackIso: string): string {
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) {
    return val.slice(0, 40);
  }
  if (
    val !== null &&
    typeof val === 'object' &&
    'toDate' in val &&
    typeof (val as { toDate: () => Date }).toDate === 'function'
  ) {
    try {
      return (val as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return fallbackIso;
    }
  }
  if (typeof val === 'number' && Number.isFinite(val)) {
    return new Date(val).toISOString();
  }
  return fallbackIso;
}

function mapCyclingDiscipline(raw: DocumentData): CatalogDiscipline {
  const bikeType = raw?.tactics?.bikeType;
  if (bikeType === 'gravel') return 'gravel';
  if (bikeType === 'mtb') return 'mtb';
  return 'road';
}

function buildSanitizedPreview(
  app: CatalogApp,
  docId: string,
  raw: DocumentData,
  nowIso: string
): PublicPreviewDoc | null {
  const gpxContent = typeof raw.gpxContent === 'string' ? raw.gpxContent : '';
  const summary = buildCompactTrackSummary(
    gpxContent,
    typeof raw.totalDistanceKm === 'number' ? raw.totalDistanceKm : undefined,
    typeof raw.totalElevationGain === 'number' ? raw.totalElevationGain : undefined
  );

  if (!summary || summary.pathPolyline.length > 50000) {
    return null;
  }

  const rawName = typeof raw.name === 'string' ? raw.name.trim() : '';
  const safeName = (rawName || 'Parcours sans titre').slice(0, 200);
  const rawMaxAlt =
    typeof raw.maxAltitude === 'number' && Number.isFinite(raw.maxAltitude)
      ? Math.max(-500, Math.min(9000, Math.round(raw.maxAltitude)))
      : summary.maxAltitude;

  const previewId = `${app}_${docId}`.slice(0, 128);
  const discipline: CatalogDiscipline =
    app === 'cycling' ? mapCyclingDiscipline(raw) : 'trail';

  const createdAt = toIsoDateString(raw.createdAt, nowIso);
  const updatedAt = toIsoDateString(raw.updatedAt, createdAt);

  return {
    id: previewId,
    app,
    discipline,
    name: safeName,
    totalDistanceKm: summary.totalDistanceKm,
    totalElevationGain: summary.totalElevationGain,
    minAltitude: Math.min(summary.minAltitude, rawMaxAlt),
    maxAltitude: Math.max(summary.maxAltitude, rawMaxAlt),
    createdAt,
    updatedAt,
    pathPolyline: summary.pathPolyline,
    elevationSamples: summary.elevationSamples,
    startLat: summary.startLat,
    startLng: summary.startLng,
  };
}

function toSummaryItem(p: PublicPreviewDoc): CatalogSummaryItem {
  return {
    id: p.id,
    app: p.app,
    discipline: p.discipline,
    name: p.name,
    totalDistanceKm: p.totalDistanceKm,
    totalElevationGain: p.totalElevationGain,
    minAltitude: p.minAltitude,
    maxAltitude: p.maxAltitude,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    ...(typeof p.startLat === 'number' ? { startLat: p.startLat } : {}),
    ...(typeof p.startLng === 'number' ? { startLng: p.startLng } : {}),
  };
}

function isUnchangedRide(
  existing: CatalogSummaryItem | undefined,
  raw: DocumentData,
  app: CatalogApp,
  nowIso: string
): boolean {
  if (!existing || (!raw.updatedAt && !raw.createdAt)) {
    return false;
  }
  const rawName = (typeof raw.name === 'string' ? raw.name.trim() : '') || 'Parcours sans titre';
  const safeName = rawName.slice(0, 200);
  const discipline: CatalogDiscipline = app === 'cycling' ? mapCyclingDiscipline(raw) : 'trail';
  const createdAt = toIsoDateString(raw.createdAt, nowIso);
  const updatedAt = toIsoDateString(raw.updatedAt, createdAt);

  if (
    existing.updatedAt !== updatedAt ||
    existing.name !== safeName ||
    existing.discipline !== discipline
  ) {
    return false;
  }

  if (typeof raw.totalDistanceKm === 'number' && Number.isFinite(raw.totalDistanceKm)) {
    const roundedDist = Math.round(raw.totalDistanceKm * 10) / 10;
    if (Math.abs(roundedDist - existing.totalDistanceKm) > 0.1) {
      return false;
    }
  }

  return true;
}

/**
 * Incrementally synchronizes public routes (`isPublic == true`) into `trackpilot-hub`.
 * Uses `/catalog_meta/index` (1 read) to skip GPX parsing & Firestore writes for unchanged routes
 * and detect orphaned/privatized routes without reading the full `public_previews` collection.
 */
export async function syncPublicCatalogFromApps(): Promise<SyncReport> {
  const auth = getHubAuth();
  if (!isAllowedAdminUser(auth.currentUser)) {
    throw new Error('Authentification administrateur requise pour synchroniser le catalogue.');
  }

  const nowIso = new Date().toISOString();
  const hubDb = getHubDb();

  // Single read on /catalog_meta/index for incremental diff & orphan detection
  const existingIndexSnap = await getDoc(doc(hubDb, 'catalog_meta', 'index'));
  const existingItems =
    existingIndexSnap.exists() && Array.isArray(existingIndexSnap.data().items)
      ? (existingIndexSnap.data().items as CatalogSummaryItem[])
      : [];
  const existingById = new Map<string, CatalogSummaryItem>(
    existingItems.map((item) => [item.id, item])
  );

  const previewsToWrite: PublicPreviewDoc[] = [];
  const summaryItems: CatalogSummaryItem[] = [];
  const activeIds = new Set<string>();
  let unchangedCount = 0;
  let skippedCount = 0;

  // Source 1: TrackPilot-Cycling
  const cyclingApp = getSecondaryApp('trackpilot-cycling-readonly', CYCLING_SOURCE_CONFIG);
  const cyclingDb = getFirestore(cyclingApp);
  const cyclingQuery = query(collection(cyclingDb, 'rides'), where('isPublic', '==', true));
  const cyclingSnap = await getDocs(cyclingQuery);

  cyclingSnap.forEach((docSnap) => {
    const previewId = `cycling_${docSnap.id}`.slice(0, 128);
    const raw = docSnap.data();
    const existing = existingById.get(previewId);

    if (isUnchangedRide(existing, raw, 'cycling', nowIso) && existing) {
      activeIds.add(previewId);
      summaryItems.push(existing);
      unchangedCount += 1;
      return;
    }

    const preview = buildSanitizedPreview('cycling', docSnap.id, raw, nowIso);
    if (preview) {
      activeIds.add(preview.id);
      previewsToWrite.push(preview);
      summaryItems.push(toSummaryItem(preview));
    } else {
      skippedCount += 1;
    }
  });

  // Source 2: TrackPilot-Trail will be plugged in here when ready (public rides enabled).

  // Sort most recently updated first (with deterministic tie-break)
  summaryItems.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const orphanIds: string[] = [];
  existingById.forEach((_item, existingId) => {
    if (!activeIds.has(existingId)) {
      orphanIds.push(existingId);
    }
  });

  // Upsert only new or changed previews in safe Firestore batches (< 500 ops per batch)
  const CHUNK_SIZE = 350;
  for (let i = 0; i < previewsToWrite.length; i += CHUNK_SIZE) {
    const chunk = previewsToWrite.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(hubDb);
    for (const preview of chunk) {
      batch.set(doc(hubDb, 'public_previews', preview.id), preview);
    }
    await batch.commit();
  }

  // Delete orphaned / privatized routes from hub catalog
  for (let i = 0; i < orphanIds.length; i += CHUNK_SIZE) {
    const chunk = orphanIds.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(hubDb);
    for (const orphanId of chunk) {
      batch.delete(doc(hubDb, 'public_previews', orphanId));
    }
    await batch.commit();
  }

  const indexDoc: CatalogIndexDoc = {
    updatedAt: nowIso,
    count: summaryItems.length,
    items: summaryItems,
  };

  const metaBatch = writeBatch(hubDb);
  metaBatch.set(doc(hubDb, 'catalog_meta', 'index'), indexDoc);
  await metaBatch.commit();

  return {
    totalActiveCount: summaryItems.length,
    syncedCount: previewsToWrite.length,
    unchangedCount,
    deletedCount: orphanIds.length,
    skippedCount,
    updatedAt: nowIso,
  };
}
