import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Clock,
  Compass,
  Download,
  LogOut,
  MousePointerClick,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  createGoogleAuthProvider,
  getHubAuth,
  isAllowedAdminUser,
} from '../config/firebase';
import { fetchCatalogIndex, getAppLaunchUrl } from '../services/catalogService';
import { fetchHubAnalyticsSummary, recordHubEvent } from '../services/historyService';
import type { CatalogDiscipline, CatalogSummaryItem } from '../types/catalog';
import type { HubAnalyticsSummary, RankedCounterItem } from '../types/history';

interface AdminBackendViewProps {
  currentUser: User | null;
  isAuthChecking: boolean;
  onAuthenticated: (user: User) => void;
  onSignedOut: () => void;
}

type BackendTab = 'overview' | 'catalog' | 'plans' | 'content' | 'logs';

const DISCIPLINE_LABELS: Record<CatalogDiscipline, string> = {
  road: 'Route',
  gravel: 'Gravel',
  mtb: 'VTT',
  trail: 'Trail',
  hike: 'Rando',
  walk: 'Marche',
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  page_view: 'Vue page',
  section_view: 'Section vue',
  cta_click: 'Clic CTA',
  route_preview: 'Aperçu parcours',
  app_launch: 'Lancement app',
  catalog_filter: 'Filtre catalogue',
  catalog_search: 'Recherche catalogue',
  install_tab: 'Onglet installation',
  faq_toggle: 'Ouverture FAQ',
  contact_action: 'Action contact',
  legal_open: 'Ouverture légal',
  cookie_choice: 'Choix cookies',
  admin_event: 'Action admin',
  client_error: 'Erreur client',
};

function formatShortDateTime(ms: number): string {
  if (!ms) return '-';
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(new Date(ms));
  } catch {
    return '-';
  }
}

function formatIsoDateTime(iso: string): string {
  if (!iso) return '-';
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return '-';
  }
}

