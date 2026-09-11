'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'aarti_sangraha_favorites_v1';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const updated = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.includes(id);
  }, [favorites]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    isLoaded,
  };
}
