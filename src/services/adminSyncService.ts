import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import {
  collection,
  doc,
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
  syncedCount: number;
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

/**
 * Synchronizes public routes (`isPublic == true`) from active source apps into `trackpilot-hub`.
 * Runs client-side using the authenticated admin's Firestore write permission.
 */
export async function syncPublicCatalogFromApps(): Promise<SyncReport> {
  const auth = getHubAuth();
  if (!isAllowedAdminUser(auth.currentUser)) {
    throw new Error('Authentification administrateur requise pour synchroniser le catalogue.');
  }

  const nowIso = new Date().toISOString();
  const collectedPreviews: PublicPreviewDoc[] = [];
  let skippedCount = 0;

  // Source 1: TrackPilot-Cycling
  const cyclingApp = getSecondaryApp('trackpilot-cycling-readonly', CYCLING_SOURCE_CONFIG);
  const cyclingDb = getFirestore(cyclingApp);
  const cyclingQuery = query(collection(cyclingDb, 'rides'), where('isPublic', '==', true));
  const cyclingSnap = await getDocs(cyclingQuery);

  cyclingSnap.forEach((docSnap) => {
    const preview = buildSanitizedPreview('cycling', docSnap.id, docSnap.data(), nowIso);
    if (preview) {
      collectedPreviews.push(preview);
    } else {
      skippedCount += 1;
    }
  });

  // Source 2: TrackPilot-Trail will be plugged in here when ready (public rides enabled).

  // Sort most recently updated first (with deterministic tie-break)
  collectedPreviews.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const hubDb = getHubDb();
  const existingSnap = await getDocs(collection(hubDb, 'public_previews'));
  const activeIds = new Set(collectedPreviews.map((p) => p.id));
  const orphanIds: string[] = [];

  existingSnap.forEach((docSnap) => {
    if (!activeIds.has(docSnap.id)) {
      orphanIds.push(docSnap.id);
    }
  });

  // Upsert sanitized previews in safe Firestore batches (< 500 ops per batch)
  const CHUNK_SIZE = 350;
  for (let i = 0; i < collectedPreviews.length; i += CHUNK_SIZE) {
    const chunk = collectedPreviews.slice(i, i + CHUNK_SIZE);
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

  const summaryItems: CatalogSummaryItem[] = collectedPreviews.map((p) => ({
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
  }));

  const indexDoc: CatalogIndexDoc = {
    updatedAt: nowIso,
    count: summaryItems.length,
    items: summaryItems,
  };

  const metaBatch = writeBatch(hubDb);
  metaBatch.set(doc(hubDb, 'catalog_meta', 'index'), indexDoc);
  await metaBatch.commit();

  return {
    syncedCount: collectedPreviews.length,
    deletedCount: orphanIds.length,
    skippedCount,
    updatedAt: nowIso,
  };
}
