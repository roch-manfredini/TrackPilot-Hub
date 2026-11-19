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
import { SloganBadge } from './components/SloganBadge';
import { Footer } from './components/Footer';
import { enableAnalytics, getCookieConsent, setCookieConsent } from './utils/analytics';
import {
  classifyReferrer,
  recordHubEvent,
  setTrackedView,
} from './services/historyService';

const PlansCatalogView = lazy(() => import('./components/PlansCatalogView'));
const AdminBackendView = lazy(() => import('./components/AdminBackendView'));

export const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'plans' | 'admin'>('home');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  const prevSyncedViewRef = React.useRef<'home' | 'plans' | null>(null);

  const syncLocationState = useCallback(() => {
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    const nextView: 'home' | 'plans' =
      pathname === '/plans' || pathname.startsWith('/plans/') || hash === '#plans'
        ? 'plans'
        : 'home';

    setView(nextView);
    setTrackedView(nextView);
    if (prevSyncedViewRef.current !== null && prevSyncedViewRef.current !== nextView) {
      recordHubEvent({
        type: 'page_view',
        view: nextView,
        target: 'popstate',
      });
    }
    prevSyncedViewRef.current = nextView;

    if (hash === '#mentions') {
      setLegalTab('mentions');
    } else if (hash === '#confidentialite' || hash === '#privacy') {
      setLegalTab('privacy');
    } else if (hash === '#cgu' || hash === '#disclaimer') {
      setLegalTab('disclaimer');
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
      setIsAuthChecking(true);
      try {
        const [{ onAuthStateChanged }, { getHubAuth, isAllowedAdminUser }] = await Promise.all([
          import('firebase/auth'),
          import('./config/firebase'),
        ]);
        if (cancelled) return;
        const auth = getHubAuth();
        if (typeof auth.authStateReady === 'function') {
          await auth.authStateReady();
        }
        if (cancelled) return;
        setCurrentUser(isAllowedAdminUser(auth.currentUser) ? auth.currentUser : null);
        setIsAuthChecking(false);
        unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(isAllowedAdminUser(user) ? user : null);
        });
      } catch {
        setIsAuthChecking(false);
      }
    };

    if (view === 'admin') {
      void attachAuthListener();
    }

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [view]);

  const handleNavigatePlans = useCallback(() => {
    const alreadyPlans = window.location.pathname === '/plans';
    if (!alreadyPlans) {
      window.history.pushState(null, '', '/plans');
    }
    setView('plans');
    setTrackedView('plans');
    if (!alreadyPlans) {
      recordHubEvent({
        type: 'page_view',
        view: 'plans',
        target: 'spa',
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigateHome = useCallback((sectionHash?: string) => {
    const wasPlans = window.location.pathname === '/plans' || view === 'plans';
    const targetUrl = sectionHash ? `/${sectionHash}` : '/';
    if (window.location.pathname !== '/' || window.location.hash !== (sectionHash ?? '')) {
      window.history.pushState(null, '', targetUrl);
    }
    setView('home');
    setTrackedView('home');
    if (wasPlans) {
      recordHubEvent({
        type: 'page_view',
        view: 'home',
        target: 'spa',
      });
    }
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
  }, [view]);

  const handleOpenAdminBackend = useCallback(() => {
    setView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent === 'accepted') {
      enableAnalytics();
    } else if (consent === null) {
      setShowCookieBanner(true);
    }

    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const initialView: 'home' | 'plans' =
      pathname === '/plans' || pathname.startsWith('/plans/') || hash === '#plans'
        ? 'plans'
        : 'home';
    setTrackedView(initialView);
    recordHubEvent({
      type: 'page_view',
      view: initialView,
      target: 'initial',
      referrerCategory: classifyReferrer(),
      dedupeKey: `initial_page_view:${initialView}`,
    });
  }, []);

  useEffect(() => {
    if (view === 'home' || view === 'plans') {
      setTrackedView(view);
    }
  }, [view]);

  // Passive scroll-depth tracking across home sections (once per section per visit)
  useEffect(() => {
    if (view !== 'home' || typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) return;

    const sectionIds = [
      'modules',
      'formats',
      'pourquoi',
      'tech',
      'installation',
      'vision',
      'faq',
      'contact',
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            recordHubEvent({
              type: 'section_view',
              view: 'home',
              target: entry.target.id,
              dedupeKey: `section:${entry.target.id}`,
            });
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.3 }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [view]);

  const handleOpenLegal = useCallback((tab: LegalTab) => {
    setLegalTab(tab);
    recordHubEvent({ type: 'legal_open', target: tab });
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
    recordHubEvent({ type: 'cookie_choice', target: 'accepted' });
  };

  const handleRefuseCookies = () => {
    setCookieConsent('refused');
    setShowCookieBanner(false);
    recordHubEvent({ type: 'cookie_choice', target: 'refused' });
  };

  const handleReopenCookies = useCallback(() => {
    setShowCookieBanner(true);
    recordHubEvent({ type: 'cookie_choice', target: 'banner_reopened' });
  }, []);

  return (
    <div id="top" className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500/20 selection:text-brand-300">
      <Navbar
        activeView={view}
        onNavigateHome={handleNavigateHome}
        onNavigatePlans={handleNavigatePlans}
      />
      <main className="flex-1">
        {view === 'admin' ? (
          <Suspense
            fallback={
              <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto min-h-[80vh]">
                <div className="h-10 w-64 rounded-xl bg-dark-900/70 animate-pulse mb-6" />
                <div className="h-24 rounded-2xl bg-dark-900/60 animate-pulse mb-6" />
                <div className="h-[420px] rounded-2xl bg-dark-900/60 animate-pulse" />
              </div>
            }
          >
            <AdminBackendView
              currentUser={currentUser}
              isAuthChecking={isAuthChecking}
              onAuthenticated={(user) => setCurrentUser(user)}
              onSignedOut={() => setCurrentUser(null)}
            />
          </Suspense>
        ) : view === 'plans' ? (
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
            <EcosystemVision
              onOpenContact={() => {
                setIsContactModalOpen(true);
                recordHubEvent({
                  type: 'contact_action',
                  target: 'modal_open',
                  filterValue: 'ecosystem_vision',
                });
              }}
            />
            <FaqSection />
            <ContactSection />
          </>
        )}
      </main>
      <Footer
        onOpenLegal={handleOpenLegal}
        onOpenCookies={handleReopenCookies}
        onOpenAdmin={handleOpenAdminBackend}
      />
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      <LegalModal
        activeTab={legalTab}
        onSelectTab={handleOpenLegal}
        onClose={handleCloseLegal}
        onOpenCookieSettings={handleReopenCookies}
      />
      <SloganBadge
        activeView={view}
        onNavigateHome={handleNavigateHome}
      />
      <CookieBanner
        isOpen={showCookieBanner}
        onAccept={handleAcceptCookies}
        onRefuse={handleRefuseCookies}
        onOpenPrivacy={() => handleOpenLegal('privacy')}
      />
    </div>
  );
};

export default App;
