'use client';

import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export interface ChallengeItemData {
  id: string;
  order_index: number;
  title: string;
  description: string;
  mode_required: 'junior' | 'senior' | 'both';
}

export interface ChallengePanelProps {
  challenges: ChallengeItemData[];
  passedIds?: string[];
  onVerifyChallenge?: (challengeId: string) => void;
}

export function ChallengePanel({
  challenges,
  passedIds = [],
  onVerifyChallenge,
}: ChallengePanelProps) {
  return (
    <div className="flex flex-col gap-3" aria-live="polite">
      {challenges.map((ch) => {
        const isPassed = passedIds.includes(ch.id);

        return (
          <div
            key={ch.id}
            data-challenge-id={ch.id}
            className={`challenge-card ${isPassed ? 'passed' : ''}`}
          >
            <div className="challenge-top">
              <div className="flex items-center gap-2">
                {isPassed ? (
                  <CheckCircle2 size={16} className="text-senior shrink-0" />
                ) : (
                  <Circle size={16} className="text-ink-soft shrink-0" />
                )}
                <strong className="text-[13px] text-ink">
                  Nhiệm vụ {ch.order_index}: {ch.title}
                </strong>
              </div>

              <span
                data-challenge-status
                className={`chip ${isPassed ? 'chip-senior' : 'chip-info'}`}
              >
                {isPassed ? 'Đạt' : 'Chưa đạt'}
              </span>
            </div>

            <div className="text-[12px] text-ink-soft leading-relaxed mt-1">
              {ch.description}
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-line text-[11px] text-ink-muted">
              <span>
                Yêu cầu: {ch.mode_required === 'both' ? 'Cả 2 chế độ' : ch.mode_required === 'senior' ? 'Senior Mode' : 'Junior Mode'}
              </span>

              {!isPassed && onVerifyChallenge && (
                <button
                  type="button"
                  onClick={() => onVerifyChallenge(ch.id)}
                  className="btn btn-sm btn-primary text-[11px]"
                >
                  Kiểm chứng
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
