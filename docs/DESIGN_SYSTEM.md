# Hệ thống Thiết kế TechLab (Design System)

_Tự động sinh từ `designs/tokens.json` qua lệnh `pnpm tokens:gen`. Không sửa file này bằng tay._

## 1. Nguyên tắc cốt lõi (Fluent Compact + Master–Detail)
- **Màn hình lớn trước:** Tối ưu chuẩn 1440×900, hiển thị tốt ở 1366×768.
- **Không cuộn toàn cục:** Ở độ phân giải ≥ 1366×768, `document.documentElement.scrollHeight <= innerHeight`. Cuộn xảy ra nội bộ trong từng panel (`flex-1 min-h-0 overflow-y-auto`).
- **Mặt sáng mặc định:** Nền `#F5F5F5`, bề mặt panel `#FFFFFF`, viền mảnh 1px.
- **Dark Mode:** Điều khiển bằng thuộc tính `data-theme="dark"` trên thẻ `<html>`.
- **Icon chuẩn:** Dùng duy nhất `lucide-react` kích thước nét 16px.

## 2. Bảng Màu (Colors)
| Token | Light Mode | Dark Mode | Mục đích |
|---|---|---|---|
| `--bg` | `#F5F5F5` | `#1F1F1F` | Nền vùng nội dung. |
| `--surface` | `#FFFFFF` | `#292929` | Mặt panel, bảng, ô nhập, thanh trên, ngăn kéo. |
| `--surface-2` | `#FAFAFA` | `#2E2E2E` | Tiêu đề bảng, hover dòng, panel Inspector, khối phụ. |
| `--line` | `#E0E0E0` | `#3D3D3D` | Viền panel, chia dòng bảng. |
| `--line-strong` | `#707070` | `#959595` | Viền dưới ô nhập, nút phụ (>= 4.5:1). |
| `--ink` | `#242424` | `#F0F0F0` | Chữ chính. |
| `--ink-soft` | `#616161` | `#ADADAD` | Chữ phụ, nhãn cột, mốc thời gian. |
| `--primary` | `#0F6CBD` | `#479EF5` | Nút chính, link, bước/tab đang chọn. |
| `--primary-hover` | `#115EA3` | `#62ABF5` | Hover nút chính. |
| `--on-primary` | `#FFFFFF` | `#0A0A0A` | Chữ trên primary. |
| `--primary-soft` | `#EBF3FC` | `#0F2C48` | Nền mục/bước/dòng đang chọn, chip phương thức GET. |
| `--focus` | `#0F6CBD` | `#62ABF5` | Viền focus 2px. |
| `--nav-bg` | `#FFFFFF` | `#292929` | Nền thanh bên (Fluent: sáng, viền phải). |
| `--nav-ink` | `#242424` | `#F0F0F0` | Chữ menu. |
| `--nav-active` | `#EBF3FC` | `#0F2C48` | Mục menu đang chọn. |
| `--nav-accent` | `#0F6CBD` | `#479EF5` | Vạch trái mục đang chọn. |
| `--ok` | `#107C10` | `#54B054` | Senior Mode, Challenge đạt, HTTP 2xx. |
| `--ok-soft` | `#F1FAF1` | `#0D2E0D` | Nền chip ok. |
| `--crit` | `#C50F1F` | `#F1707B` | Lỗi mô phỏng, HTTP 4xx/5xx, DELETE, cảnh báo bảo mật. |
| `--crit-soft` | `#FDF3F4` | `#3B1418` | Nền lỗi, cảnh báo lỗ hổng. |
| `--warn` | `#BC4B09` | `#F7A46B` | Junior (First-Try) Mode, PUT/PATCH, cảnh báo hiệu năng. |
| `--warn-soft` | `#FFF9F5` | `#3A2210` | Nền cảnh báo Junior. |
| `--purple` | `#5C2E91` | `#C4B5FD` | GraphQL, gRPC, thẻ nâng cao. |
| `--purple-soft` | `#F7F4FB` | `#2A1F4D` | Nền chip purple. |
| `--off` | `#616161` | `#ADADAD` | Chưa bắt đầu, đã khai tử (Deprecated). |
| `--off-soft` | `#F0F0F0` | `#333333` | Nền chip off. |
| `--info` | `#0F6CBD` | `#62ABF5` | Đang học, thông tin gói tin, HTTP 1xx/3xx. |
| `--info-soft` | `#EBF3FC` | `#0F2C48` | Nền thông tin. |
| `--code-bg` | `#1E1E1E` | `#141414` | Nền khối mã, Raw HTTP Inspector. |
| `--code-ink` | `#D4D4D4` | `#D4D4D4` | Chữ khối mã, Raw HTTP Inspector. |

## 3. Kiểu Chữ (Typography)
- Phông giao diện: `--font-ui` ("Segoe UI", "Segoe UI Web", Roboto, Arial, sans-serif)
- Phông mã nguồn / HTTP / JSON: `--font-mono` (Consolas, "Cascadia Mono", ui-monospace, monospace)

| Cấp bậc | Cỡ (Size) | Độ cao dòng (Line) | Độ đậm (Weight) |
|---|---|---|---|
| `screen-title` | 18 | 1.3 | 600 |
| `section-title` | 14 | 1.4 | 600 |
| `kpi-figure` | 20 | 1.2 | 600 |
| `body` | 13 | 1.45 | 400 |
| `body-sm` | 12 | 1.4 | 400 |
| `label` | 12 | 1.4 | 600 |
| `button` | 13 | 1.2 | 600 |
| `chip` | 11 | 1.4 | 600 |
| `caption` | 11 | 1.4 | 600 |
| `code` | 12 | 1.5 | 400 |

## 4. Kích thước chuẩn (Layout & Controls)
| Hạng mục | Token | Giá trị |
|---|---|---|
| Thanh bên (Sidebar mở rộng) | `--size-nav` | 200px |
| Thanh bên (Sidebar thu gọn) | `--size-nav-collapsed` | 48px |
| Thanh trên (Header 1 dòng) | `--size-header` | 44px |
| Control tiêu chuẩn (Input, Button) | `--size-control` | 30px |
| Control nhỏ gọn | `--size-control-sm` | 26px |
| Ngăn kéo Ghi chú | `--size-drawer` | 480px |
| Panel Chi tiết (Master–Detail) | `--size-detail-panel` | 320px |
| Command bar | `--size-commandbar` | 40px |
