---
name: phan-tich-nguon
description: Phân tích transcript hoặc tài liệu nguồn từ YouTube trong thư mục sources/ để lập bản đồ kiến thức đầy đủ (curriculum.md) kèm mốc thời gian [HH:MM:SS], chia Module và đề xuất kịch bản Lab Junior vs Senior. Dùng khi người dùng nói "phân tích video", "tách kiến thức khóa học" hoặc gọi /phan-tich-nguon.
---

# Phân tích nguồn kiến thức (YouTube → Curriculum)

Đầu vào: Đường dẫn thư mục hoặc file transcript trong `sources/<course-slug>/` (hoặc link/nội dung người dùng cung cấp).

## Quy trình thực hiện

1. **Đọc trọn vẹn nguồn:** Đọc toàn bộ transcript/ghi chú trong `sources/<course-slug>/`, không bỏ qua đoạn giữa hoặc cuối video.
2. **Kiểm kê 100% khái niệm:** Lập danh sách đầy đủ mọi chủ đề, quy tắc kỹ thuật, mã lỗi, giao thức, đánh đổi kiến trúc (trade-offs) xuất hiện trong nguồn, gắn kèm mốc thời gian `[HH:MM:SS]` chính xác.
3. **Quy hoạch Module:** Nhóm các khái niệm thành các Module có phạm vi vừa đủ (mỗi Module triển khai được trong 1 task độc lập), đảm bảo **không bỏ sót bất kỳ mục kiến thức nào** từ bước 2.
4. **Thiết kế cặp kịch bản Junior vs Senior cho từng Module:**
   - **Junior (First-Try):** Người học bấm thao tác gì và sẽ thấy lỗi gì xảy ra trên Simulator & Inspector?
   - **Senior (Chuẩn Hệ Thống):** Thay đổi kỹ thuật nào được áp dụng (Header, Method, Status Code, SQL, Kiến trúc) và kết quả đổi ra sao?
5. **Thiết kế bộ Challenge tự chấm:** Đề xuất 2–4 thử thách thực hành cho mỗi Module, ghi rõ điều kiện kiểm chứng trên `engine.ts` (không dùng câu hỏi trắc nghiệm suông nếu có thể kiểm chứng bằng hành động mô phỏng).
6. **Xuất file `docs/courses/<course-slug>/curriculum.md`:** Ghi đầy đủ bản đồ kiến thức, bảng Module, mốc thời gian và đề xuất danh sách task cần tạo.
7. **DỪNG chờ duyệt:** Báo cáo tóm tắt và chờ người dùng xác nhận bản `curriculum.md` trước khi gọi `/tao-task` để tạo các task triển khai.
