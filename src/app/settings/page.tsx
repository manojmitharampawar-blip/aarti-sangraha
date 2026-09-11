'use client';

import React from 'react';
import { Sun, Moon, Flame, Bell, Type, ShieldCheck, Github, Smartphone } from 'lucide-react';
import { useThemeContext, ThemeType } from '@/components/ThemeProvider';
import { playTempleBell } from '@/lib/audioBell';

export default function SettingsPage() {
  const { theme, setTheme, script, setScript, fontSize, setFontSize } = useThemeContext();

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

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-devanagari">
          सेटिंग्ज व प्राधान्ये
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          Settings & Preferences
        </p>
      </div>

      {/* Theme Settings */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          रंगसंगती (Theme & Appearance)
        </h2>
        <div className="space-y-2">
          {themeOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                theme === opt.id
                  ? 'border-saffron-600 bg-saffron-500/10 shadow-sm ring-1 ring-saffron-500/30'
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
          लिपी प्राधान्य (Script Preference)
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setScript('devanagari')}
            className={`p-4 rounded-2xl border text-center transition-all ${
              script === 'devanagari'
                ? 'border-saffron-600 bg-saffron-500/10 text-saffron-600 font-bold'
                : 'border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)]'
            }`}
          >
            <span className="block text-base font-devanagari">मराठी / हिंदी</span>
            <span className="text-[11px] block mt-0.5 opacity-80">देवनागरी लिपी</span>
          </button>

          <button
            onClick={() => setScript('transliteration')}
            className={`p-4 rounded-2xl border text-center transition-all ${
              script === 'transliteration'
                ? 'border-saffron-600 bg-saffron-500/10 text-saffron-600 font-bold'
                : 'border-[var(--border-main)] bg-[var(--card-main)] text-[var(--text-secondary)]'
            }`}
          >
            <span className="block text-base font-sans font-bold">English</span>
            <span className="text-[11px] block mt-0.5 opacity-80">Phonetic Latin Script</span>
          </button>
        </div>
      </section>

      {/* Font Scale Preference */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
          <Type className="w-4 h-4 text-saffron-600" />
          <span>अक्षर आकार (Font Size Scale: {fontSize}px)</span>
        </h2>
        <div className="p-4 rounded-2xl border border-[var(--border-main)] bg-[var(--card-main)] space-y-3">
          <input
            type="range"
            min={16}
            max={28}
            step={2}
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            className="w-full accent-saffron-600 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[var(--text-secondary)]">
            <span>लहान (16px)</span>
            <span>मध्यम (20px)</span>
            <span>मोठे (24px)</span>
            <span>खूप मोठे (28px)</span>
          </div>
          <p
            style={{ fontSize: `${fontSize}px` }}
            className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-center font-devanagari mt-2"
          >
            सुखकर्ता दुःखहर्ता वार्ता विघ्नाची
          </p>
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
          <span>आवृत्ती: १.०.० (GitHub Pages)</span>
          <span className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>PWA Ready</span>
          </span>
        </div>
      </section>
    </div>
  );
}
