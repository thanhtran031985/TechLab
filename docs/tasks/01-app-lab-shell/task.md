# 01-app-lab-shell — Dựng khung Dark Studio 3 cột (`<LabShell>`), Trang chủ `/` & Ghép nối điều hướng

- Ngày tạo: 2026-11-19
- Giai đoạn: GĐ0
- Phụ thuộc: 00
- Nhánh git: feat/01-app-lab-shell

## Mục tiêu
Chuyển đổi bộ khung tĩnh `designs/shell/` + `designs/pages/home.html` thành các component Next.js dùng chung (`<LabShell>`, `<ModeToggle>`, `<InspectorPanel>`, `<ChallengePanel>`, `<CheatSheetModal>`) và nối với SQLite qua `/api/courses`, `/api/progress`. Đảm bảo khi chuyển sang các task `02` → `11`, mỗi file `designs/pages/courses/<course-slug>/module-XX.html` được ghép trơn tru thành 1 trang module hoàn chỉnh trên cùng giao diện Dark Studio 3 cột.

## Phạm vi
- Nạp `designs/shell/tokens.css` vào `src/app/globals.css`.
- API `/api/courses`, `/api/courses/[course]`, `/api/progress` (GET/POST validate bằng Zod, ghi nhận `PASSED` vào SQLite).
- Khung `<LabShell>` khóa cứng Header (Logo, Tiến độ tổng từ SQLite, Công tắc Junior/Senior, Cheat Sheet) + Bố cục 3 cột (Danh sách 10 Module trái | Slot Mô phỏng giữa | 3 Tab phải).
- Component dùng chung: `<ModeToggle>`, `<InspectorPanel>` (5 chặng mạng + phân tích + Raw Request/Response), `<ChallengePanel>` (`aria-live="polite"`), `<CheatSheetModal>`, cùng 4 trạng thái (`LoadingSkeleton`, `EmptyState`, `ErrorAlert`).
- Trang chủ `/` bám sát `designs/pages/home.html` và route động `/courses/[course]/[module]` cho phép chuyển mượt qua lại giữa các module bằng cột danh sách bài học bên trái.

## Thiết kế
- `designs/README.md` (Bản đồ ghép trang)
- `designs/tokens.json`, `designs/shell/tokens.css`, `designs/shell/shell.css`, `designs/shell/shell.js`
- `designs/pages/home.html`
- `designs/pages/courses/rest-api/module-01.html` (tham chiếu mẫu bố cục 3 cột + URL Anatomy)

## Spec liên quan
- `docs/PRD.md`
- `docs/courses/rest-api/curriculum.md`
- `.agents/rules/ui-web.md`

## Các bước
### Bước 1 — API chuẩn hóa (`/api/courses`, `/api/progress`)
- Làm: `src/lib/api-response.ts`, route handlers đọc khóa học và lưu tiến độ Challenge vào SQLite.
- Test viết trước: `tests/integration/api-progress.test.ts`.
- Kiểm tra: `pnpm test tests/integration/api-progress.test.ts`

### Bước 2 — Nạp tokens Dark Studio & Thành phần dùng chung
- Làm: `globals.css`, `ModeToggle`, `InspectorPanel`, `ChallengePanel`, `CheatSheetModal`, 4 trạng thái dữ liệu.
- Test viết trước: `tests/unit/lab-components.test.tsx`.
- Kiểm tra: `pnpm test tests/unit/lab-components.test.tsx`

### Bước 3 — Khung `<LabShell>` 3 cột bám sát `designs/shell/shell.css`
- Làm: `src/components/LabShell.tsx` (Header 56px + Cột trái danh sách module có `next/link` + Cột giữa Simulator slot + Cột phải 3 Tab).
- Test viết trước: `tests/unit/lab-shell.test.tsx`.
- Kiểm tra: `pnpm test tests/unit/lab-shell.test.tsx`

### Bước 4 — Trang chủ `/` theo `designs/pages/home.html` & Route động `/courses/[course]/[module]`
- Làm: `src/app/page.tsx`, `src/app/courses/[course]/[module]/page.tsx`, registry `src/labs/index.ts`.
- Test viết trước: `tests/e2e/lab-shell.spec.ts` (kiểm tra 1366×768 và 1440×900, không cuộn toàn cục, chuyển Junior/Senior, mở Cheat Sheet, điều hướng giữa các module, chụp ảnh lưu `tests/e2e/__screens__/`).
- Kiểm tra: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, chạy `/ra-soat-ui`.

## Chấp nhận khi
- [ ] Giao diện `/` và `/courses/[course]/[module]` khớp 100% bố cục Dark Studio 3 cột của `designs/pages/home.html` và `designs/pages/courses/rest-api/module-01.html`
- [ ] Thanh tiến độ Header đọc/ghi thật từ SQLite qua `/api/progress`
- [ ] `pnpm test:e2e` xanh ở 1366×768 và 1440×900, `scrollHeight <= innerHeight`, không rớt chữ trên Header, 0 lỗi console
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm security:check` xanh
