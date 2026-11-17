import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  Activity,
  BarChart3,
  Download,
  RefreshCw,
  ShieldCheck,
  X,
  AlertCircle,
  Clock,
  Compass,
  MousePointerClick,
} from 'lucide-react';
import { fetchHubAnalyticsSummary, recordHubEvent } from '../services/historyService';
import type { HubAnalyticsSummary, RankedCounterItem } from '../types/history';

interface AdminStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const AdminStatsModal: React.FC<AdminStatsModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();

  const [daysBack, setDaysBack] = useState<7 | 30 | 90>(30);
  const [includeAdmin, setIncludeAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<StatsTab>('overview');
  const [summary, setSummary] = useState<HubAnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
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
  }, [daysBack, includeAdmin]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      recordHubEvent({ type: 'admin_event', target: 'stats_opened' });
      void loadStats();
    } else if (dialog.open) {
      dialog.close();
      dialog.returnValue = '';
    }
  }, [isOpen, loadStats]);

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
    { id: 'overview', label: 'Vue generale' },
    { id: 'plans', label: 'Plans & filtres' },
    { id: 'content', label: 'Sections & FAQ' },
    { id: 'logs', label: 'Journal & synchros' },
  ];

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: 'any' } as Record<string, string>)}
      onClose={handleClose}
      className="m-auto w-[calc(100%-1.5rem)] max-w-5xl rounded-2xl border border-white/15 bg-[#090a0f] p-0 text-slate-100 shadow-2xl"
    >
      <div className="flex flex-col max-h-[88dvh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-[#08090d] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center text-brand-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 id={titleId} className="text-sm sm:text-base font-bold text-white">
                Historique et statistiques TrackPilot Hub
              </h2>
              <p className="text-[11px] text-slate-400">
                Telemetrie anonymisee sans cookies ni donnees personnelles (Firestore)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={daysBack}
              onChange={(e) => setDaysBack(Number(e.target.value) as 7 | 30 | 90)}
              aria-label="Periode d'analyse"
              className="px-2.5 py-1.5 rounded-lg bg-[#0c1017] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-brand-400"
            >
              <option value={7}>7 derniers jours</option>
              <option value={30}>30 derniers jours</option>
              <option value={90}>90 derniers jours</option>
            </select>

            <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0c1017] border border-white/10 text-xs text-slate-300 cursor-pointer select-none">
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1017] hover:bg-white/5 border border-white/10 text-xs text-slate-200 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              disabled={!summary || isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/30 text-xs font-medium text-brand-300 cursor-pointer disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Fermer les statistiques"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Sections des statistiques"
          className="px-5 pt-2 border-b border-white/10 bg-[#08090d] flex items-center gap-4 overflow-x-auto shrink-0"
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
                className={`relative py-2.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
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
                Reessayer
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
                Aucun evenement enregistre sur cette periode
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Les visites, apercus de parcours, filtres, lancements vers Cycling/Trail et actions
                apparaitront ici des que la version mise a jour est deployee.
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
                    Apercus traces
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
                    Evenements totaux
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
                      Activite quotidienne
                    </h3>
                    {summary.dailyActivity.length === 0 ? (
                      <p className="text-xs text-slate-500">Aucune donnee quotidienne.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="border-b border-white/10 text-[11px] font-mono text-slate-400">
                              <th className="py-2 pr-4">Date (UTC)</th>
                              <th className="py-2 px-3 text-right">Visites</th>
                              <th className="py-2 px-3 text-right">Accueil</th>
                              <th className="py-2 px-3 text-right">Plans</th>
                              <th className="py-2 px-3 text-right">Apercus</th>
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
                        Repartition horaire (UTC)
                      </h3>
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="grid grid-cols-12 sm:grid-cols-[repeat(24,minmax(0,1fr))] gap-1 items-end h-20 pt-2">
                      {summary.hourlyDistribution.map((count, hour) => {
                        const maxHour = Math.max(...summary.hourlyDistribution, 1);
                        const hPct = count > 0 ? Math.max(12, Math.round((count / maxHour) * 100)) : 4;
                        return (
                          <div
                            key={hour}
                            title={`${hour}h UTC : ${count} evenement(s)`}
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
                      title="Ecrans (par visite)"
                      items={summary.viewportBreakdown}
                      emptyText="Aucune donnee d'ecran."
                    />
                    <RankedBarList
                      title="Provenance (referent)"
                      items={summary.referrerBreakdown}
                      emptyText="Aucune provenance enregistree."
                    />
                    <RankedBarList
                      title="Consentement cookies"
                      items={summary.consentBreakdown}
                      emptyText="Aucun choix enregistre."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'plans' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RankedBarList
                    title="Parcours les plus consultes"
                    items={summary.topRoutesPreviewed}
                    emptyText="Aucun apercu declenche par clic pour le moment."
                  />
                  <RankedBarList
                    title="Parcours lances dans l'app"
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
                    emptyText="Aucun filtre applique."
                  />
                </div>
              )}

              {activeTab === 'content' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RankedBarList
                    title="Profondeur de lecture (Sections Home)"
                    items={summary.topSectionsViewed}
                    emptyText="Aucune section observee."
                  />
                  <RankedBarList
                    title="Boutons CTA cliques"
                    items={summary.topCtas}
                    emptyText="Aucun clic CTA enregistre."
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
                    title="Modale legale & erreurs client"
                    items={[...summary.legalTabs, ...summary.clientErrors]}
                    emptyText="Aucune ouverture legale ni erreur client."
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
                        Aucune synchronisation enregistree dans hub_sync_history pour l'instant.
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
                              <th className="py-2 px-2 text-right">Retires</th>
                              <th className="py-2 pl-2 text-right">Duree</th>
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
                        Derniers evenements enregistres ({summary.recentEvents.length})
                      </h3>
                    </div>
                    {summary.recentEvents.length === 0 ? (
                      <p className="text-xs text-slate-500">Aucun evenement recent.</p>
                    ) : (
                      <div className="overflow-x-auto max-h-80 overflow-y-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="border-b border-white/10 text-[11px] font-mono text-slate-400">
                              <th className="py-2 pr-3">Horodatage</th>
                              <th className="py-2 px-2">Type</th>
                              <th className="py-2 px-2">Vue</th>
                              <th className="py-2 px-2">Detail</th>
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
            <span>Collection Firestore : hub_events &amp; hub_sync_history</span>
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
    </dialog>
  );
};

export default AdminStatsModal;
