'use client';

import React from 'react';

export interface HopNode {
  label: string;
  status?: 'idle' | 'lit' | 'err';
}

export interface InspectorPanelProps {
  hops?: HopNode[];
  request?: string;
  response?: string;
  analysis?: string;
  tone?: 'ok' | 'warn' | 'crit';
}

const DEFAULT_HOPS: HopNode[] = [
  { label: '1. Client', status: 'idle' },
  { label: '2. DNS/TLS', status: 'idle' },
  { label: '3. Gateway', status: 'idle' },
  { label: '4. Service', status: 'idle' },
  { label: '5. Database', status: 'idle' },
];

export function InspectorPanel({
  hops = DEFAULT_HOPS,
  request = '(Chưa có request nào được gửi)',
  response = '(Chờ response từ server...)',
  analysis = 'Bấm một nút kịch bản ở cột giữa để quan sát gói tin và so sánh chế độ Junior vs Senior.',
  tone = 'ok',
}: InspectorPanelProps) {
  return (
    <div className="flex flex-col gap-3.5" aria-live="polite">
      <div>
        <div className="scenario-title mb-1.5">Hành trình gói tin &amp; tầng xử lý (5 chặng)</div>
        <div className="hops-bar" id="tl-hops">
          {hops.map((hop, idx) => (
            <div
              key={idx}
              className={`hop-node ${
                hop.status === 'lit' ? 'lit' : hop.status === 'err' ? 'err' : ''
              }`}
            >
              {hop.label}
            </div>
          ))}
        </div>
      </div>

      <div className={`analysis-box ${tone}`} id="tl-analysis">
        {analysis}
      </div>

      <div>
        <div className="scenario-title mb-1">Raw HTTP Request</div>
        <pre className="code-block" id="tl-raw-req">{request}</pre>
      </div>

      <div>
        <div className="scenario-title mb-1">Raw HTTP Response</div>
        <pre className="code-block" id="tl-raw-res">{response}</pre>
      </div>
    </div>
  );
}
