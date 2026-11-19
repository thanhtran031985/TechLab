# TechLab — Hướng dẫn cho agent (Antigravity)

File này luôn được nạp. Quy tắc theo vùng code ở `.agents/rules/` (tự nạp theo glob), quy trình lặp lại ở `.agents/skills/`.

## Dự án
TechLab là nền tảng web học tập kỹ thuật phần mềm tương tác theo mô hình **Content-as-Code**, chuyển hóa kiến thức từ các video chuyên sâu (như kênh System Design Lab) thành các **Interactive Sandbox**.

Mỗi chủ đề (**Course**) gồm nhiều **Module** độc lập. Mỗi Module vận hành theo mô hình **Split-Screen**:
- **Bên trái:** Ứng dụng hoặc hệ thống mô phỏng tương tác trực tiếp (ví dụ: JaneGram Mobile, Dual-Version App, Server Pipeline).
- **Bên phải:** 3 Tab chuẩn hóa gồm: (1) Kiến thức cốt lõi & sơ đồ trực quan, (2) Live Inspector & Network/System Visualizer, (3) Nhiệm vụ thực hành (Challenge) tự động chấm điểm.
- **Công tắc trung tâm:** Chuyển đổi tức thì giữa chế độ **Junior (First-Try — cố tình tái hiện lỗi thực tế)** và **Senior (Chuẩn Hệ Thống)**.

Phạm vi hiện tại:
- **Chưa cần đăng nhập và phân quyền** (để giai đoạn sau). Schema SQLite vẫn dự phòng cột `user_id` mặc định `'local'` để mở rộng không phải phá vỡ cấu trúc bảng.
- **Content-as-Code:** Kiến thức, cấu hình khóa học và bộ test Challenge lưu dạng file (`MDX` + `JSON`) trong repo, đồng bộ metadata vào SQLite bằng script.
- Tài liệu: `docs/PRD.md`, `docs/courses/<course-slug>/curriculum.md` (bản đồ kiến thức kèm timestamp YouTube), `docs/DESIGN_SYSTEM.md`, `designs/` (CHỈ ĐỌC).

