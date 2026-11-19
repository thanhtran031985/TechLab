# Screen04 — `CheatSheetModal` & `NotesDrawer`

## Mục đích
Chuẩn hóa 2 thành phần lớp nổi dùng trong `<LabShell>`:
- **`CheatSheetModal`:** Hộp thoại tra cứu nhanh dạng bảng gọn gồm 3 tab (HTTP Methods, Status Codes, So sánh REST/GraphQL/gRPC), đóng bằng nút `×` hoặc phím `Esc`.
- **`NotesDrawer` (`--size-drawer: 480px`):** Ngăn kéo trượt từ phải để thêm/sửa/xóa ghi chú gắn với `module_id` và mốc thời gian `[HH:MM:SS]`, lưu vào bảng `user_notes` trên SQLite.
