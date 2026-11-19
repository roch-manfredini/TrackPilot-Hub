import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ArrowLeft,
  ArrowUpRight,
  Bike,
  ChevronDown,
  Compass,
  Footprints,
  Info,
  Mountain,
  RefreshCw,
  RotateCcw,
  Route as RouteIcon,
  Search,
  SlidersHorizontal,
  User as UserIcon,
  X,
} from 'lucide-react';
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
import { getSearchLengthBucket, recordHubEvent } from '../services/historyService';

interface PlansCatalogViewProps {
  onBackHome: (sectionHash?: string) => void;
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
const PAGE_SIZE = 40;

export const PlansCatalogView: React.FC<PlansCatalogViewProps> = ({
  onBackHome,
}) => {
  // Catalog index state
  const [items, setItems] = useState<CatalogSummaryItem[]>([]);
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
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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
      recordHubEvent({ type: 'client_error', target: 'catalog_load' });
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

      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !(item.authorName && item.authorName.toLowerCase().includes(q))
      ) {
        return false;
      }
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

  // Reset DOM pagination cleanly whenever filters or sort order change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [universe, disciplineFilter, distanceBucket, elevationBucket, searchQuery, sortMode]);

  // Debounced anonymous search tracking (never logs raw search string)
  const isFirstSearchEffectRef = useRef(true);
  useEffect(() => {
    if (isFirstSearchEffectRef.current) {
      isFirstSearchEffectRef.current = false;
      return;
    }
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    const timer = window.setTimeout(() => {
      recordHubEvent({
        type: 'catalog_search',
        filterValue: getSearchLengthBucket(trimmed),
        resultsCount: filteredItems.length,
      });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [searchQuery, filteredItems.length]);

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  );

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
        recordHubEvent({
          type: 'client_error',
          target: 'preview_load',
          previewId: selectedId,
        });
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
    recordHubEvent({
      type: 'catalog_filter',
      target: 'universe',
      filterValue: next,
    });
  };

  const resetFilters = () => {
    setUniverse('all');
    setDisciplineFilter('all');
    setDistanceBucket('all');
    setElevationBucket('all');
    setSearchQuery('');
    setSortMode('recent');
    recordHubEvent({
      type: 'catalog_filter',
      target: 'reset',
      filterValue: 'all',
    });
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

  const activeSummary =
    items.find((i) => i.id === selectedId) ?? selectedPreview ?? null;

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[82vh]">
      {/* Top Bar: Back + Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            type="button"
            onClick={() => onBackHome()}
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
      <div className="mb-6 p-4 sm:p-5 rounded-2xl glass-panel border border-brand-500/25 bg-brand-500/[0.06] flex flex-col sm:flex-row items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center shrink-0 text-brand-400">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs sm:text-sm text-slate-200 leading-relaxed flex-1">
          <p>
            <strong className="text-white font-semibold">
              Espace de consultation rapide uniquement.
            </strong>{' '}
            Cet aperçu affiche uniquement le tracé géographique et le profil altimétrique (sans
            téléchargement GPX ni réglages personnels). Pour planifier votre stratégie et exploiter
            un parcours complet, ouvrez-le directement dans l’application dédiée{' '}
            <strong className="text-brand-300 font-semibold">TrackPilot Cycling</strong> ou{' '}
            <strong className="text-trail-300 font-semibold">TrackPilot Trail</strong>.
          </p>

          <details
            className="faq-details mt-2.5"
            onToggle={(e) => {
              if (e.currentTarget.open) {
                recordHubEvent({
                  type: 'faq_toggle',
                  target: 'plans_visibility_info',
                  filterValue: 'open',
                });
              }
            }}
          >
            <summary className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-xs font-medium text-slate-200 hover:text-white transition-all duration-150 active:scale-[0.98] cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              <ChevronDown
                className="w-3.5 h-3.5 text-brand-400 faq-chevron shrink-0"
                aria-hidden="true"
              />
              <span>Infos visibilité et synchronisation</span>
            </summary>

            <div className="mt-2.5 pt-2.5 border-t border-white/10">
              <p>
                Dans le menu <strong className="text-white font-semibold">Ajustements</strong> de
                votre plan de route, décochez la case{' '}
                <strong className="text-white font-semibold">Partager</strong> pour qu’il reste
                privé. Cette liste est synchronisée régulièrement par l’auteur (et non en direct) :
                si votre parcours public n’apparaît pas encore, patientez ou{' '}
                <a
                  href="/#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    recordHubEvent({
                      type: 'contact_action',
                      target: 'modal_open',
                      filterValue: 'plans_banner',
                    });
                    onBackHome('#contact');
                  }}
                  className="text-brand-300 hover:text-brand-neon font-semibold underline decoration-brand-400/60 underline-offset-4 transition-colors"
                >
                  contactez l’auteur
                </a>
                .
              </p>
            </div>
          </details>
        </div>
      </div>

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
                  ? 'bg-trail-500/20 text-trail-300 border border-trail-500/35'
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
              onChange={(e) => {
                const next = e.target.value as DistanceBucket;
                setDistanceBucket(next);
                recordHubEvent({
                  type: 'catalog_filter',
                  target: 'distance',
                  filterValue: next,
                });
              }}
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
              onChange={(e) => {
                const next = e.target.value as ElevationBucket;
                setElevationBucket(next);
                recordHubEvent({
                  type: 'catalog_filter',
                  target: 'elevation',
                  filterValue: next,
                });
              }}
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
              onChange={(e) => {
                const next = e.target.value as SortMode;
                setSortMode(next);
                recordHubEvent({
                  type: 'catalog_filter',
                  target: 'sort',
                  filterValue: next,
                });
              }}
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
              onClick={() => {
                setDisciplineFilter('all');
                recordHubEvent({
                  type: 'catalog_filter',
                  target: 'discipline',
                  filterValue: 'all',
                });
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                disciplineFilter === 'all'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Toutes disciplines
            </button>
            {availableDisciplines.map((disc) => {
              const isTrailDisc = TRAIL_DISCIPLINES.includes(disc);
              return (
                <button
                  key={disc}
                  type="button"
                  onClick={() => {
                    setDisciplineFilter(disc);
                    recordHubEvent({
                      type: 'catalog_filter',
                      target: 'discipline',
                      discipline: disc,
                      filterValue: disc,
                    });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                    disciplineFilter === disc
                      ? isTrailDisc
                        ? 'bg-trail-500/20 text-trail-300 border border-trail-500/35'
                        : 'bg-brand-500/20 text-brand-300 border border-brand-500/35'
                      : 'text-slate-400 hover:text-slate-200 border border-white/5 hover:border-white/15'
                  }`}
                >
                  {DISCIPLINE_LABELS[disc]}
                </button>
              );
            })}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch">
          <div className="lg:col-span-5 lg:relative lg:min-h-0">
            <div className="space-y-1.5 lg:absolute lg:inset-0 lg:overflow-hidden">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                <div
                  key={n}
                  className={`h-14 rounded-xl glass-panel border border-white/5 animate-pulse bg-dark-900/60 ${
                    n >= 7 ? 'hidden lg:block' : ''
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 h-[520px] lg:h-[760px] rounded-2xl glass-panel border border-white/5 animate-pulse bg-dark-900/60" />
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
            {items.length === 0 ? (
              <>
                Les parcours publics partagés depuis{' '}
                <strong className="text-brand-300 font-semibold">TrackPilot Cycling</strong> et{' '}
                <strong className="text-trail-300 font-semibold">TrackPilot Trail</strong>{' '}
                apparaîtront ici après synchronisation.
              </>
            ) : (
              'Essayez d’élargir vos critères de distance, de dénivelé ou de discipline.'
            )}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch">
          {/* Left Route List (height matched to right inspection panel on desktop) */}
          <div className="lg:col-span-5 lg:relative lg:min-h-0">
            <div className="space-y-1.5 lg:absolute lg:inset-0 lg:overflow-y-auto lg:pr-1.5 plans-list-scroller">
              {visibleItems.map((item) => {
              const isSelected = item.id === selectedId;
              const isCycling = item.app === 'cycling';

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(item.id);
                    recordHubEvent({
                      type: 'route_preview',
                      target: 'catalog_click',
                      previewId: item.id,
                      routeName: item.name,
                      app: item.app,
                      discipline: item.discipline,
                    });
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? isCycling
                        ? 'bg-brand-500/[0.1] border-brand-400/55 shadow-md shadow-brand-500/5'
                        : 'bg-trail-500/[0.1] border-trail-400/55 shadow-md shadow-trail-500/5'
                      : 'bg-[#0b0e15]/90 border-white/10 hover:border-white/20 hover:bg-dark-850/90'
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
                          : 'text-trail-300 bg-trail-500/10 border-trail-500/30'
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

                    <span className="text-[10px] text-slate-400 ml-auto truncate max-w-[140px]">
                      {item.authorName || `${Math.round(item.maxAltitude)}m • ${isCycling ? 'Cycling' : 'Trail'}`}
                    </span>
                  </div>
                </button>
              );
            })}

            {visibleCount < filteredItems.length && (
              <button
                type="button"
                onClick={() => {
                  const nextCount = visibleCount + PAGE_SIZE;
                  setVisibleCount(nextCount);
                  recordHubEvent({
                    type: 'catalog_filter',
                    target: 'load_more',
                    resultsCount: Math.min(nextCount, filteredItems.length),
                  });
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0b0e15]/90 border border-white/10 hover:border-brand-400/40 text-xs font-mono text-slate-300 hover:text-brand-300 transition-colors cursor-pointer"
              >
                Afficher plus ({filteredItems.length - visibleCount} restant
                {filteredItems.length - visibleCount > 1 ? 's' : ''})
              </button>
            )}
            </div>
          </div>

          {/* Right Inspection Panel */}
          <div className="lg:col-span-7 rounded-2xl glass-panel border border-white/10 p-4 sm:p-5 space-y-4">
            {activeSummary && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${
                          activeSummary.app === 'cycling' ? 'text-brand-300' : 'text-trail-300'
                        }`}
                      >
                        {activeSummary.app === 'cycling'
                          ? 'TrackPilot Cycling'
                          : 'TrackPilot Trail'}{' '}
                        • {DISCIPLINE_LABELS[activeSummary.discipline]}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      {activeSummary.name}
                    </h2>
                    {activeSummary.authorName && (
                      <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-300">
                        <UserIcon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            activeSummary.app === 'cycling' ? 'text-brand-400' : 'text-trail-400'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{activeSummary.authorName}</span>
                      </div>
                    )}
                  </div>

                  <a
                    href={getAppLaunchUrl(activeSummary.app, activeSummary.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      recordHubEvent({
                        type: 'app_launch',
                        target: 'plans_catalog',
                        app: activeSummary.app,
                        discipline: activeSummary.discipline,
                        previewId: activeSummary.id,
                        routeName: activeSummary.name,
                      })
                    }
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-dark-950 transition-all shrink-0 shadow-lg ${
                      activeSummary.app === 'cycling'
                        ? 'bg-brand-400 hover:bg-brand-300 shadow-brand-500/15'
                        : 'bg-trail-400 hover:bg-trail-300 shadow-trail-500/15'
                    }`}
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
                    <div
                      className={`text-base sm:text-lg font-bold font-mono tabular-nums mt-0.5 ${
                        activeSummary.app === 'trail' ? 'text-trail-400' : 'text-brand-400'
                      }`}
                    >
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
