'use client';

import React, { useState, useEffect, use } from 'react';
import { LabShell } from '@/components/LabShell';
import { InspectorPanel, HopNode } from '@/components/InspectorPanel';
import { ChallengePanel, ChallengeItemData } from '@/components/ChallengePanel';
import { REST_API_MODULES } from '@/labs/registry';
import { Module01Simulator } from '@/labs/rest-api/01-network-http-rest/Simulator';
import { Module01Theory } from '@/labs/rest-api/01-network-http-rest/Theory';

interface PageProps {
  params: Promise<{
    course: string;
    module: string;
  }>;
}

const MODULE_01_CHALLENGES: ChallengeItemData[] = [
  {
    id: 'rest-api/01-network-http-rest/1',
    order_index: 1,
    title: 'Giải phẫu URL',
    description: 'Xác định chính xác 6 thành phần của URL: Scheme, Host, Port, Path, Query String, Fragment.',
    mode_required: 'both',
  },
  {
    id: 'rest-api/01-network-http-rest/2',
    order_index: 2,
    title: 'Chuyển giao thức HTTP sang HTTPS & Chuẩn hóa REST',
    description: 'Quan sát rủi ro mất an toàn ở Junior Mode (HTTP thường, URL tùy hứng /likeIt), sau đó kích hoạt Senior Mode (HTTPS + TLS + RESTful) và xác nhận đủ 5 chặng mạng.',
    mode_required: 'both',
  },
  {
    id: 'rest-api/01-network-http-rest/3',
    order_index: 3,
    title: 'Khắc phục mất độ chính xác số nguyên 64-bit trong JSON',
    description: 'Phát hiện lỗi làm tròn số của ID vượt quá 2^53 - 1 trong JavaScript JSON parser và chuyển trường id sang kiểu chuỗi.',
    mode_required: 'senior',
  },
];

