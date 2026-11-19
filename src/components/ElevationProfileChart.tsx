import React, { useId, useMemo, useRef, useState } from 'react';
import { unpackElevationSamples } from '../utils/trackGeometry';

interface ElevationProfileChartProps {
  elevationSamples: number[];
  totalDistanceKm: number;
  minAltitude: number;
  maxAltitude: number;
  accent?: 'cycling' | 'trail';
  onHoverDistanceKm?: (distKm: number | null) => void;
}

const CHART_W = 680;
const CHART_H = 190;
const PAD_TOP = 16;
const PAD_RIGHT = 14;
const PAD_BOTTOM = 26;
const PAD_LEFT = 46;

export const ElevationProfileChart: React.FC<ElevationProfileChartProps> = ({
  elevationSamples,
  totalDistanceKm,
  minAltitude,
  maxAltitude,
  accent = 'cycling',
  onHoverDistanceKm,
}) => {
  const gradientId = useId();
  const isTrail = accent === 'trail';
  const strokeColor = isTrail ? '#f97316' : '#34d399';
  const crosshairColor = isTrail ? 'rgba(249, 115, 22, 0.55)' : 'rgba(52, 211, 153, 0.55)';
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const samples = useMemo(
    () => unpackElevationSamples(elevationSamples),
    [elevationSamples]
  );

  const plot = useMemo(() => {
    if (samples.length < 2) return null;

    const plotW = CHART_W - PAD_LEFT - PAD_RIGHT;
    const plotH = CHART_H - PAD_TOP - PAD_BOTTOM;

    const maxD = Math.max(
      totalDistanceKm,
      samples[samples.length - 1]?.d ?? 0,
      0.1
    );

    const rawMinE = Math.min(minAltitude, ...samples.map((s) => s.e));
    const rawMaxE = Math.max(maxAltitude, ...samples.map((s) => s.e));
    const spanE = Math.max(rawMaxE - rawMinE, 30);
    const yMin = Math.floor((rawMinE - spanE * 0.08) / 10) * 10;
    const yMax = Math.ceil((rawMaxE + spanE * 0.1) / 10) * 10;
    const ySpan = Math.max(yMax - yMin, 10);

    const coords = samples.map((s, idx) => {
      const x = PAD_LEFT + (s.d / maxD) * plotW;
      const y = PAD_TOP + plotH - ((s.e - yMin) / ySpan) * plotH;
      const prev = idx > 0 ? samples[idx - 1] : null;
      const dDistM = prev ? (s.d - prev.d) * 1000 : 0;
      const grade =
        prev && dDistM >= 20 ? ((s.e - prev.e) / dDistM) * 100 : 0;
      return { x, y, d: s.d, e: s.e, grade };
    });

    const linePath = coords
      .map((c, idx) => `${idx === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
      .join(' ');
    const baseLineY = PAD_TOP + plotH;
    const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${baseLineY} L ${coords[0].x.toFixed(1)} ${baseLineY} Z`;

    const yTicks = [0, 0.5, 1].map((t) => {
      const val = Math.round(yMin + t * ySpan);
      const y = PAD_TOP + plotH - t * plotH;
      return { val, y };
    });

    const xTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
      val: Math.round(maxD * t),
      x: PAD_LEFT + t * plotW,
    }));

    return {
      coords,
      linePath,
      areaPath,
      yTicks,
      xTicks,
      baseLineY,
      maxD,
      plotW,
    };
  }, [samples, totalDistanceKm, minAltitude, maxAltitude]);

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!plot || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;

    const svgX = ((e.clientX - rect.left) / rect.width) * CHART_W;
    const clampedX = Math.max(PAD_LEFT, Math.min(PAD_LEFT + plot.plotW, svgX));
    const targetD = ((clampedX - PAD_LEFT) / plot.plotW) * plot.maxD;

    let closestIdx = 0;
    let bestDiff = Infinity;
    for (let i = 0; i < plot.coords.length; i++) {
      const diff = Math.abs(plot.coords[i].d - targetD);
      if (diff < bestDiff) {
        bestDiff = diff;
        closestIdx = i;
      }
    }

    setHoverIdx(closestIdx);
    onHoverDistanceKm?.(plot.coords[closestIdx].d);
  };

  const handlePointerLeave = () => {
    setHoverIdx(null);
    onHoverDistanceKm?.(null);
  };

  if (!plot) {
    return (
      <div className="h-[190px] flex items-center justify-center rounded-xl border border-white/5 bg-dark-900/50 text-xs text-slate-500">
        Données altimétriques indisponibles pour ce parcours.
      </div>
    );
  }

  const hovered = hoverIdx !== null ? plot.coords[hoverIdx] : null;

  return (
    <div className="relative select-none">
      <div className="flex items-center justify-between gap-2 mb-2 px-0.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
          Profil altimétrique
        </span>
        {hovered ? (
          <div
            className={`inline-flex items-center gap-3 text-xs font-mono tabular-nums text-slate-200 bg-dark-900/90 border px-2.5 py-0.5 rounded-md ${
              isTrail ? 'border-trail-500/35' : 'border-brand-500/30'
            }`}
          >
            <span>
              {hovered.d.toFixed(1)} <span className="text-[10px] text-slate-400">km</span>
            </span>
            <span className={`font-semibold ${isTrail ? 'text-trail-400' : 'text-brand-400'}`}>
              {Math.round(hovered.e)}{' '}
              <span className={`text-[10px] ${isTrail ? 'text-trail-300/70' : 'text-brand-300/70'}`}>
                m
              </span>
            </span>
            <span className="text-slate-300">
              {hovered.grade >= 0 ? '+' : ''}
              {hovered.grade.toFixed(1)}
              <span className="text-[10px] text-slate-400">%</span>
            </span>
          </div>
        ) : (
          <span className="text-[11px] font-mono tabular-nums text-slate-500">
            Alt. {Math.round(minAltitude)}-{Math.round(maxAltitude)}{' '}
            <span className="text-[10px]">m</span>
          </span>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full h-auto block touch-none cursor-crosshair"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        role="img"
        aria-label="Profil altimétrique du parcours"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.34" />
            <stop offset="85%" stopColor={strokeColor} stopOpacity="0.04" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal altitude gridlines */}
        {plot.yTicks.map((tick) => (
          <g key={tick.val}>
            <line
              x1={PAD_LEFT}
              x2={CHART_W - PAD_RIGHT}
              y1={tick.y}
              y2={tick.y}
              stroke="rgba(148, 163, 184, 0.12)"
              strokeDasharray="3 4"
              strokeWidth="1"
            />
            <text
              x={PAD_LEFT - 8}
              y={tick.y + 3}
              textAnchor="end"
              className="fill-slate-500 text-[10px] font-mono tabular-nums"
            >
              {tick.val}m
            </text>
          </g>
        ))}

        {/* X axis distance ticks */}
        {plot.xTicks.map((tick, idx) => (
          <text
            key={`${tick.val}-${idx}`}
            x={tick.x}
            y={CHART_H - 6}
            textAnchor={idx === 0 ? 'start' : idx === plot.xTicks.length - 1 ? 'end' : 'middle'}
            className="fill-slate-500 text-[10px] font-mono tabular-nums"
          >
            {tick.val} km
          </text>
        ))}

        {/* Area & trace curve */}
        <path d={plot.areaPath} fill={`url(#${gradientId})`} />
        <path
          d={plot.linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Interactive crosshair */}
        {hovered && (
          <g>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={PAD_TOP}
              y2={plot.baseLineY}
              stroke={crosshairColor}
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle
              cx={hovered.x}
              cy={hovered.y}
              r="5"
              fill="#07080b"
              stroke={strokeColor}
              strokeWidth="2.5"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
