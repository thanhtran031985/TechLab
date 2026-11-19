import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LabShell } from '../../src/components/LabShell';

describe('LabShell Component (src/components/LabShell.tsx)', () => {
  const mockModules = [
    {
      slug: '01-network-http-rest',
      order_index: 1,
      title: 'HTTP, REST & Mạng',
      desc: 'DNS, TCP, TLS & 4 thói quen vàng',
    },
    {
      slug: '02-resource-modeling',
      order_index: 2,
      title: 'Resource & Cấu trúc URL',
      desc: 'Danh từ, Entity/Attribute & Nested',
    },
  ];

  it('renders Header with brand, progress pill, and mode switch', () => {
    const html = renderToStaticMarkup(
      <LabShell
        courseSlug="rest-api"
        currentModuleSlug="01-network-http-rest"
        modules={mockModules}
        mode="junior"
        onModeChange={() => {}}
        passedCount={5}
        totalCount={30}
        modulePassedCount={1}
        moduleTotalCount={3}
        leftSimulator={<div>Mock Simulator</div>}
        theoryTab={<div>Mock Theory</div>}
        inspectorTab={<div>Mock Inspector</div>}
        challengesTab={<div>Mock Challenges</div>}
      />
    );

    expect(html).toContain('lab-header');
    expect(html).toContain('Senior API Lab');
    expect(html).toContain('5/30');
    expect(html).toContain('Junior (First-Try)');
    expect(html).toContain('Cheat Sheet');
  });

  it('renders 3-column workspace with module list, simulator and workbench tabs', () => {
    const html = renderToStaticMarkup(
      <LabShell
        courseSlug="rest-api"
        currentModuleSlug="01-network-http-rest"
        modules={mockModules}
        mode="senior"
        onModeChange={() => {}}
        passedCount={10}
        totalCount={30}
        modulePassedCount={2}
        moduleTotalCount={3}
        leftSimulator={<div>JaneGram Frame</div>}
        theoryTab={<div>Theory Content</div>}
        inspectorTab={<div>Inspector Content</div>}
        challengesTab={<div>Challenge List</div>}
      />
    );

    // Column 1
    expect(html).toContain('module-sidebar');
    expect(html).toContain('HTTP, REST &amp; Mạng');
    expect(html).toContain('module-item active');
    expect(html).toContain('Resource &amp; Cấu trúc URL');

    // Column 2
    expect(html).toContain('sim-column');
    expect(html).toContain('JaneGram Frame');
    expect(html).toContain('Senior (Chuẩn Hệ Thống)');

    // Column 3
    expect(html).toContain('workbench-column');
    expect(html).toContain('1. Kiến Thức Cốt Lõi');
    expect(html).toContain('2. Live HTTP Inspector');
    expect(html).toContain('3. Nhiệm Vụ');
    expect(html).toContain('2/3');
    expect(html).toContain('Theory Content');
  });
});
