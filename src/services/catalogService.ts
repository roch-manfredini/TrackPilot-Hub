import { doc, getDoc } from 'firebase/firestore';
import { getHubDb } from '../config/firebase';
import type { CatalogIndexDoc, PublicPreviewDoc } from '../types/catalog';

/**
 * Fetches the single-read lightweight catalog summary index from `trackpilot-hub`.
 */
export async function fetchCatalogIndex(): Promise<CatalogIndexDoc> {
  const db = getHubDb();
  const snap = await getDoc(doc(db, 'catalog_meta', 'index'));

  if (!snap.exists()) {
    return {
      updatedAt: '',
      count: 0,
      items: [],
    };
  }

  const data = snap.data();
  const items = Array.isArray(data.items) ? data.items : [];
  const count = typeof data.count === 'number' ? data.count : items.length;
  const updatedAt =
    typeof data.updatedAt === 'string'
      ? data.updatedAt
      : typeof data.updatedAt?.toDate === 'function'
        ? data.updatedAt.toDate().toISOString()
        : '';

  return {
    updatedAt,
    count,
    items,
  };
}

/**
 * Fetches a single sanitized route preview (polyline + LTTB elevation profile).
 */
export async function fetchPublicPreview(previewId: string): Promise<PublicPreviewDoc | null> {
  const db = getHubDb();
  const snap = await getDoc(doc(db, 'public_previews', previewId));
  if (!snap.exists()) {
    return null;
  }
  return snap.data() as PublicPreviewDoc;
}

/**
 * Builds the external deep-link URL to open a route inside its native TrackPilot app.
 */
export function getAppLaunchUrl(app: 'cycling' | 'trail', previewId: string): string {
  const prefix = `${app}_`;
  const sourceId = previewId.startsWith(prefix) ? previewId.slice(prefix.length) : previewId;

  if (app === 'trail') {
    return `https://trail.trackpilot.fit/?ride=${encodeURIComponent(sourceId)}`;
  }
  return `https://cycling.trackpilot.fit/?ride=${encodeURIComponent(sourceId)}`;
}
