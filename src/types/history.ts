import type { CatalogApp, CatalogDiscipline } from './catalog';

export type HubView = 'home' | 'plans';
export type HubViewport = 'mobile' | 'tablet' | 'desktop';
export type HubPointerType = 'coarse' | 'fine';
export type HubConsentState = 'accepted' | 'refused' | 'pending';
export type HubActor = 'visitor' | 'admin';
export type HubReferrerCategory =
  | 'direct'
  | 'search'
  | 'trackpilot_app'
  | 'social'
  | 'other';

export type HubEventType =
  | 'page_view'
  | 'section_view'
  | 'cta_click'
  | 'route_preview'
  | 'app_launch'
  | 'catalog_filter'
  | 'catalog_search'
  | 'install_tab'
  | 'faq_toggle'
  | 'contact_action'
  | 'legal_open'
  | 'cookie_choice'
  | 'admin_event'
  | 'client_error';

export interface HubEventInput {
  type: HubEventType;
  view?: HubView;
  target?: string;
  app?: CatalogApp;
  discipline?: CatalogDiscipline;
  previewId?: string;
  routeName?: string;
  filterValue?: string;
  referrerCategory?: HubReferrerCategory;
  resultsCount?: number;
  /** Skip in-memory deduping when explicit user action should always count */
  dedupeKey?: string;
}

export interface HubEventRecord {
  id: string;
  tsMs: number;
  date: string;
  hour: number;
  visitToken: string;
  type: HubEventType;
  view: HubView;
  viewport: HubViewport;
  pointer: HubPointerType;
  standalone: boolean;
  consent: HubConsentState;
  actor: HubActor;
  target?: string;
  app?: CatalogApp;
  discipline?: CatalogDiscipline;
  previewId?: string;
  routeName?: string;
  filterValue?: string;
  referrerCategory?: HubReferrerCategory;
  resultsCount?: number;
}

export interface HubSyncHistoryRecord {
  id: string;
  syncedAtMs: number;
  syncedAtIso: string;
  adminEmail: string;
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
}

export interface RankedCounterItem {
  key: string;
  label: string;
  count: number;
  secondary?: string;
}

export interface DailyActivityPoint {
  date: string;
  events: number;
  visits: number;
  homeViews: number;
  plansViews: number;
  previews: number;
  launches: number;
}

export interface HubAnalyticsSummary {
  daysBack: number;
  includeAdmin: boolean;
  totalEvents: number;
  uniqueVisits: number;
  homeViews: number;
  plansViews: number;
  routePreviews: number;
  appLaunches: number;
  plansToLaunchRatePct: number;
  standaloneVisits: number;
  dailyActivity: DailyActivityPoint[];
  hourlyDistribution: number[];
  topRoutesPreviewed: RankedCounterItem[];
  topRoutesLaunched: RankedCounterItem[];
  launchSources: RankedCounterItem[];
  viewportBreakdown: RankedCounterItem[];
  referrerBreakdown: RankedCounterItem[];
  consentBreakdown: RankedCounterItem[];
  topSectionsViewed: RankedCounterItem[];
  topFaqOpened: RankedCounterItem[];
  installTabs: RankedCounterItem[];
  filterUsage: RankedCounterItem[];
  contactActions: RankedCounterItem[];
  legalTabs: RankedCounterItem[];
  topCtas: RankedCounterItem[];
  clientErrors: RankedCounterItem[];
  recentEvents: HubEventRecord[];
  syncHistory: HubSyncHistoryRecord[];
}
