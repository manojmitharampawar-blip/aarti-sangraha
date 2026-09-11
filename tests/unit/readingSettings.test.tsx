import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReadingSettingsModal } from '@/components/ReadingSettingsModal';
import { ThemeProvider, useThemeContext } from '@/components/ThemeProvider';

function TestReadingConsumer() {
  const {
    theme,
    script,
    fontSize,
    fontFamily,
    lineSpacing,
    textAlign,
    spotlightMode,
    zenMode,
    toggleZenMode,
  } = useThemeContext();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <span data-testid="current-script">{script}</span>
      <span data-testid="current-size">{fontSize}</span>
      <span data-testid="current-font">{fontFamily}</span>
      <span data-testid="current-spacing">{lineSpacing}</span>
      <span data-testid="current-align">{textAlign}</span>
      <span data-testid="current-spotlight">{String(spotlightMode)}</span>
      <span data-testid="current-zen">{String(zenMode)}</span>
      <button data-testid="toggle-zen-btn" onClick={toggleZenMode}>
        Toggle Zen
      </button>
    </div>
  );
}

describe('Reading Settings & Kindle/Apple Books Modern UX Engine', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('renders ReadingSettingsModal and enables theme, font, and script customization', () => {
    render(
      <ThemeProvider>
        <TestReadingConsumer />
        <ReadingSettingsModal isOpen={true} onClose={() => {}} />
      </ThemeProvider>
    );

    // Initial state defaults
    expect(screen.getByTestId('current-theme').textContent).toBe('light');
    expect(screen.getByTestId('current-script').textContent).toBe('devanagari');
    expect(screen.getByTestId('current-font').textContent).toBe('sans');
    expect(screen.getByTestId('current-spotlight').textContent).toBe('true');

    // Select Sepia / Parchment Paper Theme
    const sepiaBtn = screen.getByTitle('हस्तलिखित सेपिया');
    fireEvent.click(sepiaBtn);
    expect(screen.getByTestId('current-theme').textContent).toBe('sepia');
    expect(document.documentElement.classList.contains('theme-sepia')).toBe(true);

    // Select OLED Pure Black Theme
    const oledBtn = screen.getByTitle('गडद काळा');
    fireEvent.click(oledBtn);
    expect(screen.getByTestId('current-theme').textContent).toBe('oled');
    expect(document.documentElement.classList.contains('theme-oled')).toBe(true);

    // Select Grantha Serif Font Family
    const granthaBtn = screen.getByText('ग्रंथ पोथी शैली');
    fireEvent.click(granthaBtn);
    expect(screen.getByTestId('current-font').textContent).toBe('serif');

    // Select Dual-Script Interlinear Mode
    const dualBtn = screen.getByText('दोन्ही एकत्र (Dual)');
    fireEvent.click(dualBtn);
    expect(screen.getByTestId('current-script').textContent).toBe('dual');

    // Toggle Chanting Spotlight
    const spotlightToggle = screen.getByRole('button', { name: '' });
    fireEvent.click(spotlightToggle);
    expect(screen.getByTestId('current-spotlight').textContent).toBe('false');
  });

  it('toggles Zen / Distraction-Free reading mode correctly', () => {
    render(
      <ThemeProvider>
        <TestReadingConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-zen').textContent).toBe('false');
    fireEvent.click(screen.getByTestId('toggle-zen-btn'));
    expect(screen.getByTestId('current-zen').textContent).toBe('true');
  });
});
