import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { generateTokens } from '../../scripts/gen-tokens';

describe('Design Tokens Generation (scripts/gen-tokens.ts)', () => {
  it('generates designs/tokens.css and docs/DESIGN_SYSTEM.md from designs/tokens.json', () => {
    generateTokens();

    const cssPath = path.resolve(process.cwd(), 'designs', 'tokens.css');
    const docPath = path.resolve(process.cwd(), 'docs', 'DESIGN_SYSTEM.md');

    expect(fs.existsSync(cssPath)).toBe(true);
    expect(fs.existsSync(docPath)).toBe(true);

    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    expect(cssContent).toContain(':root');
    expect(cssContent).toContain('--primary:');
    expect(cssContent).toContain('--bg:');
    expect(cssContent).toContain('--surface:');
    expect(cssContent).toContain('--senior:');
    expect(cssContent).toContain('--junior:');
    expect(cssContent).toContain('--crit:');

    const docContent = fs.readFileSync(docPath, 'utf-8');
    expect(docContent).toContain('# Hệ thống Thiết kế TechLab (Design System)');
  });
});
