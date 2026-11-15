import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, X, AlertCircle, LogOut } from 'lucide-react';
import { signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  createGoogleAuthProvider,
  getHubAuth,
  isAllowedAdminUser,
} from '../config/firebase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthenticated: (user: User) => void;
  onSignedOut: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthenticated,
  onSignedOut,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const backdropPressRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      setErrorMsg(null);
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
      dialog.returnValue = '';
    }
  }, [isOpen]);

  const handleClose = () => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.returnValue = '';
    }
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const auth = getHubAuth();
      const provider = createGoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (!isAllowedAdminUser(result.user)) {
        await signOut(auth);
        setErrorMsg(
          "Accès refusé : ce compte Google n'est pas autorisé à administrer TrackPilot Hub."
        );
        return;
      }

      onAuthenticated(result.user);
      handleClose();
    } catch (err: unknown) {
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code: unknown }).code)
          : '';
      if (code === 'auth/popup-closed-by-user') {
        setErrorMsg('Connexion annulée.');
      } else {
        setErrorMsg('Impossible de finaliser la connexion Google pour le moment.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await signOut(getHubAuth());
      onSignedOut();
      handleClose();
    } catch {
      setErrorMsg('Erreur lors de la déconnexion.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = isAllowedAdminUser(currentUser);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="admin-dialog-title"
      {...({ closedby: 'any' } as Record<string, string>)}
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
      onPointerDown={(e) => {
        backdropPressRef.current = e.target === dialogRef.current;
      }}
      onClick={(e) => {
        if (backdropPressRef.current && e.target === dialogRef.current) {
          handleClose();
        }
        backdropPressRef.current = false;
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/10 bg-dark-900/95 p-0 text-slate-100 shadow-2xl backdrop:bg-dark-950/80 backdrop:backdrop-blur-md"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 id="admin-dialog-title" className="text-base font-bold text-white">
                Administration Hub
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Synchronisation du catalogue des plans publics
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Fermer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5 text-xs text-red-200 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isAdmin && currentUser ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/25 text-xs text-slate-200 space-y-1">
                <p className="text-[11px] font-mono uppercase tracking-wider text-brand-300">
                  Session active
                </p>
                <p className="font-medium text-white truncate">{currentUser.email}</p>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-dark-850 hover:bg-dark-800 border border-white/10 transition-colors disabled:opacity-50"
              >
                <LogOut className="w-4 h-4 text-slate-400" />
                <span>Se déconnecter</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Connectez-vous avec votre compte Google gestionnaire pour accéder au bouton de
                synchronisation dans la vue des plans publics.
              </p>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-dark-950 bg-brand-400 hover:bg-brand-300 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
                  />
                </svg>
                <span>{isLoading ? 'Connexion en cours...' : 'Continuer avec Google'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
};
