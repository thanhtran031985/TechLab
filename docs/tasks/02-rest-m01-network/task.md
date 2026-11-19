# 02-rest-m01-network — Module 01 — Nền tảng Mạng, HTTP & REST

- Ngày tạo: 2026-11-19
- Giai đoạn: GĐ1
- Phụ thuộc: 01
- Nhánh git: feat/02-rest-m01-network

## Mục tiêu
Hoàn thiện trọn vẹn Module 01 — Nền tảng Mạng, HTTP & REST (khóa `rest-api`) theo `docs/courses/rest-api/curriculum.md` ([00:00:00] – [00:19:34]): đầy đủ nội dung lý thuyết `MDX`, engine mô phỏng thuần (`Junior` vs `Senior`), bộ `Challenge` tự chấm lưu vào SQLite qua `/api/progress`, giao diện mô phỏng cắm vào khung `<LabShell>` khớp `designs/pages/courses/rest-api/module-01.html`, unit test Vitest và kiểm thử E2E Playwright.

## Phạm vi
- `content/courses/rest-api/modules/02-rest-m01-network.mdx`: Lý thuyết bám sát 100% các mốc thời gian [00:00:00] – [00:19:34] và bảng đối chiếu Junior vs Senior.
- `content/courses/rest-api/challenges/02-rest-m01-network.json`: Danh sách thử thách tự chấm của module.
- `src/labs/rest-api/02-rest-m01-network/engine.ts`: Hàm thuần mô phỏng 2 chế độ `junior` và `senior` + hàm đánh giá Challenge (`evaluateChallenges`).
- `src/labs/rest-api/02-rest-m01-network/Simulator.tsx`: Giao diện mô phỏng cắm vào các slot của `<LabShell>`, tuân thủ `.agents/rules/ui-web.md`.
- Cập nhật `content/courses/rest-api/course.json` và `src/labs/index.ts`, chạy `pnpm courses:sync`.
- Test: `tests/unit/engine/rest-api-02-rest-m01-network.test.ts` và `tests/e2e/rest-api-02-rest-m01-network.spec.ts`.

## Kiến thức bắt buộc & Mốc thời gian
- API Contract (Client vs Server) [00:02:42]
- Giải phẫu URL: Scheme, Host, Port (80/443), Path, Query String, Percent-encoding (%20), Fragment (#top không gửi lên server) [00:03:54]
- DNS & TTL (caching ở resolver) [00:05:27]; IP chọn máy, Port chọn tiến trình [00:06:17]
- TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK), đánh số gói tin, retry với backoff, giới hạn của TCP [00:06:58]
- UDP vs TCP và HTTP/3 trên QUIC (tránh head-of-line blocking trên mạng di động yếu) [00:09:39]
- HTTP vs HTTPS (TLS mã hóa & xác thực server trên Wi-Fi công cộng) [00:10:56]
- Server Routing, 4 phần HTTP Request và Response [00:11:48]
- JSON thực chiến: không có kiểu Date (gửi chuỗi), ID lớn (> 2^53 - 1) gửi dạng String tránh mất chữ số [00:14:49]
- Mô hình Stateless sau Load Balancer [00:15:57]
- 4 thói quen cốt lõi của REST và Richardson Maturity Model (Hypermedia/HATEOAS) [00:16:35]

## Danh sách Challenge
- `m01-c1` — **Giải phẫu cấu trúc URL**: Bấm kiểm tra ít nhất 3 thành phần trong công cụ Giải phẫu URL ở Tab 1.
- `m01-c2` — **So sánh HTTP thường và HTTPS Stateless**: Bấm kịch bản 1 ở chế độ Junior rồi chuyển Senior để hoàn tất 5 chặng mạng TLS.
- `m01-c3` — **Phát hiện bẫy BigInt trong JSON**: Chạy kịch bản 3 để thấy số nguyên 64-bit bị sai lệch khi không bọc String.

## Ngoài phạm vi
- Thay đổi cấu trúc khung `<LabShell>` chung (đã chốt ở task `01-app-lab-shell`).
- Sửa trực tiếp các file tham chiếu trong `designs/` (CHỈ ĐỌC).

## Thiết kế & Nguồn liên quan
- `designs/pages/courses/rest-api/module-01.html`
- `designs/shell/shell.css`, `designs/tokens.json`
- `docs/courses/rest-api/curriculum.md`
- `.agents/rules/ui-web.md`, `.agents/rules/engine.md`

## Các bước
### Bước 1 — Nội dung MDX lý thuyết & đặc tả Challenge JSON
- Làm: Tạo `content/courses/rest-api/modules/02-rest-m01-network.mdx` và `content/courses/rest-api/challenges/02-rest-m01-network.json`; cập nhật `course.json`.
- Test viết trước: Test validate schema Zod cho `course.json` và `challenges/02-rest-m01-network.json`.
- Kiểm tra: `pnpm courses:sync` và `pnpm courses:sync:check`.

### Bước 2 — Pure Engine (`engine.ts`) & Unit Test Vitest
- Làm: Cài đặt hàm thuần xử lý kịch bản Junior vs Senior, sinh request/response/5-hop trace và chấm Challenge trong `src/labs/rest-api/02-rest-m01-network/engine.ts`.
- Test viết trước: `tests/unit/engine/rest-api-02-rest-m01-network.test.ts` (kiểm tra lỗi ở chế độ `junior`, hành vi chuẩn ở chế độ `senior` và logic chấm điểm từng Challenge).
- Kiểm tra: `pnpm test tests/unit/engine/rest-api-02-rest-m01-network.test.ts`.

### Bước 3 — Simulator UI cắm vào `<LabShell>` & Playwright E2E
- Làm: Tạo `src/labs/rest-api/02-rest-m01-network/Simulator.tsx` và đăng ký vào `src/labs/index.ts`.
- Test viết trước: `tests/e2e/rest-api-02-rest-m01-network.spec.ts` (mở route `/courses/rest-api/02-rest-m01-network` ở 1366×768 và 1440×900, không cuộn toàn cục, 0 lỗi console, thao tác ở Junior & Senior và xác nhận Challenge lưu tiến độ).
- Kiểm tra: `pnpm typecheck`; `pnpm lint`; `pnpm test`; `pnpm test:e2e tests/e2e/rest-api-02-rest-m01-network.spec.ts`; chạy `/ra-soat-ui`.

## Chấp nhận khi
- [ ] Bao phủ 100% kiến thức và mốc thời gian [00:00:00] – [00:19:34] của Module 01 — Nền tảng Mạng, HTTP & REST
- [ ] Pure engine chạy độc lập không phụ thuộc DB/DOM, unit test xanh
- [ ] Giao diện cắm vào `<LabShell>` khớp `designs/pages/courses/rest-api/module-01.html`, không cuộn toàn cục ở 1366×768 và 1440×900, có ảnh chụp bằng chứng
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm courses:sync:check`, `pnpm test:e2e` xanh

## Câu hỏi mở
- Không có
