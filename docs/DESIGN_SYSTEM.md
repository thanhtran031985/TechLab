# Hệ thống Thiết kế TechLab (Design System)

_Tự động sinh từ `designs/tokens.json` qua lệnh `pnpm tokens:gen`. Không sửa file này bằng tay._

## 1. Nguyên tắc cốt lõi (Senior API Lab Dark Studio)
- **Màn hình lớn trước:** Tối ưu chuẩn 1440×900, hiển thị tốt ở 1366×768.
- **Không cuộn toàn cục:** Ở độ phân giải ≥ 1366×768, `document.documentElement.scrollHeight <= innerHeight`. Cuộn xảy ra nội bộ trong từng panel (`flex-1 min-h-0 overflow-y-auto`).
- **Nền Dark Studio:** Slate-950 (`#020617`), Emerald/Teal (`#10b981`) cho Senior & bài đang học, Amber (`#f59e0b`) cho Junior (First-Try), Rose (`#fb7185`) cho cảnh báo lỗi.
- **Icon chuẩn:** Dùng duy nhất `lucide-react` kích thước nét 16px.

## 2. Bảng Màu (Colors)
| Token | Giá trị |
|---|---|
| `--bg` | `#020617` |
| `--surface` | `#0b1120` |
| `--surface-2` | `#0f172a` |
| `--surface-3` | `#1e293b` |
| `--line` | `#1e293b` |
| `--line-strong` | `#334155` |
| `--ink` | `#f1f5f9` |
| `--ink-soft` | `#94a3b8` |
| `--ink-muted` | `#64748b` |
| `--primary` | `#10b981` |
| `--primary-hover` | `#059669` |
| `--primary-soft` | `rgba(16, 185, 129, 0.14)` |
| `--accent-teal` | `#14b8a6` |
| `--junior` | `#f59e0b` |
| `--junior-ink` | `#020617` |
| `--junior-soft` | `rgba(245, 158, 11, 0.16)` |
| `--senior` | `#10b981` |
| `--senior-ink` | `#020617` |
| `--senior-soft` | `rgba(16, 185, 129, 0.16)` |
| `--info` | `#38bdf8` |
| `--info-soft` | `rgba(56, 189, 248, 0.14)` |
| `--purple` | `#c084fc` |
| `--purple-soft` | `rgba(192, 132, 252, 0.15)` |
| `--pink` | `#f472b6` |
| `--pink-soft` | `rgba(244, 114, 182, 0.15)` |
| `--crit` | `#fb7185` |
| `--crit-soft` | `rgba(244, 63, 94, 0.16)` |
| `--code-bg` | `#060b16` |
| `--code-ink` | `#e2e8f0` |

## 3. Kiểu Chữ (Typography)
- Phông giao diện: `--font-ui` ("Segoe UI", "Inter", system-ui, -apple-system, Roboto, sans-serif)
- Phông mã nguồn / HTTP / JSON: `--font-mono` ("JetBrains Mono", "Cascadia Mono", Consolas, ui-monospace, monospace)

## 4. Kích thước chuẩn (Layout & Controls)
| Hạng mục | Token | Giá trị |
|---|---|---|
| Header cao | `--header-h` | 56px |
| Sidebar rộng | `--sidebar-w` | 248px |
| Simulator min width | `--sim-min-w` | 360px |
