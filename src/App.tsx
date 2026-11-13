import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ModulesHub } from './components/ModulesHub';
import { TechPillars } from './components/TechPillars';
import { FieldResilience } from './components/FieldResilience';
import { StatelessSection } from './components/StatelessSection';
import { InstallSection } from './components/InstallSection';
import { EcosystemVision } from './components/EcosystemVision';
import { ContactSection } from './components/ContactSection';
import { ContactModal } from './components/ContactModal';
import { LegalModal, LegalTab } from './components/LegalModal';
import { CookieBanner } from './components/CookieBanner';
import { Footer } from './components/Footer';
import { enableAnalytics, getCookieConsent, setCookieConsent } from './utils/analytics';

export const App: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const syncLegalHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#mentions') {
        setLegalTab('mentions');
      } else if (hash === '#confidentialite' || hash === '#privacy') {
        setLegalTab('privacy');
      } else if (hash === '#cgu' || hash === '#disclaimer') {
        setLegalTab('disclaimer');
      }
    };

    syncLegalHash();
    window.addEventListener('hashchange', syncLegalHash);
    return () => window.removeEventListener('hashchange', syncLegalHash);
  }, []);

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent === 'accepted') {
      enableAnalytics();
    } else if (consent === null) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleCloseLegal = () => {
    setLegalTab(null);
    const hash = window.location.hash.toLowerCase();
    if (['#mentions', '#confidentialite', '#privacy', '#cgu', '#disclaimer'].includes(hash)) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleAcceptCookies = () => {
    setCookieConsent('accepted');
    setShowCookieBanner(false);
  };

  const handleRefuseCookies = () => {
    setCookieConsent('refused');
    setShowCookieBanner(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500/20 selection:text-brand-300">
      <Navbar onOpenContact={() => setIsContactModalOpen(true)} />
      <main className="flex-1">
        <Hero />
        <ModulesHub />
        <TechPillars />
        <FieldResilience />
        <StatelessSection />
        <InstallSection />
        <EcosystemVision onOpenContact={() => setIsContactModalOpen(true)} />
        <ContactSection />
      </main>
      <Footer
        onOpenLegal={(tab) => setLegalTab(tab)}
        onOpenCookies={() => setShowCookieBanner(true)}
      />
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      <LegalModal
        activeTab={legalTab}
        onSelectTab={(tab) => setLegalTab(tab)}
        onClose={handleCloseLegal}
        onOpenCookieSettings={() => setShowCookieBanner(true)}
      />
      <CookieBanner
        isOpen={showCookieBanner}
        onAccept={handleAcceptCookies}
        onRefuse={handleRefuseCookies}
        onOpenPrivacy={() => setLegalTab('privacy')}
      />
    </div>
  );
};

export default App;
