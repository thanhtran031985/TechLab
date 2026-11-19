import React from 'react';
import { AlertCircle, FolderOpen, RefreshCw } from 'lucide-react';

export function LoadingSkeleton({
  height = '100px',
  className = '',
}: {
  height?: string;
  className?: string;
}) {
  return (
    <div
      style={{ height }}
      className={`w-full rounded-md bg-surface-2 animate-pulse border border-line ${className}`}
    />
  );
}

export function EmptyState({
  message = 'Chưa có dữ liệu',
  actionLabel,
  onAction,
}: {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-md border border-line bg-surface text-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-ink-soft">
        <FolderOpen size={20} />
      </div>
      <p className="text-[13px] text-ink-soft max-w-xs">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn btn-sm btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorAlert({
  message = 'Đã có lỗi xảy ra',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-md border border-crit bg-crit-soft text-crit text-[12px] gap-3">
      <div className="flex items-center gap-2">
        <AlertCircle size={16} className="shrink-0" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-sm btn-crit flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw size={13} />
          <span>Thử lại</span>
        </button>
      )}
    </div>
  );
}
