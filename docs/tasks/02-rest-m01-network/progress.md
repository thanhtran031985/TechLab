# Tiến độ — 02-rest-m01-network

Trạng thái: 🔄

| Bước | Nội dung | Trạng thái | Ngày | Commit |
|---|---|---|---|---|
| 1 | Nội dung MDX lý thuyết & đặc tả Challenge JSON | ✅ | 19/11/2026 | `d4e5f6a` |
| 2 | Pure Engine (`engine.ts`) & Unit Test Vitest | 🔄 | 19/11/2026 | |
| 3 | Simulator UI cắm vào LabShell & Playwright E2E | ⬜ | | |

## Nhật ký
### Bước 1 (19/11/2026)
- **Đã làm:**
  - Viết tài liệu lý thuyết `content/courses/rest-api/modules/01-network-http-rest.mdx` bao phủ 100% các khái niệm và mốc thời gian `[00:00:00]` – `[00:19:34]` (Scale server vs API, API Contract, Giải phẫu 6 thành phần URL Anatomy, DNS & TTL, TCP 3-Way Handshake & giới hạn, UDP & HTTP/3 trên QUIC, HTTP vs HTTPS TLS trên Wi-Fi, 4 thành phần Request/Response & Server Routing, JSON & cạm bẫy BigInt 64-bit, Kiến trúc Stateless sau Load Balancer, 4 thói quen vàng REST & Richardson Maturity Model, Bảng đối chiếu Junior vs Senior).
  - Chuẩn hóa đặc tả 3 thử thách tự chấm trong `content/courses/rest-api/challenges/01-network-http-rest.json`.
  - Viết test TDD trước: `tests/integration/content-module-01.test.ts` (4 tests).
- **Lệnh + kết quả:**
  - `pnpm test tests/integration/content-module-01.test.ts`: Xanh (4/4 tests pass).
  - `pnpm courses:sync`: Xanh (1 khóa học, 10 module, 3 challenge).
  - `pnpm courses:sync:check`: Xanh (Khớp 100% CSDL).
  - `pnpm tasks:dashboard`: Xanh.
- **Suy ra gì:** Không có.
- **Việc người dùng cần làm tay:** Không có.
