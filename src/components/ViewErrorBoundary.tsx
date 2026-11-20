import React from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { isChunkLoadError } from '../utils/lazyWithRetry';

interface ViewErrorBoundaryProps {
  resetKey: string;
  onGoHome: () => void;
  children: React.ReactNode;
}

interface ViewErrorBoundaryState {
  error: Error | null;
}

export class ViewErrorBoundary extends React.Component<
  ViewErrorBoundaryProps,
  ViewErrorBoundaryState
> {
  constructor(props: ViewErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ViewErrorBoundaryState {
    return { error };
  }

  componentDidUpdate(prevProps: ViewErrorBoundaryProps): void {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error !== null) {
      this.setState({ error: null });
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ error: null });
    this.props.onGoHome();
  };

  render(): React.ReactNode {
    if (!this.state.error) {
      return this.props.children;
    }

    const isStaleChunk = isChunkLoadError(this.state.error);

    return (
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto min-h-[75vh] flex items-center justify-center">
        <div className="w-full p-6 sm:p-7 rounded-2xl bg-[#08090d] border border-white/10 space-y-5 shadow-card">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-red-400" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isStaleChunk
                  ? 'Nouvelle version disponible'
                  : 'Impossible de charger cette vue'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isStaleChunk
                  ? 'Le site a été mis à jour depuis l’ouverture de cet onglet. Rechargez la page pour charger les fichiers à jour.'
                  : 'Une erreur inattendue est survenue lors du chargement du module. Vérifiez votre connexion puis rechargez la page.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-dark-950 bg-brand-400 hover:bg-brand-300 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Recharger la page</span>
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-200 bg-[#090a0f] hover:bg-white/5 border border-white/10 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Retour à l'accueil</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
