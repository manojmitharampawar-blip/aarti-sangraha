'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScriptType } from '@/types';

export type ThemeType = 'light' | 'dark' | 'pooja';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  script: ScriptType;
  setScript: (script: ScriptType) => void;
  toggleScript: () => void;
  fontSize: number; // in pixels, e.g. 18, 22, 26
  setFontSize: (size: number) => void;
  diyaGlow: boolean;
  toggleDiyaGlow: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [script, setScriptState] = useState<ScriptType>('devanagari');
  const [fontSize, setFontSizeState] = useState<number>(20);
  const [diyaGlow, setDiyaGlow] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('aarti_theme') as ThemeType;
      if (savedTheme) setThemeState(savedTheme);

      const savedScript = localStorage.getItem('aarti_script') as ScriptType;
      if (savedScript) setScriptState(savedScript);

      const savedSize = localStorage.getItem('aarti_font_size');
      if (savedSize) setFontSizeState(Number(savedSize));
    } catch {
      // ignore
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-pooja', 'dark');

    if (theme === 'dark') {
      root.classList.add('dark', 'theme-dark');
    } else if (theme === 'pooja') {
      root.classList.add('dark', 'theme-pooja');
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
    setScript(script === 'devanagari' ? 'transliteration' : 'devanagari');
  };

  const setFontSize = (size: number) => {
    setFontSizeState(size);
    try {
      localStorage.setItem('aarti_font_size', String(size));
    } catch {}
  };

  const toggleDiyaGlow = () => {
    setDiyaGlow(prev => !prev);
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
        diyaGlow,
        toggleDiyaGlow,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
}
