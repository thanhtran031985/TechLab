# TechLab — Hệ thống thiết kế tham chiếu (CHỈ ĐỌC)

Thư mục này là nguồn thiết kế gốc để đối chiếu khi code giao diện bằng **Next.js (App Router) + React + Tailwind CSS + lucide-react**. Agent KHÔNG tự sửa các file trong `designs/components/`.

## Cấu trúc
- `tokens.json`: Nguồn duy nhất cho màu Sáng/Tối, font, khoảng cách, bo góc, kích thước, bóng, trạng thái.
- `tokens.css`: Sinh tự động từ `tokens.json` (`pnpm tokens:gen`), nạp vào `src/app/globals.css`.
- `components/bundle.css`: Kiểu dáng Fluent Compact dùng chung cho các bản preview tĩnh (tiền tố `tl-`).
- `components/_shared/preview.js`: Thanh điều khiển chuyển đổi 4 trạng thái (Bình thường / Đang tải / Trống / Lỗi) và Sáng/Tối khi mở trực tiếp file `preview.html` bằng Chrome.
- `components/Screen01…Screen05`: Bản thiết kế hoàn chỉnh cho từng màn hình (`preview.html` + `README.md`).

## Ánh xạ thành phần sang Next.js + Tailwind

| Bản thiết kế (`bundle.css`) | Thành phần React (`src/components/`) | Ghi chú |
|---|---|---|
| `.tl-shell`, `.tl-nav`, `.tl-header` | `<AppShell>` | Thanh bên `var(--size-nav)` thu gọn `var(--size-nav-collapsed)`, header `var(--size-header)` |
| `.tl-lab-split`, `.tl-commandbar`, `.tl-tabs` | `<LabShell>` | Bắt buộc dùng cho mọi Module Lab; 4 slot cố định |
| `.tl-mode-toggle` | `<ModeToggle>` | Chuyển `junior` (tone `warn`) / `senior` (tone `ok`) |
| `.tl-hops`, `.tl-code-box` | `<InspectorPanel>` | Nền `--code-bg`, chữ `--code-ink`, font `--font-mono` |
| `.tl-challenge-item` | `<ChallengePanel>` | Bọc trong `aria-live="polite"`, nối `POST /api/progress` |
| `.tl-chip` | `<StatusChip>` | Luôn gồm màu + icon `lucide-react` 16px + chữ |
| `.tl-modal-card` | `<CheatSheetModal>` | Đóng bằng `Esc` hoặc nút đóng |
| `.tl-drawer-card` | `<NotesDrawer>` | Rộng `var(--size-drawer)` (480px) |
| `.tl-skeleton`, `.tl-empty-box`, `.tl-alert` | `<LoadingSkeleton>`, `<EmptyState>`, `<ErrorAlert>` | 4 trạng thái bắt buộc |
