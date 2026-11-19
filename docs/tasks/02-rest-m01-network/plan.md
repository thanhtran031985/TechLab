# Kế hoạch triển khai — 02-rest-m01-network

## Mục tiêu
Hoàn thiện trọn vẹn Module 01 — Nền tảng Mạng, HTTP & REST (khóa `rest-api`) bao phủ 100% mốc thời gian `[00:00:00]` – `[00:19:34]` từ video gốc:
1. Nội dung lý thuyết Content-as-Code (`MDX`) + Đặc tả Challenge (`JSON`).
2. Pure Engine giả lập độc lập (`engine.ts`) xử lý 3 kịch bản Junior (lỗi thực tế) vs Senior (chuẩn hệ thống) và tự động chấm điểm thực chất.
3. Giao diện Simulator JaneGram cắm vào `<LabShell>`, tự động đồng bộ kết quả vào SQLite qua `/api/progress`.
4. Đảm bảo 100% xanh ở toàn bộ Unit test, Integration test và Playwright E2E ở 2 độ phân giải chuẩn (1366×768 & 1440×900, không cuộn toàn cục).

## Chi tiết các bước

### Bước 1 — Nội dung MDX lý thuyết & đặc tả Challenge JSON
- **File tạo / sửa:**
  - `content/courses/rest-api/modules/01-network-http-rest.mdx`: Soạn thảo lý thuyết bám sát 100% mốc video `[00:00:00]` – `[00:19:34]` (API Contract, 6 thành phần URL Anatomy, DNS/TTL, TCP 3-Way Handshake, UDP & HTTP/3 QUIC, TLS/HTTPS quán cafe, Server Routing, JSON & cạm bẫy BigInt, Stateless sau Load Balancer, 4 thói quen vàng REST).
  - `content/courses/rest-api/challenges/01-network-http-rest.json`: Cập nhật chuẩn hóa 3 thử thách (`m01-c1` URL Anatomy, `m01-c2` HTTP vs HTTPS Stateless, `m01-c3` BigInt JSON).
  - `content/courses/rest-api/course.json`: Rà soát metadata module 01.
- **Test viết trước (TDD):**
  - `tests/integration/content-module-01.test.ts`: Validate Zod schema cho file `course.json` và `challenges/01-network-http-rest.json`, kiểm tra đồng bộ dữ liệu vào SQLite.
- **Lệnh kiểm tra:** `pnpm test tests/integration/content-module-01.test.ts`, `pnpm courses:sync`, `pnpm courses:sync:check`.
- **Rủi ro:** Lệch schema SQLite khi sync -> Khắc phục: Schema đã định nghĩa chặt chẽ với Zod.

### Bước 2 — Pure Engine (`engine.ts`) & Unit Test Vitest
- **File tạo / sửa:**
  - `src/labs/rest-api/01-network-http-rest/engine.ts`:
    - `parseUrlAnatomy(url)`: Phân tích 6 thành phần URL (Scheme, Host, Port, Path, Query, Fragment).
    - `executeScenario(scenarioId, mode)`:
      - `sc-wifi`: Junior (HTTP thuần, `/likeIt`, lộ Bearer token, 5 chặng dừng lỗi TLS) vs Senior (HTTPS TLS 1.3, PUT `/v1/posts/42/likes`, 204 No Content, 5 chặng sáng xanh).
      - `sc-stateless`: Stateless sau Load Balancer (2 request liên tiếp tới worker ngẫu nhiên mà không mất phiên).
      - `sc-bigint`: Junior (gửi số nguyên 64-bit `9007199254740993` làm tròn thành `9007199254740992` gây sai lệch dữ liệu) vs Senior (bọc String `"9007199254740993"` bảo toàn 100%).
    - `evaluateChallenges(traceHistory)`: Hàm thuần chấm điểm thực chất dựa trên lịch sử gói tin và thao tác, trả về danh sách các challenge ID đủ điều kiện đạt.
- **Test viết trước (TDD):**
  - `tests/unit/engine/rest-api-01-network.test.ts`: Kiểm thử độc lập logic thuần của 3 kịch bản ở cả 2 mode, kiểm tra hành vi lỗi của JS parser với số nguyên lớn, kiểm tra hàm chấm điểm tự động.
- **Lệnh kiểm tra:** `pnpm test tests/unit/engine/rest-api-01-network.test.ts`.
- **Rủi ro:** Phụ thuộc vào DOM hoặc Node API -> Khắc phục: Viết hàm thuần 100% trong `src/labs/rest-api/01-network-http-rest/engine.ts`, không import thư viện ngoài.

### Bước 3 — Simulator UI cắm vào `<LabShell>` & Playwright E2E
- **File tạo / sửa:**
  - `src/labs/rest-api/01-network-http-rest/Simulator.tsx`: Kết nối với `engine.ts` để hiển thị tương tác JaneGram Mobile v2.4, 3 nút bấm kịch bản thực hành.
  - `src/labs/rest-api/01-network-http-rest/Theory.tsx`: Kết nối với công cụ URL Anatomy tương tác và bảng đối chiếu lý thuyết Junior vs Senior.
  - `src/app/courses/[course]/[module]/page.tsx`: Tích hợp dispatch action từ engine, hiển thị cập nhật trực tiếp lên `InspectorPanel` và `ChallengePanel`, gọi `/api/progress` lưu tiến độ vào SQLite.
  - `tests/e2e/rest-api-01-network.spec.ts`: Bộ test Playwright E2E độc lập cho riêng Module 01.
- **Test viết trước (TDD):**
  - `tests/e2e/rest-api-01-network.spec.ts`: Mở trang `/courses/rest-api/01-network-http-rest` ở 1366×768 và 1440×900; kiểm tra không cuộn toàn cục; tương tác lần lượt 3 kịch bản ở Junior và Senior; xác nhận 3 Challenge đạt và lưu vào CSDL; chụp ảnh bằng chứng lưu vào `tests/e2e/__screens__/`.
- **Lệnh kiểm tra:** `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm security:check`.
- **Rủi ro:** Tràn chiều ngang hoặc vỡ bố cục khi mở rộng văn bản phân tích gói tin -> Khắc phục: Khống chế trong container cuộn riêng biệt `sim-scroll` và `wb-pane`.
