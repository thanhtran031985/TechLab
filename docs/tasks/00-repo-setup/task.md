# 00-repo-setup — Khung repo Next.js + TypeScript + SQLite (Drizzle) + Tokens + CI

- Ngày tạo: 2026-11-19
- Giai đoạn: GĐ0
- Phụ thuộc: —
- Nhánh git: feat/00-repo-setup

## Mục tiêu
Có repo **TechLab** chạy hoàn chỉnh trên Windows (không Docker) bằng `pnpm`: Next.js (App Router) + TypeScript strict hiển thị khung `<AppShell>` theo `designs/tokens.css` (Sáng/Tối, không cuộn toàn cục ở 1366×768 và 1440×900), endpoint `/api/health` trả trạng thái SQLite (WAL) do Drizzle migration tạo đủ 6 bảng trong PRD, lệnh `pnpm courses:sync` đồng bộ được dữ liệu mẫu Content-as-Code, và toàn bộ bộ lệnh kiểm tra (`typecheck`, `lint`, `test`, `test:e2e`, `security:check`, `tasks:dashboard`) chạy xanh.

## Phạm vi
- Khởi tạo dự án Next.js (App Router) + TypeScript `strict` + Tailwind CSS + `lucide-react`, cấu hình `package.json` với đầy đủ scripts theo `AGENTS.md` mục Lệnh; `pnpm-lock.yaml`.
- `src/lib/env.ts`: đọc và validate biến môi trường bằng Zod; chuẩn hóa đường dẫn bằng `node:path`; cập nhật `.env.example` (như `TECHLAB_DB_PATH=data/techlab.db`).
- `src/db/schema.ts`: định nghĩa đủ 6 bảng theo `docs/PRD.md` Phần E (`courses`, `modules`, `challenges`, `challenge_progress`, `user_notes`, `sandbox_runs`), có `user_id` mặc định `'local'`.
- `src/db/client.ts`: khởi tạo `better-sqlite3` kèm PRAGMA bắt buộc (`journal_mode=WAL`, `foreign_keys=ON`, `busy_timeout=30000`, `synchronous=NORMAL`, `auto_vacuum=INCREMENTAL`).
- Cấu hình `drizzle.config.ts` và sinh migration đầu tiên `drizzle/0000_init.sql`; chạy `pnpm db:migrate` idempotent.
- `scripts/gen-tokens.ts`: đọc `designs/tokens.json`, sinh `designs/tokens.css` và `docs/DESIGN_SYSTEM.md`; nhập `designs/tokens.css` vào `src/app/globals.css` và ánh xạ biến màu/spacing/radius sang Tailwind theme.
- `src/components/AppShell.tsx` + `src/app/layout.tsx` + `src/app/page.tsx`: khung ứng dụng Fluent Compact (thanh bên thu gọn được, thanh trên 1 dòng có nút chuyển Sáng/Tối `[data-theme="dark"]`, vùng nội dung trống `flex-1 min-h-0` không cuộn toàn cục).
- `src/app/api/health/route.ts`: kiểm tra kết nối SQLite (`SELECT 1`), trả `{ ok: true, data: { status: "up", db: "sqlite", journalMode: "wal" } }`.
- `src/schemas/course.ts` + `scripts/sync-courses.ts`: Zod schema cho `course.json` & `challenges/*.json`, lệnh `pnpm courses:sync` và `pnpm courses:sync:check`; tạo 1 dữ liệu mẫu tối thiểu trong `content/courses/rest-api/course.json` để kiểm chứng pipeline.
- `scripts/tasks-dashboard.ts` (sinh `docs/tasks/dashboard.html`) và `scripts/security-check.ts` (kiểm tra cơ bản theo `.agents/rules/security.md`).
- Cấu hình **Vitest** (`vitest.config.ts`), **Playwright** (`playwright.config.ts`), **ESLint/Prettier**, và GitHub Actions CI (`.github/workflows/ci.yml`) chạy trên `windows-latest` và `ubuntu-latest`.

## Ngoài phạm vi
- Khung `<LabShell>` chi tiết, Simulator JaneGram, Live Inspector (thuộc task `01-app-lab-shell`).
- Nội dung chi tiết 10 module REST API (thuộc GĐ1).
- Đăng nhập, phân quyền (thuộc GĐ3).
- Docker.

## Thiết kế & Nguồn liên quan
- `designs/tokens.json`, `designs/tokens.css`
- `docs/PRD.md` (Phần B, E, F, G)
- `.agents/rules/ui-web.md`, `.agents/rules/database.md`, `.agents/rules/security.md`

## Quyết định kiến trúc
- Dùng `pnpm` làm trình quản lý gói duy nhất; mọi script chạy qua `tsx` để thuần TypeScript trên Windows và Linux.
- CSDL SQLite dùng `better-sqlite3` + `drizzle-orm` (đồng bộ, tốc độ cao, không cần server DB ngoài).
- CSS ưu tiên biến từ `designs/tokens.css`; Dark Mode điều khiển bằng thuộc tính `data-theme="dark"` trên `<html>`.

