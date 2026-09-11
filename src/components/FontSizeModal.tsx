'use client';

import React from 'react';
import { ReadingSettingsModal } from './ReadingSettingsModal';

interface FontSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FontSizeModal({ isOpen, onClose }: FontSizeModalProps) {
  return <ReadingSettingsModal isOpen={isOpen} onClose={onClose} />;
}
