---
trigger: model_decision
description: Áp dụng khi làm việc với API Routes, xử lý MDX/HTML, bài Lab bảo mật, biến môi trường, log hoặc khi mở rộng Auth về sau.
---

# Bảo mật TechLab

- **Cách ly tuyệt đối các bài Lab tấn công:** Các bài Lab mô phỏng lỗ hổng bảo mật (SQL Injection, XSS, CSRF, BOLA/IDOR, Mass Assignment, JWT tampering) **BẮT BUỘC** chỉ chạy trên bộ mô phỏng giả lập trong bộ nhớ (`src/engine/`). Tuyệt đối KHÔNG thực thi chuỗi SQL thô hoặc mã script từ input người học lên file `data/techlab.db` thật hoặc DOM thật.
- **Chống XSS khi render nội dung:** Mọi nội dung MDX, ghi chú người học (`user_notes`), hoặc JSON/HTML hiển thị trong Inspector phải được escape chuẩn của React; cấm dùng `dangerouslySetInnerHTML` trừ khi đã qua bộ sanitize nghiêm ngặt cho syntax highlighting và không nhận input trực tiếp từ người dùng.
- **Validate mọi đầu vào API:** Mọi Next.js Route Handler (`src/app/api/**`) phải parse và validate body/query/params bằng **Zod**; từ chối đầu vào sai kiểu với HTTP 400/422 theo cấu trúc lỗi chuẩn, không trả stack trace hay chi tiết bảng SQLite ra client.
- **Truy vấn DB an toàn:** Chỉ dùng query builder có bind parameter của Drizzle ORM; không nối chuỗi SQL thủ công.
- **Biến môi trường & Bí mật:** KHÔNG đọc trực tiếp `.env`; khai báo biến mẫu ở `.env.example`. Không đặt API key hay secret vào biến có tiền tố `NEXT_PUBLIC_*` hoặc nhúng vào client bundle.
- **Log an toàn:** Không ghi dữ liệu nhạy cảm hay secret vào log server.
- **Giai đoạn mở rộng Auth (tương lai):** Khi bổ sung tính năng đăng nhập/đa người dùng, áp dụng băm mật khẩu `argon2id`, cookie phiên `HttpOnly` + `SameSite=Lax`, kiểm quyền ở tầng service/API (không dựa vào việc ẩn nút UI).
- **Kiểm tra tự động:** Chạy `pnpm security:check` trước khi đóng task (kiểm tra rò rỉ secret, cấm `dangerouslySetInnerHTML` không kiểm soát, kiểm tra `.env` trong `.gitignore`).
