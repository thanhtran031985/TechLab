# Checklist kiểm thử — 00-repo-setup

## Cấu hình & DB
- [x] `src/lib/env.ts` chuẩn hóa đúng đường dẫn Windows bằng `node:path`
- [x] Migration chạy 2 lần liên tiếp (idempotent) không lỗi
- [x] SQLite bật đúng `journal_mode=wal` và `foreign_keys=1`
- [x] `/api/health` trả 200 và `journalMode: "wal"`

## Content-as-Code
- [x] `pnpm courses:sync` upsert khóa mẫu thành công, không xóa tiến độ sẵn có
- [x] `pnpm courses:sync:check` phát hiện được sai lệch nếu file đổi mà chưa sync

## Giao diện / UI
- [x] Đúng token từ `designs/tokens.css`, không hardcode hex/px
- [x] Không cuộn toàn cục (`scrollHeight <= innerHeight`, không cuộn ngang) ở 1366×768 và 1440×900
- [x] Nút chuyển Sáng/Tối cập nhật `data-theme="dark"` hoạt động ổn định
- [x] Thu gọn/mở rộng thanh bên (200px / 48px) mượt mà

## Chất lượng & CI
- [x] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm security:check`, `pnpm test:e2e` xanh
- [x] `pnpm tasks:dashboard` sinh được `docs/tasks/dashboard.html`
