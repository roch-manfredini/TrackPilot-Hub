import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { getRecoveryTargetView, triggerChunkReloadOnce } from './utils/lazyWithRetry';

if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    if (triggerChunkReloadOnce(getRecoveryTargetView())) {
      event.preventDefault();
    }
  });
}

const rootElement = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (rootElement.firstElementChild !== null) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}
