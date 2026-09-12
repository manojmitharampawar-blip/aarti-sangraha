'use client';

import React from 'react';
import { X, Type, Check, Sparkles, AlignCenter, AlignLeft, Eye, FastForward } from 'lucide-react';
import { useThemeContext, ThemeType, UNIFORM_SCROLL_SPEEDS } from '@/components/ThemeProvider';
import { FontFamilyType, LineSpacingType, ScriptType, TextAlignType } from '@/types';

interface ReadingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const themeOptions: { id: ThemeType; label: string; devLabel: string; bg: string; text: string; border: string }[] = [
  { id: 'light', label: 'Day White', devLabel: 'स्वच्छ पांढरा', bg: '#fdfbf7', text: '#1c1917', border: '#e7dfcf' },
  { id: 'sepia', label: 'Parchment', devLabel: 'हस्तलिखित सेपिया', bg: '#fbf3e4', text: '#3c2f1f', border: '#ebdcc0' },
  { id: 'pooja', label: 'Sandalwood', devLabel: 'चंदन दीप पूजा', bg: '#180902', text: '#fef3c7', border: '#4a1c06' },
  { id: 'dark', label: 'Slate Night', devLabel: 'शांत रात्र', bg: '#0f172a', text: '#f1f5f9', border: '#334155' },
  { id: 'oled', label: 'OLED Black', devLabel: 'गडद काळा', bg: '#000000', text: '#fafafa', border: '#262626' },
];

const fontOptions: { id: FontFamilyType; label: string; devLabel: string; fontClass: string }[] = [
  { id: 'serif', label: 'Grantha (Serif)', devLabel: 'ग्रंथ पोथी शैली', fontClass: 'font-grantha' },
  { id: 'sans', label: 'Modern Sans', devLabel: 'आधुनिक स्पष्ट', fontClass: 'font-devanagari' },
  { id: 'mukta', label: 'Mukta Fluid', devLabel: 'लयबद्ध मुक्त', fontClass: 'font-mukta' },
];

const fontSizes = [
  { label: 'लहान', size: 17 },
  { label: 'मध्यम', size: 20 },
  { label: 'मोठे', size: 24 },
  { label: 'अति मोठे', size: 28 },
  { label: 'महाकाय', size: 32 },
];

const lineSpacingOptions: { id: LineSpacingType; label: string; devLabel: string; height: string }[] = [
  { id: 'compact', label: 'Compact', devLabel: 'मध्यम (१.८x)', height: '1.85' },
  { id: 'normal', label: 'Standard', devLabel: 'सुटसुटीत (२.२x)', height: '2.2' },
  { id: 'relaxed', label: 'Relaxed', devLabel: 'ऐसपैस (२.६x)', height: '2.6' },
];

const scrollSpeedOptions = [
  { val: 0.5, label: '0.5x', desc: 'मंद (Slow)' },
  { val: 1, label: '1.0x', desc: 'सामान्य (Normal)' },
  { val: 1.5, label: '1.5x', desc: 'मध्यम (Medium)' },
  { val: 2, label: '2.0x', desc: 'जलद (Fast)' },
];

