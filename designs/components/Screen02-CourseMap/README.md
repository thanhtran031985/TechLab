# Screen02 — Bản đồ khóa học (`/courses/[course]`)

## Mục đích
Hiển thị danh sách toàn bộ Module theo đúng thứ tự video bằng bố cục **Master–Detail**.

## Cấu trúc vùng
- **Trái (`flex-1`):** Bảng danh sách module (STT, Tên module, Mốc video `[HH:MM:SS]`, Thử thách `X/Y`, Trạng thái). Chọn dòng sẽ tô nền `--primary-soft` và cập nhật panel phải ngay lập tức, không mở Modal.
- **Phải (`--size-detail-panel: 320px`, cuộn độc lập):** Hiển thị mục tiêu, đối chiếu ngắn Junior vs Senior, tiến độ từng Challenge và nút chính `Vào phòng Lab` cố định ở footer panel.
