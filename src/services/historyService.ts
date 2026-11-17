import {
  getCookieConsent,
  trackGaEvent,
  trackGaPageView,
} from '../utils/analytics';
import type {
  DailyActivityPoint,
  HubAnalyticsSummary,
  HubConsentState,
  HubEventInput,
  HubEventRecord,
  HubPointerType,
  HubReferrerCategory,
  HubSyncHistoryRecord,
  HubView,
  HubViewport,
  RankedCounterItem,
} from '../types/history';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

function createEphemeralVisitToken(): string {
  const len = 12;
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
  }
  let out = '';
  for (let i = 0; i < len; i += 1) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

const EPHEMERAL_VISIT_TOKEN =
  typeof window !== 'undefined' ? createEphemeralVisitToken() : 'ssr_preview';

let activeView: HubView = 'home';
const dedupeKeys = new Set<string>();
const pendingEvents: Array<Omit<QueuedEvent, 'actor'>> = [];
let flushScheduled = false;
let isFlushing = false;
let flushTimerId: number | null = null;

interface QueuedEvent {
  date: string;
  hour: number;
  visitToken: string;
  type: HubEventInput['type'];
  view: HubView;
  viewport: HubViewport;
  pointer: HubPointerType;
  standalone: boolean;
  consent: HubConsentState;
  actor: 'visitor' | 'admin';
  target?: string;
  app?: 'cycling' | 'trail';
  discipline?: 'road' | 'gravel' | 'mtb' | 'trail' | 'hike' | 'walk';
  previewId?: string;
  routeName?: string;
  filterValue?: string;
  referrerCategory?: HubReferrerCategory;
  resultsCount?: number;
}

function getViewportBucket(): HubViewport {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 640) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function getPointerType(): HubPointerType {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'fine';
  }
  return window.matchMedia('(pointer: coarse)').matches ? 'coarse' : 'fine';
}

function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  const mqStandalone =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches;
  const navStandalone = Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone
  );
  return mqStandalone || navStandalone;
}

function getConsentState(): HubConsentState {
  if (typeof window === 'undefined') return 'pending';
  return getCookieConsent() ?? 'pending';
}

export function classifyReferrer(): HubReferrerCategory {
  if (typeof document === 'undefined' || !document.referrer) return 'direct';
  try {
    const host = new URL(document.referrer).hostname.toLowerCase();
    if (!host || host === window.location.hostname.toLowerCase()) return 'direct';
    if (host.includes('trackpilot.fit')) return 'trackpilot_app';
    if (
      host.includes('google.') ||
      host.includes('bing.') ||
      host.includes('duckduckgo.') ||
      host.includes('ecosia.') ||
      host.includes('qwant.') ||
      host.includes('yahoo.')
    ) {
      return 'search';
    }
    if (
      host.includes('strava.') ||
      host.includes('instagram.') ||
      host.includes('facebook.') ||
      host.includes('linkedin.') ||
      host.includes('x.com') ||
      host.includes('twitter.') ||
      host.includes('youtube.') ||
      host.includes('reddit.')
    ) {
      return 'social';
    }
    return 'other';
  } catch {
    return 'other';
  }
}

function sanitizeSafeText(val: string | undefined, maxLen: number): string | undefined {
  if (!val) return undefined;
  const cleaned = val.replace(/@/g, '_').trim().slice(0, maxLen);
  return cleaned.length > 0 ? cleaned : undefined;
}

export function setTrackedView(view: HubView): void {
  activeView = view;
}

function forwardToGoogleAnalytics(input: HubEventInput, view: HubView): void {
  if (input.type === 'page_view') {
    const path = view === 'plans' ? '/plans' : '/';
    const title =
      view === 'plans'
        ? 'TrackPilot Hub - Plans publics'
        : 'TrackPilot Hub - Accueil';
    trackGaPageView(path, title);
    return;
  }

  trackGaEvent(input.type, {
    hub_view: view,
    target: input.target,
    app: input.app,
    discipline: input.discipline,
    preview_id: input.previewId,
    route_name: input.routeName,
    filter_value: input.filterValue,
    results_count: input.resultsCount,
  });
}

