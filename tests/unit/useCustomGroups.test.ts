import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCustomGroups } from '@/hooks/useCustomGroups';

describe('useCustomGroups Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initializes with default groups or empty array', () => {
    const { result } = renderHook(() => useCustomGroups());
    expect(Array.isArray(result.current.groups)).toBe(true);
  });

  it('creates a new custom group', () => {
    const { result } = renderHook(() => useCustomGroups());
    let createdId = '';

    act(() => {
      const newGroup = result.current.createGroup('माझी सकाळची पूजा', 'Morning prayers', ['ganesha-sukhkarta']);
      createdId = newGroup.id;
    });

    const found = result.current.groups.find(g => g.id === createdId);
    expect(found).toBeDefined();
    expect(found?.name).toBe('माझी सकाळची पूजा');
    expect(found?.aartiIds).toContain('ganesha-sukhkarta');
  });

  it('adds an aarti to an existing group and prevents duplicates', () => {
    const { result } = renderHook(() => useCustomGroups());
    let groupId = '';

    act(() => {
      const g = result.current.createGroup('दैनिक पूजा');
      groupId = g.id;
    });

    act(() => {
      result.current.addAartiToGroup(groupId, 'ganesha-sukhkarta');
    });

    let group = result.current.groups.find(g => g.id === groupId);
    expect(group?.aartiIds).toEqual(['ganesha-sukhkarta']);

    // Attempt to add duplicate
    act(() => {
      result.current.addAartiToGroup(groupId, 'ganesha-sukhkarta');
    });
    group = result.current.groups.find(g => g.id === groupId);
    expect(group?.aartiIds.length).toBe(1);

    // Add second aarti
    act(() => {
      result.current.addAartiToGroup(groupId, 'shiva-lavthavti');
    });
    group = result.current.groups.find(g => g.id === groupId);
    expect(group?.aartiIds).toEqual(['ganesha-sukhkarta', 'shiva-lavthavti']);
  });

  it('removes an aarti from a group', () => {
    const { result } = renderHook(() => useCustomGroups());
    let groupId = '';

    act(() => {
      const g = result.current.createGroup('दैनिक पूजा', '', ['ganesha-sukhkarta', 'shiva-lavthavti']);
      groupId = g.id;
    });

    act(() => {
      result.current.removeAartiFromGroup(groupId, 'ganesha-sukhkarta');
    });

    const group = result.current.groups.find(g => g.id === groupId);
    expect(group?.aartiIds).toEqual(['shiva-lavthavti']);
  });

  it('reorders aartis within a group sequence', () => {
    const { result } = renderHook(() => useCustomGroups());
    let groupId = '';

    act(() => {
      const g = result.current.createGroup('अनुक्रम टेस्ट', '', [
        'ganesha-sukhkarta',
        'shiva-lavthavti',
        'devi-durge-durgat',
      ]);
      groupId = g.id;
    });

    // Move 'devi-durge-durgat' (index 2) to top (index 0)
    act(() => {
      result.current.reorderAartisInGroup(groupId, 2, 0);
    });

    let group = result.current.groups.find(g => g.id === groupId);
    expect(group?.aartiIds).toEqual([
      'devi-durge-durgat',
      'ganesha-sukhkarta',
      'shiva-lavthavti',
    ]);

    // Move first item down
    act(() => {
      result.current.moveAarti(groupId, 'devi-durge-durgat', 'down');
    });
    group = result.current.groups.find(g => g.id === groupId);
    expect(group?.aartiIds).toEqual([
      'ganesha-sukhkarta',
      'devi-durge-durgat',
      'shiva-lavthavti',
    ]);
  });

  it('deletes a custom group', () => {
    const { result } = renderHook(() => useCustomGroups());
    let groupId = '';

    act(() => {
      const g = result.current.createGroup('हंगामी ग्रुप');
      groupId = g.id;
    });

    expect(result.current.groups.some(g => g.id === groupId)).toBe(true);

    act(() => {
      result.current.deleteGroup(groupId);
    });

    expect(result.current.groups.some(g => g.id === groupId)).toBe(false);
  });
});
