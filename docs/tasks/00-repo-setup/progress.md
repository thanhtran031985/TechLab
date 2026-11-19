# Tiến độ — 00-repo-setup

Trạng thái: ✅

| Bước | Nội dung | Trạng thái | Ngày | Commit |
|---|---|---|---|---|
| 1 | Khởi tạo Next.js + TypeScript + pnpm scripts + Zod env | ✅ | 19/11/2026 | `44ea544` |
| 2 | Schema Drizzle + SQLite WAL + Migration | ✅ | 19/11/2026 | `a8eab8b` |
| 3 | Pipeline Tokens + AppShell khung + /api/health | ✅ | 19/11/2026 | `3d606a8` |
| 4 | Pipeline Content-as-Code (courses:sync) | ✅ | 19/11/2026 | `e633b63` |
| 5 | Tasks Dashboard + Security Check + Playwright E2E Smoke | ✅ | 19/11/2026 | `de98989` |
| 6 | Lint, Typecheck, CI & Đối chiếu AGENTS.md | ✅ | 19/11/2026 | `141f15f` |

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

### Bước 4 (19/11/2026)
- **Đã làm:**
  - Định nghĩa Zod schemas trong `src/schemas/course.ts` cho `course.json` và `challenges/*.json`.
  - Triển khai `scripts/sync-courses.ts` hỗ trợ 2 chế độ: upsert CSDL trong transaction an toàn (PRD D2: bảo toàn tuyệt đối bảng `challenge_progress` và `user_notes`), và cờ `--check` đối chiếu tính đồng bộ giữa file và DB.
  - Tạo dữ liệu mẫu Content-as-Code: `content/courses/rest-api/course.json` (10 modules từ curriculum) và `content/courses/rest-api/challenges/01-network-http-rest.json` (3 challenges).
  - Viết test TDD trước: `tests/integration/sync-courses.test.ts` (kiểm tra tính idempotent, kiểm tra bảo toàn tiến độ người học, kiểm tra cờ checkOnly).
- **Lệnh + kết quả:**
  - `pnpm courses:sync`: Đồng bộ thành công 1 khóa học, 10 module, 3 challenge vào `data/techlab.db`.
  - `pnpm courses:sync:check`: Xác nhận khớp 100% với CSDL.
  - `pnpm test`: 12/12 tests pass (5 test files).
  - `pnpm typecheck`: Xanh.
  - `pnpm tasks:dashboard`: Xanh.
- **Suy ra gì:** Không có.
- **Việc người dùng cần làm tay:** Không có.

### Bước 5 (19/11/2026)
- **Đã làm:**
  - Nâng cấp `scripts/tasks-dashboard.ts` sinh file `docs/tasks/dashboard.html` chuẩn giao diện Fluent Compact hiển thị chi tiết tiến độ từng bước.
  - Viết `scripts/security-check.ts` kiểm tra an toàn theo `.agents/rules/security.md` (kiểm tra .gitignore, cấm dangerouslySetInnerHTML, kiểm tra rò rỉ secret).
  - Cấu hình Playwright (`playwright.config.ts`) tự động khởi chạy Next.js dev server.
  - Viết bộ kiểm thử E2E `tests/e2e/smoke.spec.ts` kiểm tra trang chủ `/` ở 2 kích thước 1366×768 và 1440×900, xác nhận 0 lỗi console, không cuộn toàn cục (`scrollHeight <= innerHeight`), kiểm tra bật/tắt Dark Mode (`data-theme="dark"`), và chụp 4 ảnh màn hình bằng chứng vào `tests/e2e/__screens__/`.
- **Lệnh + kết quả:**
  - `pnpm tasks:dashboard`: Xanh, sinh `docs/tasks/dashboard.html`.
  - `pnpm security:check`: Xanh (0 cảnh báo bảo mật).
  - `pnpm test:e2e`: 3/3 tests pass (1366x768, 1440x900, /api/health).
- **Suy ra gì:** Không có.
- **Việc người dùng cần làm tay:** Không có.

### Bước 6 (19/11/2026)
- **Đã làm:**
  - Cấu hình `.eslintrc.json` và `.prettierrc`, cập nhật script `lint` và `format`.
  - Thiết lập GitHub Actions CI `.github/workflows/ci.yml` kiểm thử đa nền tảng (`ubuntu-latest` và `windows-latest`).
  - Kiểm tra Next.js production build (`pnpm build`).
  - Đối chiếu 100% các lệnh trong `AGENTS.md` với `package.json`.
  - Chạy toàn bộ bộ kiểm thử: `lint`, `typecheck`, `test`, `security:check`, `courses:sync:check`, `test:e2e`, `tasks:dashboard`.
  - Cập nhật checklist kiểm thử `docs/tasks/00-repo-setup/checklist.md`.
- **Lệnh + kết quả:**
  - `pnpm lint`: Xanh (No ESLint warnings or errors).
  - `pnpm format`: Xanh, định dạng toàn bộ repository.
  - `pnpm build`: Xanh (Next.js compiled successfully).
  - `pnpm typecheck`: Xanh (0 lỗi).
  - `pnpm test`: Xanh (12/12 tests passed).
  - `pnpm security:check`: Xanh (an toàn).
  - `pnpm courses:sync:check`: Xanh (100% khớp).
  - `pnpm test:e2e`: Xanh (3/3 tests passed).
  - `pnpm tasks:dashboard`: Xanh, sinh `docs/tasks/dashboard.html`.
- **Suy ra gì:** Không có.
- **Việc người dùng cần làm tay:** Không có.
