# Checklist kiểm thử — 01-app-lab-shell

## API & SQLite
- [ ] `/api/courses` và `/api/courses/[course]` trả đúng tiến độ tổng hợp từ SQLite
- [ ] `POST /api/progress` validate bằng Zod, ghi nhận `PASSED` idempotent, trả 400 tiếng Việt khi sai payload

## Thành phần & Khung LabShell
- [ ] `StatusChip` luôn hiển thị đủ màu + icon Lucide + chữ
- [ ] `ModeToggle` chuyển đổi mượt giữa `Junior (First-Try)` và `Senior (Chuẩn Hệ Thống)`
- [ ] `CheatSheetModal` chuyển đủ 3 tab và đóng bằng phím `Esc`
- [ ] `<LabShell>` khóa cứng Command bar 40px, Split-Screen 42%/58% và 3 Tab

## Giao diện & Đối chiếu thiết kế
- [ ] Đối chiếu `Screen01`, `Screen02`, `Screen03`, `Screen04`: đúng mật độ Fluent Compact, không emoji, không dấu chấm than
- [ ] Không cuộn toàn cục (`scrollHeight <= innerHeight`, không cuộn ngang) ở 1366×768 và 1440×900
- [ ] Đồng nhất Light Mode và Dark Mode (`data-theme="dark"`)
- [ ] Đủ 4 trạng thái dữ liệu (Bình thường, Skeleton, Trống, Lỗi có Thử lại)
