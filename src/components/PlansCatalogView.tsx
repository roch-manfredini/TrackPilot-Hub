import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ArrowLeft,
  ArrowUpRight,
  Bike,
  Compass,
  Footprints,
  Info,
  LogOut,
  Mountain,
  RefreshCw,
  RotateCcw,
  Route as RouteIcon,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { getHubAuth, isAllowedAdminUser } from '../config/firebase';
import {
  fetchCatalogIndex,
  fetchPublicPreview,
  getAppLaunchUrl,
} from '../services/catalogService';
import type {
  CatalogApp,
  CatalogDiscipline,
  CatalogSummaryItem,
  PublicPreviewDoc,
} from '../types/catalog';
import {
  decodePolyline,
  interpolateCoordinateAtDistance,
  type DecodedCoordinate,
} from '../utils/trackGeometry';
import { ElevationProfileChart } from './ElevationProfileChart';

interface PlansCatalogViewProps {
  onBackHome: () => void;
  currentUser: User | null;
  onAdminSignedOut: () => void;
}

type UniverseFilter = 'all' | CatalogApp;
type DistanceBucket = 'all' | 'short' | 'medium' | 'long';
type ElevationBucket = 'all' | 'low' | 'mid' | 'high';
type SortMode = 'recent' | 'dist_desc' | 'dist_asc' | 'elev_desc';

const DISCIPLINE_LABELS: Record<CatalogDiscipline, string> = {
  road: 'Route',
  gravel: 'Gravel',
  mtb: 'VTT',
  trail: 'Trail',
  hike: 'Rando',
  walk: 'Marche',
};

const CYCLING_DISCIPLINES: CatalogDiscipline[] = ['road', 'gravel', 'mtb'];
const TRAIL_DISCIPLINES: CatalogDiscipline[] = ['trail', 'hike', 'walk'];

