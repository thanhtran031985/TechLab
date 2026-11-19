# TechLab — Bộ thiết kế Dark Studio & Bản đồ ghép trang cho Antigravity (CHỈ ĐỌC)

Thư mục `designs/` là chuẩn thiết kế duy nhất theo phong cách **Senior API Lab v3.0 (Dark Mode Developer Studio — 3 cột)**. Agent KHÔNG tự sửa các file trong `designs/shell/` và `designs/pages/`.

## 1. Cấu trúc bộ thiết kế mẫu
- `designs/tokens.json` & `designs/shell/tokens.css`: Bảng màu Slate-950 (`#020617`), Emerald/Teal (`#10b981`) cho Senior & bài đang học, Amber (`#f59e0b`) cho Junior (First-Try), Rose (`#fb7185`) cho cảnh báo lỗi/tấn công.
- `designs/shell/shell.css` & `shell.js`: **Khung dùng chung** khóa cứng Header (Logo, Tiến độ `0/30`, Công tắc Junior/Senior, Cheat Sheet), Cột trái Danh sách bài học, cấu trúc 3 cột không cuộn toàn cục, 3 Tab bên phải và Modal Cheat Sheet.
- `designs/pages/home.html`: Trang cổng danh sách khóa học (`/`).
- `designs/pages/courses/<course-slug>/module-01.html` → `module-XX.html` (hiện có `designs/pages/courses/rest-api/`): 10 file layout độc lập tương ứng đủ 10 Module của khóa **REST API Design Like a Senior Engineer**.

## 2. Hướng dẫn ghép các page vào Next.js (App Router + SQLite)
Khi thực hiện task `01-app-lab-shell` và các task Module `02` → `11`, Antigravity ghép nối đúng theo bản đồ sau:

| Thành phần tĩnh trong `designs/` | Thành phần trong Next.js (`src/`) | Quy tắc ghép nối |
|---|---|---|
| `designs/shell/tokens.css` | `src/app/globals.css` | Nạp trực tiếp biến CSS, không hardcode hex trong component |
| `designs/shell/shell.css` + Header + Sidebar + 3 Tabs | `src/components/LabShell.tsx` | Dựng **1 lần duy nhất** cho mọi khóa học và mọi module |
| `designs/pages/home.html` | `src/app/page.tsx` (`/`) | Đọc danh sách khóa học & tiến độ tổng từ SQLite (`/api/courses`) |
| `designs/pages/courses/<course-slug>/module-XX.html` | `src/app/courses/[course]/[module]/page.tsx` + `src/labs/rest-api/<slug>/` | Cột trái (`module-sidebar`) chuyển route mượt bằng `next/link`; Cột giữa cắm `Simulator.tsx`; Tab 1 render `MDX`; Tab 2 cắm `InspectorPanel`; Tab 3 cắm `ChallengePanel` lưu SQLite qua `POST /api/progress` |
| Modal `#tl-cheatsheet-modal` | `src/components/CheatSheetModal.tsx` | Mở từ nút `Cheat Sheet` trên Header ở mọi trang |

## 3. Lưu ý kiểm tra mắt trước khi code
Mở trực tiếp `designs/pages/home.html` hoặc `designs/pages/courses/rest-api/module-01.html` bằng Chrome (không cần chạy server) để duyệt giao diện và bấm chuyển qua lại giữa đủ 10 bài học.

## 4. Quy ước mở rộng cho khóa học thứ 2, thứ 3...
- Mọi trang dùng chung toàn hệ thống (như trang chủ, lịch sử tổng) đặt trực tiếp trong `designs/pages/` (ví dụ `designs/pages/home.html`).
- Mọi trang thiết kế bài học của từng khóa học bắt buộc đặt trong thư mục con `designs/pages/courses/<course-slug>/` (ví dụ `designs/pages/courses/rest-api/`, `designs/pages/courses/system-design/`).
- Tất cả các khóa học đều nhúng chung `../../../shell/tokens.css`, `../../../shell/shell.css` và `../../../shell/shell.js` để khóa cứng giao diện 3 cột.
