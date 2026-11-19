---
name: tao-task
description: Tạo task mới trong docs/tasks từ mẫu _template. Dùng khi người dùng nói "tạo task mới" hoặc gọi /tao-task.
---

# Tạo task mới

1. Đọc `docs/tasks/README.md`, lấy số lớn nhất + 1 làm `NN` (định dạng 2 chữ số: `00`, `01`, `02`...).
2. Đề xuất `slug` (kebab-case, tiếng Anh, ngắn gọn); hỏi xác nhận nếu chưa rõ.
3. Copy `docs/tasks/_template/` sang `docs/tasks/NN-slug/` (bắt buộc đủ: `task.md`, `progress.md`, `plan.md`, `decisions.md`, `checklist.md`, `_archive/`), điền tiêu đề, ngày tạo, giai đoạn, phụ thuộc và nhánh git `feat/NN-slug`.
4. Có yêu cầu cụ thể thì ghi đầy đủ vào `task.md` theo khung chuẩn; chưa có thì để khung trống.
5. Luôn soạn thảo `checklist.md` ghi danh sách test case cần kiểm chứng (chức năng, engine, UI, hồi quy) cho task.
6. Nếu là task xây dựng bài học (Module): liệt kê rõ đường dẫn `docs/courses/<slug>/curriculum.md`, các mốc thời gian `[HH:MM:SS]` từ nguồn video và danh sách Challenge bắt buộc phải có.
7. Nếu là task có giao diện: liệt kê `designs/tokens.json` và các component dùng chung (`AppShell`, `LabShell`, `InspectorPanel`...) liên quan.
8. Thêm dòng mới vào bảng `docs/tasks/README.md` với trạng thái ⬜, chạy `pnpm tasks:dashboard`.
9. Không bắt đầu code khi chưa được yêu cầu.
