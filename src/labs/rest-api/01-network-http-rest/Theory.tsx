'use client';

import React, { useState } from 'react';

interface UrlPart {
  part: string;
  className: string;
  text: string;
  label: string;
  desc: string;
}

const URL_PARTS: UrlPart[] = [
  {
    part: 'scheme',
    className: 'p-scheme',
    text: 'https://',
    label: 'Scheme (https://)',
    desc: 'Quy định giao thức truyền tải. HTTPS = HTTP chạy bên trong đường hầm mã hóa TLS.',
  },
  {
    part: 'host',
    className: 'p-host',
    text: 'api.janegram.com',
    label: 'Host (api.janegram.com)',
    desc: 'Tên miền định danh máy chủ. DNS phân giải tên này thành địa chỉ IP và lưu đệm theo TTL.',
  },
  {
    part: 'port',
    className: 'p-port',
    text: ':443',
    label: 'Port (:443)',
    desc: 'IP chọn đúng máy, Port chọn đúng tiến trình (443 mặc định cho HTTPS, 80 cho HTTP).',
  },
  {
    part: 'path',
    className: 'p-path',
    text: '/v1/posts/42/comments',
    label: 'Path (/v1/posts/42/comments)',
    desc: 'Đường dẫn giúp Server Routing đưa request vào đúng hàm xử lý tài nguyên.',
  },
  {
    part: 'query',
    className: 'p-query',
    text: '?sort=-created_at&limit=10',
    label: 'Query (?sort=-created_at&limit=10)',
    desc: 'Tham số tùy chọn để lọc/sắp xếp. Ký tự khoảng trắng được mã hóa thành %20.',
  },
  {
    part: 'frag',
    className: 'p-frag',
    text: '#comments-section',
    label: 'Fragment (#comments-section)',
    desc: 'Chỉ dùng ở trình duyệt/client để cuộn tới vị trí trang; KHÔNG BAO GIỜ gửi lên server.',
  },
];

export function Module01Theory() {
  const [selectedPart, setSelectedPart] = useState<UrlPart | null>(null);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[16px] font-bold text-ink m-0">Module 01: HTTP, REST &amp; Mạng</h2>
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
          {URL_PARTS.map((p) => (
            <button
              key={p.part}
              type="button"
              className={`url-pill ${p.className} ${selectedPart?.part === p.part ? 'selected' : ''}`}
              data-part={p.part}
              onClick={() => setSelectedPart(p)}
            >
              {p.text}
            </button>
          ))}
        </div>
        <div id="url-anatomy-explain" className="analysis-box">
          {selectedPart ? (
            <div>
              <strong>{selectedPart.label}:</strong> {selectedPart.desc}
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
