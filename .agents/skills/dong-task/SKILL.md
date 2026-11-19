---
name: dong-task
description: Rà soát và đóng một task: kiểm từng mục "Chấp nhận khi", chạy toàn bộ kiểm tra, đổi trạng thái ✅. Dùng khi người dùng nói "đóng task", "kiểm tra hoàn thành" hoặc gọi /dong-task.
---

# Đóng task

1. Đọc mục "Chấp nhận khi" trong `docs/tasks/NN-slug/task.md` và đối chiếu `checklist.md`.
2. Chạy toàn bộ bộ kiểm tra:
   - `pnpm typecheck`
   - `pnpm lint`
   - `pnpm test`
   - `pnpm security:check`
   - Task có thay đổi nội dung khóa học/module: chạy `pnpm courses:sync --check`
   - Task có giao diện: chạy `pnpm test:e2e`
3. Báo cáo dạng bảng: `Mục | Đạt/Chưa đạt | Bằng chứng`.
4. Khi tất cả đều Đạt và người dùng đồng ý:
   - Đổi trạng thái thành ✅ trong `docs/tasks/README.md` và `docs/tasks/NN-slug/progress.md`.
   - Chạy `pnpm tasks:dashboard`.
   - Đề xuất commit `NN-slug: done` và nhắc người dùng merge nhánh `feat/NN-slug` vào `main`.
5. Nếu còn mục Chưa đạt: liệt kê rõ việc còn thiếu, tuyệt đối không đổi trạng thái.
