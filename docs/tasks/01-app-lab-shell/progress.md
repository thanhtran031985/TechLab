# Tiến độ — 01-app-lab-shell

Trạng thái: 🔄

| Bước | Nội dung | Trạng thái | Ngày | Commit |
|---|---|---|---|---|
| 1 | API chuẩn hóa (`/api/courses`, `/api/progress`) | ✅ | 19/11/2026 | `80b770e` |
| 2 | Nạp tokens Dark Studio & Thành phần dùng chung | ✅ | 19/11/2026 | `24eacdc` |
| 3 | Khung `<LabShell>` 3 cột bám sát `designs/shell/shell.css` | ✅ | 19/11/2026 | (chờ commit) |
| 4 | Trang chủ `/` theo `designs/pages/home.html` & Route động `/courses/[course]/[module]` | ⬜ | | |

## Nhật ký
### Bước 1 (19/11/2026)
- **Đã làm:**
  - Viết helper `src/lib/api-response.ts` trả định dạng thống nhất `{ ok: true, data }` hoặc `{ ok: false, code, message, details }`.
  - Triển khai Route Handler `src/app/api/courses/route.ts` truy vấn danh sách khóa học kèm số lượng module và số challenge đã đạt (`PASSED`).
  - Triển khai Route Handler `src/app/api/courses/[course]/route.ts` lấy chi tiết khóa học và danh sách 10 modules kèm số challenge đạt của từng module (trả 404 nếu không tìm thấy khóa).
  - Triển khai Route Handler `src/app/api/progress/route.ts`:
    - `GET`: Lấy danh sách các challenge đã hoàn thành và tổng số đạt trên 30.
    - `POST`: Nhận `challengeId`, validate bằng Zod, kiểm tra challenge tồn tại và upsert vào `challenge_progress` cho `user_id = 'local'` (idempotent).
  - Viết test TDD trước: `tests/integration/api-progress.test.ts` (7 tests).
- **Lệnh + kết quả:**
  - `pnpm test tests/integration/api-progress.test.ts`: Xanh (7/7 tests pass).
  - `pnpm typecheck`: Xanh (0 lỗi).
  - `pnpm tasks:dashboard`: Xanh.
- **Suy ra gì:** Không có.
- **Việc người dùng cần làm tay:** Không có.

### Bước 2 (19/11/2026)
- **Đã làm:**
  - Nạp token và layout CSS từ `designs/shell/tokens.css` và `designs/shell/shell.css` vào `src/app/globals.css`.
  - Triển khai component `ModeToggle` (`src/components/ModeToggle.tsx`) cho phép chuyển đổi chế độ Junior (First-Try) và Senior (Chuẩn Hệ Thống).
  - Triển khai component `InspectorPanel` (`src/components/InspectorPanel.tsx`) hiển thị 5 chặng mạng (`hops-bar`), Raw HTTP Request, Raw HTTP Response và hộp phân tích tone màu.
  - Triển khai component `ChallengePanel` (`src/components/ChallengePanel.tsx`) hiển thị danh sách thử thách, trạng thái Đạt/Chưa đạt và hỗ trợ vùng `aria-live="polite"`.
  - Triển khai `CheatSheetModal` (`src/components/CheatSheetModal.tsx`) hiển thị tra cứu nhanh HTTP Methods và Status Codes, hỗ trợ phím `Esc` để đóng.
  - Xây dựng bộ component phản hồi trạng thái dữ liệu `LoadingSkeleton`, `EmptyState`, `ErrorAlert` (`src/components/ui/FeedbackStates.tsx`).
  - Viết test TDD trước: `tests/unit/lab-components.test.tsx` (7 tests).
- **Lệnh + kết quả:**
  - `pnpm test tests/unit/lab-components.test.tsx`: Xanh (7/7 tests pass).
  - `pnpm typecheck`: Xanh.
  - `pnpm tasks:dashboard`: Xanh.
- **Suy ra gì:** Không có.
- **Việc người dùng cần làm tay:** Không có.

### Bước 3 (19/11/2026)
- **Đã làm:**
  - Xây dựng component khung `<LabShell>` (`src/components/LabShell.tsx`) chuẩn hóa 3 cột Dark Studio theo `designs/shell/shell.css`:
    - Header 56px: Brand Title "Senior API Lab" link về `/`, thanh tiến độ nhiệm vụ `X/30`, công tắc chế độ `ModeToggle`, nút mở `CheatSheetModal`.
    - Cột 1 (Sidebar 248px): Danh sách bài học 10 module, hiển thị số thứ tự, tiêu đề, mô tả ngắn và trạng thái `active`.
    - Cột 2 (Simulator Pane 38%): Thanh tiêu đề simulator, chip chế độ Junior/Senior, vùng cuộn mô phỏng `sim-scroll`.
    - Cột 3 (Workbench 3 Tabs): Tab 1 Kiến Thức Cốt Lõi, Tab 2 Live HTTP Inspector, Tab 3 Nhiệm Vụ kèm badge tiến độ module `X/3`.
  - Cập nhật `scripts/gen-tokens.ts` tương thích với phiên bản Dark Studio v5.
  - Viết test TDD trước: `tests/unit/lab-shell.test.tsx` (2 tests).
- **Lệnh + kết quả:**
  - `pnpm test`: 28/28 tests pass (8 test files).
  - `pnpm typecheck`: Xanh.
  - `pnpm tasks:dashboard`: Xanh.
- **Suy ra gì:** Không có.
- **Việc người dùng cần làm tay:** Không có.
