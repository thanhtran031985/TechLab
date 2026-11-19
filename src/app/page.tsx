'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, BookOpen } from 'lucide-react';
import { CheatSheetModal } from '@/components/CheatSheetModal';

export default function HomePage() {
  const [passedCount, setPassedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(30);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);

  useEffect(() => {
    fetch('/api/progress')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.data) {
          setPassedCount(data.data.passedCount || 0);
          setTotalCount(data.data.totalCount || 30);
        }
      })
      .catch(() => {});
  }, []);

  const progressPercent = Math.min(100, Math.round((passedCount / totalCount) * 100));

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-bg text-ink">
      {/* Header */}
      <header className="lab-header">
        <Link href="/" className="brand-wrap">
          <div className="brand-logo">
            <Layers size={20} />
          </div>
          <div>
            <div className="brand-title">TechLab Portal</div>
            <div className="brand-sub">Interactive System Design &amp; Engineering Sandboxes</div>
          </div>
        </Link>

        <div className="progress-pill">
          <span className="progress-label">Tiến độ REST API:</span>
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

      {/* Main Home Page */}
      <main className="home-page">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-[20px] font-bold text-ink m-0">
              Danh sách khóa học tương tác
            </h1>
            <div className="muted mt-1 text-[13px]">
              Mỗi khóa học bám sát 100% kiến thức từ video gốc, chia thành từng Module Lab tách biệt trên cùng một khung Dark Studio.
            </div>
          </div>

          <Link
            href="/courses/rest-api/01-network-http-rest"
            className="btn btn-primary shrink-0"
          >
            Vào ngay Module 01
          </Link>
        </div>

        <div className="home-grid">
          {/* Card 1: REST API */}
          <div className="card">
            <div className="card-title">
              <span>REST API Design Like a Senior Engineer</span>
              <span className="chip chip-senior">10 Modules · Sẵn sàng</span>
            </div>
            <div className="muted text-[12px] leading-relaxed">
              Nguồn: System Design Lab (02:24:33). Bao phủ trọn vẹn Networking, Resource URL, Methods/ETag, Pagination, Idempotency, Kiến trúc 3 tầng &amp; Versioning, Auth/JWT/OAuth, Bảo mật OWASP, OpenAPI và GraphQL/gRPC.
            </div>
            <div className="flex items-center justify-between mt-1.5 pt-2 border-t border-line">
              <span className="mono muted text-[12px]">30 nhiệm vụ tự chấm</span>
              <Link
                href="/courses/rest-api/01-network-http-rest"
                className="btn btn-primary btn-sm"
              >
                Mở phòng Lab
              </Link>
            </div>
          </div>

          {/* Card 2: Future Course */}
          <div className="card" style={{ opacity: 0.75 }}>
            <div className="card-title">
              <span>Khóa học tiếp theo (System Design / Database)</span>
              <span className="chip chip-info">Mở rộng bằng /phan-tich-nguon</span>
            </div>
            <div className="muted text-[12px] leading-relaxed">
              Thêm transcript mới vào thư mục sources/, chạy skill phan-tich-nguon và tạo thêm file module HTML trên cùng bộ khung shell.css/shell.js để Antigravity ghép tiếp vào TechLab.
            </div>
            <div className="flex items-center justify-between mt-1.5 pt-2 border-t border-line">
              <span className="mono muted text-[12px]">Chưa nạp dữ liệu</span>
              <span className="btn btn-sm cursor-default">Sắp triển khai</span>
            </div>
          </div>
        </div>
      </main>

      {/* Cheat Sheet Modal */}
      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />
    </div>
  );
}
