'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Layers } from 'lucide-react';
import { ModeToggle } from './ModeToggle';
import { CheatSheetModal } from './CheatSheetModal';

export interface ModuleNavInfo {
  slug: string;
  order_index: number;
  title: string;
  desc?: string;
  video_timestamp?: string;
}

export interface LabShellProps {
  courseSlug: string;
  currentModuleSlug: string;
  modules: ModuleNavInfo[];
  mode: 'junior' | 'senior';
  onModeChange: (mode: 'junior' | 'senior') => void;
  passedCount: number;
  totalCount?: number;
  modulePassedCount?: number;
  moduleTotalCount?: number;
  simTopbarTitle?: string;
  leftSimulator: React.ReactNode;
  theoryTab: React.ReactNode;
  inspectorTab: React.ReactNode;
  challengesTab: React.ReactNode;
}

export function LabShell({
  courseSlug,
  currentModuleSlug,
  modules,
  mode,
  onModeChange,
  passedCount,
  totalCount = 30,
  modulePassedCount = 0,
  moduleTotalCount = 3,
  simTopbarTitle = 'JaneGram Mobile · v2.4',
  leftSimulator,
  theoryTab,
  inspectorTab,
  challengesTab,
}: LabShellProps) {
  const [activeTab, setActiveTab] = useState<'theory' | 'inspector' | 'challenges'>('theory');
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);

  const progressPercent = Math.min(100, Math.round((passedCount / totalCount) * 100));

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-bg text-ink">
      {/* ================= TOP HEADER (56px) ================= */}
      <header className="lab-header">
        <Link href="/" className="brand-wrap" title="Quay về danh sách khóa học">
          <div className="brand-logo">
            <Layers size={18} />
          </div>
          <div>
            <div className="brand-title">Senior API Lab</div>
            <div className="brand-sub">TechLab · REST API Design ({modules.length} Modules)</div>
          </div>
        </Link>

        {/* Global Progress Pill */}
        <div className="progress-pill">
          <span className="progress-label">Tiến độ nhiệm vụ:</span>
          <div className="progress-track">
            <div
              className="progress-fill"
              id="tl-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="progress-count" id="tl-progress-count">
            {passedCount}/{totalCount}
          </span>
        </div>

        {/* Center Junior / Senior Toggle */}
        <ModeToggle mode={mode} onModeChange={onModeChange} />

        {/* Right Action */}
        <div className="header-right">
          <button
            type="button"
            className="btn"
            id="btn-open-cheatsheet"
            onClick={() => setIsCheatSheetOpen(true)}
          >
            <BookOpen size={15} />
            <span>Cheat Sheet</span>
          </button>
        </div>
      </header>

      {/* ================= 3-COLUMN WORKSPACE ================= */}
      <div className="lab-workspace">
        {/* CỘT 1: DANH SÁCH MODULE (248px) */}
        <aside className="module-sidebar" aria-label="Danh sách bài học">
          <div className="sidebar-head">
            <span>Danh sách bài học ({modules.length} Modules)</span>
            <Link
              href="/"
              className="text-info text-[11px] no-underline hover:underline transition-colors"
            >
              Khóa học
            </Link>
          </div>
          <nav className="module-list">
            {modules.map((m) => {
              const isActive = m.slug === currentModuleSlug;
              return (
                <Link
                  key={m.slug}
                  href={`/courses/${courseSlug}/${m.slug}`}
                  className={`module-item ${isActive ? 'active' : ''}`}
                >
                  <span className="module-num">{m.order_index}</span>
                  <div className="module-meta">
                    <div className="module-name">{m.title}</div>
                    {m.desc && <div className="module-desc">{m.desc}</div>}
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* CỘT 2: KHU VỰC MÔ PHỎNG TƯƠNG TÁC (SLOT_SIMULATOR) */}
        <section className="sim-column" aria-label="Mô phỏng tương tác">
          <div className="sim-topbar">
            <strong className="text-[13px]">{simTopbarTitle}</strong>
            <span
              data-mode-badge
              className={`chip ${mode === 'junior' ? 'chip-junior' : 'chip-senior'}`}
            >
              {mode === 'junior' ? 'Junior (First-Try)' : 'Senior (Chuẩn Hệ Thống)'}
            </span>
          </div>
          <div className="sim-scroll">
            {leftSimulator}
          </div>
        </section>

        {/* CỘT 3: KHU VỰC HỌC & SOI 3 TAB (SLOT_WORKBENCH) */}
        <section className="workbench-column" aria-label="Lý thuyết, Live Inspector và Nhiệm vụ">
          <div className="wb-tabs" role="tablist">
            <button
              type="button"
              className={`wb-tab ${activeTab === 'theory' ? 'active' : ''}`}
              data-tab="theory"
              role="tab"
              aria-selected={activeTab === 'theory'}
              onClick={() => setActiveTab('theory')}
            >
              1. Kiến Thức Cốt Lõi
            </button>

            <button
              type="button"
              className={`wb-tab ${activeTab === 'inspector' ? 'active' : ''}`}
              data-tab="inspector"
              role="tab"
              aria-selected={activeTab === 'inspector'}
              onClick={() => setActiveTab('inspector')}
            >
              2. Live HTTP Inspector
            </button>

            <button
              type="button"
              className={`wb-tab ${activeTab === 'challenges' ? 'active' : ''}`}
              data-tab="challenges"
              role="tab"
              aria-selected={activeTab === 'challenges'}
              onClick={() => setActiveTab('challenges')}
            >
              3. Nhiệm Vụ{' '}
              <span className="tab-badge" id="tl-tab-challenge-count">
                {modulePassedCount}/{moduleTotalCount}
              </span>
            </button>
          </div>

          <div
            className={`wb-pane ${activeTab === 'theory' ? 'active' : ''}`}
            data-pane="theory"
            style={{ display: activeTab === 'theory' ? 'flex' : 'none' }}
          >
            {theoryTab}
          </div>

          <div
            className={`wb-pane ${activeTab === 'inspector' ? 'active' : ''}`}
            data-pane="inspector"
            style={{ display: activeTab === 'inspector' ? 'flex' : 'none' }}
          >
            {inspectorTab}
          </div>

          <div
            className={`wb-pane ${activeTab === 'challenges' ? 'active' : ''}`}
            data-pane="challenges"
            style={{ display: activeTab === 'challenges' ? 'flex' : 'none' }}
          >
            {challengesTab}
          </div>
        </section>
      </div>

      {/* Cheat Sheet Modal */}
      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />
    </div>
  );
}
