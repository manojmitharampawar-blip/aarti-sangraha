'use client';

import React from 'react';
import {
  Sun,
  Moon,
  Flame,
  Bell,
  Type,
  ShieldCheck,
  Smartphone,
  Download,
  CheckCircle,
  FastForward,
} from 'lucide-react';
import { useThemeContext, ThemeType } from '@/components/ThemeProvider';
import { playTempleBell } from '@/lib/audioBell';
import { triggerPWAInstall } from '@/components/PWAInstallPrompt';

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    script,
    setScript,
    fontSize,
    setFontSize,
    autoScrollSpeed,
    setAutoScrollSpeed,
  } = useThemeContext();

  const isDevanagari = script === 'devanagari';

  const themeOptions: { id: ThemeType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'light',
      label: 'चंदन (Light)',
      icon: <Sun className="w-5 h-5 text-amber-600" />,
      desc: 'दिवसाच्या वाचनासाठी स्वच्छ व प्रसन्न रूप',
    },
    {
      id: 'pooja',
      label: 'पूजा दीप (Pooja Amber)',
      icon: <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />,
      desc: 'संध्याकाळच्या पूजेसाठी मंद सुवर्ण दीप प्रकाश',
    },
    {
      id: 'dark',
      label: 'रात्र (Dark)',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      desc: 'डोळ्यांना आराम देणारा गडद रंगसंगती',
    },
  ];

  const scrollSpeeds = [
    { val: 0.5, label: '0.5x', desc: 'अति मंद (Slow)' },
    { val: 0.75, label: '0.75x', desc: 'मंद (Gentle)' },
    { val: 1, label: '1.0x', desc: 'सामान्य (Normal)' },
    { val: 1.25, label: '1.25x', desc: 'संतुलित (Steady)' },
    { val: 1.5, label: '1.5x', desc: 'मध्यम (Medium)' },
    { val: 1.75, label: '1.75x', desc: 'तीव्र (Brisk)' },
    { val: 2, label: '2.0x', desc: 'जलद (Fast)' },
  ];

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-devanagari">
          {isDevanagari ? 'सेटिंग्ज व प्राधान्ये' : 'Settings & Preferences'}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          {isDevanagari ? 'ॲप रूप, फॉन्ट, स्क्रोल गती, ध्वनी व ऑफलाइन इन्स्टॉलेशन' : 'Appearance, Font Scale, Auto-scroll, Audio & PWA Install'}
        </p>
      </div>

      {/* PWA Direct Installation Card */}
      <section className="p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-saffron-500/5 to-transparent space-y-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-black text-[var(--text-primary)] font-devanagari">
              {isDevanagari ? 'मोबाईल / डेस्कटॉप ॲप इन्स्टॉल करा' : 'Install Aarti Sangraha App'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {isDevanagari
                ? 'हे ॲप आपल्या होम स्क्रीनवर इन्स्टॉल करा. इंटरनेट नसतानाही सर्व आरत्या व श्लोक त्वरित उपलब्ध होतील.'
                : 'Add to Home Screen for fast, 100% offline access with native app feel.'}
            </p>
          </div>
        </div>
        <button
          onClick={triggerPWAInstall}
          className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-amber-600/20 active:scale-98 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>{isDevanagari ? 'आताच ॲप इन्स्टॉल करा (Install PWA)' : 'Install PWA Now'}</span>
        </button>
      </section>

      {/* Theme Preference */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          रंगसंगती (Theme & Atmosphere)
        </h2>
        <div className="grid grid-cols-1 gap-2.5">
          {themeOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                theme === opt.id
                  ? 'border-saffron-600 bg-saffron-500/10 shadow-xs ring-1 ring-saffron-500/30'
                  : 'border-[var(--border-main)] bg-[var(--card-main)] hover:border-saffron-500/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5">{opt.icon}</div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">{opt.label}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{opt.desc}</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  theme === opt.id ? 'border-saffron-600 bg-saffron-600' : 'border-stone-400'
                }`}
              >
                {theme === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Script Language Preference */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          भाषा व लिपी (Script & Language)
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setScript('devanagari')}
            className={`p-4 rounded-2xl border text-center transition-all ${
              script === 'devanagari'
                ? 'border-saffron-600 bg-saffron-500/10 text-saffron-600 font-bold shadow-xs ring-1 ring-saffron-500/30'
                : 'border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-saffron-500/40'
            }`}
          >
            <div className="text-lg font-bold font-devanagari">मराठी</div>
            <div className="text-xs opacity-70 mt-1">देवनागरी लिपी</div>
          </button>
          <button
            onClick={() => setScript('transliteration')}
            className={`p-4 rounded-2xl border text-center transition-all ${
              script === 'transliteration'
                ? 'border-saffron-600 bg-saffron-500/10 text-saffron-600 font-bold shadow-xs ring-1 ring-saffron-500/30'
                : 'border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-saffron-500/40'
            }`}
          >
            <div className="text-lg font-bold">English</div>
            <div className="text-xs opacity-70 mt-1">Roman Transliteration</div>
          </button>
        </div>
      </section>

      {/* Font Size Preference */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-4 h-4 text-saffron-600" />
            <span>अक्षर आकार (Font Size: {fontSize}px)</span>
          </h2>
          <span className="text-xs text-[var(--text-secondary)]">पूर्वावलोकन</span>
        </div>
        <div className="p-4 rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-[var(--text-secondary)]">A- (16px)</span>
            <input
              type="range"
              min={16}
              max={32}
              step={2}
              value={fontSize}
              onChange={e => setFontSize(Number(e.target.value))}
              aria-label="Adjust font size"
              className="w-full accent-saffron-600 h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs font-bold text-[var(--text-secondary)]">A+ (32px)</span>
          </div>
          <div className="pt-2 border-t border-[var(--border-main)] text-center">
            <p
              style={{ fontSize: `${fontSize}px` }}
              className="font-black text-saffron-600 font-devanagari transition-all"
            >
              ॥ सुखकर्ता दुःखहर्ता वार्ता विघ्नाची ॥
            </p>
          </div>
        </div>
      </section>

      {/* Synchronized Auto-Scroll Speed Preference */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
            <FastForward className="w-4 h-4 text-saffron-600" />
            <span>स्वयं-स्क्रोल गती (Auto-Scroll Speed: {autoScrollSpeed}x)</span>
          </h2>
          <span className="text-xs font-bold text-saffron-600 font-sans">
            {autoScrollSpeed}x
          </span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {scrollSpeeds.map(item => (
            <button
              key={item.val}
              onClick={() => setAutoScrollSpeed(item.val)}
              className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all ${
                autoScrollSpeed === item.val
                  ? 'border-saffron-600 bg-saffron-500/10 text-saffron-600 font-bold shadow-xs ring-1 ring-saffron-500/30'
                  : 'border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-saffron-500/40'
              }`}
            >
              <div className="text-sm font-black">{item.label}</div>
              <div className="text-[10px] opacity-80 font-devanagari mt-0.5">{item.desc.split(' ')[0]}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Audio & Haptic Test */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-saffron-600" />
          <span>आभासी पूजा ध्वनी (Temple Sound Effects)</span>
        </h2>
        <div className="p-4 rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">मंदिरातील घंटा (Temple Bell)</h3>
            <p className="text-xs text-[var(--text-secondary)]">Web Audio multi-harmonic synthesizer</p>
          </div>
          <button
            onClick={() => playTempleBell({ enableHaptics: true })}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-stone-900 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-transform"
          >
            ध्वनी तपासा (Ring)
          </button>
        </div>
      </section>

      {/* Offline & App Info */}
      <section className="p-4 rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
          <ShieldCheck className="w-4 h-4" />
          <span>१००% मोफत व सुरक्षित (100% Free, Static & Offline Ready)</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          हे ॲप पूर्णपणे स्टॅटिक असून इंटरनेट नसतानाही काम करते. कोणतीही जाहिरात किंवा ट्रॅकर नाही.
        </p>
        <div className="pt-2 border-t border-[var(--border-main)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span>आवृत्ती: १.०.० (PWA Enabled)</span>
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>PWA Ready</span>
          </span>
        </div>
      </section>
    </div>
  );
}
