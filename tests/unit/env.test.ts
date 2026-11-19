import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';

describe('Environment configuration (src/lib/env.ts)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('provides default TECHLAB_DB_PATH normalized with node:path', async () => {
    delete process.env.TECHLAB_DB_PATH;
    const { getEnv } = await import('../../src/lib/env');
    const env = getEnv();
    const expected = path.resolve(process.cwd(), 'data', 'techlab.db');
    expect(env.TECHLAB_DB_PATH).toBe(expected);
  });

  it('normalizes custom relative TECHLAB_DB_PATH to absolute path', async () => {
    process.env.TECHLAB_DB_PATH = 'custom/data/test.db';
    const { getEnv } = await import('../../src/lib/env');
    const env = getEnv();
    const expected = path.resolve(process.cwd(), 'custom', 'data', 'test.db');
    expect(env.TECHLAB_DB_PATH).toBe(expected);
  });

  it('respects already absolute TECHLAB_DB_PATH', async () => {
    const absPath = path.resolve(process.cwd(), 'test-abs.db');
    process.env.TECHLAB_DB_PATH = absPath;
    const { getEnv } = await import('../../src/lib/env');
    const env = getEnv();
    expect(env.TECHLAB_DB_PATH).toBe(absPath);
  });
});
