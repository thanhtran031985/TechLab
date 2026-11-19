# Kế hoạch thực hiện (Implementation Plan) — 00-repo-setup

## 1. Mục tiêu
Thiết lập toàn bộ khung nền tảng TechLab trên Windows bằng `pnpm` (không Docker):
- Next.js (App Router) + React 19 + TypeScript `strict` + Tailwind CSS + `lucide-react`.
- Khung ứng dụng `<AppShell>` Fluent Compact (Sáng/Tối qua `[data-theme="dark"]`, không cuộn toàn cục ở 1366×768 và 1440×900).
- CSDL SQLite (`better-sqlite3` + WAL mode) qua Drizzle ORM với đủ 6 bảng trong PRD; migration tự động idempotent.
- Endpoint `/api/health` trả trạng thái kết nối SQLite WAL.
- Pipeline Tokens (`pnpm tokens:gen`) sinh CSS và tài liệu Design System.
- Pipeline Content-as-Code (`pnpm courses:sync` và `pnpm courses:sync:check`) validate bằng Zod và bảo toàn tiến độ người học.
- Bộ công cụ kiểm soát chất lượng: Vitest, Playwright E2E, ESLint, Prettier, Tasks Dashboard, Security Check và GitHub Actions CI đa nền tảng.

---

## 2. Danh sách Package cần cài đặt

### Dependencies (chính)
- `next` (^15.1.0), `react` (^19.0.0), `react-dom` (^19.0.0)
- `better-sqlite3` (^11.8.0 / ^13.2.0): SQLite cục bộ tốc độ cao
- `drizzle-orm` (^0.39.0): ORM thuần TypeScript
- `zod` (^3.24.0): Validate runtime schema (env, JSON content, API)
- `lucide-react` (^1.16.0): Bộ icon nét chuẩn 16px

### DevDependencies (phát triển & kiểm thử)
- `typescript` (^5.7.0), `@types/node` (^22.0.0), `@types/react` (^19.0.0), `@types/react-dom` (^19.0.0), `@types/better-sqlite3` (^7.6.12)
- `drizzle-kit` (^0.30.0): Công cụ sinh migration Drizzle
- `tailwindcss` (^3.4.17), `postcss` (^8.5.1), `autoprefixer` (^10.4.20)
- `vitest` (^3.0.0): Unit & Integration test runner
- `@playwright/test` (^1.50.0): E2E test runner
- `tsx` (^4.19.0): Trình thực thi TypeScript cho các script `scripts/*.ts`
- `eslint` (^9.0.0), `eslint-config-next` (^15.1.0), `prettier` (^3.4.0)

---

## 3. Các bước thực hiện chi tiết

### Bước 1 — Khởi tạo Next.js + TypeScript + pnpm scripts + Zod env
- **Mục tiêu:** Có repo git và cấu trúc dự án Next.js hoạt động với TypeScript `strict`, nạp biến môi trường chuẩn hóa đường dẫn Windows bằng `node:path`.
- **Files tạo/sửa:**
  - Khởi tạo git (`git init`), tạo nhánh `feat/00-repo-setup`.
  - `package.json`: Đầy đủ metadata và 15 scripts theo `AGENTS.md`.
  - `tsconfig.json`: `strict: true`, path alias `@/*` -> `./src/*`.
  - `next.config.ts`: Cấu hình Next.js 15 cơ bản.
  - `.env.example`: `TECHLAB_DB_PATH=data/techlab.db`.
  - `.gitignore`: Bỏ qua `data/`, `.env`, `node_modules/`, `.next/`, `playwright-report/`, `test-results/`.
  - `src/lib/env.ts`: Zod schema đọc `process.env`, dùng `node:path.resolve` chuẩn hóa đường dẫn DB Windows/Linux.
- **Test viết trước (TDD):**
  - `tests/unit/env.test.ts`: Kiểm tra `env.TECHLAB_DB_PATH` chuẩn hóa đúng đường dẫn Windows, fallback hợp lệ khi không có biến môi trường.
- **Lệnh kiểm tra:**
  - `pnpm install`
  - `pnpm typecheck`
  - `pnpm test tests/unit/env.test.ts`
