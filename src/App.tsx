import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ModulesHub } from './components/ModulesHub';
import { ScreenVersions } from './components/ScreenVersions';
import { TechPillars } from './components/TechPillars';
import { FieldResilience } from './components/FieldResilience';
import { InstallSection } from './components/InstallSection';
import { EcosystemVision } from './components/EcosystemVision';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { ContactModal } from './components/ContactModal';
import { LegalModal, LegalTab } from './components/LegalModal';
import { CookieBanner } from './components/CookieBanner';
import { Footer } from './components/Footer';
import { enableAnalytics, getCookieConsent, setCookieConsent } from './utils/analytics';

const PlansCatalogView = lazy(() => import('./components/PlansCatalogView'));
const AdminLoginModal = lazy(() =>
  import('./components/AdminLoginModal').then((m) => ({ default: m.AdminLoginModal }))
);

export const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'plans'>('home');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  const syncLocationState = useCallback(() => {
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (pathname === '/plans' || pathname.startsWith('/plans/') || hash === '#plans') {
      setView('plans');
    } else {
      setView('home');
    }

    if (hash === '#mentions') {
      setLegalTab('mentions');
    } else if (hash === '#confidentialite' || hash === '#privacy') {
      setLegalTab('privacy');
    } else if (hash === '#cgu' || hash === '#disclaimer') {
      setLegalTab('disclaimer');
    } else if (hash === '#admin') {
      setIsAdminModalOpen(true);
    }
  }, []);

  useEffect(() => {
    syncLocationState();
    window.addEventListener('hashchange', syncLocationState);
    window.addEventListener('popstate', syncLocationState);
    return () => {
      window.removeEventListener('hashchange', syncLocationState);
      window.removeEventListener('popstate', syncLocationState);
    };
  }, [syncLocationState]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const attachAuthListener = async () => {
      try {
        const [{ onAuthStateChanged }, { getHubAuth, isAllowedAdminUser }] = await Promise.all([
          import('firebase/auth'),
          import('./config/firebase'),
        ]);
        if (cancelled) return;
        const auth = getHubAuth();
        unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(isAllowedAdminUser(user) ? user : null);
        });
      } catch {
        // Ignore if Firebase cannot initialize in restricted environments
      }
    };

    if (view === 'plans' || isAdminModalOpen) {
      void attachAuthListener();
    }

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [view, isAdminModalOpen]);

  const handleNavigatePlans = useCallback(() => {
    if (window.location.pathname !== '/plans') {
      window.history.pushState(null, '', '/plans');
    }
    setView('plans');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigateHome = useCallback((sectionHash?: string) => {
    const targetUrl = sectionHash ? `/${sectionHash}` : '/';
    if (window.location.pathname !== '/' || window.location.hash !== (sectionHash ?? '')) {
      window.history.pushState(null, '', targetUrl);
    }
    setView('home');
    if (sectionHash && sectionHash.startsWith('#')) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const el = document.querySelector(sectionHash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleCloseAdminModal = () => {
    setIsAdminModalOpen(false);
    if (window.location.hash.toLowerCase() === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

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
    <div id="top" className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500/20 selection:text-brand-300">
      <Navbar
        activeView={view}
        onNavigateHome={handleNavigateHome}
        onNavigatePlans={handleNavigatePlans}
      />
      <main className="flex-1">
        {view === 'plans' ? (
          <Suspense
            fallback={
              <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto min-h-[80vh]">
                <div className="h-10 w-64 rounded-xl bg-dark-900/70 animate-pulse mb-6" />
                <div className="h-20 rounded-2xl bg-dark-900/60 animate-pulse mb-6" />
                <div className="h-[460px] rounded-2xl bg-dark-900/60 animate-pulse" />
              </div>
            }
          >
            <PlansCatalogView
              onBackHome={handleNavigateHome}
              currentUser={currentUser}
              onAdminSignedOut={() => setCurrentUser(null)}
            />
          </Suspense>
        ) : (
          <>
            <Hero />
            <ModulesHub onOpenPlans={handleNavigatePlans} />
            <ScreenVersions />
            <FieldResilience />
            <TechPillars />
            <InstallSection />
            <EcosystemVision onOpenContact={() => setIsContactModalOpen(true)} />
            <FaqSection />
            <ContactSection />
          </>
        )}
      </main>
      <Footer
        onOpenLegal={(tab) => setLegalTab(tab)}
        onOpenCookies={() => setShowCookieBanner(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      {isAdminModalOpen && (
        <Suspense fallback={null}>
          <AdminLoginModal
            isOpen={isAdminModalOpen}
            onClose={handleCloseAdminModal}
            currentUser={currentUser}
            onAuthenticated={(user) => setCurrentUser(user)}
            onSignedOut={() => setCurrentUser(null)}
          />
        </Suspense>
      )}
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
