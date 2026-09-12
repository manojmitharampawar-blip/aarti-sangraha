'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScriptType, FontFamilyType, LineSpacingType, TextAlignType } from '@/types';

export type ThemeType = 'light' | 'sepia' | 'pooja' | 'dark' | 'oled';

export const UNIFORM_SCROLL_SPEEDS = [0.5, 1, 1.5, 2] as const;
export type AutoScrollSpeedType = typeof UNIFORM_SCROLL_SPEEDS[number];

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  script: ScriptType;
  setScript: (script: ScriptType) => void;
  toggleScript: () => void;
  fontSize: number; // in pixels, e.g. 16 to 32
  setFontSize: (size: number) => void;
  fontFamily: FontFamilyType;
  setFontFamily: (font: FontFamilyType) => void;
  lineSpacing: LineSpacingType;
  setLineSpacing: (spacing: LineSpacingType) => void;
  textAlign: TextAlignType;
  setTextAlign: (align: TextAlignType) => void;
  spotlightMode: boolean;
  setSpotlightMode: (enabled: boolean) => void;
  toggleSpotlightMode: () => void;
  zenMode: boolean;
  setZenMode: (enabled: boolean) => void;
  toggleZenMode: () => void;
  diyaGlow: boolean;
  toggleDiyaGlow: () => void;
  autoScrollSpeed: number;
  setAutoScrollSpeed: (speed: number) => void;
  cycleAutoScrollSpeed: () => number;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [script, setScriptState] = useState<ScriptType>('devanagari');
  const [fontSize, setFontSizeState] = useState<number>(21);
  const [fontFamily, setFontFamilyState] = useState<FontFamilyType>('sans');
  const [lineSpacing, setLineSpacingState] = useState<LineSpacingType>('normal');
  const [textAlign, setTextAlignState] = useState<TextAlignType>('center');
  const [spotlightMode, setSpotlightModeState] = useState<boolean>(true);
  const [zenMode, setZenModeState] = useState<boolean>(false);
  const [diyaGlow, setDiyaGlow] = useState<boolean>(false);
  const [autoScrollSpeed, setAutoScrollSpeedState] = useState<number>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('aarti_theme') as ThemeType;
      if (savedTheme) setThemeState(savedTheme);

      const savedScript = localStorage.getItem('aarti_script') as ScriptType;
      if (savedScript) setScriptState(savedScript);

      const savedSize = localStorage.getItem('aarti_font_size');
      if (savedSize) setFontSizeState(Number(savedSize));

      const savedFontFamily = localStorage.getItem('aarti_font_family') as FontFamilyType;
      if (savedFontFamily) setFontFamilyState(savedFontFamily);

      const savedSpacing = localStorage.getItem('aarti_line_spacing') as LineSpacingType;
      if (savedSpacing) setLineSpacingState(savedSpacing);

      const savedAlign = localStorage.getItem('aarti_text_align') as TextAlignType;
      if (savedAlign) setTextAlignState(savedAlign);

      const savedSpotlight = localStorage.getItem('aarti_spotlight_mode');
      if (savedSpotlight !== null) setSpotlightModeState(savedSpotlight === 'true');

      const savedZen = localStorage.getItem('aarti_zen_mode');
      if (savedZen !== null) setZenModeState(savedZen === 'true');

      const savedSpeed = localStorage.getItem('aarti_autoscroll_speed');
      if (savedSpeed !== null) {
        const parsed = Number(savedSpeed);
        if (UNIFORM_SCROLL_SPEEDS.includes(parsed as AutoScrollSpeedType)) {
          setAutoScrollSpeedState(parsed);
        }
      }
    } catch {
      // ignore storage access errors
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove(
      'theme-light',
      'theme-sepia',
      'theme-pooja',
      'theme-dark',
      'theme-oled',
      'dark'
    );

    if (theme === 'dark') {
      root.classList.add('dark', 'theme-dark');
    } else if (theme === 'oled') {
      root.classList.add('dark', 'theme-oled');
    } else if (theme === 'pooja') {
      root.classList.add('dark', 'theme-pooja');
    } else if (theme === 'sepia') {
      root.classList.add('theme-sepia');
    } else {
      root.classList.add('theme-light');
    }

    try {
      localStorage.setItem('aarti_theme', theme);
    } catch {}
  }, [theme, mounted]);

  const setTheme = (t: ThemeType) => {
    setThemeState(t);
  };

  const setScript = (s: ScriptType) => {
    setScriptState(s);
    try {
      localStorage.setItem('aarti_script', s);
    } catch {}
  };

  const toggleScript = () => {
    setScript(
      script === 'devanagari'
        ? 'dual'
        : script === 'dual'
        ? 'transliteration'
        : 'devanagari'
    );
  };

  const setFontSize = (size: number) => {
    setFontSizeState(size);
    try {
      localStorage.setItem('aarti_font_size', String(size));
    } catch {}
  };

  const setFontFamily = (font: FontFamilyType) => {
    setFontFamilyState(font);
    try {
      localStorage.setItem('aarti_font_family', font);
    } catch {}
  };

  const setLineSpacing = (spacing: LineSpacingType) => {
    setLineSpacingState(spacing);
    try {
      localStorage.setItem('aarti_line_spacing', spacing);
    } catch {}
  };

  const setTextAlign = (align: TextAlignType) => {
    setTextAlignState(align);
    try {
      localStorage.setItem('aarti_text_align', align);
    } catch {}
  };

  const setSpotlightMode = (enabled: boolean) => {
    setSpotlightModeState(enabled);
    try {
      localStorage.setItem('aarti_spotlight_mode', String(enabled));
    } catch {}
  };

  const toggleSpotlightMode = () => {
    setSpotlightMode(!spotlightMode);
  };

  const setZenMode = (enabled: boolean) => {
    setZenModeState(enabled);
    try {
      localStorage.setItem('aarti_zen_mode', String(enabled));
    } catch {}
  };

  const toggleZenMode = () => {
    setZenMode(!zenMode);
  };

  const toggleDiyaGlow = () => {
    setDiyaGlow(prev => !prev);
  };

  const setAutoScrollSpeed = (spd: number) => {
    setAutoScrollSpeedState(spd);
    try {
      localStorage.setItem('aarti_autoscroll_speed', String(spd));
    } catch {}
  };

  const cycleAutoScrollSpeed = (): number => {
    const currentIndex = UNIFORM_SCROLL_SPEEDS.indexOf(autoScrollSpeed as AutoScrollSpeedType);
    const nextIndex = (currentIndex + 1) % UNIFORM_SCROLL_SPEEDS.length;
    const nextSpeed = UNIFORM_SCROLL_SPEEDS[nextIndex];
    setAutoScrollSpeed(nextSpeed);
    return nextSpeed;
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        script,
        setScript,
        toggleScript,
        fontSize,
        setFontSize,
        fontFamily,
        setFontFamily,
        lineSpacing,
        setLineSpacing,
        textAlign,
        setTextAlign,
        spotlightMode,
        setSpotlightMode,
        toggleSpotlightMode,
        zenMode,
        setZenMode,
        toggleZenMode,
        diyaGlow,
        toggleDiyaGlow,
        autoScrollSpeed,
        setAutoScrollSpeed,
        cycleAutoScrollSpeed,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
