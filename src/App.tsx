import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ModulesHub } from './components/ModulesHub';
import { TechPillars } from './components/TechPillars';
import { InstallSection } from './components/InstallSection';
import { EcosystemVision } from './components/EcosystemVision';
import { ContactSection } from './components/ContactSection';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500/20 selection:text-brand-300">
      <Navbar onOpenContact={() => setIsContactModalOpen(true)} />
      <main className="flex-1">
        <Hero />
        <ModulesHub />
        <TechPillars />
        <InstallSection />
        <EcosystemVision onOpenContact={() => setIsContactModalOpen(true)} />
        <ContactSection />
      </main>
      <Footer onOpenContact={() => setIsContactModalOpen(true)} />
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
};

export default App;