async function flushEventQueue(): Promise<void> {
  if (typeof window === 'undefined' || isFlushing || pendingEvents.length === 0) return;

  isFlushing = true;
  flushScheduled = false;
  if (flushTimerId !== null) {
    window.clearTimeout(flushTimerId);
    flushTimerId = null;
  }

  try {
    const [{ addDoc, collection, serverTimestamp }, { getHubAuth, getHubDb, isAllowedAdminUser }] =
      await Promise.all([import('firebase/firestore'), import('../config/firebase')]);

    const db = getHubDb();
    const auth = getHubAuth();
    if (typeof auth.authStateReady === 'function') {
      await auth.authStateReady();
    }
    const actor: 'visitor' | 'admin' = isAllowedAdminUser(auth.currentUser)
      ? 'admin'
      : 'visitor';

    const batchItems = pendingEvents.splice(0, 25);
    const eventsCol = collection(db, 'hub_events');

    await Promise.allSettled(
      batchItems.map((evt) => {
        if (evt.type === 'admin_event' && actor !== 'admin') {
          return Promise.resolve();
        }
        return addDoc(eventsCol, {
          ...evt,
          actor,
          ts: serverTimestamp(),
        });
      })
    );
  } catch {
    // Non-blocking telemetry: silently ignore adblockers, offline mode or restricted env
  } finally {
    isFlushing = false;
    if (pendingEvents.length > 0) {
      scheduleFlush();
    }
  }
}

function scheduleFlush(): void {
  if (typeof window === 'undefined' || flushScheduled) return;
  flushScheduled = true;

  const win = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };

  if (typeof win.requestIdleCallback === 'function') {
    win.requestIdleCallback(
      () => {
        void flushEventQueue();
      },
      { timeout: 1800 }
    );
  } else {
    flushTimerId = window.setTimeout(() => {
      void flushEventQueue();
    }, 800);
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && pendingEvents.length > 0) {
      void flushEventQueue();
    }
  });
  window.addEventListener('pagehide', () => {
    if (pendingEvents.length > 0) {
      void flushEventQueue();
    }
  });
}

export function recordHubEvent(input: HubEventInput): void {
  if (typeof window === 'undefined') return;

  const view = input.view ?? activeView;

  if (input.dedupeKey) {
    if (dedupeKeys.has(input.dedupeKey)) {
      return;
    }
    dedupeKeys.add(input.dedupeKey);
  }

  // 1. Forward to GA4 if cookie consent was accepted
  forwardToGoogleAnalytics(input, view);

  // 2. Queue strictly PII-free, cookie-less event for Firestore hub_events
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const hour = now.getUTCHours();

  const payload: Omit<QueuedEvent, 'actor'> = {
    date,
    hour,
    visitToken: EPHEMERAL_VISIT_TOKEN,
    type: input.type,
    view,
    viewport: getViewportBucket(),
    pointer: getPointerType(),
    standalone: isStandaloneMode(),
    consent: getConsentState(),
  };

  const target = sanitizeSafeText(input.target, 80);
  if (target) payload.target = target;
  if (input.app) payload.app = input.app;
  if (input.discipline) payload.discipline = input.discipline;
  const previewId = sanitizeSafeText(input.previewId, 128);
  if (previewId) payload.previewId = previewId;
  const routeName = sanitizeSafeText(input.routeName, 200);
  if (routeName) payload.routeName = routeName;
  const filterValue = sanitizeSafeText(input.filterValue, 64);
  if (filterValue) payload.filterValue = filterValue;
  if (input.referrerCategory) payload.referrerCategory = input.referrerCategory;
  if (
    typeof input.resultsCount === 'number' &&
    Number.isFinite(input.resultsCount) &&
    input.resultsCount >= 0
  ) {
    payload.resultsCount = Math.min(10000, Math.round(input.resultsCount));
  }

  pendingEvents.push(payload);
  if (pendingEvents.length > 100) {
    pendingEvents.shift();
  }
  scheduleFlush();
}

export function getSearchLengthBucket(rawQuery: string): '1-3' | '4-8' | '9+' {
  const len = rawQuery.trim().length;
  if (len <= 3) return '1-3';
  if (len <= 8) return '4-8';
  return '9+';
}

