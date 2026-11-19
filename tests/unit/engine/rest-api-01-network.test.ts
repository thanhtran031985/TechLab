import { describe, it, expect } from 'vitest';
import {
  parseUrlAnatomy,
  executeScenario,
  evaluateChallenges,
} from '@/labs/rest-api/01-network-http-rest/engine';

describe('Module 01 Pure Engine (src/labs/rest-api/01-network-http-rest/engine.ts)', () => {
  describe('parseUrlAnatomy', () => {
    it('accurately extracts 6 URL components', () => {
      const url =
        'https://api.janegram.com:443/v1/posts/42/comments?sort=-created_at&limit=10#comments-section';
      const parts = parseUrlAnatomy(url);

      expect(parts).toHaveLength(6);

      const scheme = parts.find((p) => p.part === 'scheme');
      expect(scheme?.raw).toBe('https://');
      expect(scheme?.label).toContain('Scheme');

      const host = parts.find((p) => p.part === 'host');
      expect(host?.raw).toBe('api.janegram.com');

      const port = parts.find((p) => p.part === 'port');
      expect(port?.raw).toBe(':443');

      const pathPart = parts.find((p) => p.part === 'path');
      expect(pathPart?.raw).toBe('/v1/posts/42/comments');

      const query = parts.find((p) => p.part === 'query');
      expect(query?.raw).toBe('?sort=-created_at&limit=10');

      const frag = parts.find((p) => p.part === 'frag');
      expect(frag?.raw).toBe('#comments-section');
      expect(frag?.description).toContain('không bao giờ gửi lên server');
    });
  });

  describe('executeScenario - Wi-Fi Cafe (sc-wifi)', () => {
    it('reproduces Junior vulnerabilities: Plaintext HTTP, verb URL, leaked token, TLS error', () => {
      const res = executeScenario('sc-wifi', 'junior');
      expect(res.mode).toBe('junior');
      expect(res.analysisTone).toBe('warn');
      expect(res.rawRequest).toContain('GET /likeIt?user=janedoe');
      expect(res.rawRequest).toContain('Authorization: Bearer secret-token-12345');
      expect(res.rawResponse).toContain('200 OK');

      // Hop 2 (DNS/TLS) fails in Junior mode
      const dnsHop = res.hops.find((h) => h.label.includes('DNS/TLS'));
      expect(dnsHop?.status).toBe('err');
    });

    it('enforces Senior standards: HTTPS TLS 1.3, PUT Idempotent, 204 No Content, all 5 hops lit', () => {
      const res = executeScenario('sc-wifi', 'senior');
      expect(res.mode).toBe('senior');
      expect(res.analysisTone).toBe('ok');
      expect(res.rawRequest).toContain('PUT /v1/posts/42/likes');
      expect(res.rawRequest).toContain('[ENCRYPTED_TLS]');
      expect(res.rawResponse).toContain('204 No Content');

      // All 5 hops lit
      expect(res.hops.every((h) => h.status === 'lit')).toBe(true);
      expect(res.passedChallengeId).toBe('rest-api/01-network-http-rest/2');
    });
  });

  describe('executeScenario - BigInt JSON precision (sc-bigint)', () => {
    it('demonstrates Junior precision loss for 64-bit integer > 2^53 - 1', () => {
      const res = executeScenario('sc-bigint', 'junior');
      expect(res.mode).toBe('junior');
      expect(res.analysisTone).toBe('crit');
      expect(res.rawRequest).toContain('9007199254740993');
      // JS parser rounded it down to 9007199254740992
      expect(res.rawResponse).toContain('9007199254740992');
      expect(res.analysis).toContain('Number.MAX_SAFE_INTEGER');
    });

    it('demonstrates Senior String wrapping preserving full 64-bit ID', () => {
      const res = executeScenario('sc-bigint', 'senior');
      expect(res.mode).toBe('senior');
      expect(res.analysisTone).toBe('ok');
      expect(res.rawRequest).toContain('"tx_id": "9007199254740993"');
      expect(res.rawResponse).toContain('"processed_id": "9007199254740993"');
      expect(res.passedChallengeId).toBe('rest-api/01-network-http-rest/3');
    });
  });

  describe('executeScenario - Stateless Load Balancer (sc-stateless)', () => {
    it('runs stateless request across worker nodes', () => {
      const res = executeScenario('sc-stateless', 'senior');
      expect(res.analysisTone).toBe('ok');
      expect(res.rawResponse).toContain('X-Served-By:');
      expect(res.analysis.toLowerCase()).toContain('stateless');
    });
  });

  describe('evaluateChallenges', () => {
    it('evaluates Challenge 1 as PASSED when at least 3 URL parts visited', () => {
      const passed = evaluateChallenges({
        visitedParts: ['scheme', 'host', 'path'],
        history: [],
      });
      expect(passed).toContain('rest-api/01-network-http-rest/1');
    });

    it('evaluates Challenge 2 as PASSED when both Junior error and Senior TLS observed', () => {
      const juniorWifi = executeScenario('sc-wifi', 'junior');
      const seniorWifi = executeScenario('sc-wifi', 'senior');

      const passed = evaluateChallenges({
        visitedParts: [],
        history: [juniorWifi, seniorWifi],
      });
      expect(passed).toContain('rest-api/01-network-http-rest/2');
    });

    it('evaluates Challenge 3 as PASSED when Senior BigInt executed with String', () => {
      const seniorBigInt = executeScenario('sc-bigint', 'senior');

      const passed = evaluateChallenges({
        visitedParts: [],
        history: [seniorBigInt],
      });
      expect(passed).toContain('rest-api/01-network-http-rest/3');
    });
  });
});
