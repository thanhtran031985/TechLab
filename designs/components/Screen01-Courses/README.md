# Screen01 — Danh sách khóa học (`/`)

## Mục đích
Màn hình trang chủ hiển thị tổng quan tiến độ học tập và danh sách khóa học đã đồng bộ từ `content/courses/` vào SQLite.

## Cấu trúc vùng (không cuộn toàn cục ở ≥ 1366×768)
1. **Header 1 dòng:** Tiêu đề `Danh sách khóa học` + mô tả ngắn; nút chính `Tiếp tục bài gần nhất` bên phải.
2. **Hàng 4 KPI gọn:** Tổng khóa học, Module đã hoàn thành, Thử thách đã đạt (`tabular-nums`), Ghi chú đã lưu.
3. **Command bar (40px):** Ô tìm kiếm theo tên/kênh + bộ lọc trạng thái.
4. **Bảng khóa học (`flex-1 min-h-0 overflow-auto`):** Mã khóa (mono), Tên khóa học, Nguồn kênh, Số module (căn phải), Thử thách đạt (`X / Y`), Trạng thái (chip màu + icon + chữ), Lần học gần nhất (`dd/MM/yyyy HH:mm:ss` hoặc `—`), nút hành động. Không dùng lưới card lớn.

## Bốn trạng thái
- **Bình thường:** Đủ 4 KPI và bảng danh sách.
- **Đang tải:** Skeleton đúng chiều cao hàng bảng.
- **Trống:** Lý do chưa đồng bộ khóa học + 1 nút hành động.
- **Lỗi:** Alert tone `crit` giữ lại dữ liệu cũ nếu có + nút `Thử lại`.