export async function recordSyncHistoryEntry(entry: {
  syncedAtIso: string;
  status: 'ok' | 'error';
  totalActiveCount: number;
  syncedCount: number;
  unchangedCount: number;
  deletedCount: number;
  skippedCount: number;
  durationMs: number;
  addedOrUpdatedIds: string[];
  deletedIds: string[];
  errorMessage?: string;
}): Promise<void> {
  const [{ addDoc, collection, serverTimestamp }, { getHubAuth, getHubDb, isAllowedAdminUser }] =
    await Promise.all([import('firebase/firestore'), import('../config/firebase')]);

  const auth = getHubAuth();
  const user = auth.currentUser;
  if (!isAllowedAdminUser(user) || !user?.email) {
    return;
  }

  const db = getHubDb();
  const docPayload: Record<string, unknown> = {
    syncedAt: serverTimestamp(),
    syncedAtIso: entry.syncedAtIso.slice(0, 40),
    adminEmail: user.email,
    status: entry.status,
    totalActiveCount: Math.max(0, Math.min(10000, Math.round(entry.totalActiveCount))),
    syncedCount: Math.max(0, Math.min(10000, Math.round(entry.syncedCount))),
    unchangedCount: Math.max(0, Math.min(10000, Math.round(entry.unchangedCount))),
    deletedCount: Math.max(0, Math.min(10000, Math.round(entry.deletedCount))),
    skippedCount: Math.max(0, Math.min(10000, Math.round(entry.skippedCount))),
    durationMs: Math.max(0, Math.min(600000, Math.round(entry.durationMs))),
    addedOrUpdatedIds: entry.addedOrUpdatedIds.slice(0, 200),
    deletedIds: entry.deletedIds.slice(0, 200),
  };

  if (entry.errorMessage) {
    docPayload.errorMessage = entry.errorMessage.slice(0, 300);
  }

  await addDoc(collection(db, 'hub_sync_history'), docPayload);
}

