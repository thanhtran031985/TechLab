---
trigger: glob
globs: src/db/**, drizzle/**, src/app/api/**, scripts/sync-courses.ts, tests/integration/**
description: Quy tắc SQLite (WAL), Drizzle ORM, migration và đồng bộ Content-as-Code cho TechLab.
---

# TechLab Database: SQLite + Drizzle ORM

- Schema định nghĩa duy nhất một lần tại `src/db/schema.ts` bằng Drizzle ORM (`drizzle-orm/sqlite-core`). Đặt tên bảng và cột dạng `snake_case`, rõ nghĩa, có khóa ngoại tường minh.
- Thời gian lưu chuẩn ISO-8601 UTC (`TEXT`) hoặc epoch milliseconds (`INTEGER`) thống nhất toàn dự án; hiển thị ra giao diện mới đổi sang giờ Việt Nam (`dd/MM/yyyy HH:mm:ss`).
- Dữ liệu JSON (như trace request, payload mô phỏng, metadata cấu hình) lưu `TEXT` và validate bằng Zod trước khi ghi và sau khi đọc.
- Dự phòng đa người dùng: các bảng tiến độ (`challenge_progress`, `user_notes`, `sandbox_runs`) luôn có cột `user_id TEXT NOT NULL DEFAULT 'local'` để sẵn sàng mở rộng tính năng đăng nhập sau này mà không cần phá schema.

## Cấu hình kết nối SQLite (`src/db/client.ts`)

- Khi mở kết nối `better-sqlite3`, bắt buộc thiết lập ngay các PRAGMA:
  - `PRAGMA journal_mode = WAL;`
  - `PRAGMA foreign_keys = ON;`
  - `PRAGMA busy_timeout = 30000;`
  - `PRAGMA synchronous = NORMAL;`
  - `PRAGMA auto_vacuum = INCREMENTAL;` (khi khởi tạo DB mới).
- File `data/techlab.db` phải nằm trên ổ đĩa local (không đặt trong thư mục đồng bộ OneDrive/SharePoint).
- Giao dịch ghi giữ ngắn; dùng `BEGIN IMMEDIATE` cho các thao tác đọc-rồi-ghi.
- Sao lưu SQLite dùng `VACUUM INTO` hoặc SQLite backup API, không copy file trực tiếp khi server đang chạy.

## Migration & Đồng bộ nội dung

- Mọi thay đổi schema phải tạo migration qua `pnpm db:generate` (Drizzle Kit) và chạy bằng `pnpm db:migrate`. Không tự sửa file SQL migration cũ đã áp dụng.
- Test tích hợp (`tests/integration/`) phải chạy trên file SQLite tạm, kiểm tra áp dụng migration 2 lần liên tiếp (idempotent) và kiểm tra đúng PRAGMA (`wal`, `foreign_keys = 1`).
- Script `scripts/sync-courses.ts` đồng bộ `content/courses/` vào bảng `courses`, `modules`, `challenges` theo cơ chế upsert an toàn trong một transaction; không xóa mất dữ liệu `challenge_progress` hoặc `user_notes` của người học khi cập nhật nội dung bài học.
