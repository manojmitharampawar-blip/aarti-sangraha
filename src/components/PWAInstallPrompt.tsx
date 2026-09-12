'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Sparkles, Check, Smartphone } from 'lucide-react';
import { useThemeContext } from '@/components/ThemeProvider';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function triggerPWAInstall() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('trigger-pwa-install'));
  }
}

export function PWAInstallPrompt() {
  const { script } = useThemeContext();
  const isDevanagari = script === 'devanagari';

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [installedSuccessfully, setInstalledSuccessfully] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / running in standalone PWA mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(isStandaloneMode);

    // 2. Register Service Worker with dynamic base path support (GitHub Pages / custom domain)
    if ('serviceWorker' in navigator) {
      const isGitHubPages = window.location.pathname.startsWith('/aarti-sangraha');
      const basePath = isGitHubPages ? '/aarti-sangraha' : '';
      const swUrl = `${basePath}/sw.js`;
      navigator.serviceWorker
        .register(swUrl, { scope: `${basePath}/` })
        .then(reg => console.log('SW registered with scope:', reg.scope))
        .catch(err => console.log('SW registration error:', err));
    }

    // 3. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 4. Capture beforeinstallprompt for Android/Chrome/Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setInstalledSuccessfully(true);
      setTimeout(() => setInstalledSuccessfully(false), 5000);
    };

    const handleExternalTrigger = () => {
      handleInstallAction();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('trigger-pwa-install', handleExternalTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('trigger-pwa-install', handleExternalTrigger);
    };
  }, []);

  const handleInstallAction = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      alert(
        isDevanagari
          ? 'ॲप इन्स्टॉल करण्यासाठी ब्राउझरच्या मेन्यू (⋮ किंवा Share) वर टॅप करून "Install App" किंवा "Add to Home screen" निवडा.'
          : 'To install the app, open browser menu (⋮ or Share) and tap "Install App" or "Add to Home screen".'
      );
    }
  };

  // If installed successfully, show brief congratulatory badge
  if (installedSuccessfully) {
    return (
      <div className="fixed top-20 left-4 right-4 z-50 max-w-sm mx-auto p-3 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 text-xs font-bold animate-fade-in">
        <Check className="w-5 h-5" />
        <span>{isDevanagari ? 'आरती संग्रह ॲप यशस्वीरीत्या इन्स्टॉल झाले!' : 'Aarti App successfully installed!'}</span>
      </div>
    );
  }

  return (
    <>
      {/* Floating Modern PWA Install Banner - Shown if not in standalone and not dismissed */}
      {!isStandalone && !isDismissed && (
        <div className="fixed top-18 left-3 right-3 z-40 max-w-lg mx-auto animate-fade-in">
          <div className="flex items-center justify-between gap-3 p-3 sm:px-4 rounded-2xl border border-amber-500/30 bg-[var(--card-main)]/95 backdrop-blur-md shadow-xl shadow-saffron-500/10">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-saffron-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Download className="w-4 h-4 animate-bounce" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-[var(--text-primary)] truncate font-devanagari">
                  {isDevanagari ? 'आरती संग्रह ॲप इन्स्टॉल करा' : 'Install Aarti Sangraha App'}
                </p>
                <p className="text-[10px] text-[var(--text-secondary)] truncate">
                  {isDevanagari
                    ? 'ऑफलाइन पठण, जलद अनुभव व होम स्क्रीन ॲक्सेस'
                    : 'Fast, offline prayers directly from your home screen'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstallAction}
                className="px-3 py-1.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1"
              >
                <span>{isDevanagari ? 'इन्स्टॉल' : 'Install'}</span>
              </button>

              <button
                onClick={() => setIsDismissed(true)}
                aria-label="Dismiss install banner"
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-[var(--border-main)] bg-[var(--card-main)] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-saffron-600 font-bold text-sm font-devanagari">
                <Sparkles className="w-4 h-4" />
                <span>{isDevanagari ? 'आयफोनवर ॲप कसे जोडावे' : 'How to install on iPhone'}</span>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-full text-[var(--text-secondary)] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[var(--text-primary)] font-devanagari">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <div className="p-2 rounded-xl bg-saffron-500/10 text-saffron-600 shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">१. शेअर आयकॉनवर टॅप करा</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Safari ब्राउझरच्या खालील पट्टीतील 'Share' (⎋) बटनावर टॅप करा.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <div className="p-2 rounded-xl bg-saffron-500/10 text-saffron-600 shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold">२. 'Add to Home Screen' निवडा</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    खाली स्क्रोल करून 'Add to Home Screen' (होम स्क्रीनवर जोडा) वर टॅप करा.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-saffron-600 text-white font-bold text-xs shadow-md"
            >
              समजले (Got it)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
