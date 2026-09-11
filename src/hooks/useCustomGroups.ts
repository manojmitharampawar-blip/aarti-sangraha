'use client';

import { useState, useEffect, useCallback } from 'react';
import { CustomGroup } from '@/types';

const STORAGE_KEY = 'aarti_sangraha_custom_groups_v1';

const defaultInitialGroups: CustomGroup[] = [
  {
    id: 'default-daily-pooja',
    name: 'माझी नित्य पूजा (My Daily Pooja)',
    description: 'दैनंदिन सकाळ-संध्याकाळ पूजेसाठी सलग आरत्यांचा क्रम',
    aartiIds: [
      'ganesha-sukhkarta',
      'shiva-lavthavti',
      'devi-durge-durgat',
      'concluding-ghalin-lotangan',
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export function useCustomGroups() {
  const [groups, setGroups] = useState<CustomGroup[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setGroups(Array.isArray(parsed) ? parsed : defaultInitialGroups);
      } else {
        setGroups(defaultInitialGroups);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInitialGroups));
      }
    } catch {
      setGroups(defaultInitialGroups);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save helper
  const saveGroups = useCallback((newGroups: CustomGroup[]) => {
    setGroups(newGroups);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newGroups));
    } catch {
      // ignore
    }
  }, []);

  const createGroup = useCallback(
    (name: string, description: string = '', initialAartiIds: string[] = []): CustomGroup => {
      const newGroup: CustomGroup = {
        id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: name.trim() || 'नवीन आरती संग्रह (New Group)',
        description: description.trim(),
        aartiIds: Array.from(new Set(initialAartiIds)),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updated = [...groups, newGroup];
      saveGroups(updated);
      return newGroup;
    },
    [groups, saveGroups]
  );

  const updateGroup = useCallback(
    (
      groupId: string,
      updates: { name?: string; description?: string; aartiIds?: string[] }
    ) => {
      const updated = groups.map(g => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          name: updates.name !== undefined ? updates.name.trim() : g.name,
          description: updates.description !== undefined ? updates.description.trim() : g.description,
          aartiIds: updates.aartiIds !== undefined ? updates.aartiIds : g.aartiIds,
          updatedAt: Date.now(),
        };
      });
      saveGroups(updated);
    },
    [groups, saveGroups]
  );

  const deleteGroup = useCallback(
    (groupId: string) => {
      const updated = groups.filter(g => g.id !== groupId);
      saveGroups(updated);
    },
    [groups, saveGroups]
  );

  const addAartiToGroup = useCallback(
    (groupId: string, aartiId: string) => {
      const updated = groups.map(g => {
        if (g.id !== groupId) return g;
        if (g.aartiIds.includes(aartiId)) return g;
        return {
          ...g,
          aartiIds: [...g.aartiIds, aartiId],
          updatedAt: Date.now(),
        };
      });
      saveGroups(updated);
    },
    [groups, saveGroups]
  );

  const removeAartiFromGroup = useCallback(
    (groupId: string, aartiId: string) => {
      const updated = groups.map(g => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          aartiIds: g.aartiIds.filter(id => id !== aartiId),
          updatedAt: Date.now(),
        };
      });
      saveGroups(updated);
    },
    [groups, saveGroups]
  );

  const reorderAartisInGroup = useCallback(
    (groupId: string, fromIndex: number, toIndex: number) => {
      const updated = groups.map(g => {
        if (g.id !== groupId) return g;
        const newIds = [...g.aartiIds];
        if (fromIndex < 0 || fromIndex >= newIds.length || toIndex < 0 || toIndex >= newIds.length) {
          return g;
        }
        const [moved] = newIds.splice(fromIndex, 1);
        newIds.splice(toIndex, 0, moved);
        return {
          ...g,
          aartiIds: newIds,
          updatedAt: Date.now(),
        };
      });
      saveGroups(updated);
    },
    [groups, saveGroups]
  );

  const moveAarti = useCallback(
    (groupId: string, aartiId: string, direction: 'up' | 'down') => {
      const group = groups.find(g => g.id === groupId);
      if (!group) return;
      const currentIndex = group.aartiIds.indexOf(aartiId);
      if (currentIndex === -1) return;

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= group.aartiIds.length) return;

      reorderAartisInGroup(groupId, currentIndex, targetIndex);
    },
    [groups, reorderAartisInGroup]
  );

  const isAartiInGroup = useCallback(
    (groupId: string, aartiId: string) => {
      const group = groups.find(g => g.id === groupId);
      return group ? group.aartiIds.includes(aartiId) : false;
    },
    [groups]
  );

  return {
    groups,
    isLoaded,
    createGroup,
    updateGroup,
    deleteGroup,
    addAartiToGroup,
    removeAartiFromGroup,
    reorderAartisInGroup,
    moveAarti,
    isAartiInGroup,
  };
}
