'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export interface ModeToggleProps {
  mode: 'junior' | 'senior';
  onModeChange: (mode: 'junior' | 'senior') => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="mode-switch" role="group" aria-label="Chế độ Junior hoặc Senior">
      <button
        type="button"
        id="btn-mode-junior"
        onClick={() => onModeChange('junior')}
        className={`mode-btn ${mode === 'junior' ? 'active-junior' : ''}`}
        aria-pressed={mode === 'junior'}
      >
        <AlertTriangle size={15} className="shrink-0" />
        <span>Junior (First-Try)</span>
      </button>

      <button
        type="button"
        id="btn-mode-senior"
        onClick={() => onModeChange('senior')}
        className={`mode-btn ${mode === 'senior' ? 'active-senior' : ''}`}
        aria-pressed={mode === 'senior'}
      >
        <ShieldCheck size={15} className="shrink-0" />
        <span>Senior (Chuẩn Hệ Thống)</span>
      </button>
    </div>
  );
}
