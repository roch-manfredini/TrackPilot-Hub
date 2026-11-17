import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  Activity,
  BarChart3,
  Download,
  LogOut,
  RefreshCw,
  ShieldCheck,
  X,
  AlertCircle,
  Clock,
  Compass,
  MousePointerClick,
} from 'lucide-react';
import { signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  createGoogleAuthProvider,
  getHubAuth,
  isAllowedAdminUser,
} from '../config/firebase';
import { fetchHubAnalyticsSummary, recordHubEvent } from '../services/historyService';
import type { HubAnalyticsSummary, RankedCounterItem } from '../types/history';

interface AdminStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  isAuthChecking?: boolean;
  onAuthenticated: (user: User) => void;
  onSignedOut: () => void;
}

type StatsTab = 'overview' | 'plans' | 'content' | 'logs';

const EVENT_TYPE_LABELS: Record<string, string> = {
  page_view: 'Vue page',
  section_view: 'Section vue',
  cta_click: 'Clic CTA',
  route_preview: 'Apercu parcours',
  app_launch: 'Lancement app',
  catalog_filter: 'Filtre catalogue',
  catalog_search: 'Recherche catalogue',
  install_tab: 'Onglet installation',
  faq_toggle: 'Ouverture FAQ',
  contact_action: 'Action contact',
  legal_open: 'Ouverture legal',
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

export const AdminStatsModal: React.FC<AdminStatsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  isAuthChecking = false,
  onAuthenticated,
  onSignedOut,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const isAdmin = isAllowedAdminUser(currentUser);

  // Auth & sync states
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  // Stats states
  const [daysBack, setDaysBack] = useState<7 | 30 | 90>(30);
  const [includeAdmin, setIncludeAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<StatsTab>('overview');
  const [summary, setSummary] = useState<HubAnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchHubAnalyticsSummary(daysBack, includeAdmin);
      setSummary(data);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error && err.message
          ? err.message
          : 'Impossible de charger les statistiques Firestore.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [daysBack, includeAdmin, isAdmin]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      setAuthError(null);
      if (!dialog.open) {
        dialog.showModal();
      }
      if (isAdmin) {
        recordHubEvent({ type: 'admin_event', target: 'stats_opened' });
        void loadStats();
      }
    } else if (dialog.open) {
      dialog.close();
      dialog.returnValue = '';
    }
  }, [isOpen, isAdmin, loadStats]);

  // Fallback light-dismiss for Safari without native `closedBy`
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    let pressedOutside = false;
    const onPointerDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) {
        dialog.close();
      }
    };

    dialog.addEventListener('pointerdown', onPointerDown);
    dialog.addEventListener('pointerup', onPointerUp);
    return () => {
      dialog.removeEventListener('pointerdown', onPointerDown);
      dialog.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  const handleClose = () => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.returnValue = '';
    }
    onClose();
  };

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
      handleClose();
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
      await loadStats();
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
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trackpilot-hub-stats-${daysBack}d-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: Array<{ id: StatsTab; label: string }> = [
    { id: 'overview', label: 'Vue générale' },
    { id: 'plans', label: 'Plans & filtres' },
    { id: 'content', label: 'Sections & FAQ' },
    { id: 'logs', label: 'Journal & synchros' },
  ];

  const dialogWidthClass = isAdmin ? 'max-w-5xl' : 'max-w-md';

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: 'any' } as Record<string, string>)}
      onClose={handleClose}
      className={`m-auto w-[calc(100%-1.5rem)] ${dialogWidthClass} rounded-2xl border border-white/15 bg-[#090a0f] p-0 text-slate-100 shadow-2xl`}
    >
      {isAuthChecking ? (
        <div className="p-6 space-y-4">
          <div className="h-6 w-48 rounded-lg bg-[#08090d] border border-white/10 animate-pulse" />
          <div className="h-24 rounded-xl bg-[#08090d] border border-white/10 animate-pulse" />
        </div>
      ) : !isAdmin ? (
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h2 id={titleId} className="text-base font-bold text-white">
                  Cockpit TrackPilot Hub
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Statistiques et synchronisation du catalogue
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Fermer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5 text-xs text-red-200 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <p className="text-xs text-slate-400 leading-relaxed">
              Connectez-vous avec votre compte Google gestionnaire pour accéder aux statistiques et
              à la synchronisation du catalogue.
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
        </div>
      ) : (
        <div className="flex flex-col max-h-[88dvh]">
          {/* Header + Synchroniser button */}
          <div className="px-5 py-4 border-b border-white/10 bg-[#08090d] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center text-brand-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h2 id={titleId} className="text-sm sm:text-base font-bold text-white">
                  Statistiques et synchronisation Hub
                </h2>
                <p className="text-[11px] font-mono text-slate-400 truncate max-w-[260px] sm:max-w-none">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSyncCatalog}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-400 hover:bg-brand-300 text-xs font-semibold text-dark-950 transition-colors cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser le catalogue'}</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={authLoading || isSyncing}
                title="Quitter la session gestionnaire"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0c1017] hover:bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>

              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Fermer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sync Feedback Banner */}
          {syncFeedback && (
            <div
              className={`px-5 py-2.5 border-b border-white/10 text-xs flex items-center justify-between gap-2 ${
                syncFeedback.type === 'ok'
                  ? 'bg-emerald-500/10 text-emerald-300'
                  : 'bg-red-500/10 text-red-200'
              }`}
            >
              <span>{syncFeedback.text}</span>
              <button
                type="button"
                onClick={() => setSyncFeedback(null)}
                aria-label="Masquer le message"
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Filter & Tabs Bar */}
          <div className="px-5 py-2 border-b border-white/10 bg-[#08090d] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div
              role="tablist"
              aria-label="Sections des statistiques"
              className="flex items-center gap-4 overflow-x-auto"
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
                    className={`relative py-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
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

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={daysBack}
                onChange={(e) => setDaysBack(Number(e.target.value) as 7 | 30 | 90)}
                aria-label="Période d'analyse"
                className="px-2.5 py-1 rounded-lg bg-[#0c1017] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-brand-400"
              >
                <option value={7}>7 jours</option>
                <option value={30}>30 jours</option>
                <option value={90}>90 jours</option>
              </select>

              <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0c1017] border border-white/10 text-xs text-slate-300 cursor-pointer select-none">
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
                onClick={loadStats}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0c1017] hover:bg-white/5 border border-white/10 text-xs text-slate-200 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                disabled={!summary || isLoading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/30 text-xs font-medium text-brand-300 cursor-pointer disabled:opacity-40"
              >
                <Download className="w-3 h-3" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="p-5 overflow-y-auto space-y-5 flex-1">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-between gap-3 text-xs text-red-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={loadStats}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white font-semibold cursor-pointer"
                >
                  Réessayer
                </button>
              </div>
            )}

            {isLoading && !summary && (
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

            {summary && summary.totalEvents === 0 && summary.syncHistory.length === 0 && (
              <div className="p-8 rounded-xl bg-[#08090d] border border-white/10 text-center space-y-2">
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

            {summary && (summary.totalEvents > 0 || summary.syncHistory.length > 0) && (
              <>
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
                      <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Activité quotidienne
                      </h3>
                      {summary.dailyActivity.length === 0 ? (
                        <p className="text-xs text-slate-500">Aucune donnée quotidienne.</p>
                      ) : (
                        <div className="overflow-x-auto">
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
                                  <td className="py-2 pr-4 text-white">{day.date}</td>
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
                        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                          Historique des synchronisations catalogue ({summary.syncHistory.length})
                        </h3>
                      </div>
                      {summary.syncHistory.length === 0 ? (
                        <p className="text-xs text-slate-500">
                          Aucune synchronisation enregistrée dans hub_sync_history pour l'instant.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
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
                                  <td className="py-2 pr-3 whitespace-nowrap">
                                    {formatShortDateTime(sync.syncedAtMs)}
                                  </td>
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
                        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                          Derniers événements enregistrés ({summary.recentEvents.length})
                        </h3>
                      </div>
                      {summary.recentEvents.length === 0 ? (
                        <p className="text-xs text-slate-500">Aucun événement récent.</p>
                      ) : (
                        <div className="overflow-x-auto max-h-80 overflow-y-auto">
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
                                    <td className="py-1.5 pr-3 whitespace-nowrap text-slate-400">
                                      {formatShortDateTime(ev.tsMs)}
                                    </td>
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
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-white/10 bg-[#08090d] flex items-center justify-between text-xs text-slate-500 font-mono shrink-0">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-brand-400" />
              <span>Collections Firestore : hub_events &amp; hub_sync_history</span>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="px-3.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 text-slate-300 hover:text-white cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default AdminStatsModal;
