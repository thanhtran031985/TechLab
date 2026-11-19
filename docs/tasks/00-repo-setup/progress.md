# Tiến độ — 00-repo-setup

Trạng thái: 🔄

| Bước | Nội dung | Trạng thái | Ngày | Commit |
|---|---|---|---|---|
| 1 | Khởi tạo Next.js + TypeScript + pnpm scripts + Zod env | ✅ | 19/11/2026 | (chờ duyệt) |
| 2 | Schema Drizzle + SQLite WAL + Migration | ⬜ | | |
| 3 | Pipeline Tokens + AppShell khung + /api/health | ⬜ | | |
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
