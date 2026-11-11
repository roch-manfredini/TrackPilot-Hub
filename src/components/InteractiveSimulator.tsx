import React, { useState } from 'react';
import { Sliders, Gauge, Flame, Droplets, Wind, ArrowRight } from 'lucide-react';

export const InteractiveSimulator: React.FC = () => {
  // State for interactive calculation
  const [slope, setSlope] = useState<number>(7); // in %
  const [wind, setWind] = useState<number>(20); // in km/h (positive = headwind, negative = tailwind)
  const [ftpPower, setFtpPower] = useState<number>(240); // in Watts

  // Physics & physiological mock calculations
  // Base cycling formula estimation:
  // Rolling + gravity + aero drag
  const effectiveSlope = slope;
  const gravityResistance = (effectiveSlope / 100) * 75 * 9.81; // mass ~ 75kg

  // Approximate speed calculation
  const powerForSpeed = Math.max(80, ftpPower);
  let estimatedSpeedKmh = 14;
  if (slope > 10) {
    estimatedSpeedKmh = Math.max(6.5, (powerForSpeed / (gravityResistance + 10)) * 3.6 * 0.95 - (wind * 0.15));
  } else if (slope > 4) {
    estimatedSpeedKmh = Math.max(9.5, (powerForSpeed / (gravityResistance + 8)) * 3.6 - (wind * 0.2));
  } else {
    estimatedSpeedKmh = Math.max(16, 32 - (effectiveSlope * 2.2) - (wind * 0.35));
  }
  estimatedSpeedKmh = Math.min(65, Math.max(5.5, estimatedSpeedKmh));

  // Carbohydrate consumption based on intensity:
  // At higher watts/slope, higher carb oxidation
  const carbRate = Math.min(100, Math.max(40, Math.round(45 + (ftpPower / 250) * 20 + (slope > 6 ? 15 : 0) + (wind > 15 ? 10 : 0))));
  
  // Hydration demand:
  const hydrationRate = Math.min(1000, Math.max(500, Math.round(500 + (ftpPower / 250) * 150 + (slope > 5 ? 100 : 0))));

  // Recommended gearing
  const recommendedGear = slope >= 10 ? '34 x 32 ou 34' : slope >= 6 ? '34 x 28' : slope >= 2 ? '50 x 21' : '50 x 16';

  return (
    <section id="simulator" className="relative py-20 sm:py-28 bg-dark-900/60 border-t border-white/[0.06] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulateur Interactif en Direct</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Testez l’impact du vent et de la pente en temps réel.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Ajustez les curseurs ci-dessous pour observer comment notre moteur algorithmique recalcule instantanément la vitesse prévisionnelle et les besoins énergétiques.
          </p>
        </div>

        {/* Interactive Sandbox Card */}
        <div className="max-w-4xl mx-auto rounded-2xl glass-panel p-6 sm:p-10 border border-white/10 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Sliders */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Slider 1: Pente */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="slope-slider" className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-400"></span>
                    Pente Moyenne
                  </label>
                  <span className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                    {slope > 0 ? `+${slope} %` : `${slope} %`}
                  </span>
                </div>
                <input
                  id="slope-slider"
                  type="range"
                  min="0"
                  max="14"
                  step="0.5"
                  value={slope}
                  onChange={(e) => setSlope(parseFloat(e.target.value))}
                  className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                  <span>Plat (0%)</span>
                  <span>Col Régulier (7%)</span>
                  <span>Mur Alpin (14%)</span>
                </div>
              </div>

              {/* Slider 2: Vent */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="wind-slider" className="text-sm font-semibold text-white flex items-center gap-2">
                    <Wind className="w-4 h-4 text-teal-400" />
                    Vent Relatif
                  </label>
                  <span className="text-sm font-bold font-mono text-teal-300 tabular-nums">
                    {wind > 0 ? `Face +${wind} km/h` : wind < 0 ? `Dos ${wind} km/h` : 'Nul (0 km/h)'}
                  </span>
                </div>
                <input
                  id="wind-slider"
                  type="range"
                  min="-20"
                  max="40"
                  step="5"
                  value={wind}
                  onChange={(e) => setWind(parseInt(e.target.value))}
                  className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                  <span>Vent dos (-20 km/h)</span>
                  <span>Calme (0)</span>
                  <span>Forte bourrasque (+40 km/h)</span>
                </div>
              </div>

              {/* Slider 3: Puissance Watts */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="power-slider" className="text-sm font-semibold text-white flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-amber-400" />
                    Puissance Développée (Watts)
                  </label>
                  <span className="text-sm font-bold font-mono text-amber-400 tabular-nums">
                    {ftpPower} W
                  </span>
                </div>
                <input
                  id="power-slider"
                  type="range"
                  min="150"
                  max="380"
                  step="10"
                  value={ftpPower}
                  onChange={(e) => setFtpPower(parseInt(e.target.value))}
                  className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                  <span>Endurance (180W)</span>
                  <span>Tempo (250W)</span>
                  <span>Seuil / Clm (350W)</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Recalculated Output Box */}
            <div className="lg:col-span-5 rounded-xl bg-dark-950/90 border border-white/10 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Résultats Algorithmiques</span>
                <span className="inline-block w-2 h-2 rounded-full bg-brand-neon animate-pulse"></span>
              </div>

              {/* Output 1: Speed */}
              <div>
                <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Vitesse Estimée</div>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-white tabular-nums tracking-tight">
                    {estimatedSpeedKmh.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">km/h</span>
                </div>
              </div>

              {/* Output 2: Carbs & Hydration */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded-lg bg-dark-900 border border-white/5">
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-400 uppercase font-mono">
                    <Flame className="w-3 h-3" />
                    <span>Glucides Cible</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-bold text-amber-300 tabular-nums">{carbRate}</span>
                    <span className="text-[11px] text-slate-400">g/h</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-dark-900 border border-white/5">
                  <div className="flex items-center gap-1.5 text-[10px] text-sky-400 uppercase font-mono">
                    <Droplets className="w-3 h-3" />
                    <span>Hydratation</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-bold text-sky-300 tabular-nums">{hydrationRate}</span>
                    <span className="text-[11px] text-slate-400">ml/h</span>
                  </div>
                </div>
              </div>

              {/* Output 3: Recommended Gearing */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="text-[11px] text-slate-400">Développement conseillé :</div>
                <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                  {recommendedGear}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <a
                  href="https://cycling.trackpilot.fit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-dark-950 bg-brand-400 hover:bg-brand-300 transition-colors"
                >
                  <span>Appliquer à un tracé réel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
