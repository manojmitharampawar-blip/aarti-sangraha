import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GroupEditorModal } from '@/components/GroupEditorModal';
import { CustomGroup } from '@/types';

const mockGroup: CustomGroup = {
  id: 'test-group-1',
  name: 'माझी नित्य पूजा',
  description: 'सकाळची आरती',
  aartiIds: ['ganesha-sukhkarta'],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

describe('GroupEditorModal', () => {
  it('populates with existing group details when editing', () => {
    render(
      <GroupEditorModal
        isOpen={true}
        onClose={() => {}}
        group={mockGroup}
      />
    );

    // Group name input should contain the existing name
    const input = screen.getByPlaceholderText(/माझी सकाळची पूजा/i) as HTMLInputElement;
    expect(input.value).toBe('माझी नित्य पूजा');

    // Should indicate editing mode
    expect(screen.getByText('बदल जतन करा (Save Changes)')).toBeInTheDocument();
  });

  it('allows searching and adding aartis to the group', () => {
    render(
      <GroupEditorModal
        isOpen={true}
        onClose={() => {}}
        group={mockGroup}
      />
    );

    // Search for aarti
    const searchInput = screen.getByPlaceholderText(/आरतीचे नाव, देवता किंवा शब्द शोधा/i);
    fireEvent.change(searchInput, { target: { value: 'लवथवती' } });

    // Should find Shiva aarti
    expect(screen.getByText('लवथवती विक्राळा (महादेव आरती)')).toBeInTheDocument();
  });
});
