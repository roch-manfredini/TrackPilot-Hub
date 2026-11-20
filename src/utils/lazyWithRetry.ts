import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export type RecoverableView = 'admin' | 'plans';

const PENDING_VIEW_KEY = 'trackpilot_hub_pending_view';
const CHUNK_RELOAD_TS_KEY = 'trackpilot_hub_chunk_reload_ts';
const RELOAD_COOLDOWN_MS = 15_000;

let recoveryTargetView: RecoverableView | undefined;

export function setRecoveryTargetView(view: RecoverableView | undefined): void {
  recoveryTargetView = view;
}

export function getRecoveryTargetView(): RecoverableView | undefined {
  return recoveryTargetView;
}

export function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const message =
    error instanceof Error
      ? `${error.name} ${error.message}`
      : typeof error === 'string'
        ? error
        : String(error);

  return (
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /ChunkLoadError/i.test(message) ||
    /Loading chunk [\w-]+ failed/i.test(message) ||
    /Unable to preload CSS/i.test(message) ||
    /text\/html.*is not a valid JavaScript MIME type/i.test(message)
  );
}

export function persistPendingView(view: RecoverableView): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(PENDING_VIEW_KEY, view);
  } catch {
    // Ignore storage errors (private mode / restricted env)
  }
}

export function consumePendingView(): RecoverableView | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(PENDING_VIEW_KEY);
    if (raw !== null) {
      window.sessionStorage.removeItem(PENDING_VIEW_KEY);
    }
    if (raw === 'admin' || raw === 'plans') {
      return raw;
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

/**
 * Triggers at most one automatic hard reload within RELOAD_COOLDOWN_MS when a
 * stale deployment breaks a lazy-loaded Vite chunk. Returns true if a reload
 * was scheduled, or false if the cooldown prevented an infinite reload loop.
 */
export function triggerChunkReloadOnce(pendingView?: RecoverableView): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const now = Date.now();
    const lastTs = Number(window.sessionStorage.getItem(CHUNK_RELOAD_TS_KEY) ?? '0');
    if (Number.isFinite(lastTs) && lastTs > 0 && now - lastTs < RELOAD_COOLDOWN_MS) {
      return false;
    }
    window.sessionStorage.setItem(CHUNK_RELOAD_TS_KEY, String(now));
    if (pendingView) {
      persistPendingView(pendingView);
    }
    window.location.reload();
    return true;
  } catch {
    return false;
  }
}

export function lazyWithRetry<T extends ComponentType<any>>(
  importer: () => Promise<{ default: T }>,
  pendingView: RecoverableView
): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      return await importer();
    } catch (error) {
      if (isChunkLoadError(error) && triggerChunkReloadOnce(pendingView)) {
        // Keep Suspense fallback mounted while the browser reloads fresh assets
        return await new Promise<{ default: T }>(() => {});
      }
      throw error;
    }
  });
}
