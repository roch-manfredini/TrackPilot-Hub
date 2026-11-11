import React, { useState } from 'react';
import { Wind, Droplets, Flame, Navigation, Activity, CheckCircle2 } from 'lucide-react';

interface RoutePoint {
  km: number;
  alt: number;
  gradient: number;
  windSpeed: number;
  windDirection: string; // 'face' | 'side' | 'tail'
  windAngle: number;
  fuelRate: number; // g/h
  waterDist: number; // m
  waterName: string;
}

const ROUTE_DATA: RoutePoint[] = [
  { km: 0, alt: 240, gradient: 1.2, windSpeed: 14, windDirection: 'face', windAngle: 15, fuelRate: 50, waterDist: 0, waterName: 'Départ - Fontaine du village' },
  { km: 15, alt: 420, gradient: 3.5, windSpeed: 16, windDirection: 'face', windAngle: 25, fuelRate: 60, waterDist: 1200, waterName: 'Source des Pins (km 16.2)' },
  { km: 32, alt: 890, gradient: 7.8, windSpeed: 24, windDirection: 'side', windAngle: 75, fuelRate: 75, waterDist: 400, waterName: 'Cimetière communal (Eau potable)' },
  { km: 48, alt: 1420, gradient: 9.4, windSpeed: 28, windDirection: 'face', windAngle: -10, fuelRate: 85, waterDist: 3100, waterName: 'Refuge du Col (km 51)' },
  { km: 64, alt: 1912, gradient: 10.2, windSpeed: 34, windDirection: 'face', windAngle: 5, fuelRate: 90, waterDist: 800, waterName: 'Sommet - Bar / Fontaine' },
  { km: 78, alt: 1250, gradient: -6.5, windSpeed: 22, windDirection: 'tail', windAngle: 170, fuelRate: 40, waterDist: 500, waterName: 'Lavoir de la Vallée' },
  { km: 95, alt: 780, gradient: -2.1, windSpeed: 18, windDirection: 'tail', windAngle: 165, fuelRate: 45, waterDist: 2200, waterName: 'Fontaine du Marché' },
  { km: 114, alt: 310, gradient: 0.5, windSpeed: 12, windDirection: 'side', windAngle: 90, fuelRate: 50, waterDist: 0, waterName: 'Arrivée' },
];

