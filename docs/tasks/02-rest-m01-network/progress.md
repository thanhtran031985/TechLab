# Tiến độ — 02-rest-m01-network

Trạng thái: ✅

| Bước | Nội dung | Trạng thái | Ngày | Commit |
|---|---|---|---|---|
| 1 | Nội dung MDX lý thuyết & đặc tả Challenge JSON | ✅ | 19/11/2026 | `9e0411c` |
| 2 | Pure Engine (`engine.ts`) & Unit Test Vitest | ✅ | 19/11/2026 | `ea444b6` |
| 3 | Simulator UI cắm vào LabShell & Playwright E2E | ✅ | 19/11/2026 | `c8d9e0f` |

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

### Bước 2 (19/11/2026)
- **Đã làm:**
  - Xây dựng Pure Simulation Engine `src/labs/rest-api/01-network-http-rest/engine.ts`:
    - `parseUrlAnatomy(urlString)`: Bóc tách 6 thành phần URL (Scheme, Host, Port, Path, Query, Fragment) độc lập không phụ thuộc DOM.
    - `executeScenario(scenarioId, mode, options)`: Mô phỏng thuần túy 3 kịch bản: `sc-wifi` (Junior HTTP lộ token vs Senior HTTPS TLS 1.3), `sc-bigint` (Junior mất độ chính xác số > 2^53 - 1 vs Senior bọc String), `sc-stateless` (phân phối request tới các worker node không lưu session).
    - `evaluateChallenges(input)`: Hàm thuần chấm điểm 3 thử thách thực chất dựa trên trace lịch sử thao tác và kịch bản đã quan sát.
  - Viết test TDD trước: `tests/unit/engine/rest-api-01-network.test.ts` (9 tests).
- **Lệnh + kết quả:**
  - `pnpm test tests/unit/engine/rest-api-01-network.test.ts`: Xanh (9/9 tests pass).
  - `pnpm test`: Xanh toàn bộ 41/41 tests (10 files).
  - `pnpm typecheck`: Xanh (0 lỗi).
  - `pnpm tasks:dashboard`: Xanh.
- **Suy ra gì:** Không có.
- **Việc người dùng cần làm tay:** Không có.

### Bước 3 (19/11/2026)
- **Đã làm:**
  - Nối Pure Engine `src/labs/rest-api/01-network-http-rest/engine.ts` vào `Theory.tsx`, `Simulator.tsx` và `src/app/courses/[course]/[module]/page.tsx`.
  - Bấm chọn các pill URL Anatomy gọi callback `onSelectPart` cập nhật giải phẫu URL và kích hoạt chấm Challenge 1.
  - Thực thi các kịch bản mạng gọi `executeScenario` và `evaluateChallenges` tự động chấm Challenge 2 và Challenge 3, gửi POST tới `/api/progress` lưu vào SQLite.
  - Viết bộ test E2E Playwright `tests/e2e/rest-api-02-rest-m01-network.spec.ts` kiểm thử toàn bộ hành vi ở 1366×768 và 1440×900: không cuộn toàn cục, 0 lỗi console, vượt qua cả 3 Challenge, chụp ảnh màn hình lưu vào `tests/e2e/__screens__/`.
- **Lệnh + kết quả:**
  - `pnpm test:e2e`: 10/10 tests pass (25.4s).
  - `pnpm test`: 41/41 tests pass (10 files).
  - `pnpm typecheck`: Xanh.
  - `pnpm lint`: Xanh.
  - `pnpm security:check`: Xanh.
  - `pnpm courses:sync:check`: Xanh (100% khớp SQLite).
  - `pnpm tasks:dashboard`: Xanh.
- **Suy ra gì:** Không có.
- **Việc người dùng cần làm tay:** Không có.
