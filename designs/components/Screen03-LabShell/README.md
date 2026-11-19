# Screen03 — Khung phòng Lab dùng chung (`<LabShell>`, `/courses/[course]/[module]`)

## Mục đích
Đây là **khung chuẩn bắt buộc** cho 100% các Module Lab thuộc mọi khóa học trong TechLab nhằm đảm bảo giao diện đồng nhất tuyệt đối.

## 4 Slot chuẩn của `<LabShell>`
1. **Command bar (40px, cố định trên cùng):**
   - Trái: Dropdown chuyển nhanh Module + Chip mốc thời gian `[HH:MM:SS]`.
   - Giữa: `ModeToggle` chuyển đổi `Junior (First-Try)` (tone `warn`) và `Senior (Chuẩn Hệ Thống)` (tone `ok`).
   - Phải: Nút `Đặt lại`, nút `Ghi chú`, nút `Cheat Sheet`.
2. **`leftSlot` (42% chiều rộng, cuộn độc lập):** Khung ứng dụng/hệ thống mô phỏng + danh sách nút Scenario Controls của riêng từng module.
3. **`theorySlot` (Tab 1 bên phải, cuộn độc lập):** Nội dung MDX render tĩnh ngay khi mở trang, có mốc `[HH:MM:SS]` và bảng đối chiếu Junior vs Senior.
4. **`inspectorSlot` (Tab 2 bên phải) & `challengeSlot` (Tab 3 bên phải):** Thanh tiến trình 5 chặng mạng/tầng server, hộp phân tích, Raw Request/Response nền `--code-bg` font `--font-mono`, và danh sách thử thách tự chấm đặt trong `aria-live="polite"`.
