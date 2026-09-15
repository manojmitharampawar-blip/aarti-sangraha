'use client';

import React from 'react';
import {
  X,
  Camera,
  Mic,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { useAppPermissions, PermissionStatusType } from '@/hooks/useAppPermissions';

interface DevotionalPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DevotionalPermissionsModal({
  isOpen,
  onClose,
}: DevotionalPermissionsModalProps) {
  const {
    cameraStatus,
    micStatus,
    locationStatus,
    userLocation,
    allGranted,
    isRequestingAll,
    lastActionMessage,
    requestCamera,
    requestMicrophone,
    requestLocation,
    requestAllPermissions,
  } = useAppPermissions();

  if (!isOpen) return null;

  const renderStatusBadge = (status: PermissionStatusType) => {
    switch (status) {
      case 'granted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>सक्रिय (Active)</span>
          </span>
        );
      case 'denied':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-[11px] font-bold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>नाकारले (Blocked)</span>
          </span>
        );
      case 'unsupported':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-500/15 border border-stone-500/30 text-stone-600 dark:text-stone-400 text-[11px] font-bold">
            <span>अनुपलब्ध</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
            <span>परवानगी हवी</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[var(--card-main)] border border-[var(--border-main)] shadow-2xl p-5 sm:p-6 space-y-5 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-main)]/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500/15 text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-[var(--text-primary)] font-devanagari">
                ॲप परवानग्या व सुलभता
              </h2>
              <p className="text-[11px] text-[var(--text-secondary)]">
                अखंड व समृद्ध भक्ती अनुभवासाठी सक्षम करा
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close permissions dialog"
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[var(--text-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master One-Click Enable Button */}
        {!allGranted && (
          <button
            onClick={requestAllPermissions}
            disabled={isRequestingAll}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-saffron-600/25 active:scale-98 transition-all disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isRequestingAll
                ? 'परवानग्या सुरू करत आहे...'
                : 'सर्व परवानग्या एकाच क्लिकमध्ये सक्षम करा (Enable All)'}
            </span>
          </button>
        )}

        {/* Permissions List */}
        <div className="space-y-3">
          {/* 1. Video / Camera */}
          <div className="p-3.5 rounded-2xl border border-[var(--border-main)] bg-stone-500/5 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 shrink-0 mt-0.5">
                <Camera className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[var(--text-primary)]">
                    व्हिडिओ कॅमेरा (Video / Camera)
                  </h3>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
                  हात जोडून नमस्कार व स्पर्शविरहित व्हर्च्युअल आरती ओवाळण्यासाठी
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              {cameraStatus === 'granted' ? (
                renderStatusBadge(cameraStatus)
              ) : (
                <button
                  onClick={requestCamera}
                  className="px-3 py-1.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
                >
                  सुरू करा
                </button>
              )}
            </div>
          </div>

          {/* 2. Microphone / Voice */}
          <div className="p-3.5 rounded-2xl border border-[var(--border-main)] bg-stone-500/5 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 shrink-0 mt-0.5">
                <Mic className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[var(--text-primary)]">
                    मायक्रोफोन (Voice / Mic)
                  </h3>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
                  वाणी स्क्रोल (AI) साठी — तुमचे गायन ऐकून आपोआप स्क्रोल होते
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              {micStatus === 'granted' ? (
                renderStatusBadge(micStatus)
              ) : (
                <button
                  onClick={requestMicrophone}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
                >
                  सुरू करा
                </button>
              )}
            </div>
          </div>

          {/* 3. Location */}
          <div className="p-3.5 rounded-2xl border border-[var(--border-main)] bg-stone-500/5 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-600 shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[var(--text-primary)]">
                    स्थान (Location)
                  </h3>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
                  स्थानिक अचूक सूर्योदय, सूर्यास्त व दैनिक पंचांग तिथीसाठी
                  {userLocation && (
                    <span className="block text-saffron-600 font-bold mt-0.5">
                      📍 {userLocation.cityNameMr} ({userLocation.cityNameEn})
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              {locationStatus === 'granted' ? (
                renderStatusBadge(locationStatus)
              ) : (
                <button
                  onClick={requestLocation}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
                >
                  जोडा
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Feedback / Action Toast */}
        {lastActionMessage && (
          <div className="p-2.5 rounded-xl bg-saffron-500/10 border border-saffron-500/20 text-xs text-saffron-800 dark:text-saffron-200 text-center font-medium animate-fade-in">
            {lastActionMessage}
          </div>
        )}

        {/* 100% Privacy and Security Guarantee */}
        <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-2.5 text-[11px] text-[var(--text-secondary)]">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-[var(--text-primary)]">१००% सुरक्षित व खाजगी:</strong> आपला कॅमेरा,
            आवाज किंवा स्थान कुठेही अपलोड केले जात नाही. सर्व प्रक्रिया फक्त आपल्या फोनवरच होते.
          </p>
        </div>

        {/* Done / Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-[var(--border-main)] text-xs font-bold text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          बंद करा (Done)
        </button>
      </div>
    </div>
  );
}