## Môi trường
- Máy dev: **Windows**, chạy trực tiếp Node.js LTS (không Docker).
- Trình quản lý gói và lệnh: **pnpm** (`pnpm <script>` khai báo trong `package.json`), chạy được trên Windows PowerShell và Linux.
- Đường dẫn trong script/code dùng `node:path`, không hardcode `/` hay `\`.
- Mọi script tự động hóa viết bằng TypeScript chạy qua `tsx`.

## Stack (thuần TypeScript)
- **Framework & UI:** Next.js (App Router), React 19, TypeScript (`strict`), Tailwind CSS (ánh xạ trực tiếp CSS variables từ `designs/tokens.css`), `lucide-react` (icon nét 16px).
- **Nội dung:** MDX (`@next/mdx` hoặc `next-mdx-remote`) + JSON metadata, validate bằng **Zod**.
- **CSDL & Migration:** **SQLite** (`data/techlab.db`, chế độ WAL) qua `better-sqlite3`, **Drizzle ORM** và `drizzle-kit`.
- **Kiểm thử & Chất lượng mã:** Unit/Integration test bằng **Vitest**, E2E và kiểm tra giao diện bằng **Playwright**, lint/format bằng **ESLint + Prettier** (hoặc Biome), kiểm tra kiểu bằng `tsc --noEmit`.

## Cấu trúc mã
```text
src/
  app/                 Next.js App Router: layout.tsx, page.tsx, courses/[course]/[module]/, api/health, api/progress, api/notes, api/sandbox/*
  components/          Khung dùng chung: AppShell, LabShell, ModeToggle, InspectorPanel, ChallengePanel, CheatSheetModal, EmptyState, ErrorAlert
  labs/                Component mô phỏng riêng của từng khóa học/module: <course>/<module>/Simulator.tsx, engine.ts
  engine/              Hàm thuần lõi: protocol simulators, grading engine, types
  db/                  Drizzle ORM: schema.ts (nguồn sự thật), client.ts (PRAGMA WAL), seed.ts
  schemas/             Zod schemas cho course.json, module metadata, API request/response
  lib/                 Tiện ích chung: format ngày/số, path helpers, logger
content/
  courses/<slug>/      course.json, modules/<NN-slug>.mdx, challenges/<NN-slug>.json
sources/               Transcript, ghi chú gốc từ YouTube (CHỈ ĐỌC)
designs/               tokens.json, tokens.css, reference/ (CHỈ ĐỌC)
drizzle/               SQL migrations sinh bởi drizzle-kit
scripts/               gen-tokens.ts, sync-courses.ts, tasks-dashboard.ts
docs/                  PRD.md, DESIGN_SYSTEM.md, courses/<slug>/curriculum.md, tasks/
tests/                 unit/, integration/, e2e/ (__screens__/)
data/                  techlab.db (gitignore)
```

## Cấu trúc task
`docs/tasks/README.md` là bảng tổng (cột `#`, `Task`, `Trạng thái`, `Phụ thuộc`, `Nhánh git`). Mỗi task `docs/tasks/NN-slug/` có `task.md` (yêu cầu, KHÔNG tự sửa), `progress.md` (agent cập nhật sau mỗi bước), `plan.md` (kế hoạch đã duyệt), `decisions.md`, `checklist.md` (ghi và cập nhật test case), `_archive/`. Nhánh `feat/NN-slug`. `docs/tasks/dashboard.html` sinh bởi `pnpm tasks:dashboard`, không sửa tay.
Trạng thái: ⬜ chưa làm · 🔄 đang làm · ❓ có code chưa rà soát · ⚠️ khác task.md · ❌ thiếu · ✅ xong.

## Quy trình khi làm một task (chi tiết: skill `lam-task`)
- Mở phiên mới hoặc sau khi ngữ cảnh bị nén: đọc `docs/tasks/README.md` → `task.md` → `progress.md` → `decisions.md`, tiếp tục từ bước dở, không làm lại bước ✅.
- Luôn lập **Implementation Plan** trước. Khi được duyệt: chép nguyên văn vào `plan.md`, tạo nhánh `feat/NN-slug`, đổi trạng thái 🔄.
- Làm đúng thứ tự các bước trong `task.md`. Viết test hành vi trước (thấy đỏ) rồi code cho xanh.
- Sau MỖI bước: chạy phần "Kiểm tra"; cập nhật `progress.md`; chạy `pnpm tasks:dashboard`; báo cáo ngắn; đề xuất commit `NN-slug: step N — <mô tả>`; **DỪNG** chờ `"continue"`. Chỉ commit khi được đồng ý.
- Khác `task.md`/spec/thiết kế: ghi `decisions.md`. Mơ hồ hoặc mâu thuẫn: DỪNG và hỏi. Chi tiết nhỏ: tự suy ra từ spec, báo đã suy ra gì.
- Không cài package ngoài danh sách Stack khi chưa hỏi.
- Xong task: chạy skill `dong-task`, đổi trạng thái ✅ trong `docs/tasks/README.md`.

## Quy tắc code (mọi task)
- Logic mô phỏng và chấm điểm Challenge chỉ nằm ở `src/engine/` và `src/labs/<course>/<module>/engine.ts` dưới dạng hàm thuần; UI component chỉ nhận state và dispatch action.
- API Route (`src/app/api/**`) bắt buộc validate input bằng Zod, trả cấu trúc thống nhất `{ ok: true, data }` hoặc `{ ok: false, code, message, details }`; `message` tiếng Việt có dấu. Không để stack trace lọt ra giao diện.
- Truy cập SQLite chỉ qua Drizzle ORM trong `src/db/`. Thay đổi bảng chỉ qua migration sinh bởi `drizzle-kit`.
- Chỉ dùng design token từ `designs/tokens.css` (ánh xạ qua Tailwind theme); không hardcode hex/px trong page hoặc component.
- Mọi bài học (Module) bắt buộc dùng khung `<LabShell>` chung; không tự tạo lại header, sidebar hay bố cục 2 cột riêng lẻ.
- Chỉ sửa trong phạm vi task. Không thêm tính năng ngoài `task.md`.
- Trước khi báo xong: `pnpm typecheck`, `pnpm lint`, `pnpm test` xanh; task có giao diện chạy thêm `pnpm test:e2e`.

## Quy tắc đồng bộ Course Registry & Nội dung
Khi task thêm/xóa/sửa khóa học, module hoặc challenge trong `content/courses/`:
1. Đảm bảo `docs/courses/<slug>/curriculum.md` đã liệt kê đủ khái niệm kèm mốc thời gian `[HH:MM:SS]` từ `sources/`.
2. Chạy `pnpm courses:sync` để validate bằng Zod và đồng bộ metadata vào SQLite (`courses`, `modules`, `challenges`).
3. Chạy `pnpm courses:sync --check` đảm bảo không lệch giữa file Content-as-Code và DB/registry.
4. Chạy `pnpm test:e2e` xác nhận trang module mở không lỗi console, hiển thị lý thuyết ngay, chuyển đổi Junior/Senior hoạt động và không cuộn toàn cục ở 1366×768 và 1440×900.

## Quy tắc sư phạm & Sandbox cốt lõi
- **Bám sát nguồn 100%:** Không bỏ sót khái niệm quan trọng trong video nguồn; mọi mục lý thuyết lớn đều gắn mốc `[HH:MM:SS]` để đối chiếu.
- **Junior vs Senior trực quan:** Mọi bài Lab phải cho phép người học tự thao tác để chứng kiến lỗi thực tế xảy ra ở chế độ Junior, sau đó gạt sang Senior để thấy chính thao tác đó chạy chuẩn kèm giải thích nguyên nhân.
- **Chấm điểm thực chất:** Challenge chỉ Pass khi trace/state thực tế từ engine thỏa mãn điều kiện kiểm chứng, không chấm điểm giả bằng nút "Đánh dấu hoàn thành".

## Giao diện (chi tiết: rule `ui-web`)
Máy tính trước (1440×900, dùng tốt ở 1366×768), không cuộn cả trang. Tiếng Việt có dấu, viết hoa kiểu câu; giữ thuật ngữ kỹ thuật tiếng Anh chuẩn (API, REST, Idempotency, Cursor Pagination, ETag, Breaking Change, JWT, BOLA, Rate Limit, GraphQL, gRPC...). Không emoji, không dấu chấm than. Màu trạng thái luôn kèm icon Lucide và chữ. Mỗi vùng dữ liệu có 4 trạng thái: đang tải (skeleton), trống, lỗi (giữ dữ liệu cũ + Thử lại), có dữ liệu. Mã code, URL, JSON, HTTP Header, SQL dùng font mono.

Phong cách: **Fluent Compact + Master–Detail** (mặt sáng mặc định, hỗ trợ chuyển Sáng/Tối qua `[data-theme="dark"]`).

## Bảo mật môi trường
KHÔNG đọc `.env` (biến nằm trong `.env.example`; cần biến mới thì thêm vào đó và báo người dùng điền). Không đưa secret vào biến `NEXT_PUBLIC_*`. Các bài Lab về bảo mật (SQL Injection, XSS, BOLA) chỉ chạy trên engine giả lập trong bộ nhớ, tuyệt đối không chạy truy vấn thô từ input người học lên `data/techlab.db`.

## Lệnh (`pnpm <tên>`)
- `dev` (chạy Next.js dev server cổng 3000), `build`, `start`.
- `db:generate` (sinh migration Drizzle), `db:migrate` (chạy migration SQLite), `db:studio`.
- `courses:sync` (validate và đồng bộ `content/courses/` vào SQLite), `courses:sync:check`.
- `tokens:gen` (sinh `designs/tokens.css` và `docs/DESIGN_SYSTEM.md` từ `designs/tokens.json`).
- `typecheck` (`tsc --noEmit`), `lint`, `format`, `test` (Vitest), `test:e2e` (Playwright), `security:check`, `tasks:dashboard`.
