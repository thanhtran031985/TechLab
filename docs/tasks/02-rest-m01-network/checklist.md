# Checklist kiểm thử — 02-rest-m01-network

## Engine & Thử thách
- [x] Kịch bản chế độ `junior` tái hiện đúng lỗi thực tế (HTTP lộ Bearer token trên Wi-Fi, BigInt 64-bit mất độ chính xác trong JSON)
- [x] Kịch bản chế độ `senior` xử lý chuẩn kèm giải thích nguyên nhân (HTTPS TLS 1.3, PUT Idempotent 204 No Content, BigInt bọc String)
- [x] Thử thách `m01-c1` (Giải phẫu cấu trúc URL) chấm đạt khi thỏa mãn điều kiện thực tế (bấm khám phá >= 3 thành phần URL)
- [x] Thử thách `m01-c2` (So sánh HTTP thường và HTTPS Stateless) chấm đạt khi thỏa mãn điều kiện thực tế (chạy Junior thấy lỗi rồi chuyển Senior 5 chặng)
- [x] Thử thách `m01-c3` (Phát hiện bẫy BigInt trong JSON) chấm đạt khi thỏa mãn điều kiện thực tế (chạy kịch bản Senior BigInt dạng chuỗi)
- [x] 9/9 tests trong `tests/unit/engine/rest-api-01-network.test.ts` xanh

## Giao diện & Đồng bộ
- [x] Khớp `designs/pages/courses/rest-api/module-01.html`, không cuộn toàn cục ở 1366×768 và 1440×900
- [x] 10/10 tests trong Playwright E2E (`tests/e2e/rest-api-02-rest-m01-network.spec.ts` & `tests/e2e/lab-shell.spec.ts`) xanh
- [x] Ảnh chụp giao diện đã lưu tại `tests/e2e/__screens__/module-01-1366x768.png` và `module-01-1440x900.png`
- [x] `pnpm courses:sync:check` (100% khớp SQLite) và `pnpm security:check` xanh