export const TelemetryPreview: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(3); // Default at Col climb
  const current = ROUTE_DATA[activeIdx];

  // SVG dimensions for elevation profile
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 20;

  const maxKm = 114;
  const minAlt = 200;
  const maxAlt = 2000;

  const getX = (km: number) => paddingX + (km / maxKm) * (svgWidth - 2 * paddingX);
  const getY = (alt: number) => svgHeight - paddingY - ((alt - minAlt) / (maxAlt - minAlt)) * (svgHeight - 2 * paddingY);

  const pointsPath = ROUTE_DATA.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.km).toFixed(1)} ${getY(p.alt).toFixed(1)}`).join(' ');
  const areaPath = `${pointsPath} L ${getX(maxKm).toFixed(1)} ${svgHeight - paddingY} L ${getX(0).toFixed(1)} ${svgHeight - paddingY} Z`;

  return (
    <div className="relative w-full rounded-2xl glass-panel p-5 sm:p-7 overflow-hidden border border-white/10 shadow-2xl">
      
      {/* Top Header Cockpit Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-brand-400 font-semibold">Télémétrie Active</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-neon animate-pulse"></span>
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight">Col du Ventoux — Traversée Sud-Nord (114.2 km)</h4>
          </div>
        </div>

        {/* GPS Badge & Format */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-dark-800 text-slate-400 border border-white/5">
            Format: FIT / GPX v1.1
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/30">
            <CheckCircle2 className="w-3 h-3 text-brand-400" />
            Synchronisé
          </span>
        </div>
      </div>

      {/* Primary KPI Grid (Tabular Nums & Craft rules) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-5">
        
        {/* Metric 1: Distance & Altitude */}
        <div className="p-3.5 rounded-xl bg-dark-900/80 border border-white/5">
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Progression / Alt.</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white tabular-nums tracking-tight">
              {current.km.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-medium">km</span>
            <span className="text-slate-600 mx-1">/</span>
            <span className="text-xl font-bold text-emerald-400 tabular-nums">
              {current.alt}
            </span>
            <span className="text-xs text-slate-400 font-medium">m</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>D+ Total : <strong className="text-slate-200 tabular-nums">2 450 m</strong></span>
          </div>
        </div>

        {/* Metric 2: Slope / Gradient */}
        <div className="p-3.5 rounded-xl bg-dark-900/80 border border-white/5">
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Pente Locale</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold tabular-nums tracking-tight ${
              current.gradient > 8 ? 'text-amber-400' : current.gradient > 4 ? 'text-emerald-400' : 'text-slate-100'
            }`}>
              {current.gradient > 0 ? `+${current.gradient}` : current.gradient}
            </span>
            <span className="text-xs text-slate-400 font-medium">%</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {current.gradient > 8 ? 'Rampe sévère • 34x30' : current.gradient < 0 ? 'Descente technique' : 'Faux-plat montant'}
          </div>
        </div>

        {/* Metric 3: Weather & Headwind */}
        <div className="p-3.5 rounded-xl bg-dark-900/80 border border-white/5">
          <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            <span>Vent Relatif</span>
            <Wind className="w-3.5 h-3.5 text-brand-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white tabular-nums tracking-tight">
              {current.windSpeed}
            </span>
            <span className="text-xs text-slate-400 font-medium">km/h</span>
            <span className="text-xs px-1.5 py-0.5 rounded font-mono uppercase font-bold text-[10px] ml-auto bg-dark-800 text-slate-300 border border-white/10">
              {current.windDirection === 'face' ? 'Face' : current.windDirection === 'tail' ? 'Dos' : 'Latéral'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <Navigation 
              className="w-3 h-3 text-brand-400 inline" 
              style={{ transform: `rotate(${current.windAngle}deg)` }} 
            />
            <span className="text-slate-300">Angle incident {current.windAngle}°</span>
          </div>
        </div>

        {/* Metric 4: Carbohydrates & Hydration */}
        <div className="p-3.5 rounded-xl bg-dark-900/80 border border-white/5">
          <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            <span>Cible Nutrition</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-amber-400 tabular-nums tracking-tight">
              {current.fuelRate}
            </span>
            <span className="text-xs text-slate-400 font-medium">g/h</span>
            <span className="text-slate-600 mx-1">•</span>
            <span className="text-base font-bold text-sky-400 tabular-nums">750</span>
            <span className="text-xs text-slate-400 font-medium">ml/h</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            Ratio 1:0.8 • 1 gel / 35 min
          </div>
        </div>

      </div>

      {/* Dynamic Elevation Chart SVG */}
      <div className="mt-4 p-4 rounded-xl bg-dark-950/80 border border-white/5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-mono text-slate-300">Profil Altimétrique Dynamique — Cliquez ou survolez la trace :</span>
          <span className="hidden sm:inline font-mono text-brand-400">Point actuel : {current.waterName}</span>
        </div>

        <div className="relative w-full overflow-hidden">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 sm:h-52 overflow-visible">
            <defs>
              <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#10b981" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1={paddingX} y1={getY(500)} x2={svgWidth - paddingX} y2={getY(500)} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1={paddingX} y1={getY(1000)} x2={svgWidth - paddingX} y2={getY(1000)} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1={paddingX} y1={getY(1500)} x2={svgWidth - paddingX} y2={getY(1500)} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1={paddingX} y1={getY(2000)} x2={svgWidth - paddingX} y2={getY(2000)} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

            {/* Area Fill */}
            <path d={areaPath} fill="url(#elevationGrad)" />

            {/* Main Elevation Stroke */}
            <path 
              d={pointsPath} 
              fill="none" 
              stroke="url(#lineGrad)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="path-glow"
            />

            {/* Interactive waypoint pins & water markers */}
            {ROUTE_DATA.map((p, idx) => {
              const cx = getX(p.km);
              const cy = getY(p.alt);
              const isSelected = idx === activeIdx;

              return (
                <g 
                  key={idx} 
                  className="cursor-pointer group"
                  onClick={() => setActiveIdx(idx)}
                  onMouseEnter={() => setActiveIdx(idx)}
                >
                  {/* Scrubber vertical guide line on selected */}
                  {isSelected && (
                    <line 
                      x1={cx} 
                      y1={paddingY} 
                      x2={cx} 
                      y2={svgHeight - paddingY} 
                      stroke="#10b981" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3"
                      className="opacity-70"
                    />
                  )}

                  {/* Halo pulse */}
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={isSelected ? 10 : 5} 
                    fill="#10b981" 
                    fillOpacity={isSelected ? 0.35 : 0.15} 
                    className="transition-all duration-150"
                  />

                  {/* Core dot */}
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={isSelected ? 5 : 3.5} 
                    fill={isSelected ? '#00E676' : '#10b981'} 
                    stroke="#07080b" 
                    strokeWidth="1.5"
                  />

                  {/* Distance label on axis */}
                  <text 
                    x={cx} 
                    y={svgHeight - 4} 
                    fill="#64748b" 
                    fontSize="9" 
                    textAnchor="middle" 
                    fontFamily="monospace"
                  >
                    {p.km}k
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Live Water Point & Advice Banner */}
        <div className="mt-3 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sky-500/15 text-sky-400">
              <Droplets className="w-3 h-3" />
            </span>
            <span>Ravitaillement détecté : <strong className="text-white font-medium">{current.waterName}</strong></span>
          </div>
          <div className="font-mono text-emerald-400 text-[11px] bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            {current.windDirection === 'face' 
              ? 'Conseil : Réduire l’exposition frontale, abri en peloton conseillé' 
              : 'Conseil : Portion favorable, maintien cadence de pédalage fluide'}
          </div>
        </div>

      </div>

    </div>
  );
};