## Các bước
### Bước 1 — Khởi tạo Next.js + TypeScript + pnpm scripts + Zod env
- Làm: `package.json` (đủ dependencies và scripts trong `AGENTS.md`), `tsconfig.json` (`strict: true`), `next.config.ts`, `src/lib/env.ts`, `.env.example`, `.gitignore` (ignore `data/`, `.env`, `node_modules/`, `.next/`).
- Test viết trước: `tests/unit/env.test.ts` (đọc mặc định từ `.env.example`, chuẩn hóa đường dẫn `TECHLAB_DB_PATH` bằng `node:path` đúng trên Windows).
- Kiểm tra: `pnpm install`; `pnpm typecheck`; `pnpm test tests/unit/env.test.ts`.

### Bước 2 — Schema Drizzle + SQLite WAL + Migration
- Làm: `src/db/schema.ts` (đủ 6 bảng), `src/db/client.ts` (PRAGMA WAL, foreign_keys, busy_timeout, synchronous, auto_vacuum), `drizzle.config.ts`, sinh migration đầu tiên bằng `pnpm db:generate`.
- Test viết trước: `tests/integration/db-migrations.test.ts` (tạo SQLite DB tạm, chạy migrate 2 lần liên tiếp không lỗi, kiểm tra PRAGMA `journal_mode=wal` và `foreign_keys=1`, kiểm tra đủ 6 bảng và khóa ngoại hoạt động).
- Kiểm tra: `pnpm db:migrate` 2 lần; `pnpm test tests/integration/db-migrations.test.ts`.

### Bước 3 — Pipeline Tokens + AppShell khung + `/api/health`
- Làm: `scripts/gen-tokens.ts`, `src/app/globals.css` (nạp `designs/tokens.css`), cấu hình Tailwind ánh xạ token, `src/components/AppShell.tsx` (Sidebar thu gọn, Header 1 dòng, nút chuyển Sáng/Tối), `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/api/health/route.ts`.
- Test viết trước: `tests/integration/api-health.test.ts` (gọi handler `/api/health` trả HTTP 200, `ok: true`, `journalMode: "wal"`); `tests/unit/tokens.test.ts` (kiểm tra `tokens.css` khớp `tokens.json` và có `[data-theme="dark"]`).
- Kiểm tra: `pnpm tokens:gen`; `pnpm test`; mở `http://localhost:3000` kiểm tra giao diện Sáng/Tối.

### Bước 4 — Pipeline Content-as-Code (`courses:sync`)
- Làm: `src/schemas/course.ts` (Zod schemas cho course, module, challenge), `scripts/sync-courses.ts` (hỗ trợ chạy bình thường và cờ `--check`), tạo file mẫu `content/courses/rest-api/course.json` (khai báo metadata khóa REST API).
- Test viết trước: `tests/integration/sync-courses.test.ts` (đồng bộ vào SQLite tạm, chạy 2 lần idempotent, không xóa mất bản ghi `challenge_progress` và `user_notes` có sẵn, báo lỗi rõ ràng khi JSON sai schema Zod).
- Kiểm tra: `pnpm courses:sync`; `pnpm courses:sync:check`; `pnpm test tests/integration/sync-courses.test.ts`.

### Bước 5 — Tasks Dashboard + Security Check + Playwright E2E Smoke
- Làm: `scripts/tasks-dashboard.ts` (đọc `docs/tasks/README.md` và `progress.md` để sinh `docs/tasks/dashboard.html`), `scripts/security-check.ts`, `playwright.config.ts`, `tests/e2e/smoke.spec.ts`.
- Test viết trước: `tests/e2e/smoke.spec.ts` (mở `/` ở 1366×768 và 1440×900, 0 console errors, `scrollHeight <= innerHeight`, không cuộn ngang, bật/tắt Dark Mode đổi đúng `data-theme="dark"`, chụp ảnh vào `tests/e2e/__screens__/`).
- Kiểm tra: `pnpm tasks:dashboard`; `pnpm security:check`; `pnpm test:e2e`.

### Bước 6 — Lint, Typecheck, CI & Đối chiếu `AGENTS.md`
- Làm: cấu hình ESLint/Prettier, `.github/workflows/ci.yml` (chạy `lint`, `typecheck`, `test`, `security:check`, `courses:sync:check` trên `windows-latest` và `ubuntu-latest`), đối chiếu mục Lệnh trong `AGENTS.md` với `package.json`.
- Test viết trước: —
- Kiểm tra: `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm test:e2e`; `pnpm tasks:dashboard`.

## Chấp nhận khi
- [ ] Máy Windows mới: `pnpm install`, `pnpm db:migrate`, `pnpm courses:sync`, `pnpm dev` chạy được không lỗi
- [ ] `/api/health` trả HTTP 200 với `journalMode: "wal"`
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm security:check`, `pnpm courses:sync:check` xanh
- [ ] `pnpm test:e2e` xanh ở 1366×768 và 1440×900 (Light & Dark), không cuộn toàn cục, có ảnh chụp bằng chứng

## Câu hỏi mở
- Không có
