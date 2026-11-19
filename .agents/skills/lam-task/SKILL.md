---
name: lam-task
description: Làm một task trong docs/tasks theo quy trình từng bước (plan, test trước, kiểm tra, cập nhật progress, dừng chờ duyệt). Dùng khi người dùng nói "làm task NN", "tiếp tục task", "continue" hoặc gọi /lam-task.
---

# Làm một task

Đầu vào: `NN-slug` (nếu chỉ nói "tiếp tục", lấy task đang 🔄 trong `docs/tasks/README.md`).

## Đọc

1. `docs/tasks/README.md` → `docs/tasks/NN-slug/task.md` → `progress.md` → `decisions.md`.
2. Chỉ đọc các tài liệu/spec liên quan mà `task.md` liệt kê (ví dụ `docs/PRD.md`, `docs/courses/<slug>/curriculum.md`). Task có giao diện: đọc `designs/tokens.json` và `.agents/rules/ui-web.md`.
3. Bước đã ✅ không làm lại.

## Lập kế hoạch (khi chưa có plan.md)

Lập **Implementation Plan**: mỗi bước ghi rõ file tạo/sửa, test viết trước (TDD), lệnh kiểm tra, rủi ro; chỗ tự suy ra; câu hỏi mở; package cần cài thêm (phải hỏi trước khi cài). **DỪNG** chờ người dùng duyệt.

## Bắt đầu (sau khi duyệt)

- Chép nguyên văn kế hoạch vào `plan.md`; chạy `git checkout -b feat/NN-slug`; đổi trạng thái 🔄 trong `docs/tasks/README.md` và `progress.md`.

## Mỗi bước

1. Viết test hành vi trước (Vitest/Playwright), chạy thấy đỏ.
2. Code cho xanh, chỉ trong phạm vi bước hiện tại.
3. Chạy đúng các lệnh ở mục "Kiểm tra" (ví dụ `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm courses:sync`).
4. Cập nhật `progress.md` (dòng trạng thái của bước + nhật ký: đã làm, lệnh + kết quả, suy ra gì, việc người dùng cần làm tay nếu có).
5. Chạy `pnpm tasks:dashboard`.
6. Báo cáo ngắn + đề xuất commit `NN-slug: step N — <mô tả>`; bước có giao diện đính kèm ảnh chụp ở 1366×768 và 1440×900.
7. **DỪNG** chờ `"continue"`. Chỉ commit khi được người dùng đồng ý.

## Khi có vấn đề

- Khác `task.md`/spec/thiết kế: ghi `decisions.md` (ngày, quyết định, lý do, ảnh hưởng).
- Mơ hồ hoặc mâu thuẫn: DỪNG và hỏi.

## Kết thúc task

Chạy skill `dong-task`.