export const PlansCatalogView: React.FC<PlansCatalogViewProps> = ({
  onBackHome,
  currentUser,
  onAdminSignedOut,
}) => {
  const isAdmin = isAllowedAdminUser(currentUser);

  // Catalog index state
  const [items, setItems] = useState<CatalogSummaryItem[]>([]);
  const [indexUpdatedAt, setIndexUpdatedAt] = useState<string>('');
  const [isLoadingIndex, setIsLoadingIndex] = useState(true);
  const [indexError, setIndexError] = useState<string | null>(null);

  // Selected preview state + in-memory cache
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<PublicPreviewDoc | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const previewCacheRef = useRef<Map<string, PublicPreviewDoc>>(new Map());

  // Filter & sort state
  const [universe, setUniverse] = useState<UniverseFilter>('all');
  const [disciplineFilter, setDisciplineFilter] = useState<CatalogDiscipline | 'all'>('all');
  const [distanceBucket, setDistanceBucket] = useState<DistanceBucket>('all');
  const [elevationBucket, setElevationBucket] = useState<ElevationBucket>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('recent');

  // Admin sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  // Map refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const hoverMarkerRef = useRef<L.CircleMarker | null>(null);
  const decodedCoordsRef = useRef<DecodedCoordinate[]>([]);

  const loadCatalog = useCallback(async () => {
    setIsLoadingIndex(true);
    setIndexError(null);
    try {
      const idx = await fetchCatalogIndex();
      setItems(idx.items);
      setIndexUpdatedAt(idx.updatedAt);

      if (idx.items.length > 0) {
        setSelectedId((prev) =>
          prev && idx.items.some((item) => item.id === prev) ? prev : idx.items[0].id
        );
      } else {
        setSelectedId(null);
        setSelectedPreview(null);
      }
    } catch {
      setIndexError(
        'Impossible de charger le catalogue des plans publics pour le moment.'
      );
    } finally {
      setIsLoadingIndex(false);
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  // Filtered & sorted list
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = items.filter((item) => {
      if (universe !== 'all' && item.app !== universe) return false;
      if (disciplineFilter !== 'all' && item.discipline !== disciplineFilter) return false;

      if (distanceBucket === 'short' && item.totalDistanceKm >= 50) return false;
      if (
        distanceBucket === 'medium' &&
        (item.totalDistanceKm < 50 || item.totalDistanceKm >= 100)
      ) {
        return false;
      }
      if (distanceBucket === 'long' && item.totalDistanceKm < 100) return false;

      if (elevationBucket === 'low' && item.totalElevationGain >= 800) return false;
      if (
        elevationBucket === 'mid' &&
        (item.totalElevationGain < 800 || item.totalElevationGain >= 2000)
      ) {
        return false;
      }
      if (elevationBucket === 'high' && item.totalElevationGain < 2000) return false;

      if (q && !item.name.toLowerCase().includes(q)) return false;
      return true;
    });

    const sorted = [...list];
    if (sortMode === 'dist_desc') {
      sorted.sort((a, b) => b.totalDistanceKm - a.totalDistanceKm);
    } else if (sortMode === 'dist_asc') {
      sorted.sort((a, b) => a.totalDistanceKm - b.totalDistanceKm);
    } else if (sortMode === 'elev_desc') {
      sorted.sort((a, b) => b.totalElevationGain - a.totalElevationGain);
    } else {
      sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }

    return sorted;
  }, [items, universe, disciplineFilter, distanceBucket, elevationBucket, searchQuery, sortMode]);

  // Keep selectedId synced to visible filtered list when current selection is filtered out
  useEffect(() => {
    if (filteredItems.length === 0) return;
    if (!selectedId || !filteredItems.some((item) => item.id === selectedId)) {
      setSelectedId(filteredItems[0].id);
    }
  }, [filteredItems, selectedId]);

  // Load selected full preview
  useEffect(() => {
    if (!selectedId) {
      setSelectedPreview(null);
      return;
    }

    const cached = previewCacheRef.current.get(selectedId);
    if (cached) {
      setSelectedPreview(cached);
      setPreviewError(null);
      return;
    }

    let cancelled = false;
    setIsLoadingPreview(true);
    setPreviewError(null);

    fetchPublicPreview(selectedId)
      .then((docData) => {
        if (cancelled) return;
        if (!docData) {
          setPreviewError('Ce parcours public n’est plus disponible.');
          setSelectedPreview(null);
          return;
        }
        previewCacheRef.current.set(selectedId, docData);
        setSelectedPreview(docData);
      })
      .catch(() => {
        if (cancelled) return;
        setPreviewError("Impossible d'afficher le tracé de ce parcours.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPreview(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const isMapReady = !indexError && !isLoadingIndex && filteredItems.length > 0;

  // Initialize Leaflet map once while container stays mounted
  useEffect(() => {
    if (!isMapReady) return;
    const container = mapContainerRef.current;
    if (!container || mapInstanceRef.current) return;

    const map = L.map(container, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
    }).setView([45.8, 4.8], 6);

    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Données: &copy; OpenStreetMap, SRTM | Style: &copy; OpenTopoMap',
      subdomains: 'abc',
      maxZoom: 19,
      maxNativeZoom: 17,
    }).addTo(map);

    const routeGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    routeLayerRef.current = routeGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      routeLayerRef.current = null;
      hoverMarkerRef.current = null;
    };
  }, [isMapReady]);

  // Render active polyline onto Leaflet map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = routeLayerRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    hoverMarkerRef.current = null;
    decodedCoordsRef.current = [];

    if (!selectedPreview?.pathPolyline) return;

    const coords = decodePolyline(selectedPreview.pathPolyline);
    decodedCoordsRef.current = coords;
    if (coords.length < 2) return;

    const latLngs: L.LatLngExpression[] = coords.map((c) => [c.lat, c.lng]);

    // Dark obsidian casing + vibrant emerald line for crisp contrast on topo relief
    L.polyline(latLngs, {
      color: '#07080b',
      weight: 7,
      opacity: 0.78,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(layerGroup);

    const mainLine = L.polyline(latLngs, {
      color: '#10b981',
      weight: 3.5,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(layerGroup);

    // Start marker (emerald) & Finish marker (cyan/white)
    const startPt = coords[0];
    const endPt = coords[coords.length - 1];

    L.circleMarker([startPt.lat, startPt.lng], {
      radius: 6,
      fillColor: '#34d399',
      color: '#07080b',
      weight: 2,
      fillOpacity: 1,
    })
      .bindTooltip('Départ', { direction: 'top' })
      .addTo(layerGroup);

    L.circleMarker([endPt.lat, endPt.lng], {
      radius: 6,
      fillColor: '#f8fafc',
      color: '#0f172a',
      weight: 2,
      fillOpacity: 1,
    })
      .bindTooltip('Arrivée', { direction: 'top' })
      .addTo(layerGroup);

    map.invalidateSize();
    map.fitBounds(mainLine.getBounds(), { padding: [28, 28], animate: false });
  }, [selectedPreview]);

  const handleElevationHover = useCallback(
    (distKm: number | null) => {
      const map = mapInstanceRef.current;
      const layerGroup = routeLayerRef.current;
      if (!map || !layerGroup || !selectedPreview) return;

      if (distKm === null) {
        if (hoverMarkerRef.current) {
          layerGroup.removeLayer(hoverMarkerRef.current);
          hoverMarkerRef.current = null;
        }
        return;
      }

      const pos = interpolateCoordinateAtDistance(
        decodedCoordsRef.current,
        distKm,
        selectedPreview.totalDistanceKm
      );
      if (!pos) return;

      if (!hoverMarkerRef.current) {
        hoverMarkerRef.current = L.circleMarker([pos.lat, pos.lng], {
          radius: 7,
          fillColor: '#ffffff',
          color: '#10b981',
          weight: 3,
          fillOpacity: 1,
        }).addTo(layerGroup);
      } else {
        hoverMarkerRef.current.setLatLng([pos.lat, pos.lng]);
      }
    },
    [selectedPreview]
  );

  const handleUniverseChange = (next: UniverseFilter) => {
    setUniverse(next);
    if (next === 'cycling' && !CYCLING_DISCIPLINES.includes(disciplineFilter as CatalogDiscipline)) {
      setDisciplineFilter('all');
    } else if (
      next === 'trail' &&
      !TRAIL_DISCIPLINES.includes(disciplineFilter as CatalogDiscipline)
    ) {
      setDisciplineFilter('all');
    }
  };

  const resetFilters = () => {
    setUniverse('all');
    setDisciplineFilter('all');
    setDistanceBucket('all');
    setElevationBucket('all');
    setSearchQuery('');
    setSortMode('recent');
  };

  const hasActiveFilters =
    universe !== 'all' ||
    disciplineFilter !== 'all' ||
    distanceBucket !== 'all' ||
    elevationBucket !== 'all' ||
    searchQuery.trim() !== '';

  const availableDisciplines =
    universe === 'cycling'
      ? CYCLING_DISCIPLINES
      : universe === 'trail'
        ? TRAIL_DISCIPLINES
        : [...CYCLING_DISCIPLINES, ...TRAIL_DISCIPLINES];

  const handleAdminSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const { syncPublicCatalogFromApps } = await import('../services/adminSyncService');
      const report = await syncPublicCatalogFromApps();
      previewCacheRef.current.clear();
      await loadCatalog();
      setSyncFeedback({
        type: 'ok',
        text: `Synchronisation réussie : ${report.syncedCount} parcours public${
          report.syncedCount > 1 ? 's' : ''
        }${report.deletedCount > 0 ? `, ${report.deletedCount} retiré(s)` : ''}${
          report.skippedCount > 0 ? `, ${report.skippedCount} ignoré(s)` : ''
        }.`,
      });
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

  const handleSignOut = async () => {
    await signOut(getHubAuth());
    onAdminSignedOut();
  };

  const formatSyncDate = (iso: string) => {
    if (!iso) return null;
    try {
      return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(iso));
    } catch {
      return null;
    }
  };

  const activeSummary =
    items.find((i) => i.id === selectedId) ?? selectedPreview ?? null;

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[82vh]">
      {/* Top Bar: Back + Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-brand-300 transition-colors mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour à l'accueil TrackPilot</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Compass className="w-6 h-6 text-brand-400 shrink-0" />
            <span>Plans de route publics</span>
          </h1>
        </div>

        {/* Count badge */}
        <div className="inline-flex items-center gap-2 self-start sm:self-end px-3.5 py-1.5 rounded-full glass-panel border border-white/10 text-xs font-mono text-slate-300 tabular-nums">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400" aria-hidden="true" />
          <span>
            {isLoadingIndex
              ? 'Chargement...'
              : `${filteredItems.length} parcours affiché${filteredItems.length > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Prominent Consultation-Only Banner */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl glass-panel border border-brand-500/25 bg-brand-500/[0.06] flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center shrink-0 text-brand-400">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs sm:text-sm text-slate-200 leading-relaxed flex-1">
          <strong className="text-white font-semibold">
            Espace de consultation rapide uniquement.
          </strong>{' '}
          Cet aperçu affiche uniquement le tracé géographique et le profil altimétrique (sans
          téléchargement GPX ni réglages personnels). Pour planifier votre stratégie et exploiter
          un parcours complet, ouvrez-le directement dans l’application dédiée{' '}
          <span className="text-brand-300 font-medium">TrackPilot Cycling</span> ou{' '}
          <span className="text-teal-300 font-medium">TrackPilot Trail</span>.
        </div>
      </div>

      {/* Admin-Only Sync Toolbar (completely hidden for normal visitors) */}
      {isAdmin && (
        <div className="mb-6 p-4 rounded-2xl border border-brand-400/35 bg-dark-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-brand-300">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span>Mode Gestionnaire ({currentUser?.email})</span>
            </div>
            {syncFeedback ? (
              <p
                className={`text-xs ${
                  syncFeedback.type === 'ok' ? 'text-emerald-300' : 'text-red-300'
                }`}
              >
                {syncFeedback.text}
              </p>
            ) : (
              indexUpdatedAt && (
                <p className="text-xs text-slate-400">
                  Dernière synchro catalogue : {formatSyncDate(indexUpdatedAt)}
                </p>
              )
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleAdminSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-dark-950 bg-brand-400 hover:bg-brand-300 transition-all disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser'}</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSyncing}
              title="Quitter la session gestionnaire"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-dark-850 hover:bg-dark-800 border border-white/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      )}

      {/* Calibrated Filters Bar */}
      <div className="mb-6 p-4 rounded-2xl glass-panel border border-white/10 space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Universe segmented selector */}
          <div className="inline-flex p-1 rounded-xl bg-dark-950 border border-white/10 self-start">
            <button
              type="button"
              onClick={() => handleUniverseChange('all')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                universe === 'all'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Tous</span>
            </button>
            <button
              type="button"
              onClick={() => handleUniverseChange('cycling')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                universe === 'cycling'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Vélo</span>
            </button>
            <button
              type="button"
              onClick={() => handleUniverseChange('trail')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                universe === 'trail'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>À pied</span>
            </button>
          </div>

          {/* Search + Range Filters */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 lg:justify-end">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un col, massif, nom..."
                aria-label="Rechercher un parcours"
                className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-dark-950 border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-400/60"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Effacer la recherche"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={distanceBucket}
              onChange={(e) => setDistanceBucket(e.target.value as DistanceBucket)}
              aria-label="Filtrer par distance"
              className="px-3 py-1.5 rounded-xl bg-dark-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-brand-400/60"
            >
              <option value="all">Toutes distances</option>
              <option value="short">&lt; 50 km</option>
              <option value="medium">50 – 100 km</option>
              <option value="long">100+ km</option>
            </select>

            <select
              value={elevationBucket}
              onChange={(e) => setElevationBucket(e.target.value as ElevationBucket)}
              aria-label="Filtrer par dénivelé positif"
              className="px-3 py-1.5 rounded-xl bg-dark-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-brand-400/60"
            >
              <option value="all">Tout D+</option>
              <option value="low">&lt; 800 m</option>
              <option value="mid">800 – 2000 m</option>
              <option value="high">2000+ m</option>
            </select>

            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              aria-label="Trier les parcours"
              className="px-3 py-1.5 rounded-xl bg-dark-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-brand-400/60"
            >
              <option value="recent">Plus récents</option>
              <option value="dist_desc">Distance décroissante</option>
              <option value="dist_asc">Distance croissante</option>
              <option value="elev_desc">D+ décroissant</option>
            </select>
          </div>
        </div>

        {/* Discipline pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setDisciplineFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                disciplineFilter === 'all'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Toutes disciplines
            </button>
            {availableDisciplines.map((disc) => (
              <button
                key={disc}
                type="button"
                onClick={() => setDisciplineFilter(disc)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                  disciplineFilter === disc
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/35'
                    : 'text-slate-400 hover:text-slate-200 border border-white/5 hover:border-white/15'
                }`}
              >
                {DISCIPLINE_LABELS[disc]}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-brand-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>
      </div>

      {/* State 1: Error */}
      {indexError && (
        <div className="p-8 rounded-2xl glass-panel border border-red-500/25 text-center space-y-4">
          <p className="text-sm text-red-200">{indexError}</p>
          <button
            type="button"
            onClick={loadCatalog}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-dark-850 hover:bg-dark-800 border border-white/10 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réessayer</span>
          </button>
        </div>
      )}

      {/* State 2: Initial Skeleton Loading */}
      {!indexError && isLoadingIndex && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-1.5">
            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-14 rounded-xl glass-panel border border-white/5 animate-pulse bg-dark-900/60"
              />
            ))}
          </div>
          <div className="lg:col-span-7 h-[520px] rounded-2xl glass-panel border border-white/5 animate-pulse bg-dark-900/60" />
        </div>
      )}

      {/* State 3: Empty catalog or no filter match */}
      {!indexError && !isLoadingIndex && filteredItems.length === 0 && (
        <div className="p-10 rounded-2xl glass-panel border border-white/10 text-center space-y-3">
          <Compass className="w-8 h-8 text-slate-500 mx-auto" />
          <h2 className="text-base font-semibold text-white">
            {items.length === 0
              ? 'Aucun plan public publié pour le moment'
              : 'Aucun parcours ne correspond à vos filtres'}
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {items.length === 0
              ? 'Les parcours publics partagés depuis TrackPilot Cycling et TrackPilot Trail apparaîtront ici après synchronisation.'
              : 'Essayez d’élargir vos critères de distance, de dénivelé ou de discipline.'}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Afficher tous les parcours</span>
            </button>
          )}
        </div>
      )}

      {/* State 4: Nominal Catalog + Map & Elevation Inspection */}
      {!indexError && !isLoadingIndex && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Route List */}
          <div className="lg:col-span-5 space-y-1.5 lg:max-h-[680px] lg:overflow-y-auto lg:pr-1">
            {filteredItems.map((item) => {
              const isSelected = item.id === selectedId;
              const isCycling = item.app === 'cycling';

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-500/[0.1] border-brand-400/55 shadow-md shadow-brand-500/5'
                      : 'glass-panel border-white/8 hover:border-white/20 hover:bg-dark-850/80'
                  }`}
                >
                  <h3 className="text-[13px] sm:text-sm font-semibold text-white truncate leading-snug">
                    {item.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-2.5 text-[11px] font-mono tabular-nums text-slate-300">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-px rounded text-[10px] uppercase tracking-wider border shrink-0 ${
                        isCycling
                          ? 'text-brand-300 bg-brand-500/10 border-brand-500/25'
                          : 'text-teal-300 bg-teal-500/10 border-teal-500/25'
                      }`}
                    >
                      {isCycling ? (
                        <Bike className="w-2.5 h-2.5" />
                      ) : (
                        <Footprints className="w-2.5 h-2.5" />
                      )}
                      <span>{DISCIPLINE_LABELS[item.discipline]}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 shrink-0">
                      <RouteIcon className="w-3 h-3 text-slate-500" />
                      <span>{item.totalDistanceKm.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-500">km</span>
                    </span>

                    <span className="inline-flex items-center gap-1 shrink-0">
                      <Mountain className="w-3 h-3 text-brand-400/80" />
                      <span>+{Math.round(item.totalElevationGain)}</span>
                      <span className="text-[10px] text-slate-500">m</span>
                    </span>

                    <span className="text-[10px] text-slate-500 ml-auto truncate">
                      {Math.round(item.maxAltitude)}m • {isCycling ? 'Cycling' : 'Trail'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Inspection Panel (Sticky on Desktop) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 rounded-2xl glass-panel border border-white/10 p-4 sm:p-5 space-y-4">
            {activeSummary && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-brand-300">
                        {activeSummary.app === 'cycling'
                          ? 'TrackPilot Cycling'
                          : 'TrackPilot Trail'}{' '}
                        • {DISCIPLINE_LABELS[activeSummary.discipline]}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      {activeSummary.name}
                    </h2>
                  </div>

                  <a
                    href={getAppLaunchUrl(activeSummary.app, activeSummary.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-dark-950 bg-brand-400 hover:bg-brand-300 transition-all shrink-0 shadow-lg shadow-brand-500/15"
                  >
                    <span>
                      Ouvrir dans TrackPilot{' '}
                      {activeSummary.app === 'cycling' ? 'Cycling' : 'Trail'}
                    </span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Metrics Strip */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-dark-950/70 border border-white/5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      Distance
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white font-mono tabular-nums mt-0.5">
                      {activeSummary.totalDistanceKm.toFixed(1)}{' '}
                      <span className="text-xs font-normal text-slate-400">km</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-dark-950/70 border border-white/5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      Dénivelé +
                    </div>
                    <div className="text-base sm:text-lg font-bold text-brand-400 font-mono tabular-nums mt-0.5">
                      +{Math.round(activeSummary.totalElevationGain)}{' '}
                      <span className="text-xs font-normal text-slate-400">m</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-dark-950/70 border border-white/5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      Sommet
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white font-mono tabular-nums mt-0.5">
                      {Math.round(activeSummary.maxAltitude)}{' '}
                      <span className="text-xs font-normal text-slate-400">m</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Leaflet Map Container */}
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-dark-950 h-[270px] sm:h-[310px]">
              <div ref={mapContainerRef} className="w-full h-full z-0" />
              {isLoadingPreview && (
                <div className="absolute inset-0 bg-dark-950/75 backdrop-blur-xs flex items-center justify-center z-10 text-xs font-mono text-slate-300">
                  Chargement du tracé...
                </div>
              )}
              {previewError && (
                <div className="absolute inset-0 bg-dark-950/90 flex items-center justify-center z-10 text-xs text-red-300 px-4 text-center">
                  {previewError}
                </div>
              )}
            </div>

            {/* Interactive Elevation Chart */}
            {selectedPreview && !previewError && (
              <div className="p-3 sm:p-4 rounded-xl bg-dark-950/70 border border-white/5">
                <ElevationProfileChart
                  elevationSamples={selectedPreview.elevationSamples}
                  totalDistanceKm={selectedPreview.totalDistanceKm}
                  minAltitude={selectedPreview.minAltitude}
                  maxAltitude={selectedPreview.maxAltitude}
                  onHoverDistanceKm={handleElevationHover}
                />
              </div>
            )}

            <p className="text-[11px] text-slate-500 text-center pt-1">
              Consultation seule sans téléchargement • Les réglages personnels et le calcul de
              ravitaillement s’effectuent dans l’application cible.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansCatalogView;