function sortRankedMap(
  map: Map<string, { label: string; count: number; secondary?: string }>,
  maxItems = 15
): RankedCounterItem[] {
  return Array.from(map.entries())
    .map(([key, val]) => ({
      key,
      label: val.label,
      count: val.count,
      ...(val.secondary ? { secondary: val.secondary } : {}),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxItems);
}

function bumpMap(
  map: Map<string, { label: string; count: number; secondary?: string }>,
  key: string,
  label: string,
  secondary?: string
): void {
  const prev = map.get(key);
  if (prev) {
    prev.count += 1;
    if (secondary && !prev.secondary) prev.secondary = secondary;
  } else {
    map.set(key, { label, count: 1, ...(secondary ? { secondary } : {}) });
  }
}

export async function fetchHubAnalyticsSummary(
  daysBack: number,
  includeAdmin: boolean
): Promise<HubAnalyticsSummary> {
  const [
    { collection, getDocs, limit, orderBy, query, Timestamp, where },
    { getHubAuth, getHubDb, isAllowedAdminUser },
  ] = await Promise.all([import('firebase/firestore'), import('../config/firebase')]);

  const auth = getHubAuth();
  if (!isAllowedAdminUser(auth.currentUser)) {
    throw new Error('Authentification administrateur requise.');
  }

  const db = getHubDb();
  const sinceMs = Date.now() - daysBack * 86_400_000;
  const sinceTs = Timestamp.fromMillis(sinceMs);

  const eventsQuery = query(
    collection(db, 'hub_events'),
    where('ts', '>=', sinceTs),
    orderBy('ts', 'desc'),
    limit(3000)
  );
  const syncQuery = query(
    collection(db, 'hub_sync_history'),
    orderBy('syncedAt', 'desc'),
    limit(50)
  );

  const [eventsSnap, syncSnap] = await Promise.all([
    getDocs(eventsQuery),
    getDocs(syncQuery),
  ]);

  const allEvents: HubEventRecord[] = [];
  eventsSnap.forEach((docSnap) => {
    const d = docSnap.data();
    const tsMs =
      typeof d.ts?.toMillis === 'function' ? d.ts.toMillis() : Date.parse(String(d.date ?? '')) || 0;
    const rec: HubEventRecord = {
      id: docSnap.id,
      tsMs,
      date: typeof d.date === 'string' ? d.date : '',
      hour: typeof d.hour === 'number' ? d.hour : 0,
      visitToken: typeof d.visitToken === 'string' ? d.visitToken : '',
      type: d.type,
      view: d.view === 'plans' ? 'plans' : 'home',
      viewport: d.viewport ?? 'desktop',
      pointer: d.pointer ?? 'fine',
      standalone: Boolean(d.standalone),
      consent: d.consent ?? 'pending',
      actor: d.actor === 'admin' ? 'admin' : 'visitor',
      ...(typeof d.target === 'string' ? { target: d.target } : {}),
      ...(d.app === 'cycling' || d.app === 'trail' ? { app: d.app } : {}),
      ...(d.discipline === 'road' ||
      d.discipline === 'gravel' ||
      d.discipline === 'mtb' ||
      d.discipline === 'trail' ||
      d.discipline === 'hike' ||
      d.discipline === 'walk'
        ? { discipline: d.discipline }
        : {}),
      ...(typeof d.previewId === 'string' ? { previewId: d.previewId } : {}),
      ...(typeof d.routeName === 'string' ? { routeName: d.routeName } : {}),
      ...(typeof d.filterValue === 'string' ? { filterValue: d.filterValue } : {}),
      ...(typeof d.referrerCategory === 'string'
        ? { referrerCategory: d.referrerCategory as HubReferrerCategory }
        : {}),
      ...(typeof d.resultsCount === 'number' ? { resultsCount: d.resultsCount } : {}),
    };
    if (includeAdmin || rec.actor !== 'admin') {
      allEvents.push(rec);
    }
  });

  const syncHistory: HubSyncHistoryRecord[] = [];
  syncSnap.forEach((docSnap) => {
    const d = docSnap.data();
    const syncedAtMs =
      typeof d.syncedAt?.toMillis === 'function'
        ? d.syncedAt.toMillis()
        : Date.parse(String(d.syncedAtIso ?? '')) || 0;
    syncHistory.push({
      id: docSnap.id,
      syncedAtMs,
      syncedAtIso: typeof d.syncedAtIso === 'string' ? d.syncedAtIso : '',
      adminEmail: typeof d.adminEmail === 'string' ? d.adminEmail : '',
      status: d.status === 'error' ? 'error' : 'ok',
      totalActiveCount: Number(d.totalActiveCount ?? 0),
      syncedCount: Number(d.syncedCount ?? 0),
      unchangedCount: Number(d.unchangedCount ?? 0),
      deletedCount: Number(d.deletedCount ?? 0),
      skippedCount: Number(d.skippedCount ?? 0),
      durationMs: Number(d.durationMs ?? 0),
      addedOrUpdatedIds: Array.isArray(d.addedOrUpdatedIds) ? d.addedOrUpdatedIds : [],
      deletedIds: Array.isArray(d.deletedIds) ? d.deletedIds : [],
      ...(typeof d.errorMessage === 'string' ? { errorMessage: d.errorMessage } : {}),
    });
  });

  const visitSet = new Set<string>();
  const standaloneVisitSet = new Set<string>();
  const visitViewport = new Map<string, HubViewport>();
  const visitReferrer = new Map<string, HubReferrerCategory>();
  const visitConsent = new Map<string, HubConsentState>();

  const dailyMap = new Map<
    string,
    {
      visits: Set<string>;
      events: number;
      homeViews: number;
      plansViews: number;
      previews: number;
      launches: number;
    }
  >();

  const hourlyDistribution = new Array<number>(24).fill(0);
  const routePreviewMap = new Map<string, { label: string; count: number; secondary?: string }>();
  const routeLaunchMap = new Map<string, { label: string; count: number; secondary?: string }>();
  const launchSourceMap = new Map<string, { label: string; count: number }>();
  const sectionMap = new Map<string, { label: string; count: number }>();
  const faqMap = new Map<string, { label: string; count: number }>();
  const installTabMap = new Map<string, { label: string; count: number }>();
  const filterMap = new Map<string, { label: string; count: number }>();
  const contactMap = new Map<string, { label: string; count: number }>();
  const legalMap = new Map<string, { label: string; count: number }>();
  const ctaMap = new Map<string, { label: string; count: number }>();
  const errorMap = new Map<string, { label: string; count: number }>();

  let homeViews = 0;
  let plansViews = 0;
  let routePreviews = 0;
  let appLaunches = 0;

  for (const ev of allEvents) {
    if (ev.visitToken) {
      visitSet.add(ev.visitToken);
      if (ev.standalone) standaloneVisitSet.add(ev.visitToken);
      if (!visitViewport.has(ev.visitToken)) visitViewport.set(ev.visitToken, ev.viewport);
      if (ev.referrerCategory && !visitReferrer.has(ev.visitToken)) {
        visitReferrer.set(ev.visitToken, ev.referrerCategory);
      }
      visitConsent.set(ev.visitToken, ev.consent);
    }

    if (ev.hour >= 0 && ev.hour < 24) {
      hourlyDistribution[ev.hour] += 1;
    }

    if (ev.date) {
      let day = dailyMap.get(ev.date);
      if (!day) {
        day = {
          visits: new Set<string>(),
          events: 0,
          homeViews: 0,
          plansViews: 0,
          previews: 0,
          launches: 0,
        };
        dailyMap.set(ev.date, day);
      }
      day.events += 1;
      if (ev.visitToken) day.visits.add(ev.visitToken);

      if (ev.type === 'page_view') {
        if (ev.view === 'plans') {
          plansViews += 1;
          day.plansViews += 1;
        } else {
          homeViews += 1;
          day.homeViews += 1;
        }
      } else if (ev.type === 'route_preview') {
        routePreviews += 1;
        day.previews += 1;
      } else if (ev.type === 'app_launch') {
        appLaunches += 1;
        day.launches += 1;
      }
    }

    if (ev.type === 'route_preview') {
      const id = ev.previewId || ev.routeName || 'unknown';
      const label = ev.routeName || ev.previewId || 'Parcours';
      const secondary = [ev.app, ev.discipline].filter(Boolean).join(' • ');
      bumpMap(routePreviewMap, id, label, secondary);
    } else if (ev.type === 'app_launch') {
      const sourceKey = `${ev.app ?? 'cycling'}:${ev.target ?? 'direct'}`;
      bumpMap(
        launchSourceMap,
        sourceKey,
        `${ev.app === 'trail' ? 'Trail' : 'Cycling'} (${ev.target ?? 'direct'})`
      );
      if (ev.previewId || ev.routeName) {
        const id = ev.previewId || ev.routeName || 'unknown';
        bumpMap(routeLaunchMap, id, ev.routeName || ev.previewId || 'Parcours', ev.app);
      }
    } else if (ev.type === 'section_view' && ev.target) {
      bumpMap(sectionMap, ev.target, ev.target);
    } else if (ev.type === 'faq_toggle' && ev.target) {
      bumpMap(faqMap, ev.target, ev.target);
    } else if (ev.type === 'install_tab' && ev.target) {
      bumpMap(installTabMap, ev.target, ev.target.toUpperCase());
    } else if (ev.type === 'catalog_filter') {
      const key = `${ev.target ?? 'filter'}:${ev.filterValue ?? 'all'}`;
      bumpMap(filterMap, key, `${ev.target ?? 'filtre'} = ${ev.filterValue ?? 'tous'}`);
    } else if (ev.type === 'catalog_search') {
      bumpMap(
        filterMap,
        `search:${ev.filterValue ?? 'any'}`,
        `Recherche (${ev.filterValue ?? '?'})`
      );
    } else if (ev.type === 'contact_action' && ev.target) {
      const key = `${ev.target}:${ev.filterValue ?? 'general'}`;
      bumpMap(contactMap, key, `${ev.target} (${ev.filterValue ?? 'hub'})`);
    } else if (ev.type === 'legal_open' && ev.target) {
      bumpMap(legalMap, ev.target, ev.target);
    } else if (ev.type === 'cta_click' && ev.target) {
      bumpMap(ctaMap, ev.target, ev.target);
    } else if (ev.type === 'client_error' && ev.target) {
      bumpMap(errorMap, ev.target, ev.target);
    }
  }

  const viewportMap = new Map<string, { label: string; count: number }>();
  visitViewport.forEach((vp) => bumpMap(viewportMap, vp, vp));

  const referrerMap = new Map<string, { label: string; count: number }>();
  visitReferrer.forEach((ref) => bumpMap(referrerMap, ref, ref));

  const consentMap = new Map<string, { label: string; count: number }>();
  visitConsent.forEach((c) => bumpMap(consentMap, c, c));

  const dailyActivity: DailyActivityPoint[] = Array.from(dailyMap.entries())
    .map(([date, v]) => ({
      date,
      events: v.events,
      visits: v.visits.size,
      homeViews: v.homeViews,
      plansViews: v.plansViews,
      previews: v.previews,
      launches: v.launches,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const plansToLaunchRatePct =
    plansViews > 0 ? Math.round((appLaunches / plansViews) * 1000) / 10 : 0;

  return {
    daysBack,
    includeAdmin,
    totalEvents: allEvents.length,
    uniqueVisits: visitSet.size,
    homeViews,
    plansViews,
    routePreviews,
    appLaunches,
    plansToLaunchRatePct,
    standaloneVisits: standaloneVisitSet.size,
    dailyActivity,
    hourlyDistribution,
    topRoutesPreviewed: sortRankedMap(routePreviewMap, 12),
    topRoutesLaunched: sortRankedMap(routeLaunchMap, 12),
    launchSources: sortRankedMap(launchSourceMap, 10),
    viewportBreakdown: sortRankedMap(viewportMap, 5),
    referrerBreakdown: sortRankedMap(referrerMap, 8),
    consentBreakdown: sortRankedMap(consentMap, 5),
    topSectionsViewed: sortRankedMap(sectionMap, 12),
    topFaqOpened: sortRankedMap(faqMap, 12),
    installTabs: sortRankedMap(installTabMap, 5),
    filterUsage: sortRankedMap(filterMap, 15),
    contactActions: sortRankedMap(contactMap, 10),
    legalTabs: sortRankedMap(legalMap, 5),
    topCtas: sortRankedMap(ctaMap, 15),
    clientErrors: sortRankedMap(errorMap, 10),
    recentEvents: allEvents.slice(0, 80),
    syncHistory,
  };
}
