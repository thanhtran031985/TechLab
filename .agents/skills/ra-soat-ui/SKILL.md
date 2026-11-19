---
name: ra-soat-ui
description: Rà soát các màn hình đã code theo chuẩn Fluent Compact + Master–Detail ở 2 kích thước, 4 trạng thái, Light/Dark mode và Junior/Senior mode theo Rubric 6 tiêu chuẩn. Dùng khi người dùng nói "rà soát giao diện", "so với thiết kế" hoặc gọi /ra-soat-ui.
---

# Rà soát giao diện (TechLab UI/UX Audit)

> Bộ tiêu chuẩn kiểm toán giao diện (Audit Rubric) được chuẩn hóa theo phong cách **Fluent Compact + Master–Detail** trên nền tảng Next.js + Tailwind CSS + `designs/tokens.css` của TechLab.

## 1. Quy trình thực hiện rà soát

1. Đồng bộ dữ liệu và khởi động môi trường kiểm thử: `pnpm courses:sync` và `pnpm dev`.
2. Mở màn hình cần rà soát bằng trình duyệt tự động (Playwright hoặc Antigravity Browser) tại 2 kích thước chuẩn:
   - **1440×900** (Desktop chuẩn rộng).
   - **1366×768** (Laptop văn phòng, giới hạn chiều cao tối thiểu).
3. Kiểm tra lần lượt cả **Chế độ Sáng (Light Theme)** và **Chế độ Tối (Dark Theme)** (`data-theme="dark"`).
4. Kiểm tra đầy đủ **4 trạng thái dữ liệu** (Bình thường, Đang tải/Skeleton, Trống/EmptyState, Lỗi/ErrorAlert có nút Thử lại).
5. Với màn hình Module Lab: kiểm tra thao tác tương tác ở cả **Junior Mode** và **Senior Mode**, đảm bảo cả 3 tab (Lý thuyết, Live Inspector, Thử thách) hoạt động trơn tru và không có lỗi console.
6. Chụp ảnh màn hình lưu vào `tests/e2e/__screens__/` (đặt tên dạng `<NN>-<page>-<trạng_thái>-<kích_thước>.png`).
7. Đánh giá chất lượng màn hình dựa trên **Bảng kiểm định 6 tiêu chuẩn (Audit Rubric)** bên dưới.
8. Xuất bảng tổng hợp kết quả. **Không tự ý sửa code giao diện khi người dùng chưa xác nhận mục cần sửa.**

## 2. Bảng kiểm định 6 tiêu chuẩn UI/UX (TechLab Audit Rubric)

| Tiêu chuẩn                                                 | Nội dung kiểm tra bắt buộc                                                                                                                                                                                                                                  | Tiêu chí Đạt                                                    |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **1. Token Integrity (Tính toàn vẹn Token)**               | Tuyệt đối không hardcode mã màu hex (`#...`) hay kích thước pixel cứng (`px`) trong page/component. Toàn bộ màu sắc, spacing, border-radius phải dùng token từ `designs/tokens.css`. Mọi module đều dùng chung `<LabShell>`.                                | 100% sử dụng token và khung `<LabShell>` thống nhất.            |
| **2. Frame-First & No-Scroll (Khung màn hình không cuộn)** | Ở màn hình máy tính ≥ 1366×768, trang tuyệt đối **KHÔNG cuộn toàn cục** (`document.documentElement.scrollHeight <= innerHeight`, không cuộn ngang) ở cả Junior và Senior mode. Chỉ cho phép cuộn nội bộ trong các panel (`flex-1 min-h-0 overflow-y-auto`). | Không xuất hiện thanh cuộn trình duyệt của cả trang web.        |
| **3. Information Density (Mật độ Fluent Compact)**         | Controls (Input, Select, Button) dùng kích thước gọn (`30px` / `26px`). Không dùng khối hero lớn, không gradient, không emoji, không dấu chấm than. Dữ liệu dạng bảng có vạch ngăn mảnh, số dùng `tabular-nums`, code/JSON/SQL dùng `--font-mono`.          | Giao diện gọn, dày thông tin kỹ thuật nhưng tường minh, dễ đọc. |
| **4. State Completeness (Đầy đủ 4 trạng thái)**            | Mọi khối dữ liệu xử lý đủ: Bình thường, Skeleton đúng kích thước, EmptyState (lý do + 1 hành động), ErrorAlert (giữ dữ liệu cũ + nút Thử lại). Nội dung Lý thuyết hiển thị ngay, không trắng trang.                                                         | Không bị trắng trang hay đơ giao diện khi API/dữ liệu lỗi.      |
| **5. Micro-interactions & A11y (Tương tác & Tiếp cận)**    | Độ tương phản chữ/nền đạt WCAG AA (≥ 4.5:1). Focus ring 2px rõ khi bấm Tab. Nút chỉ có icon có `aria-label` và tooltip. Kết quả mô phỏng/Challenge cập nhật trong vùng `aria-live="polite"`.                                                                | Thao tác bàn phím mượt, chỉ dẫn trạng thái luôn có icon + chữ.  |
| **6. Dark Mode Consistency (Đồng nhất chế độ tối)**        | Khi bật `data-theme="dark"`: nền không đen tuyệt đối (`#000000`), phân tầng rõ giữa `bg` (`#1F1F1F`), `surface` (`#292929`), `surface-2` (`#2E2E2E`), viền mảnh rõ, chữ và khối code dễ đọc.                                                                | Trải nghiệm đồng nhất, dịu mắt ở cả Sáng và Tối.                |

## 3. Mẫu bảng báo cáo rà soát

```markdown
### Báo cáo rà soát giao diện: <Tên màn hình> (<Đường dẫn URL>)

- **Kích thước kiểm thử:** 1440×900 và 1366×768
- **Chế độ hiển thị:** Sáng (Light) & Tối (Dark) · Junior & Senior Mode
- **Ảnh chụp bằng chứng:** `tests/e2e/__screens__/...`

| Tiêu chuẩn                   | Hiện trạng thực tế |      Đánh giá       | Đề xuất cải tiến |
| ---------------------------- | ------------------ | :-----------------: | ---------------- |
| 1. Token Integrity           |                    | ✅ Đạt / ⚠️ Cần sửa |                  |
| 2. Frame-First & No-Scroll   |                    | ✅ Đạt / ⚠️ Cần sửa |                  |
| 3. Information Density       |                    | ✅ Đạt / ⚠️ Cần sửa |                  |
| 4. State Completeness        |                    | ✅ Đạt / ⚠️ Cần sửa |                  |
| 5. Micro-interactions & A11y |                    | ✅ Đạt / ⚠️ Cần sửa |                  |
| 6. Dark Mode Consistency     |                    | ✅ Đạt / ⚠️ Cần sửa |                  |

**Kết luận chung:** (Đạt chuẩn / Cần tinh chỉnh theo danh sách trên)
```
