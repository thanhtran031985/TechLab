---
trigger: glob
globs: src/engine/**, src/labs/**/engine.ts, tests/unit/engine/**
description: Quy tắc engine mô phỏng giao thức và chấm điểm Challenge (hàm thuần, tách biệt UI và DB).
---

# Engine mô phỏng & Chấm điểm

- **Hàm thuần (Pure Functions):** Toàn bộ logic mô phỏng giao thức (HTTP routing, ETag caching, Offset vs Cursor pagination, Idempotency-Key, Optimistic Locking, API Versioning adapter, JWT/Auth, Token Bucket rate limit, GraphQL/gRPC comparison) phải viết thành hàm thuần nhận `(state, action, mode)` và trả về kết quả bất biến `{ nextState, request, response, networkHops, serverLayers, analysis }`.
- **Tách biệt hoàn toàn:** Engine KHÔNG gọi SQLite, KHÔNG gọi `fetch` ra ngoài mạng, KHÔNG đọc `process.env`, KHÔNG phụ thuộc React/DOM. Nhờ đó toàn bộ engine chạy unit test bằng Vitest độc lập và tức thì.
- **Hai chế độ rõ ràng (`junior` | `senior`):**
  - Chế độ `junior` phải tái hiện chính xác lỗi kỹ thuật thực tế (ví dụ: double-tap tăng 2 like, offset bị lặp bài khi chèn bài mới, rớt mạng tạo 2 bài trùng, BOLA trả 200 dữ liệu riêng tư, Mass Assignment ghi đè `role: admin`).
  - Chế độ `senior` áp dụng đúng giải pháp chuẩn hệ thống kèm đầy đủ HTTP Status Code, Header chuẩn (`ETag`, `If-None-Match`, `Idempotency-Key`, `If-Match`, `Retry-After`, `Deprecation`, `Sunset`, `Vary`) và giải thích nguyên nhân tường minh bằng tiếng Việt có dấu.
- **Chấm điểm Challenge thực chất:** Hàm `evaluateChallenges(state, trace, challenges)` đánh giá trực tiếp trên `trace` và `nextState` do người học thực hiện; trả về danh sách trạng thái từng nhiệm vụ kèm lý do đạt/chưa đạt.
- **Độ chính xác dữ liệu mô phỏng:** Mọi HTTP request/response sinh ra bởi engine phải tuân thủ đúng chuẩn HTTP (method, path, query, headers, status code, JSON body RFC 9457 cho lỗi ở chế độ Senior).
