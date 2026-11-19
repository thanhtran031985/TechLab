# Tiến độ — 00-repo-setup

Trạng thái: 🔄

| Bước | Nội dung | Trạng thái | Ngày | Commit |
|---|---|---|---|---|
| 1 | Khởi tạo Next.js + TypeScript + pnpm scripts + Zod env | ✅ | 19/11/2026 | `44ea544` |
| 2 | Schema Drizzle + SQLite WAL + Migration | ✅ | 19/11/2026 | `a8eab8b` |
| 3 | Pipeline Tokens + AppShell khung + /api/health | ✅ | 19/11/2026 | (chờ commit) |
| 4 | Pipeline Content-as-Code (courses:sync) | ⬜ | | |
| 5 | Tasks Dashboard + Security Check + Playwright E2E Smoke | ⬜ | | |
| 6 | Lint, Typecheck, CI & Đối chiếu AGENTS.md | ⬜ | | |

## Nhật ký
### Bước 1 (19/11/2026)
- **Đã làm:**
  - Khởi tạo git repository, cấu hình remote `origin https://github.com/thanhtran031985/TechLab.git`, push nhánh `main`, tạo và chuyển sang nhánh `feat/00-repo-setup`.
  - Thiết lập `package.json` với đầy đủ 15 scripts theo `AGENTS.md`.
  - Cấu hình `tsconfig.json` (`strict: true`), `next.config.ts`, `vitest.config.ts`, `.gitignore`, `.env.example`.
  - Cài đặt dependencies qua pnpm; phê duyệt build script bằng `pnpm approve-builds --all` (ghi nhận vào `pnpm-workspace.yaml`).
  - Viết test TDD trước: `tests/unit/env.test.ts` (chạy thấy đỏ khi chưa có `src/lib/env.ts`).
  - Triển khai `src/lib/env.ts` sử dụng Zod và `node:path.resolve` chuẩn hóa đường dẫn `TECHLAB_DB_PATH` cho Windows/Linux.
  - Khởi tạo `scripts/tasks-dashboard.ts` hỗ trợ cập nhật `docs/tasks/dashboard.html`.
- **Lệnh + kết quả:**
  - `pnpm install`: Thành công
  - `pnpm typecheck`: Xanh (`tsc --noEmit` exit 0)
  - `pnpm test tests/unit/env.test.ts`: Xanh (3/3 passed)
  - `pnpm tasks:dashboard`: Xanh, sinh `docs/tasks/dashboard.html`
- **Suy ra gì:**
  - Trên pnpm v12, cấu hình cấp quyền build (`allowBuilds`) được lưu trong `pnpm-workspace.yaml`.
- **Việc người dùng cần làm tay:** Không có.

### Bước 2 (19/11/2026)
- **Đã làm:**
  - Định nghĩa 6 bảng SQLite trong `src/db/schema.ts` (`courses`, `modules`, `challenges`, `challenge_progress`, `user_notes`, `sandbox_runs`) theo PRD Phần E với `user_id` mặc định `'local'`.
  - Viết `src/db/client.ts` khởi tạo `better-sqlite3` kèm 5 PRAGMA bắt buộc (`journal_mode=WAL`, `foreign_keys=ON`, `busy_timeout=30000`, `synchronous=NORMAL`, `auto_vacuum=INCREMENTAL`).
  - Thiết lập `drizzle.config.ts`, sinh migration `drizzle/0000_same_luminals.sql` bằng `pnpm db:generate`.
  - Viết `scripts/migrate.ts` áp dụng migration qua Drizzle migrator.
  - Viết test TDD trước: `tests/integration/db-migrations.test.ts` kiểm tra áp dụng 2 lần idempotent, các PRAGMA bắt buộc, kiểm tra đủ 6 bảng và ràng buộc khóa ngoại.
- **Lệnh + kết quả:**
  - `pnpm db:generate`: Sinh thành công 6 bảng trong SQL migration.
  - `pnpm db:migrate`: Chạy 2 lần thành công (idempotent).
  - `pnpm test tests/integration/db-migrations.test.ts`: 4/4 test pass.
  - `pnpm typecheck`: Xanh.
  - `pnpm tasks:dashboard`: Xanh.
- **Suy ra gì:** Không có.
- **Việc người dùng cần làm tay:** Không có.

### Bước 3 (19/11/2026)
- **Đã làm:**
  - Viết `scripts/gen-tokens.ts` đọc `designs/tokens.json` để tự động sinh `designs/tokens.css` và `docs/DESIGN_SYSTEM.md`.
  - Cấu hình `postcss.config.mjs`, `tailwind.config.ts`, và `src/app/globals.css` nạp tokens và ánh xạ các biến màu sắc, typography, spacing, radius sang Tailwind.
  - Xây dựng component `<AppShell>` (`src/components/AppShell.tsx`) chuẩn Fluent Compact: Sidebar thu gọn linh hoạt (200px ↔ 48px), Header 44px 1 dòng có nút chuyển Sáng/Tối (`data-theme="dark"` lưu localStorage), vùng nội dung không cuộn toàn cục.
  - Cập nhật `src/app/layout.tsx` và tạo `src/app/page.tsx` tổng quan (Header 1 dòng, 4 KPI cards compact, Command bar tìm kiếm/lọc, Bảng danh sách khóa học).
  - Viết Route Handler `src/app/api/health/route.ts` kiểm tra `SELECT 1` và `PRAGMA journal_mode`, trả status 200 kèm `journalMode: "wal"`.
  - Viết test TDD trước: `tests/unit/tokens.test.ts` và `tests/integration/api-health.test.ts`.
- **Lệnh + kết quả:**
  - `pnpm tokens:gen`: Sinh thành công `designs/tokens.css` và `docs/DESIGN_SYSTEM.md`.
  - `pnpm test`: 9/9 tests pass (4 test files).
  - `pnpm typecheck`: Xanh (0 lỗi).
  - `pnpm tasks:dashboard`: Xanh.
- **Suy ra gì:** Không có.
- **Việc người dùng cần làm tay:** Không có.
