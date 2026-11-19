import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { moduleChallengesSchema, courseSchema } from '@/schemas/course';
import { syncCourses } from '../../scripts/sync-courses';

describe('Module 01 Content-as-Code & Challenges Specification', () => {
  const moduleSlug = '01-network-http-rest';
  const contentDir = path.resolve(process.cwd(), 'content', 'courses', 'rest-api');
  const mdxPath = path.join(contentDir, 'modules', `${moduleSlug}.mdx`);
  const challengePath = path.join(contentDir, 'challenges', `${moduleSlug}.json`);
  const coursePath = path.join(contentDir, 'course.json');

  it('validates course.json schema and includes module 01', () => {
    expect(fs.existsSync(coursePath)).toBe(true);
    const raw = JSON.parse(fs.readFileSync(coursePath, 'utf-8'));
    const parsed = courseSchema.parse(raw);
    const m01 = parsed.modules.find((m) => m.slug === moduleSlug);
    expect(m01).toBeDefined();
    expect(m01?.order_index).toBe(1);
    expect(m01?.video_timestamp).toBe('[00:00:00]');
  });

  it('validates challenges/01-network-http-rest.json against Zod schema', () => {
    expect(fs.existsSync(challengePath)).toBe(true);
    const raw = JSON.parse(fs.readFileSync(challengePath, 'utf-8'));
    const parsed = moduleChallengesSchema.parse(raw);
    expect(parsed.module_slug).toBe(moduleSlug);
    expect(parsed.challenges.length).toBe(3);

    // Challenge 1: URL Anatomy
    expect(parsed.challenges[0].order_index).toBe(1);
    expect(parsed.challenges[0].title).toContain('Giải phẫu URL');
    expect(parsed.challenges[0].mode_required).toBe('both');

    // Challenge 2: HTTP vs HTTPS / REST
    expect(parsed.challenges[1].order_index).toBe(2);
    expect(parsed.challenges[1].title).toContain('HTTPS');
    expect(parsed.challenges[1].mode_required).toBe('both');

    // Challenge 3: BigInt JSON precision
    expect(parsed.challenges[2].order_index).toBe(3);
    expect(parsed.challenges[2].title).toContain('số nguyên 64-bit');
    expect(parsed.challenges[2].mode_required).toBe('senior');
  });

  it('validates modules/01-network-http-rest.mdx has all 100% required timestamp concepts', () => {
    expect(fs.existsSync(mdxPath)).toBe(true);
    const content = fs.readFileSync(mdxPath, 'utf-8');

    // Must cover all core timestamps from curriculum.md
    const requiredTimestamps = [
      '[00:00:07]', // Scale server vs Scale API
      '[00:02:42]', // API Contract
      '[00:03:54]', // URL Anatomy (Scheme, Host, Port, Path, Query, Fragment)
      '[00:05:27]', // DNS & TTL
      '[00:06:17]', // IP chọn máy, Port chọn tiến trình
      '[00:06:58]', // TCP 3-Way Handshake
      '[00:09:39]', // UDP & HTTP/3 QUIC
      '[00:10:56]', // HTTP vs HTTPS TLS
      '[00:11:48]', // Server Routing & 4 components
      '[00:14:49]', // JSON & BigInt trap
      '[00:15:57]', // Stateless sau Load Balancer
      '[00:16:35]', // 4 thói quen vàng REST
    ];

    for (const ts of requiredTimestamps) {
      expect(content, `Missing timestamp ${ts}`).toContain(ts);
    }

    // Must include Junior vs Senior comparison
    expect(content).toContain('Junior');
    expect(content).toContain('Senior');
  });

  it('verifies content-as-code sync runs without errors', () => {
    const syncRes = syncCourses({ checkOnly: true });
    expect(syncRes.errors).toEqual([]);
    expect(syncRes.inSync).toBe(true);
  });
});
