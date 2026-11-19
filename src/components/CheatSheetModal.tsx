'use client';

import React, { useEffect } from 'react';

export interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheatSheetModal({ isOpen, onClose }: CheatSheetModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop active"
      id="tl-cheatsheet-modal"
      role="dialog"
      aria-modal="true"
      aria-label="API Cheat Sheet"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-dialog">
        <div className="modal-head">
          <strong style={{ fontSize: '15px' }}>
            API Cheat Sheet — Tra cứu nhanh chuẩn Senior
          </strong>
          <button
            type="button"
            className="btn btn-sm"
            id="btn-close-cheatsheet"
            onClick={onClose}
          >
            Đóng (Esc)
          </button>
        </div>

        <div className="modal-body flex flex-col gap-4">
          <div>
            <div className="scenario-title mb-1.5">HTTP Methods &amp; Thuộc tính</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Safe</th>
                  <th>Idempotent</th>
                  <th>Body</th>
                  <th>Vai trò</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono">GET</td>
                  <td>Có</td>
                  <td>Có</td>
                  <td>Không</td>
                  <td>Đọc tài nguyên</td>
                </tr>
                <tr>
                  <td className="mono">POST</td>
                  <td>Không</td>
                  <td>Không</td>
                  <td>Có</td>
                  <td>Tạo mới (dùng Idempotency-Key khi retry)</td>
                </tr>
                <tr>
                  <td className="mono">PUT</td>
                  <td>Không</td>
                  <td>Có</td>
                  <td>Có</td>
                  <td>Thay thế toàn bộ / đặt trạng thái (như Like)</td>
                </tr>
                <tr>
                  <td className="mono">PATCH</td>
                  <td>Không</td>
                  <td>Tùy</td>
                  <td>Có</td>
                  <td>Cập nhật một phần trường</td>
                </tr>
                <tr>
                  <td className="mono">DELETE</td>
                  <td>Không</td>
                  <td>Có</td>
                  <td>Không</td>
                  <td>Xóa tài nguyên (trả 204)</td>
                </tr>
                <tr>
                  <td className="mono">QUERY</td>
                  <td>Có</td>
                  <td>Có</td>
                  <td>Có</td>
                  <td>Tìm kiếm phức tạp có body (RFC 10008)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <div className="scenario-title mb-1.5">Mã trạng thái &amp; Kiến trúc cốt lõi</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nhóm / Giao thức</th>
                  <th>Ghi nhớ nhanh</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono">200 / 201 / 202 / 204</td>
                  <td>OK / Created (+Location) / Accepted (+Job URL) / No Content</td>
                </tr>
                <tr>
                  <td className="mono">301, 308 / 304</td>
                  <td>Redirect vĩnh viễn (308 giữ method) / Not Modified (ETag cache)</td>
                </tr>
                <tr>
                  <td className="mono">401 / 403 / 404 / 409 / 412 / 422 / 429</td>
                  <td>
                    Chưa login / Cấm / Không thấy / Xung đột / Sai If-Match / Sai rule / Vượt Rate Limit
                  </td>
                </tr>
                <tr>
                  <td className="mono">REST · GraphQL · gRPC</td>
                  <td>
                    REST cho Public + Cache · GraphQL cho đa thiết bị · gRPC cho nội bộ nhanh + Deadline
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
