'use client';

import React, { useState } from 'react';
import { parseUrlAnatomy } from './engine';

const SAMPLE_URL =
  'https://api.janegram.com:443/v1/posts/42/comments?sort=-created_at&limit=10#comments-section';

const URL_PARTS = parseUrlAnatomy(SAMPLE_URL);

export interface Module01TheoryProps {
  onSelectPart?: (part: string) => void;
}

export function Module01Theory({ onSelectPart }: Module01TheoryProps) {
  const [selectedPart, setSelectedPart] = useState<(typeof URL_PARTS)[0] | null>(null);

  const handleSelect = (partItem: (typeof URL_PARTS)[0]) => {
    setSelectedPart(partItem);
    onSelectPart?.(partItem.part);
  };

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[16px] font-bold text-ink m-0">Module 01: Nền tảng Mạng, HTTP &amp; REST</h2>
        <span className="ts-badge">Video [00:00:00] – [00:19:34]</span>
      </div>

      {/* URL Anatomy Tool */}
      <div className="card">
        <h3 className="card-title">
          <span>Công cụ Giải Phẫu Cấu Trúc URL</span>
          <span className="ts-badge">[00:03:54]</span>
        </h3>
        <div className="muted">
          Bấm vào từng thành phần màu bên dưới để xem vai trò trong hành trình mạng:
        </div>
        <div className="url-box">
          {URL_PARTS.map((p) => {
            const classMapping: Record<string, string> = {
              scheme: 'p-scheme',
              host: 'p-host',
              port: 'p-port',
              path: 'p-path',
              query: 'p-query',
              frag: 'p-frag',
            };
            const colorClass = classMapping[p.part] || '';

            return (
              <button
                key={p.part}
                type="button"
                className={`url-pill ${colorClass} ${selectedPart?.part === p.part ? 'selected' : ''}`}
                data-part={p.part}
                onClick={() => handleSelect(p)}
              >
                {p.raw}
              </button>
            );
          })}
        </div>
        <div id="url-anatomy-explain" className="analysis-box">
          {selectedPart ? (
            <div>
              <strong>{selectedPart.label}:</strong> {selectedPart.description}
            </div>
          ) : (
            'Bấm vào bất kỳ khối màu nào phía trên để đọc giải thích kỹ thuật.'
          )}
        </div>
      </div>

      {/* 4 Golden Rules Table */}
      <div className="card">
        <h3 className="card-title">
          <span>4 Thói Quen Vàng của REST &amp; Tầng Mạng</span>
          <span className="ts-badge">[00:06:58] – [00:18:17]</span>
        </h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Chủ đề</th>
              <th>Junior (First-Try)</th>
              <th>Senior (Chuẩn Hệ Thống)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Đặt tên URL</td>
              <td className="mono">/likeIt, /getAllPosts</td>
              <td className="mono">Tài nguyên có URL riêng (/posts/42/likes) + HTTP Method</td>
            </tr>
            <tr>
              <td>Truyền tải &amp; TLS</td>
              <td>HTTP thuần (lộ token trên Wi-Fi quán cafe)</td>
              <td>TCP 3-Way Handshake + TLS (HTTPS) hoặc HTTP/3 (QUIC)</td>
            </tr>
            <tr>
              <td>Trạng thái Server</td>
              <td>Lưu session trong RAM server A (lỗi khi qua server C)</td>
              <td>Stateless: mọi request mang theo bằng chứng danh tính</td>
            </tr>
            <tr>
              <td>JSON thực chiến</td>
              <td>Gửi ID 64-bit dạng Number (mất chữ số cuối)</td>
              <td>Gửi ID lớn và ngày giờ (RFC 3339 UTC) dạng String</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
