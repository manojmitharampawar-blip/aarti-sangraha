import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '@/hooks/useFavorites';

describe('useFavorites Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initializes with empty favorites if nothing in storage', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
  });

  it('adds an aarti to favorites', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => {
      result.current.toggleFavorite('ganesha-sukhkarta');
    });
    expect(result.current.isFavorite('ganesha-sukhkarta')).toBe(true);
    expect(result.current.favorites).toContain('ganesha-sukhkarta');
  });

  it('removes an aarti when toggled again', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => {
      result.current.toggleFavorite('ganesha-sukhkarta');
    });
    expect(result.current.isFavorite('ganesha-sukhkarta')).toBe(true);

    act(() => {
      result.current.toggleFavorite('ganesha-sukhkarta');
    });
    expect(result.current.isFavorite('ganesha-sukhkarta')).toBe(false);
  });
});
