export type CookieConsentChoice = 'accepted' | 'refused';

const GA_MEASUREMENT_ID = 'G-BFYKSM6F66';
const CONSENT_STORAGE_KEY = 'trackpilot_cookie_consent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export function getCookieConsent(): CookieConsentChoice | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'accepted' || stored === 'refused') {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

export function setCookieConsent(choice: CookieConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Ignore storage restriction errors (e.g. private browsing)
  }

  if (choice === 'accepted') {
    enableAnalytics();
  } else {
    disableAnalytics();
  }
}

export function enableAnalytics(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;

  const scriptId = 'trackpilot-gtag-script';
  if (!document.getElementById(scriptId)) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });

    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }
}

export function disableAnalytics(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;

  // Best-effort cleanup of Google Analytics cookies on refusal/revocation
  const cookies = document.cookie.split(';');
  const hostname = window.location.hostname;
  const domainParts = hostname.split('.');
  const candidateDomains = ['', hostname];
  if (domainParts.length >= 2) {
    candidateDomains.push(`.${domainParts.slice(-2).join('.')}`);
  }

  for (const rawCookie of cookies) {
    const name = rawCookie.split('=')[0]?.trim();
    if (!name) continue;
    if (name === '_ga' || name === '_gid' || name === '_gat' || name.startsWith('_ga_')) {
      for (const domain of candidateDomains) {
        const domainAttr = domain ? `; domain=${domain}` : '';
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainAttr}`;
      }
    }
  }
}
