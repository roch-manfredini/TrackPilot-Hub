import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ModulesHub } from './components/ModulesHub';
import { TechPillars } from './components/TechPillars';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { EcosystemVision } from './components/EcosystemVision';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500/20 selection:text-brand-300">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ModulesHub />
        <TechPillars />
        <InteractiveSimulator />
        <EcosystemVision />
      </main>
      <Footer />
    </div>
  );
};

export default App;
