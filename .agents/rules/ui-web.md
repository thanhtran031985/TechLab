---
trigger: glob
globs: src/app/**, src/components/**, src/labs/**, tests/e2e/**
description: Quy tắc giao diện Next.js + Tailwind, phong cách Fluent Compact + Master–Detail và khóa khung LabShell cho TechLab.
---

## Giao diện TechLab (Next.js + Tailwind CSS)

- `designs/` CHỈ ĐỌC. Nguồn token duy nhất là `designs/tokens.json` và `designs/tokens.css` (nhập vào `src/app/globals.css`).
- Không hardcode mã màu hex (`#...`) hay kích thước pixel cứng (`px`) trong page/component. Chỉ dùng CSS variables (`var(--primary)`, `var(--surface)`, `var(--line)`, `var(--space-12)`) hoặc utility class Tailwind đã ánh xạ tới token. Thiếu token: thêm vào `designs/tokens.json`, chạy `pnpm tokens:gen`, báo cáo.
- Khóa khung bài học: Mọi trang module bắt buộc dùng `<LabShell>` dùng chung trong `src/components/LabShell.tsx` với 4 slot chuẩn (`leftSlot`, `theorySlot`, `inspectorSlot`, `challengeSlot`). Cấm tự viết lại thanh Header, Sidebar, công tắc Junior/Senior hay khung chia 2 cột trong file module.
- Mọi component mô phỏng đặt trong `src/labs/<course>/<module>/` chỉ quản lý UI hiển thị và gửi action vào `engine.ts`; không chứa logic chấm điểm hay gọi SQLite trực tiếp.
- Bốn trạng thái bắt buộc cho mọi vùng tải dữ liệu: Skeleton đúng kích thước; EmptyState (nêu lý do + 1 hành động); ErrorAlert (giữ dữ liệu cũ nếu có + nút "Thử lại"); có dữ liệu.
- Định dạng: ngày giờ `dd/MM/yyyy HH:mm:ss` (giờ Việt Nam); số dùng `tabular-nums`, căn phải trong bảng; giá trị chưa có hiển thị `"—"`. URL, HTTP Method, Status Code, Header, JSON, SQL dùng `--font-mono`.
- Không dùng emoji, không dùng dấu chấm than trong văn bản giao diện.
- Kiểm tra giao diện bằng Playwright ở 1440×900 và 1366×768 (cả Light và Dark mode), chụp ảnh đính vào báo cáo bước.

## Phong cách: Fluent Compact + Master–Detail

Mọi trang dùng một phong cách thống nhất; không tự sáng tạo style mới.
Ưu tiên khi mâu thuẫn: `designs/tokens.json` / rule này > `task.md` > hướng dẫn trong skill.

### Khung màn hình (không cuộn cả trang)

- Dùng `<AppShell>` trong `src/components/AppShell.tsx`: thanh bên (thu gọn được về chỉ icon + tooltip), thanh trên một dòng (breadcrumb bên trái; công tắc Junior/Senior khi ở trang Lab, nút Cheat Sheet, nút chuyển Sáng/Tối bên phải). Kích thước lấy từ `--size-nav`, `--size-nav-collapsed`, `--size-header`.
- Ở 1366×768 trở lên: trang **KHÔNG cuộn toàn cục** (`document.documentElement.scrollHeight <= innerHeight`, không cuộn ngang). Chỉ từng panel bên trong (Simulator, Tab Lý thuyết, Live Inspector, Danh sách Module) cuộn nội bộ bằng `overflow-y-auto` trong khung `flex-1 min-h-0`.
- Mỗi trang gồm 3 vùng theo thứ tự: Header trang 1 dòng (tiêu đề + mô tả ngắn cùng hàng, hành động chính bên phải) | Command bar (nếu có) | Vùng chính chiếm toàn bộ chiều cao còn lại. Không dùng khối hero lớn.
- Dưới 900px: cho phép cuộn trang, thanh bên chuyển thành ngăn kéo trượt, bố cục chia đôi chuyển sang xếp dọc.

### Mật độ

- Input, Select, Button trong form và thanh lệnh dùng kích thước gọn theo `--size-control` (30px) và `--size-control-sm` (26px).
- Khoảng cách nội bộ panel: `var(--space-8)` đến `var(--space-12)`; không dùng padding/gap quá rộng làm lãng phí không gian ở 1366×768.
- Danh sách nhiều mục (khóa học, danh sách module, bảng tra cứu HTTP Status/Methods, lịch sử chạy): ưu tiên bảng gọn có vạch ngăn mảnh (`--line`), không dàn trải lưới card lớn thiếu thông tin.

### Mẫu bố cục

- **Màn hình Lab (Split-Screen):** Trái = Khung mô phỏng tương tác + bảng kịch bản (`flex` linh hoạt hoặc cố định tỷ lệ 42%); Phải = Panel 3 Tab (Lý thuyết | Live Inspector | Thử thách) nền phụ, viền trái, cuộn độc lập.
- **Màn hình Danh sách / Quản trị khóa học:** Master–Detail hoặc bảng gọn kèm command bar (tìm kiếm, lọc trạng thái, tiến độ).
- **Modal:** Chỉ dùng cho Cheat Sheet tra cứu nhanh, xác nhận đặt lại tiến độ (Reset Progress) hoặc thông báo ngắn; không dùng Modal cho form dài.

### Hình thức

- Bề mặt dùng `var(--surface)` / `var(--surface-2)`, viền mảnh `1px solid var(--line)`, bo góc `var(--radius-card)` (6px) và `var(--radius-control)` (4px). Không gradient, không bo góc lớn, không hiệu ứng trang trí rườm rà.
- Icon dùng duy nhất `lucide-react` nét chuẩn 16px, `currentColor`.
- Màu sắc chỉ dùng cho nút chính (`--primary`), trạng thái focus, mục menu đang chọn và nhãn trạng thái (`ok`, `crit`, `warn`, `info`, `purple`, `off`) — luôn kèm icon và chữ.
- Hỗ trợ Sáng/Tối qua thuộc tính `data-theme="dark"` trên thẻ `<html>`.

### Tương tác và truy cập

- Mọi control có `<label>` hoặc `aria-label`; nút chỉ có icon phải có `aria-label` và tooltip; viền focus 2px rõ ràng (`--focus`).
- Tôn trọng `prefers-reduced-motion`; chuyển động giữ gọn trong `--motion-fast` (150ms).
- Kết quả mô phỏng, thông báo Pass/Fail của Challenge đặt trong vùng `aria-live="polite"`.

### Nghiệm thu giao diện

- Playwright E2E ở 1366×768 và 1440×900: `document.documentElement.scrollHeight <= window.innerHeight` và không cuộn ngang trên mọi trang trong task (kiểm tra ở cả chế độ Junior và Senior).
- Báo cáo bước liệt kê ngắn các thay đổi UI và đính kèm ảnh chụp.
