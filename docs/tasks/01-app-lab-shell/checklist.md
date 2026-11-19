# Checklist kiểm thử — 01-app-lab-shell

## API & SQLite
- [x] `/api/courses` và `/api/courses/[course]` trả đúng tiến độ tổng hợp từ SQLite
- [x] `POST /api/progress` validate bằng Zod, ghi nhận `PASSED` idempotent, trả 400 tiếng Việt khi sai payload
- [x] 7/7 tests trong `tests/integration/api-progress.test.ts` xanh

## Thành phần & Khung LabShell
- [x] `ModeToggle` chuyển đổi mượt giữa `Junior (First-Try)` và `Senior (Chuẩn Hệ Thống)` với phím nhấn và trạng thái active
- [x] `CheatSheetModal` tra cứu nhanh HTTP Methods và Status Codes, mở mượt và đóng bằng phím `Esc`
- [x] `<LabShell>` khóa cứng Header 56px, Bố cục 3 cột (Sidebar 248px, Simulator 38%, Workbench 3 Tab)
- [x] `InspectorPanel` hiển thị 5 chặng mạng (`hops-bar`), Raw Request/Response, tone phân tích
- [x] `ChallengePanel` hiển thị danh sách thử thách, nhãn Đạt/Chưa đạt và `aria-live="polite"`
- [x] 4 trạng thái dữ liệu (`LoadingSkeleton`, `EmptyState`, `ErrorAlert`)
- [x] 7/7 tests trong `tests/unit/lab-components.test.tsx` và 2/2 tests trong `tests/unit/lab-shell.test.tsx` xanh

## Giao diện & Đối chiếu thiết kế
- [x] Trang chủ `/` bám sát `designs/pages/home.html` (Header TechLab Portal, Progress pill, 2 course cards, Cheat sheet)
- [x] Trang Lab `/courses/rest-api/01-network-http-rest` bám sát `designs/pages/courses/rest-api/module-01.html`
- [x] JaneGram Mobile Simulator v2.4 tương tác kịch bản Like và BigInt JSON
- [x] Công cụ URL Anatomy 6 thành phần tương tác cập nhật giải thích kỹ thuật
- [x] Không cuộn toàn cục (`scrollHeight <= innerHeight`, `scrollWidth <= innerWidth`) ở 1366×768 và 1440×900
- [x] Giao diện chuẩn Dark Studio (`data-theme="dark"` mặc định), Fluent Compact, 0 emoji, 0 dấu chấm than
- [x] 8/8 tests trong Playwright E2E (`tests/e2e/lab-shell.spec.ts` & `tests/e2e/smoke.spec.ts`) xanh
- [x] Ảnh chụp giao diện đã lưu vào `tests/e2e/__screens__/`
