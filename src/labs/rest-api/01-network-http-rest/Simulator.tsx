'use client';

import React, { useState } from 'react';

export interface Module01SimulatorProps {
  mode: 'junior' | 'senior';
  onExecuteScenario: (scenarioId: string) => void;
}

export function Module01Simulator({
  mode,
  onExecuteScenario,
}: Module01SimulatorProps) {
  const [likes, setLikes] = useState(128);

  const handleLike = () => {
    setLikes((prev) => (mode === 'junior' ? prev + 1 : prev === 128 ? 129 : 128));
    onExecuteScenario('like');
  };

  return (
    <div className="flex flex-col gap-3">
      {/* JaneGram Mobile Frame */}
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-appbar">
          <span className="jane-logo">JaneGram</span>
          <span className="mono muted">v2.4</span>
        </div>
        <div className="phone-body">
          <div className="post-user">
            <div className="avatar-circle">J</div>
            <div>
              <div style={{ fontWeight: 700 }}>janedoe</div>
              <div className="muted" style={{ fontSize: '11px' }}>
                TP. Hồ Chí Minh
              </div>
            </div>
          </div>

          <div className="post-canvas">
            <div className="post-sun" />
            <span>Coffee Break at Lab</span>
          </div>

          <div className="flex items-center justify-between">
            <span id="m1-likes" style={{ fontWeight: 700 }}>
              {likes} lượt thích
            </span>
            <span className="mono muted">post_id: 42</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-primary btn-sm flex-1"
              id="m1-btn-like"
              onClick={handleLike}
            >
              Thích bài viết
            </button>
            <button
              type="button"
              className="btn btn-sm flex-1"
              id="m1-btn-bigint"
              onClick={() => onExecuteScenario('bigint')}
            >
              Test BigInt JSON
            </button>
          </div>
        </div>
      </div>

      {/* Scenarios Box */}
      <div className="scenario-box">
        <div className="scenario-title">Kịch bản thực hành Module 01</div>
        <button
          type="button"
          className="btn scenario-btn"
          id="m1-sc-1"
          onClick={() => onExecuteScenario('sc-wifi')}
        >
          1. Bấm Like qua Wi-Fi công cộng (HTTP vs HTTPS)
        </button>
        <button
          type="button"
          className="btn scenario-btn"
          id="m1-sc-2"
          onClick={() => onExecuteScenario('sc-stateless')}
        >
          2. Gọi 2 request liên tiếp qua Load Balancer (Stateless)
        </button>
        <button
          type="button"
          className="btn scenario-btn"
          id="m1-sc-3"
          onClick={() => onExecuteScenario('sc-bigint')}
        >
          3. Kiểm tra ID số nguyên lớn &gt; 2^53 trong JSON
        </button>
      </div>
    </div>
  );
}
