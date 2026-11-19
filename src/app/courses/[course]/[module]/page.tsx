'use client';

import React, { useState, useEffect, use } from 'react';
import { LabShell } from '@/components/LabShell';
import { InspectorPanel, HopNode } from '@/components/InspectorPanel';
import { ChallengePanel, ChallengeItemData } from '@/components/ChallengePanel';
import { REST_API_MODULES } from '@/labs/registry';
import { Module01Simulator } from '@/labs/rest-api/01-network-http-rest/Simulator';
import { Module01Theory } from '@/labs/rest-api/01-network-http-rest/Theory';
import {
  executeScenario,
  evaluateChallenges,
  ScenarioResult,
} from '@/labs/rest-api/01-network-http-rest/engine';

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
    description:
      'Xác định chính xác 6 thành phần của URL: Scheme, Host, Port, Path, Query String, Fragment.',
    mode_required: 'both',
  },
  {
    id: 'rest-api/01-network-http-rest/2',
    order_index: 2,
    title: 'Chuyển giao thức HTTP sang HTTPS & Chuẩn hóa REST',
    description:
      'Quan sát rủi ro mất an toàn ở Junior Mode (HTTP thường, URL tùy hứng /likeIt), sau đó kích hoạt Senior Mode (HTTPS + TLS + RESTful) và xác nhận đủ 5 chặng mạng.',
    mode_required: 'both',
  },
  {
    id: 'rest-api/01-network-http-rest/3',
    order_index: 3,
    title: 'Khắc phục mất độ chính xác số nguyên 64-bit trong JSON',
    description:
      'Phát hiện lỗi làm tròn số của ID vượt quá 2^53 - 1 trong JavaScript JSON parser và chuyển trường id sang kiểu chuỗi.',
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
  const [rawRequest, setRawRequest] = useState<string>(
    '(Chưa có request nào được gửi)'
  );
  const [rawResponse, setRawResponse] = useState<string>(
    '(Chờ response từ server...)'
  );
  const [analysis, setAnalysis] = useState<string>(
    'Bấm một nút kịch bản ở cột giữa để quan sát gói tin và so sánh chế độ Junior vs Senior.'
  );
  const [analysisTone, setAnalysisTone] = useState<'ok' | 'warn' | 'crit'>('ok');

  // Engine tracking state
  const [visitedParts, setVisitedParts] = useState<string[]>([]);
  const [history, setHistory] = useState<ScenarioResult[]>([]);

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
        setPassedIds((prev) =>
          prev.includes(challengeId) ? prev : [...prev, challengeId]
        );
      }
    } catch {
      // Fallback local
      setPassedIds((prev) =>
        prev.includes(challengeId) ? prev : [...prev, challengeId]
      );
    }
  };

  const handleSelectPart = (part: string) => {
    const nextParts = visitedParts.includes(part)
      ? visitedParts
      : [...visitedParts, part];
    setVisitedParts(nextParts);

    // Evaluate challenges through pure engine
    const qualified = evaluateChallenges({
      visitedParts: nextParts,
      history,
    });
    for (const qId of qualified) {
      markPassed(qId);
    }
  };

  const handleScenario = (scenarioId: string) => {
    const res = executeScenario(scenarioId as any, mode);

    // Update inspector view from engine output
    setHops(res.hops);
    setRawRequest(res.rawRequest);
    setRawResponse(res.rawResponse);
    setAnalysis(res.analysis);
    setAnalysisTone(res.analysisTone);

    const nextHistory = [...history, res];
    setHistory(nextHistory);

    // Evaluate challenges through pure engine
    const qualified = evaluateChallenges({
      visitedParts,
      history: nextHistory,
    });
    for (const qId of qualified) {
      markPassed(qId);
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
      simTopbarTitle={
        isModule01 ? 'JaneGram Mobile · v2.4' : `Module: ${moduleSlug}`
      }
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
          <Module01Theory onSelectPart={handleSelectPart} />
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
