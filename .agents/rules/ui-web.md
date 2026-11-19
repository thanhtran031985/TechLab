---
trigger: glob
globs: src/app/**, src/components/**, src/labs/**, tests/e2e/**
description: Quy tắc giao diện Next.js + Tailwind bám sát thiết kế Dark Studio 3 cột (Senior API Lab v3.0) trong designs/shell và designs/pages.
---

## Giao diện TechLab (Dark Studio — 3 cột)
- `designs/` CHỈ ĐỌC. Nguồn thiết kế gốc là `designs/tokens.json`, `designs/shell/tokens.css`, `designs/shell/shell.css`, `designs/pages/home.html` và `designs/pages/courses/<course-slug>/module-XX.html`.
- Không hardcode mã màu hex (`#...`) rời rạc trong page/component; dùng CSS variables từ `designs/shell/tokens.css` (`--bg`, `--surface`, `--surface-2`, `--primary`, `--junior`, `--senior`, `--crit`, `--code-bg`).
- **Khóa khung `<LabShell>`:** Mọi trang bài học bắt buộc dùng chung `<LabShell>` với đúng bố cục 3 cột như `designs/shell/shell.css`:
  - Top Header (56px): Brand trái | Thanh tiến độ nhiệm vụ (`X/30`) | Công tắc `Junior (First-Try)` (vàng cam `--junior`) vs `Senior (Chuẩn Hệ Thống)` (xanh ngọc `--senior`) | Nút `Cheat Sheet`.
  - Cột 1 (`248px`): Danh sách bài học trong khóa có số thứ tự tròn và vạch nhấn trái `--primary` ở module đang chọn.
  - Cột 2 (`minmax(350px, 38%)`): Khu vực mô phỏng tương tác (JaneGram / hệ thống) + bảng kịch bản.
  - Cột 3 (`1fr`): 3 Tab chuẩn hóa (`1. Kiến Thức Cốt Lõi`, `2. Live HTTP Inspector`, `3. Nhiệm Vụ`).
- Ở màn hình ≥ 1366×768: trang tuyệt đối **KHÔNG cuộn toàn cục** (`document.documentElement.scrollHeight <= innerHeight`, không cuộn ngang), chữ trên Header không bị rớt dòng xấu. Chỉ từng cột bên trong cuộn độc lập (`min-height: 0; overflow-y: auto`).
- Icon dùng `lucide-react` nét 15–16px (`currentColor`). Không dùng emoji, không dấu chấm than trong văn bản giao diện.
- Đủ 4 trạng thái dữ liệu cho các vùng đọc API/SQLite: Bình thường, Skeleton, Trống, Lỗi (giữ dữ liệu cũ + nút Thử lại).
- Nghiệm thu bằng Playwright E2E ở 1366×768 và 1440×900 (kiểm tra cả chế độ Junior và Senior, chuyển 3 Tab, mở Cheat Sheet), chụp ảnh lưu `tests/e2e/__screens__/`.
