import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/faq';

export const FaqSection: React.FC = () => {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative py-20 sm:py-28 border-t border-white/[0.06] bg-dark-950 scroll-mt-16"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Questions fréquentes</span>
          </div>
          <h2 id="faq-heading" className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tout comprendre sur TrackPilot
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300">
            Formats acceptés, prévision du vent sur trace GPX, fontaines OpenStreetMap et guidage sans réseau.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.id}
              id={item.id}
              className="faq-details group rounded-xl glass-panel border border-white/[0.09] hover:border-brand-500/35 open:border-brand-500/40 transition-colors duration-150"
            >
              <summary className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 cursor-pointer select-none text-left text-sm sm:text-base font-semibold text-white rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                <span>{item.question}</span>
                <ChevronDown
                  className="faq-chevron w-4 h-4 text-brand-400 shrink-0"
                  aria-hidden="true"
                />
              </summary>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-sm text-slate-300 leading-relaxed border-t border-white/[0.06]">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