export default function LabModulePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const courseSlug = resolvedParams.course;
  const moduleSlug = resolvedParams.module;

  const [mode, setMode] = useState<'junior' | 'senior'>('junior');
  const [passedIds, setPassedIds] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState<number>(30);

  // Inspector state
  const [hops, setHops] = useState<HopNode[]>([
    { label: '1. Client', status: 'idle' },
    { label: '2. DNS/TLS', status: 'idle' },
    { label: '3. Gateway', status: 'idle' },
    { label: '4. Service', status: 'idle' },
    { label: '5. Database', status: 'idle' },
  ]);
  const [rawRequest, setRawRequest] = useState<string>('(Chưa có request nào được gửi)');
  const [rawResponse, setRawResponse] = useState<string>('(Chờ response từ server...)');
  const [analysis, setAnalysis] = useState<string>(
    'Bấm một nút kịch bản ở cột giữa để quan sát gói tin và so sánh chế độ Junior vs Senior.'
  );
  const [analysisTone, setAnalysisTone] = useState<'ok' | 'warn' | 'crit'>('ok');

  // Load progress on mount
  useEffect(() => {
    fetch('/api/progress')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.data) {
          setPassedIds(data.data.passedIds || []);
          setTotalCount(data.data.totalCount || 30);
        }
      })
      .catch(() => {});
  }, []);

  const markPassed = async (challengeId: string) => {
    if (passedIds.includes(challengeId)) return;

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId }),
      });
      const data = await res.json();
      if (data.ok) {
        setPassedIds((prev) => [...prev, challengeId]);
      }
    } catch {
      // Fallback local
      setPassedIds((prev) => [...prev, challengeId]);
    }
  };

  const handleScenario = (scenarioId: string) => {
    if (scenarioId === 'like' || scenarioId === 'sc-wifi') {
      if (mode === 'junior') {
        setHops([
          { label: '1. Client', status: 'lit' },
          { label: '2. DNS/TLS', status: 'err' },
          { label: '3. Gateway', status: 'idle' },
          { label: '4. Service', status: 'idle' },
          { label: '5. Database', status: 'idle' },
        ]);
        setRawRequest(
          `GET /likeIt?user=janedoe&post=42 HTTP/1.1\nHost: api.janegram.com\nAuthorization: Bearer secret-token-12345`
        );
        setRawResponse(
          `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"status": "ok", "message": "liked"}`
        );
        setAnalysis(
          'CẢNH BÁO JUNIOR: Request dùng GET cho hành động sửa dữ liệu, URL đặt động từ (/likeIt), chạy qua HTTP thuần không mã hóa TLS! Token nhạy cảm bị bắt gói tin thô trên Wi-Fi quán cafe.'
        );
        setAnalysisTone('warn');
      } else {
        setHops([
          { label: '1. Client', status: 'lit' },
          { label: '2. DNS/TLS', status: 'lit' },
          { label: '3. Gateway', status: 'lit' },
          { label: '4. Service', status: 'lit' },
          { label: '5. Database', status: 'lit' },
        ]);
        setRawRequest(
          `PUT /v1/posts/42/likes HTTP/1.1\nHost: api.janegram.com\nAuthorization: Bearer [ENCRYPTED_TLS]\nContent-Length: 0`
        );
        setRawResponse(
          `HTTP/1.1 204 No Content\nStrict-Transport-Security: max-age=31536000\nDate: ${new Date().toUTCString()}`
        );
        setAnalysis(
          'CHUẨN SENIOR: HTTPS + TLS 1.3 bảo mật kênh truyền. URL chuẩn RESTful (/v1/posts/42/likes) sử dụng PUT mang tính Idempotent (bấm like nhiều lần không bị cộng trùng lượt thích). Trả 204 No Content tối ưu băng thông.'
        );
        setAnalysisTone('ok');

        // Automatically pass Challenge 2 in Senior mode!
        markPassed('rest-api/01-network-http-rest/2');
      }
    } else if (scenarioId === 'bigint' || scenarioId === 'sc-bigint') {
      if (mode === 'junior') {
        setHops([
          { label: '1. Client', status: 'lit' },
          { label: '2. DNS/TLS', status: 'lit' },
          { label: '3. Gateway', status: 'lit' },
          { label: '4. Service', status: 'err' },
          { label: '5. Database', status: 'idle' },
        ]);
        setRawRequest(
          `POST /v1/transactions HTTP/1.1\nHost: api.janegram.com\nContent-Type: application/json\n\n{"tx_id": 9007199254740993}`
        );
        setRawResponse(
          `HTTP/1.1 200 OK\n\n{"processed_id": 9007199254740992}`
        );
        setAnalysis(
          'LỖI JUNIOR: Số nguyên 9007199254740993 vượt quá Number.MAX_SAFE_INTEGER (2^53 - 1). JSON parser làm tròn thành 9007199254740992 gây sai lệch ID tài chính nghiêm trọng!'
        );
        setAnalysisTone('crit');
      } else {
        setHops([
          { label: '1. Client', status: 'lit' },
          { label: '2. DNS/TLS', status: 'lit' },
          { label: '3. Gateway', status: 'lit' },
          { label: '4. Service', status: 'lit' },
          { label: '5. Database', status: 'lit' },
        ]);
        setRawRequest(
          `POST /v1/transactions HTTP/1.1\nHost: api.janegram.com\nContent-Type: application/json\n\n{"tx_id": "9007199254740993"}`
        );
        setRawResponse(
          `HTTP/1.1 201 Created\n\n{"processed_id": "9007199254740993"}`
        );
        setAnalysis(
          'CHUẨN SENIOR: ID số nguyên lớn (> 2^53 - 1) và ngày giờ luôn được biểu diễn dưới dạng String trong JSON payload để bảo toàn 100% độ chính xác trên mọi client runtime.'
        );
        setAnalysisTone('ok');

        // Automatically pass Challenge 3!
        markPassed('rest-api/01-network-http-rest/3');
      }
    } else if (scenarioId === 'sc-stateless') {
      setHops([
        { label: '1. Client', status: 'lit' },
        { label: '2. DNS/TLS', status: 'lit' },
        { label: '3. Gateway', status: 'lit' },
        { label: '4. Service', status: 'lit' },
        { label: '5. Database', status: 'lit' },
      ]);
      setRawRequest(
        `GET /v1/profile HTTP/1.1\nHost: api.janegram.com\nAuthorization: Bearer jwt-token-with-signature`
      );
      setRawResponse(
        `HTTP/1.1 200 OK\nX-Served-By: worker-node-03\n\n{"user": "janedoe", "stateless": true}`
      );
      setAnalysis(
        'KIẾN TRÚC STATELESS: Server không lưu session state trong bộ nhớ cục bộ của tiến trình. Request được cân bằng tải vào bất kỳ worker node nào (worker-node-03) vẫn xác thực thành công nhờ token độc lập.'
      );
      setAnalysisTone('ok');
    }
  };

  const handleVerifyChallenge = (challengeId: string) => {
    markPassed(challengeId);
  };

  const isModule01 = moduleSlug === '01-network-http-rest';

  // Count module passed
  const currentModuleChallenges = isModule01 ? MODULE_01_CHALLENGES : [];
  const modulePassedCount = currentModuleChallenges.filter((c) =>
    passedIds.includes(c.id)
  ).length;

  return (
    <LabShell
      courseSlug={courseSlug}
      currentModuleSlug={moduleSlug}
      modules={REST_API_MODULES}
      mode={mode}
      onModeChange={setMode}
      passedCount={passedIds.length}
      totalCount={totalCount}
      modulePassedCount={modulePassedCount}
      moduleTotalCount={isModule01 ? 3 : 0}
      simTopbarTitle={isModule01 ? 'JaneGram Mobile · v2.4' : `Module: ${moduleSlug}`}
      leftSimulator={
        isModule01 ? (
          <Module01Simulator mode={mode} onExecuteScenario={handleScenario} />
        ) : (
          <div className="card">
            <div className="card-title">
              <span>Mô phỏng Module {moduleSlug}</span>
            </div>
            <div className="muted text-[12px]">
              Module này đang được xây dựng ở các task tiếp theo (task 02 → 10). Bạn có thể bấm chuyển qua lại trên thanh danh sách 10 bài học bên trái.
            </div>
          </div>
        )
      }
      theoryTab={
        isModule01 ? (
          <Module01Theory />
        ) : (
          <div className="card">
            <div className="card-title">
              <span>Lý thuyết Module {moduleSlug}</span>
            </div>
            <div className="muted text-[12px]">
              Nội dung chi tiết được nạp từ MDX trong các task tiếp theo.
            </div>
          </div>
        )
      }
      inspectorTab={
        <InspectorPanel
          hops={hops}
          request={rawRequest}
          response={rawResponse}
          analysis={analysis}
          tone={analysisTone}
        />
      }
      challengesTab={
        <ChallengePanel
          challenges={currentModuleChallenges}
          passedIds={passedIds}
          onVerifyChallenge={handleVerifyChallenge}
        />
      }
    />
  );
}