const RankedBarList: React.FC<{
  title: string;
  items: RankedCounterItem[];
  emptyText: string;
}> = ({ title, items, emptyText }) => {
  const max = items.reduce((acc, item) => Math.max(acc, item.count), 1);
  return (
    <div className="p-4 rounded-xl bg-[#08090d] border border-white/10 space-y-3">
      <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-xs text-slate-500 py-3">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const pct = Math.max(6, Math.round((item.count / max) * 100));
            return (
              <li key={item.key} className="space-y-1">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-200 truncate" title={item.label}>
                    {item.label}
                  </span>
                  <span className="font-mono tabular-nums text-brand-300 shrink-0">
                    {item.count}
                  </span>
                </div>
                {item.secondary && (
                  <div className="text-[10px] font-mono text-slate-500 truncate">
                    {item.secondary}
                  </div>
                )}
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-400/80"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export const AdminBackendView: React.FC<AdminBackendViewProps> = ({
  currentUser,
  isAuthChecking,
  onAuthenticated,
  onSignedOut,
}) => {
  const isAdmin = isAllowedAdminUser(currentUser);
  const dailyCaptionId = useId();
  const catalogCaptionId = useId();
  const syncCaptionId = useId();
  const eventsCaptionId = useId();

  // Auth states
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync & catalog states
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );
  const [catalogItems, setCatalogItems] = useState<CatalogSummaryItem[]>([]);
  const [catalogUpdatedAt, setCatalogUpdatedAt] = useState<string>('');
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState('');

  // Stats states
  const [daysBack, setDaysBack] = useState<7 | 30 | 90>(30);
  const [includeAdmin, setIncludeAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<BackendTab>('overview');
  const [summary, setSummary] = useState<HubAnalyticsSummary | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const loadBackendData = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoadingStats(true);
    setIsLoadingCatalog(true);
    setStatsError(null);

    const [statsRes, catalogRes] = await Promise.allSettled([
      fetchHubAnalyticsSummary(daysBack, includeAdmin),
      fetchCatalogIndex(),
    ]);

    if (statsRes.status === 'fulfilled') {
      setSummary(statsRes.value);
    } else {
      const err = statsRes.reason;
      setStatsError(
        err instanceof Error && err.message
          ? err.message
          : 'Impossible de charger les statistiques Firestore.'
      );
    }

    if (catalogRes.status === 'fulfilled') {
      setCatalogItems(catalogRes.value.items);
      setCatalogUpdatedAt(catalogRes.value.updatedAt);
    }

    setIsLoadingStats(false);
    setIsLoadingCatalog(false);
  }, [daysBack, includeAdmin, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      recordHubEvent({ type: 'admin_event', target: 'stats_opened' });
      void loadBackendData();
    }
  }, [isAdmin, loadBackendData]);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const auth = getHubAuth();
      const provider = createGoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (!isAllowedAdminUser(result.user)) {
        await signOut(auth);
        setAuthError(
          "Accès refusé : ce compte Google n'est pas autorisé à administrer TrackPilot Hub."
        );
        return;
      }

      onAuthenticated(result.user);
      recordHubEvent({ type: 'admin_event', target: 'login' });
    } catch (err: unknown) {
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code: unknown }).code)
          : '';
      if (code === 'auth/popup-closed-by-user') {
        setAuthError('Connexion annulée.');
      } else {
        setAuthError('Impossible de finaliser la connexion Google pour le moment.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      recordHubEvent({ type: 'admin_event', target: 'logout' });
      await signOut(getHubAuth());
      setSummary(null);
      setSyncFeedback(null);
      onSignedOut();
    } catch {
      setAuthError('Erreur lors de la déconnexion.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSyncCatalog = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const { syncPublicCatalogFromApps } = await import('../services/adminSyncService');
      const report = await syncPublicCatalogFromApps();
      setSyncFeedback({
        type: 'ok',
        text: `Catalogue à jour : ${report.totalActiveCount} parcours (${
          report.syncedCount > 0 ? `${report.syncedCount} mis à jour` : 'aucune écriture'
        }, ${report.unchangedCount} inchangé${report.unchangedCount > 1 ? 's' : ''}${
          report.deletedCount > 0 ? `, ${report.deletedCount} retiré(s)` : ''
        }${report.skippedCount > 0 ? `, ${report.skippedCount} ignoré(s)` : ''}).`,
      });
      await loadBackendData();
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Erreur lors de la synchronisation.';
      setSyncFeedback({ type: 'err', text: message });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportJson = () => {
    if (!summary) return;
    const blob = new Blob([JSON.stringify({ summary, catalogItems }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trackpilot-hub-backend-${daysBack}d-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredCatalog = useMemo(() => {
    const q = catalogFilter.trim().toLowerCase();
    if (!q) return catalogItems;
    return catalogItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.authorName && item.authorName.toLowerCase().includes(q)) ||
        DISCIPLINE_LABELS[item.discipline].toLowerCase().includes(q) ||
        item.app.toLowerCase().includes(q)
    );
  }, [catalogItems, catalogFilter]);

  const tabs: Array<{ id: BackendTab; label: string }> = [
    { id: 'overview', label: 'Vue générale' },
    { id: 'catalog', label: `Plans partagés (${catalogItems.length})` },
    { id: 'plans', label: 'Stats plans & filtres' },
    { id: 'content', label: 'Sections & FAQ' },
    { id: 'logs', label: 'Journal & synchros' },
  ];

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[82vh] space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-brand-400 shrink-0" />
            <span>Back-office TrackPilot Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Synchronisation du catalogue public, aperçu des parcours partagés et statistiques du Hub
          </p>
        </div>

        {isAdmin && currentUser && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSyncCatalog}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-dark-950 bg-brand-400 hover:bg-brand-300 transition-colors cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser le catalogue'}</span>
            </button>

            <button
              type="button"
              onClick={loadBackendData}
              disabled={isLoadingStats || isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 bg-[#08090d] hover:bg-white/5 border border-white/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={authLoading || isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#08090d] hover:bg-white/5 border border-white/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </div>

      {/* State 1: Checking Auth */}
      {isAuthChecking && (
        <div className="max-w-lg mx-auto p-6 rounded-2xl bg-[#08090d] border border-white/10 space-y-4">
          <div className="h-6 w-52 rounded-lg bg-white/5 animate-pulse" />
          <div className="h-24 rounded-xl bg-white/5 animate-pulse" />
        </div>
      )}

      {/* State 2: Not Authenticated */}
      {!isAuthChecking && !isAdmin && (
        <div className="max-w-md mx-auto mt-8 p-6 sm:p-7 rounded-2xl bg-[#08090d] border border-white/10 space-y-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Connexion gestionnaire requise</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Accès réservé à l'administration du Hub
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5 text-xs text-red-200 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <p className="text-xs text-slate-300 leading-relaxed">
            Connectez-vous avec votre compte Google gestionnaire pour synchroniser le catalogue des
            plans publics, inspecter les parcours partagés et consulter les statistiques.
          </p>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={authLoading}
            autoFocus
            className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-dark-950 bg-brand-400 hover:bg-brand-300 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
              />
            </svg>
            <span>{authLoading ? 'Connexion en cours...' : 'Continuer avec Google'}</span>
          </button>
        </div>
      )}

      {/* State 3: Authenticated Backend Workspace */}
      {!isAuthChecking && isAdmin && currentUser && (
        <div className="space-y-6">
          {/* Session & Sync Status Strip */}
          <div className="p-4 rounded-2xl bg-[#08090d] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 text-xs">
              <div className="flex flex-wrap items-center gap-2 font-mono text-brand-300">
                <span className="w-2 h-2 rounded-full bg-brand-400" aria-hidden="true" />
                <span>Session active : {currentUser.email}</span>
              </div>
              <p className="text-slate-400 font-mono tabular-nums">
                Dernière synchronisation catalogue : {formatIsoDateTime(catalogUpdatedAt)} ({catalogItems.length} parcours publics actifs)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={daysBack}
                onChange={(e) => setDaysBack(Number(e.target.value) as 7 | 30 | 90)}
                aria-label="Période d'analyse"
                className="px-2.5 py-1.5 rounded-lg bg-[#090a0f] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-brand-400"
              >
                <option value={7}>7 derniers jours</option>
                <option value={30}>30 derniers jours</option>
                <option value={90}>90 derniers jours</option>
              </select>

              <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#090a0f] border border-white/10 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeAdmin}
                  onChange={(e) => setIncludeAdmin(e.target.checked)}
                  className="accent-emerald-400"
                />
                <span>Inclure admin</span>
              </label>

              <button
                type="button"
                onClick={handleExportJson}
                disabled={!summary || isLoadingStats}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/30 text-xs font-medium text-brand-300 cursor-pointer disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Sync Feedback */}
          {syncFeedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                syncFeedback.type === 'ok'
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/25 text-red-200'
              }`}
            >
              <span>{syncFeedback.text}</span>
              <button
                type="button"
                onClick={() => setSyncFeedback(null)}
                aria-label="Fermer le message"
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error Banner */}
          {statsError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-between gap-3 text-xs text-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{statsError}</span>
              </div>
              <button
                type="button"
                onClick={loadBackendData}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white font-semibold cursor-pointer"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div
            role="tablist"
            aria-label="Sections du back-office"
            className="border-b border-white/10 flex items-center gap-5 overflow-x-auto"
          >
            {tabs.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selected ? 'text-brand-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  {selected && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-400"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Skeleton while loading initial stats */}
          {isLoadingStats && !summary && activeTab !== 'catalog' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className="h-20 rounded-xl bg-[#08090d] border border-white/10 animate-pulse"
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-52 rounded-xl bg-[#08090d] border border-white/10 animate-pulse" />
                <div className="h-52 rounded-xl bg-[#08090d] border border-white/10 animate-pulse" />
              </div>
            </div>
          )}

          {/* Tab: Catalog of shared public plans */}
          {activeTab === 'catalog' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#08090d] border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 id={catalogCaptionId} className="text-sm font-bold text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-brand-400" />
                    <span>Plans publics actuellement partagés ({filteredCatalog.length})</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Vue lecture directe de l'index synchronisé depuis TrackPilot Cycling et Trail
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={catalogFilter}
                    onChange={(e) => setCatalogFilter(e.target.value)}
                    placeholder="Filtrer par nom, auteur, discipline..."
                    aria-label="Filtrer les plans partagés"
                    className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-[#090a0f] border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-400"
                  />
                  {catalogFilter && (
                    <button
                      type="button"
                      onClick={() => setCatalogFilter('')}
                      aria-label="Effacer le filtre"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {isLoadingCatalog ? (
                <div className="space-y-2">
                  {[0, 1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-12 rounded-xl bg-white/[0.03] border border-white/5 animate-pulse"
                    />
                  ))}
                </div>
              ) : filteredCatalog.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  {catalogItems.length === 0
                    ? 'Aucun plan public synchronisé pour le moment. Cliquez sur « Synchroniser le catalogue ».'
                    : 'Aucun parcours ne correspond à ce filtre.'}
                </div>
              ) : (
                <div
                  tabIndex={0}
                  role="region"
                  aria-labelledby={catalogCaptionId}
                  className="hub-table-wrapper max-h-[540px]"
                >
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[11px] font-mono text-slate-400">
                        <th className="py-2.5 pr-3">Nom du parcours</th>
                        <th className="py-2.5 px-2">App</th>
                        <th className="py-2.5 px-2">Discipline</th>
                        <th className="py-2.5 px-2">Auteur</th>
                        <th className="py-2.5 px-2 text-right">Distance</th>
                        <th className="py-2.5 px-2 text-right">D+</th>
                        <th className="py-2.5 px-2 text-right">Sommet</th>
                        <th className="py-2.5 px-2">Mise à jour</th>
                        <th className="py-2.5 pl-2 text-right">Lien</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {filteredCatalog.map((item) => (
                        <tr key={item.id} className="text-slate-200 hover:bg-white/[0.02]">
                          <th
                            scope="row"
                            className="py-2.5 pr-3 font-semibold text-white max-w-[260px] truncate"
                            title={`${item.name} (${item.id})`}
                          >
                            {item.name}
                          </th>
                          <td className="py-2.5 px-2 font-mono uppercase text-[10px]">
                            <span
                              className={
                                item.app === 'cycling' ? 'text-brand-300' : 'text-trail-300'
                              }
                            >
                              {item.app}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 font-mono text-slate-300">
                            {DISCIPLINE_LABELS[item.discipline]}
                          </td>
                          <td className="py-2.5 px-2 text-slate-300 max-w-[140px] truncate">
                            {item.authorName || '-'}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono tabular-nums whitespace-nowrap">
                            {item.totalDistanceKm.toFixed(1)}{' '}
                            <span className="text-slate-500">km</span>
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono tabular-nums whitespace-nowrap text-brand-300">
                            +{Math.round(item.totalElevationGain)}{' '}
                            <span className="text-slate-500">m</span>
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono tabular-nums whitespace-nowrap">
                            {Math.round(item.maxAltitude)}{' '}
                            <span className="text-slate-500">m</span>
                          </td>
                          <td className="py-2.5 px-2 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                            {formatIsoDateTime(item.updatedAt)}
                          </td>
                          <td className="py-2.5 pl-2 text-right">
                            <a
                              href={getAppLaunchUrl(item.app, item.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-300 hover:text-brand-neon"
                            >
                              <span>Ouvrir</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Empty state for stats */}
          {activeTab !== 'catalog' &&
            summary &&
            summary.totalEvents === 0 &&
            summary.syncHistory.length === 0 && (
              <div className="p-8 rounded-2xl bg-[#08090d] border border-white/10 text-center space-y-2">
                <Activity className="w-7 h-7 text-slate-500 mx-auto" />
                <p className="text-sm font-semibold text-white">
                  Aucun événement enregistré sur cette période
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Les visites, aperçus de parcours, filtres, lancements vers Cycling/Trail et
                  actions apparaîtront ici automatiquement.
                </p>
              </div>
            )}

          {/* Stats Tabs */}
          {activeTab !== 'catalog' &&
            summary &&
            (summary.totalEvents > 0 || summary.syncHistory.length > 0) && (
              <div className="space-y-5">
                {/* KPI Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#08090d] border border-white/10">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Visites (sessions)
                    </div>
                    <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
                      {summary.uniqueVisits}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 tabular-nums">
                      {summary.standaloneVisits} en PWA
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#08090d] border border-white/10">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Vues Accueil
                    </div>
                    <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
                      {summary.homeViews}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Route /</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#08090d] border border-white/10">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Vues Plans
                    </div>
                    <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
                      {summary.plansViews}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Route /plans</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#08090d] border border-white/10">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Aperçus tracés
                    </div>
                    <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
                      {summary.routePreviews}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Clics utilisateur</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#08090d] border border-white/10">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Lancements App
                    </div>
                    <div className="text-xl font-bold text-brand-400 font-mono tabular-nums mt-1">
                      {summary.appLaunches}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 tabular-nums">
                      {summary.plansToLaunchRatePct}% des vues Plans
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#08090d] border border-white/10">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Événements totaux
                    </div>
                    <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
                      {summary.totalEvents}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {summary.daysBack} jours
                    </div>
                  </div>
                </div>

                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    {/* Daily Table */}
                    <div className="p-4 rounded-xl bg-[#08090d] border border-white/10 space-y-3">
                      <h3
                        id={dailyCaptionId}
                        className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-brand-400" />
                        <span>Activité quotidienne</span>
                      </h3>
                      {summary.dailyActivity.length === 0 ? (
                        <p className="text-xs text-slate-500">Aucune donnée quotidienne.</p>
                      ) : (
                        <div
                          tabIndex={0}
                          role="region"
                          aria-labelledby={dailyCaptionId}
                          className="hub-table-wrapper max-h-80"
                        >
                          <table className="w-full text-xs text-left">
                            <thead>
                              <tr className="border-b border-white/10 text-[11px] font-mono text-slate-400">
                                <th className="py-2 pr-4">Date (UTC)</th>
                                <th className="py-2 px-3 text-right">Visites</th>
                                <th className="py-2 px-3 text-right">Accueil</th>
                                <th className="py-2 px-3 text-right">Plans</th>
                                <th className="py-2 px-3 text-right">Aperçus</th>
                                <th className="py-2 px-3 text-right">Lancements</th>
                                <th className="py-2 pl-3 text-right">Events</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06] font-mono tabular-nums">
                              {[...summary.dailyActivity].reverse().map((day) => (
                                <tr key={day.date} className="text-slate-200">
                                  <th scope="row" className="py-2 pr-4 text-white font-semibold">
                                    {day.date}
                                  </th>
                                  <td className="py-2 px-3 text-right">{day.visits}</td>
                                  <td className="py-2 px-3 text-right">{day.homeViews}</td>
                                  <td className="py-2 px-3 text-right">{day.plansViews}</td>
                                  <td className="py-2 px-3 text-right">{day.previews}</td>
                                  <td className="py-2 px-3 text-right text-brand-300">
                                    {day.launches}
                                  </td>
                                  <td className="py-2 pl-3 text-right text-slate-400">
                                    {day.events}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Hourly distribution */}
                    <div className="p-4 rounded-xl bg-[#08090d] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                          Répartition horaire (UTC)
                        </h3>
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <div className="grid grid-cols-12 sm:grid-cols-[repeat(24,minmax(0,1fr))] gap-1 items-end h-20 pt-2">
                        {summary.hourlyDistribution.map((count, hour) => {
                          const maxHour = Math.max(...summary.hourlyDistribution, 1);
                          const hPct =
                            count > 0 ? Math.max(12, Math.round((count / maxHour) * 100)) : 4;
                          return (
                            <div
                              key={hour}
                              title={`${hour}h UTC : ${count} événement(s)`}
                              className="flex flex-col items-center justify-end h-full gap-1"
                            >
                              <div
                                className={`w-full rounded-t ${
                                  count > 0 ? 'bg-brand-400/80' : 'bg-white/[0.05]'
                                }`}
                                style={{ height: `${hPct}%` }}
                              />
                              <span className="text-[9px] font-mono text-slate-500 tabular-nums">
                                {hour % 3 === 0 ? hour : ''}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <RankedBarList
                        title="Écrans (par visite)"
                        items={summary.viewportBreakdown}
                        emptyText="Aucune donnée d'écran."
                      />
                      <RankedBarList
                        title="Provenance (référent)"
                        items={summary.referrerBreakdown}
                        emptyText="Aucune provenance enregistrée."
                      />
                      <RankedBarList
                        title="Consentement cookies"
                        items={summary.consentBreakdown}
                        emptyText="Aucun choix enregistré."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'plans' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RankedBarList
                      title="Parcours les plus consultés"
                      items={summary.topRoutesPreviewed}
                      emptyText="Aucun aperçu déclenché par clic pour le moment."
                    />
                    <RankedBarList
                      title="Parcours lancés dans l'app"
                      items={summary.topRoutesLaunched}
                      emptyText="Aucun lancement depuis la fiche parcours."
                    />
                    <RankedBarList
                      title="Sources des lancements App"
                      items={summary.launchSources}
                      emptyText="Aucun lancement vers Cycling ou Trail."
                    />
                    <RankedBarList
                      title="Filtres et recherches catalogue"
                      items={summary.filterUsage}
                      emptyText="Aucun filtre appliqué."
                    />
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RankedBarList
                      title="Profondeur de lecture (Sections Home)"
                      items={summary.topSectionsViewed}
                      emptyText="Aucune section observée."
                    />
                    <RankedBarList
                      title="Boutons CTA cliqués"
                      items={summary.topCtas}
                      emptyText="Aucun clic CTA enregistré."
                    />
                    <RankedBarList
                      title="Questions FAQ ouvertes"
                      items={summary.topFaqOpened}
                      emptyText="Aucune question ouverte."
                    />
                    <RankedBarList
                      title="Onglets guide d'installation PWA"
                      items={summary.installTabs}
                      emptyText="Aucun changement d'onglet."
                    />
                    <RankedBarList
                      title="Actions Contact"
                      items={summary.contactActions}
                      emptyText="Aucune interaction contact."
                    />
                    <RankedBarList
                      title="Modale légale & erreurs client"
                      items={[...summary.legalTabs, ...summary.clientErrors]}
                      emptyText="Aucune ouverture légale ni erreur client."
                    />
                  </div>
                )}

                {activeTab === 'logs' && (
                  <div className="space-y-4">
                    {/* Sync History */}
                    <div className="p-4 rounded-xl bg-[#08090d] border border-white/10 space-y-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-brand-400" />
                        <h3
                          id={syncCaptionId}
                          className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold"
                        >
                          Historique des synchronisations catalogue ({summary.syncHistory.length})
                        </h3>
                      </div>
                      {summary.syncHistory.length === 0 ? (
                        <p className="text-xs text-slate-500">
                          Aucune synchronisation enregistrée dans hub_sync_history pour l'instant.
                        </p>
                      ) : (
                        <div
                          tabIndex={0}
                          role="region"
                          aria-labelledby={syncCaptionId}
                          className="hub-table-wrapper max-h-80"
                        >
                          <table className="w-full text-xs text-left">
                            <thead>
                              <tr className="border-b border-white/10 text-[11px] font-mono text-slate-400">
                                <th className="py-2 pr-3">Date</th>
                                <th className="py-2 px-2">Admin</th>
                                <th className="py-2 px-2">Statut</th>
                                <th className="py-2 px-2 text-right">Actifs</th>
                                <th className="py-2 px-2 text-right">Maj</th>
                                <th className="py-2 px-2 text-right">Retirés</th>
                                <th className="py-2 pl-2 text-right">Durée</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06] font-mono tabular-nums">
                              {summary.syncHistory.map((sync) => (
                                <tr key={sync.id} className="text-slate-200">
                                  <th scope="row" className="py-2 pr-3 whitespace-nowrap font-normal">
                                    {formatShortDateTime(sync.syncedAtMs)}
                                  </th>
                                  <td className="py-2 px-2 truncate max-w-[160px]">
                                    {sync.adminEmail}
                                  </td>
                                  <td className="py-2 px-2">
                                    <span
                                      className={
                                        sync.status === 'ok' ? 'text-brand-300' : 'text-red-400'
                                      }
                                    >
                                      {sync.status}
                                    </span>
                                  </td>
                                  <td className="py-2 px-2 text-right">{sync.totalActiveCount}</td>
                                  <td className="py-2 px-2 text-right">{sync.syncedCount}</td>
                                  <td className="py-2 px-2 text-right">{sync.deletedCount}</td>
                                  <td className="py-2 pl-2 text-right text-slate-400">
                                    {sync.durationMs} ms
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Recent Events */}
                    <div className="p-4 rounded-xl bg-[#08090d] border border-white/10 space-y-3">
                      <div className="flex items-center gap-2">
                        <MousePointerClick className="w-4 h-4 text-brand-400" />
                        <h3
                          id={eventsCaptionId}
                          className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold"
                        >
                          Derniers événements enregistrés ({summary.recentEvents.length})
                        </h3>
                      </div>
                      {summary.recentEvents.length === 0 ? (
                        <p className="text-xs text-slate-500">Aucun événement récent.</p>
                      ) : (
                        <div
                          tabIndex={0}
                          role="region"
                          aria-labelledby={eventsCaptionId}
                          className="hub-table-wrapper max-h-96"
                        >
                          <table className="w-full text-xs text-left">
                            <thead>
                              <tr className="border-b border-white/10 text-[11px] font-mono text-slate-400">
                                <th className="py-2 pr-3">Horodatage</th>
                                <th className="py-2 px-2">Type</th>
                                <th className="py-2 px-2">Vue</th>
                                <th className="py-2 px-2">Détail</th>
                                <th className="py-2 px-2">Contexte</th>
                                <th className="py-2 pl-2">Session</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06] font-mono text-[11px]">
                              {summary.recentEvents.map((ev) => {
                                const detail = [
                                  ev.routeName || ev.previewId,
                                  ev.target,
                                  ev.filterValue,
                                  ev.app,
                                  ev.discipline,
                                ]
                                  .filter(Boolean)
                                  .join(' | ');
                                return (
                                  <tr key={ev.id} className="text-slate-300">
                                    <th
                                      scope="row"
                                      className="py-1.5 pr-3 whitespace-nowrap text-slate-400 font-normal"
                                    >
                                      {formatShortDateTime(ev.tsMs)}
                                    </th>
                                    <td className="py-1.5 px-2 text-white whitespace-nowrap">
                                      {EVENT_TYPE_LABELS[ev.type] ?? ev.type}
                                    </td>
                                    <td className="py-1.5 px-2">{ev.view}</td>
                                    <td className="py-1.5 px-2 max-w-[260px] truncate" title={detail}>
                                      {detail || '-'}
                                    </td>
                                    <td className="py-1.5 px-2 whitespace-nowrap text-slate-400">
                                      {ev.viewport} / {ev.consent}
                                      {ev.standalone ? ' / PWA' : ''}
                                    </td>
                                    <td className="py-1.5 pl-2 text-slate-500">
                                      {ev.visitToken.slice(0, 6)}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default AdminBackendView;
