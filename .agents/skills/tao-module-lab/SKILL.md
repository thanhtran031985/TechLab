---
name: tao-module-lab
description: Hướng dẫn chuẩn hóa khi code một Module Lab mới trong TechLab (MDX lý thuyết + Pure Engine + Simulator + Challenge + Sync + E2E) đảm bảo không lệch UI và đủ kiến thức. Dùng khi thực hiện task xây dựng module bài học hoặc gọi /tao-module-lab.
---

# Tạo Module Lab mới (Chuẩn TechLab)

Áp dụng song song cùng quy trình từng bước của `lam-task`.

## Thành phần bắt buộc của mỗi Module (`<course-slug>/<NN-slug>`)
1. **Nội dung Lý thuyết (`content/courses/<course-slug>/modules/<NN-slug>.mdx`):**
   - Bao phủ 100% các khái niệm và mốc `[HH:MM:SS]` đã liệt kê cho Module trong `docs/courses/<course-slug>/curriculum.md`.
   - Có bảng đối chiếu rõ ràng **Junior (First-Try)** vs **Senior (Chuẩn Hệ Thống)**.
   - Tiếng Việt có dấu, giữ nguyên thuật ngữ kỹ thuật tiếng Anh chuẩn, không emoji, không dấu chấm than.
2. **Cấu hình Thử thách (`content/courses/<course-slug>/challenges/<NN-slug>.json`):**
   - Khai báo ID, tiêu đề, mô tả nhiệm vụ, gợi ý và điều kiện chấm điểm; phải hợp lệ với Zod schema trong `src/schemas/`.
3. **Engine thuần (`src/labs/<course-slug>/<NN-slug>/engine.ts`):**
   - Cài đặt toàn bộ logic mô phỏng 2 chế độ `junior` và `senior` + hàm chấm điểm Challenge.
   - Viết unit test Vitest trong `tests/unit/engine/<course-slug>-<NN-slug>.test.ts` (test cả trường hợp lỗi ở Junior và đạt chuẩn ở Senior).
4. **Giao diện Mô phỏng (`src/labs/<course-slug>/<NN-slug>/Simulator.tsx`):**
   - Chỉ xây dựng nội dung cho các slot của `<LabShell>` (`leftSlot`, `inspectorSlot`).
   - Tuân thủ tuyệt đối `.agents/rules/ui-web.md`: chỉ dùng CSS variables từ `designs/tokens.css`, icon `lucide-react`, không cuộn toàn cục ở 1366×768 và 1440×900.
5. **Đăng ký & Đồng bộ:**
   - Khai báo module trong `content/courses/<course-slug>/course.json` và registry component của `src/labs/index.ts`.
   - Chạy `pnpm courses:sync` để cập nhật SQLite.
6. **Kiểm thử E2E (`tests/e2e/<course-slug>-<NN-slug>.spec.ts`):**
   - Kiểm tra tải trang không lỗi console, không cuộn toàn cục, chuyển đổi Junior/Senior hoạt động, và hoàn thành được tối thiểu 1 Challenge lưu vào SQLite.