export function ReadingSettingsModal({ isOpen, onClose }: ReadingSettingsModalProps) {
  const {
    theme,
    setTheme,
    script,
    setScript,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    lineSpacing,
    setLineSpacing,
    textAlign,
    setTextAlign,
    spotlightMode,
    toggleSpotlightMode,
    autoScrollSpeed,
    setAutoScrollSpeed,
  } = useThemeContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl border border-[var(--border-main)] bg-[var(--card-main)] p-5 sm:p-6 shadow-2xl space-y-5 animate-fade-in my-auto max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-main)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-saffron-500/10 text-saffron-600 flex items-center justify-center">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base text-[var(--text-primary)] font-devanagari">
                वाचन व अक्षर रचना (Typography & Theme)
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                किंडल व ॲपल बुक्सप्रमाणे वाचनाचा अनुभव बदला
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close reading settings modal"
            className="p-1 rounded-full text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Paper Themes Swatches */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            कागद व रंगसंगती (Paper Theme)
          </label>
          <div className="grid grid-cols-5 gap-2">
            {themeOptions.map(opt => {
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  title={opt.devLabel}
                  className={`flex flex-col items-center gap-1 p-2 rounded-2xl border transition-all active:scale-95 ${
                    isSelected
                      ? 'border-saffron-500 ring-2 ring-saffron-500/30 scale-105'
                      : 'border-[var(--border-main)] hover:border-saffron-500/40'
                  }`}
                  style={{ backgroundColor: opt.bg }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center border shadow-xs"
                    style={{ backgroundColor: opt.bg, borderColor: opt.border, color: opt.text }}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5 text-saffron-500 stroke-[3]" /> : 'ॐ'}
                  </div>
                  <span
                    className="text-[10px] font-bold truncate max-w-full text-center"
                    style={{ color: opt.text }}
                  >
                    {opt.devLabel.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Script Selector (Dual-Script, Devanagari, English) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            लिपी पर्याय (Script Display)
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/5 dark:bg-white/5 text-xs font-bold">
            <button
              onClick={() => setScript('devanagari')}
              className={`py-2 px-2 rounded-xl text-center transition-all ${
                script === 'devanagari'
                  ? 'bg-[var(--card-main)] text-saffron-600 shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              मराठी (देवनागरी)
            </button>
            <button
              onClick={() => setScript('dual')}
              className={`py-2 px-2 rounded-xl text-center transition-all flex items-center justify-center gap-1 ${
                script === 'dual'
                  ? 'bg-[var(--card-main)] text-saffron-600 shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>दोन्ही एकत्र (Dual)</span>
            </button>
            <button
              onClick={() => setScript('transliteration')}
              className={`py-2 px-2 rounded-xl text-center transition-all ${
                script === 'transliteration'
                  ? 'bg-[var(--card-main)] text-saffron-600 shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              English (ENG)
            </button>
          </div>
        </div>

        {/* 3. Font Family Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            अक्षर शैली (Devanagari Font Family)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {fontOptions.map(opt => {
              const isSelected = fontFamily === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setFontFamily(opt.id)}
                  className={`py-2.5 px-2 rounded-2xl border text-center transition-all active:scale-95 ${
                    isSelected
                      ? 'border-saffron-600 bg-saffron-500/10 text-saffron-600 font-bold shadow-xs'
                      : 'border-[var(--border-main)] text-[var(--text-primary)] hover:border-saffron-500/40'
                  }`}
                >
                  <p className={`text-sm ${opt.fontClass}`}>
                    श्री गणपती
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                    {opt.devLabel}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Font Size Controls & Live Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              अक्षर आकार (Font Size: {fontSize}px)
            </label>
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setFontSize(Math.max(16, fontSize - 2))}
                className="w-7 h-7 rounded-lg border border-[var(--border-main)] hover:border-saffron-500 font-bold flex items-center justify-center text-[var(--text-primary)]"
                title="Decrease font size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize(Math.min(34, fontSize + 2))}
                className="w-7 h-7 rounded-lg border border-[var(--border-main)] hover:border-saffron-500 font-bold flex items-center justify-center text-[var(--text-primary)]"
                title="Increase font size"
              >
                A+
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {fontSizes.map(item => (
              <button
                key={item.size}
                onClick={() => setFontSize(item.size)}
                className={`py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                  fontSize === item.size
                    ? 'border-saffron-600 bg-saffron-500/10 text-saffron-600'
                    : 'border-[var(--border-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Live Preview Card */}
          <div className="p-3 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-main)] text-center transition-all">
            <p
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineSpacing === 'compact' ? '1.85' : lineSpacing === 'relaxed' ? '2.6' : '2.2',
                textAlign: textAlign,
              }}
              className={`transition-all font-bold ${
                fontFamily === 'serif'
                  ? 'font-grantha'
                  : fontFamily === 'mukta'
                  ? 'font-mukta'
                  : 'font-devanagari'
              } text-[var(--text-primary)]`}
            >
              ॥ जय देव जय देव जय मंगलमूर्ती ॥
            </p>
            {script === 'dual' && (
              <p
                style={{ fontSize: `${Math.max(12, fontSize - 6)}px`, textAlign: textAlign }}
                className="text-[var(--text-secondary)] italic mt-0.5"
              >
                Jai dev jai dev jai mangalamoorti
              </p>
            )}
          </div>
        </div>

        {/* 5. Auto-Scroll Speed Controls (Uniform: 0.5x, 1x, 1.5x, 2x) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
              <FastForward className="w-3.5 h-3.5 text-saffron-600" />
              <span>स्वयं-स्क्रोल गती (Auto-Scroll Speed)</span>
            </label>
            <span className="text-xs font-bold text-saffron-600 font-sans">
              {autoScrollSpeed}x
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {scrollSpeedOptions.map(item => (
              <button
                key={item.val}
                onClick={() => setAutoScrollSpeed(item.val)}
                className={`py-2 px-1 rounded-xl border text-center transition-all ${
                  autoScrollSpeed === item.val
                    ? 'border-saffron-600 bg-saffron-500/10 text-saffron-600 font-bold shadow-xs ring-1 ring-saffron-500/30'
                    : 'border-[var(--border-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="text-xs font-black">{item.label}</div>
                <div className="text-[10px] opacity-80 font-devanagari mt-0.5">{item.desc.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 6. Line Height (Leading) & Alignment */}
        <div className="grid grid-cols-2 gap-3">
          {/* Spacing */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              ओळींतील अंतर
            </label>
            <div className="flex rounded-xl bg-black/5 dark:bg-white/5 p-1 gap-1">
              {lineSpacingOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setLineSpacing(opt.id)}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                    lineSpacing === opt.id
                      ? 'bg-[var(--card-main)] text-saffron-600 shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alignment */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              संरेखन (Alignment)
            </label>
            <div className="flex rounded-xl bg-black/5 dark:bg-white/5 p-1 gap-1">
              <button
                onClick={() => setTextAlign('center')}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1 text-[11px] font-bold rounded-lg transition-colors ${
                  textAlign === 'center'
                    ? 'bg-[var(--card-main)] text-saffron-600 shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
                <span>मध्यभागी</span>
              </button>
              <button
                onClick={() => setTextAlign('left')}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1 text-[11px] font-bold rounded-lg transition-colors ${
                  textAlign === 'left'
                    ? 'bg-[var(--card-main)] text-saffron-600 shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>डावीकडे</span>
              </button>
            </div>
          </div>
        </div>

        {/* 7. Active Stanza Focus / Spotlight Toggle */}
        <div className="p-3 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-main)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[var(--text-primary)] font-devanagari truncate">
                एकाग्रता दीपस्तंभ (Chanting Spotlight)
              </h4>
              <p className="text-[10px] text-[var(--text-secondary)] truncate">
                वाचताना चालू कडवे ठळक व इतरांना मंद प्रकाश
              </p>
            </div>
          </div>

          <button
            onClick={toggleSpotlightMode}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
              spotlightMode ? 'bg-saffron-600' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                spotlightMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-saffron-600 text-white font-bold text-xs shadow-md shadow-saffron-600/20 active:scale-98 transition-all"
        >
          पूर्ण झाले (Save & Apply)
        </button>
      </div>
    </div>
  );
}