- **Rủi ro & Xử lý:** Node 25 trên Windows yêu cầu đường dẫn xử lý chuẩn bằng `path.resolve` tránh lỗi ký tự escape `\`.

---

### Bước 2 — Schema Drizzle + SQLite WAL + Migration
- **Mục tiêu:** Định nghĩa đủ 6 bảng CSDL trong PRD Phần E, kết nối SQLite với PRAGMA WAL bắt buộc, sinh migration và áp dụng an toàn.
- **Files tạo/sửa:**
  - `src/db/schema.ts`: Khai báo 6 bảng bằng Drizzle SQLite:
    1. `courses` (slug PK, title, description, source_url, channel_name, module_count, updated_at).
    2. `modules` (id PK `<course>/<module>`, course_slug FK, slug, order_index, title, video_timestamp, challenge_count, updated_at).
    3. `challenges` (id PK, module_id FK, order_index, title, description, mode_required).
    4. `challenge_progress` (id PK, user_id default `'local'`, challenge_id FK, status, attempts, passed_at, updated_at).
    5. `user_notes` (id PK, user_id default `'local'`, module_id FK, video_timestamp, content, created_at, updated_at).
    6. `sandbox_runs` (id PK, user_id default `'local'`, module_id FK, mode, action_name, http_method, http_path, http_status, summary, created_at).
  - `src/db/client.ts`: Khởi tạo `better-sqlite3` với các PRAGMA bắt buộc (`journal_mode=WAL`, `foreign_keys=ON`, `busy_timeout=30000`, `synchronous=NORMAL`, `auto_vacuum=INCREMENTAL`).
  - `drizzle.config.ts`: Cấu hình dialect sqlite, schema, folder `drizzle/`.
  - `scripts/migrate.ts`: Script áp dụng migration bằng Drizzle migrator.
  - `drizzle/0000_init.sql`: Migration đầu tiên sinh bởi `pnpm db:generate`.
- **Test viết trước (TDD):**
  - `tests/integration/db-migrations.test.ts`: Chạy migration trên DB SQLite tạm 2 lần liên tiếp (idempotent), kiểm tra đủ 6 bảng, kiểm tra PRAGMA `wal` và `foreign_keys=1`, kiểm tra chặn vi phạm khóa ngoại.
- **Lệnh kiểm tra:**
  - `pnpm db:generate`
  - `pnpm db:migrate` (chạy 2 lần để xác nhận idempotent)
  - `pnpm test tests/integration/db-migrations.test.ts`

---

### Bước 3 — Pipeline Tokens + AppShell khung + `/api/health`
- **Mục tiêu:** Tạo pipeline đồng bộ Token từ `designs/tokens.json`, dựng khung `<AppShell>` Fluent Compact không cuộn toàn cục, và API health check SQLite.
- **Files tạo/sửa:**
  - `scripts/gen-tokens.ts`: Đọc `designs/tokens.json`, sinh `designs/tokens.css` và `docs/DESIGN_SYSTEM.md`.
  - `src/app/globals.css`: Import `designs/tokens.css`, thiết lập base font Segoe UI / Roboto và CSS variables.
  - `tailwind.config.ts`: Ánh xạ CSS variables vào Tailwind theme (`colors`, `spacing`, `borderRadius`, `fontSize`).
  - `src/components/AppShell.tsx`: Thanh bên thu gọn (200px ↔ 48px), Thanh trên 44px 1 dòng có nút chuyển Sáng/Tối (`data-theme="dark"`).
  - `src/app/layout.tsx`: Gắn font, bao bọc bằng `<AppShell>`.
  - `src/app/page.tsx`: Màn hình `/` tổng quan (Header 1 dòng, 4 KPI cards compact, Command bar, Bảng khóa học compact).
  - `src/app/api/health/route.ts`: Kiểm tra kết nối SQLite `SELECT 1` và `PRAGMA journal_mode`, trả cấu trúc chuẩn `{ ok: true, data: { status: "up", db: "sqlite", journalMode: "wal" } }`.
- **Test viết trước (TDD):**
  - `tests/unit/tokens.test.ts`: Kiểm tra `tokens.css` sinh ra đầy đủ các biến từ `tokens.json` và có khối `[data-theme="dark"]`.
  - `tests/integration/api-health.test.ts`: Gọi handler `/api/health` kiểm tra status 200, `ok: true`, `journalMode: "wal"`.
- **Lệnh kiểm tra:**
  - `pnpm tokens:gen`
  - `pnpm test tests/unit/tokens.test.ts tests/integration/api-health.test.ts`

---

### Bước 4 — Pipeline Content-as-Code (`courses:sync`)
- **Mục tiêu:** Xây dựng cơ chế đồng bộ `content/courses/` vào SQLite an toàn bằng Zod, hỗ trợ cờ `--check` và bảo toàn tiến độ người học.
- **Files tạo/sửa:**
  - `src/schemas/course.ts`: Zod schemas cho `course.json` và `challenges/*.json`.
  - `scripts/sync-courses.ts`: Đọc thư mục content, validate schema, upsert vào DB trong transaction; kiểm tra cờ `--check`.
  - `content/courses/rest-api/course.json`: Dữ liệu mẫu khóa học REST API.
  - `content/courses/rest-api/challenges/01-network-http-rest.json`: Dữ liệu mẫu thử thách Module 1.
- **Test viết trước (TDD):**
  - `tests/integration/sync-courses.test.ts`:
    - Chạy sync 2 lần không trùng lặp dữ liệu.
    - Chèn bản ghi trong `challenge_progress` và `user_notes`, chạy sync -> bản ghi không bị xóa mất.
    - Kiểm tra cờ `--check` báo lỗi khi dữ liệu lệch hoặc file không hợp lệ.
- **Lệnh kiểm tra:**
  - `pnpm courses:sync`
  - `pnpm courses:sync:check`
  - `pnpm test tests/integration/sync-courses.test.ts`

---

### Bước 5 — Tasks Dashboard + Security Check + Playwright E2E Smoke
- **Mục tiêu:** Tự động hóa kiểm tra bảo mật, sinh trang bảng điều khiển task, và test E2E kiểm tra không cuộn toàn cục ở 1366×768 & 1440×900.
- **Files tạo/sửa:**
  - `scripts/tasks-dashboard.ts`: Quét `docs/tasks/README.md` và các thư mục task, xuất `docs/tasks/dashboard.html`.
  - `scripts/security-check.ts`: Kiểm tra không lọt `.env`, cấm `dangerouslySetInnerHTML` không an toàn, kiểm tra không có secret trong code.
  - `playwright.config.ts`: Cấu hình Playwright test, webServer Next.js.
  - `tests/e2e/smoke.spec.ts`: Test mở `/` ở 1366×768 và 1440×900, kiểm tra 0 console error, `scrollHeight <= innerHeight`, bật/tắt Dark Mode, chụp ảnh vào `tests/e2e/__screens__/`.
- **Test viết trước (TDD):**
  - Viết `tests/e2e/smoke.spec.ts` trước khi chạy E2E.
- **Lệnh kiểm tra:**
  - `pnpm tasks:dashboard`
  - `pnpm security:check`
  - `pnpm test:e2e`

---

### Bước 6 — Lint, Typecheck, CI & Đối chiếu `AGENTS.md`
- **Mục tiêu:** Cấu hình chuẩn hóa mã nguồn ESLint, Prettier, GitHub Actions CI và đối chiếu toàn bộ lệnh của repo.
- **Files tạo/sửa:**
  - `eslint.config.mjs` (hoặc `.eslintrc.json`) + `.prettierrc`
  - `.github/workflows/ci.yml`: Chạy CI trên `windows-latest` và `ubuntu-latest` (install, db:migrate, courses:sync:check, lint, typecheck, test, security:check).
  - Đối chiếu toàn bộ 15 lệnh trong `AGENTS.md` đảm bảo chạy thông suốt.
- **Lệnh kiểm tra:**
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm security:check`
  - `pnpm courses:sync:check`
  - `pnpm test:e2e`

---

## 4. Chi tiết suy ra từ Spec
- Khởi tạo git repo cục bộ: Thư mục `D:\TechLab` chưa có `.git`, sẽ chạy `git init` và tạo nhánh `feat/00-repo-setup` để theo dõi mã nguồn đúng quy trình.
- Cột `user_id` trong SQLite: Đặt giá trị mặc định là `'local'` cho các bảng tiến độ theo đúng PRD Phần E.
- Node.js version trên máy: Hệ thống đang dùng Node 25.2.1; `better-sqlite3` 13.2.0 đã được kiểm chứng hoạt động tốt với Node 25 trên Windows.

## 5. Câu hỏi mở
- Không có.
