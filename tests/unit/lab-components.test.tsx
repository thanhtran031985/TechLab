import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ModeToggle } from '../../src/components/ModeToggle';
import { InspectorPanel } from '../../src/components/InspectorPanel';
import { ChallengePanel } from '../../src/components/ChallengePanel';
import { CheatSheetModal } from '../../src/components/CheatSheetModal';
import { LoadingSkeleton, EmptyState, ErrorAlert } from '../../src/components/ui/FeedbackStates';

describe('Lab Shell Shared Components', () => {
  describe('ModeToggle', () => {
    it('renders Junior and Senior mode buttons with correct active classes', () => {
      const juniorHtml = renderToStaticMarkup(
        <ModeToggle mode="junior" onModeChange={() => {}} />
      );
      expect(juniorHtml).toContain('Junior (First-Try)');
      expect(juniorHtml).toContain('Senior (Chuẩn Hệ Thống)');
      expect(juniorHtml).toContain('active-junior');

      const seniorHtml = renderToStaticMarkup(
        <ModeToggle mode="senior" onModeChange={() => {}} />
      );
      expect(seniorHtml).toContain('active-senior');
    });
  });

  describe('InspectorPanel', () => {
    it('renders 5-hop network bar, raw request/response and analysis box', () => {
      const hops = [
        { label: '1. Client', status: 'lit' as const },
        { label: '2. DNS/TLS', status: 'lit' as const },
        { label: '3. Gateway', status: 'lit' as const },
        { label: '4. Service', status: 'lit' as const },
        { label: '5. Database', status: 'lit' as const },
      ];

      const html = renderToStaticMarkup(
        <InspectorPanel
          hops={hops}
          request="GET /v1/posts/42 HTTP/1.1"
          response="HTTP/1.1 200 OK"
          analysis="Thao tác thành công theo chuẩn Senior"
          tone="ok"
        />
      );

      expect(html).toContain('hops-bar');
      expect(html).toContain('1. Client');
      expect(html).toContain('5. Database');
      expect(html).toContain('GET /v1/posts/42 HTTP/1.1');
      expect(html).toContain('HTTP/1.1 200 OK');
      expect(html).toContain('Thao tác thành công theo chuẩn Senior');
      expect(html).toContain('analysis-box ok');
    });
  });

  describe('ChallengePanel', () => {
    it('renders challenges with correct pass/fail chips and aria-live polite', () => {
      const challenges = [
        {
          id: 'rest-api/01-network-http-rest/1',
          order_index: 1,
          title: 'Giải phẫu URL',
          description: 'Xác định đủ 6 thành phần',
          mode_required: 'both' as const,
        },
        {
          id: 'rest-api/01-network-http-rest/2',
          order_index: 2,
          title: 'HTTPS & TLS',
          description: 'Bảo vệ dữ liệu truyền tải',
          mode_required: 'senior' as const,
        },
      ];

      const html = renderToStaticMarkup(
        <ChallengePanel
          challenges={challenges}
          passedIds={['rest-api/01-network-http-rest/1']}
        />
      );

      expect(html).toContain('aria-live="polite"');
      expect(html).toContain('Giải phẫu URL');
      expect(html).toContain('HTTPS &amp; TLS');
      expect(html).toContain('Đạt');
      expect(html).toContain('Chưa đạt');
    });
  });

  describe('CheatSheetModal', () => {
    it('renders modal with HTTP methods and status code tables when open', () => {
      const htmlOpen = renderToStaticMarkup(
        <CheatSheetModal isOpen={true} onClose={() => {}} />
      );
      expect(htmlOpen).toContain('API Cheat Sheet');
      expect(htmlOpen).toContain('GET');
      expect(htmlOpen).toContain('POST');
      expect(htmlOpen).toContain('Idempotent');
      expect(htmlOpen).toContain('200 / 201 / 202 / 204');

      const htmlClosed = renderToStaticMarkup(
        <CheatSheetModal isOpen={false} onClose={() => {}} />
      );
      expect(htmlClosed).toBe('');
    });
  });

  describe('FeedbackStates', () => {
    it('renders LoadingSkeleton with given height', () => {
      const html = renderToStaticMarkup(<LoadingSkeleton height="120px" />);
      expect(html).toContain('height:120px');
    });

    it('renders EmptyState with reason and action', () => {
      const html = renderToStaticMarkup(
        <EmptyState
          message="Chưa có dữ liệu"
          actionLabel="Tải lại"
          onAction={() => {}}
        />
      );
      expect(html).toContain('Chưa có dữ liệu');
      expect(html).toContain('Tải lại');
    });

    it('renders ErrorAlert with retry action', () => {
      const html = renderToStaticMarkup(
        <ErrorAlert message="Lỗi kết nối máy chủ" onRetry={() => {}} />
      );
      expect(html).toContain('Lỗi kết nối máy chủ');
      expect(html).toContain('Thử lại');
    });
  });
});
