import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DeitiesPage from '@/app/deities/page';
import { ThemeProvider } from '@/components/ThemeProvider';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (param: string) => (param === 'id' ? null : null),
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('DeitiesPage Navigation & Aarti Grouping', () => {
  it('renders all deity cards with clickable elements', () => {
    renderWithTheme(<DeitiesPage />);

    // Should display deities
    expect(screen.getByText(/श्री गणेश/i)).toBeInTheDocument();
    expect(screen.getByText(/भगवान शिव/i)).toBeInTheDocument();
    expect(screen.getByText(/श्री दुर्गा/i)).toBeInTheDocument();
  });

  it('clicking a deity card selects that deity and presents dedicated aartis', () => {
    renderWithTheme(<DeitiesPage />);

    // Click on Shri Ganesha deity card
    const ganeshaCard = screen.getByText(/श्री गणेश/i).closest('[role="button"]');
    expect(ganeshaCard).not.toBeNull();
    if (ganeshaCard) {
      fireEvent.click(ganeshaCard);
    }

    // Should reveal Ganesha aartis & sequential chanting option
    expect(screen.getAllByText(/सुखकर्ता दुःखहर्ता/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/सर्व \d+ आरत्या सलग म्हणा/i)).toBeInTheDocument();
  });
});
