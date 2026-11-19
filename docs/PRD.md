# Đặc tả chức năng: TechLab – Nền tảng học tập kỹ thuật phần mềm tương tác

_Phiên bản 1.0, 19/11/2026. Tài liệu đặc tả theo màn hình và nghiệp vụ sư phạm cho TechLab. Khi có mâu thuẫn về hiển thị, `designs/tokens.json` và `.agents/rules/ui-web.md` là gốc._

**Quyết định đã chốt (19/11/2026):**
- **Mô hình nội dung (Content-as-Code):** Kiến thức khóa học, bài học lý thuyết (`MDX`), và đặc tả thử thách (`JSON`) lưu trực tiếp trong thư mục `content/courses/` của repo; đồng bộ metadata vào SQLite bằng lệnh `pnpm courses:sync`.
- **Kiến trúc kỹ thuật (Thuần TypeScript):** Next.js (App Router), React 19, TypeScript (`strict`), Tailwind CSS (ánh xạ token từ `designs/tokens.css`), `lucide-react`, Zod, Drizzle ORM, SQLite (`better-sqlite3`, WAL). Không Docker: dev trực tiếp trên Windows bằng `pnpm`.
- **Phạm vi người dùng:** Chưa triển khai đăng nhập và phân quyền ở giai đoạn đầu (dùng cá nhân trên máy). Toàn bộ bảng tiến độ/ghi chú trong SQLite đều dự phòng cột `user_id` mặc định `'local'` để mở rộng Auth về sau.
- **Khóa giao diện đa module:** Mọi bài học thuộc mọi khóa học dùng chung một khung `<LabShell>` (Split-Screen) và bảng token Fluent Compact + Master–Detail (mặt sáng mặc định, hỗ trợ Dark Mode qua `[data-theme="dark"]`).
- **Tách biệt mô phỏng và hệ thống thật:** Engine mô phỏng giao thức và chấm điểm Challenge là hàm thuần (pure function) trong `src/engine/` và `src/labs/`. Các bài Lab bảo mật (SQLi, XSS, BOLA, Mass Assignment) chạy hoàn toàn trên trạng thái giả lập trong bộ nhớ, tuyệt đối không chạm vào DB thật.

**Ký hiệu giai đoạn:** `[GĐ0]` Nền tảng repo & khung UI; `[GĐ1]` Khóa học đầu tiên (REST API Design — 10 Module); `[GĐ2]` Ghi chú, lịch sử chạy & mở rộng khóa học mới; `[GĐ3]` Đăng nhập, đa người dùng & đồng bộ triển khai.

---

## Phần A. Tổng quan sản phẩm

### A1. Sản phẩm làm gì
Người học kỹ thuật phần mềm thường xem các video chuyên sâu dài 2–3 giờ (như kênh *System Design Lab*) nhưng khó ghi nhớ lý do đằng sau từng quy tắc kiến trúc nếu chỉ đọc tài liệu thụ động. TechLab chuyển hóa nội dung từng video thành chuỗi **Interactive Sandbox**:
1. Người học thao tác trực tiếp trên một ứng dụng/hệ thống mô phỏng (ví dụ: ứng dụng chia sẻ ảnh JaneGram, hệ thống 2 phiên bản API v1/v2, đường ống 3 tầng server).
2. Quan sát ngay lập tức gói tin HTTP thô, đường đi mạng, truy vấn DB và phân tích nguyên nhân ở **Live Inspector**.
3. Gạt công tắc **Junior (First-Try)** vs **Senior (Chuẩn Hệ Thống)** để tự chứng kiến lỗi thực tế xảy ra và thấy chính thao tác đó chạy chuẩn khi áp dụng đúng quy tắc.
4. Hoàn thành các **Challenge** tự động chấm điểm từ trace thực tế và lưu tiến độ vào SQLite.

**Ngoài phạm vi hiện tại:** Đăng nhập/RBAC (để GĐ3); trình soạn thảo CMS tạo khóa học trên web; tự động tải/cào video YouTube; chạy container Docker cho từng bài học; lưu trữ đám mây đa người dùng.

---

## Phần B. Yêu cầu chung về giao diện

| Hạng mục | Yêu cầu |
|---|---|
| Bố cục | Máy tính trước, chuẩn 1440×900, dùng tốt ở 1366×768. Ở ≥ 1366×768 **không cuộn toàn cục** (`scrollHeight <= innerHeight`); chỉ cuộn nội bộ trong từng panel. Thanh bên 200px (thu gọn 48px), thanh trên 44px. |
| Phong cách | Fluent Compact + Master–Detail. Mặt sáng mặc định (`#F5F5F5` / `#FFFFFF`), hỗ trợ Dark Mode (`[data-theme="dark"]`). Viền mảnh `1px`, không gradient, không bóng lớn, không khối hero lớn. |
| Chữ | Segoe UI / Roboto (`--font-ui`), thân 13px; số liệu `tabular-nums` căn phải; URL, HTTP Method, Status Code, Header, JSON, SQL dùng `--font-mono` (12px). |
| Bốn trạng thái | Bình thường; Đang tải (Skeleton đúng kích thước); Trống (lý do + 1 hành động); Lỗi (Alert giữ dữ liệu cũ + nút Thử lại). |
| Lời văn | Tiếng Việt có dấu, viết hoa kiểu câu. Giữ nguyên thuật ngữ kỹ thuật chuẩn tiếng Anh (API, REST, Idempotency, ETag, Cursor Pagination, Breaking Change, JWT, OAuth, BOLA, Rate Limit, GraphQL, gRPC). Không emoji, không dấu chấm than. |
| Biểu tượng & Màu | Icon nét `lucide-react` 16px. Trạng thái (`Đạt`, `Chưa đạt`, `Lỗi Junior`, `Chuẩn Senior`, `Đang học`, `Chưa bắt đầu`) luôn đi kèm màu + icon + chữ. |
| Thao tác xóa/reset | Đặt lại tiến độ học tập luôn có hộp thoại nêu rõ sẽ xóa gì, giữ lại gì; xóa toàn bộ tiến độ khóa học yêu cầu gõ `XOA`. |

---

## Phần C. Màn hình và sơ đồ điều hướng

### Sơ đồ điều hướng
```text
/ (Tổng quan khóa học)
 ├─ /courses/[course] (Bản đồ Module của khóa học — Master–Detail)
 │   └─ /courses/[course]/[module] (Màn hình Lab tương tác — LabShell Split-Screen)
 │       ├─ Ngăn kéo Ghi chú cá nhân (Notes Drawer)
 │       └─ Hộp thoại Cheat Sheet (Tra cứu nhanh)
 └─ /progress (Lịch sử chạy Sandbox & Quản lý tiến độ)
```

### C1. Tổng quan khóa học (`/`) `[GĐ0 khung, GĐ1 dữ liệu]`
- **Header 1 dòng:** Tiêu đề "Danh sách khóa học" + mô tả ngắn; nút "Tiếp tục bài gần nhất" bên phải.
- **Hàng chỉ số gọn (4 KPI):** Tổng số khóa học, Tổng số module đã hoàn thành, Số Challenge đã đạt (`X / Y`), Số ghi chú đã lưu.
- **Command bar:** Ô tìm kiếm khóa học, bộ lọc trạng thái (`Tất cả`, `Đang học`, `Hoàn thành`, `Chưa bắt đầu`).
- **Bảng khóa học (không dùng lưới card lớn):** Tên khóa học, Nguồn video, Số module, Tiến độ Challenge (`tabular-nums`), Trạng thái (chip có icon), Lần học gần nhất, Hành động (`Mở khóa học`).

### C2. Bản đồ khóa học (`/courses/[course]`) `[GĐ1]`
- Bố cục **Master–Detail**:
  - **Trái (flex 1):** Bảng danh sách toàn bộ Module theo đúng trình tự video: STT, Tên module, Mốc video (`[HH:MM:SS]`), Tiến độ Challenge (`0/3`), Trạng thái.
  - **Phải (panel cố định `320px`, cuộn độc lập):** Chi tiết module đang chọn gồm mục tiêu học tập, danh sách khái niệm cốt lõi, tóm tắt kịch bản Junior vs Senior, và nút chính **"Vào phòng Lab"**.

### C3. Màn hình Lab tương tác (`/courses/[course]/[module]`) `[GĐ0 khung LabShell, GĐ1 các module]`
Dùng chung 100% component `<LabShell>`:
- **Command bar (40px):**
  - Trái: Bộ chọn nhanh Module (Select chuyển giữa các module trong khóa) + Mốc thời gian video tham chiếu.
  - Giữa: **Công tắc chế độ trung tâm (`ModeToggle`)** chuyển giữa `Junior (First-Try)` (tone `warn`) và `Senior (Chuẩn Hệ Thống)` (tone `ok`).
  - Phải: Nút `Đặt lại mô phỏng`, nút `Ghi chú` (mở Drawer), nút `Cheat Sheet` (mở Modal).
- **Vùng chính Split-Screen (`flex-1 min-h-0`):**
  - **Cột Trái (Simulator Panel, ~42%, cuộn độc lập):** Ứng dụng/hệ thống mô phỏng tương tác thật (ví dụ khung điện thoại JaneGram, hai màn hình App v1/v2, sơ đồ 3 tầng server) kèm bảng nút kích hoạt kịch bản (Scenario Controls).
  - **Cột Phải (Workbench Panel, ~58%, 3 Tab chuẩn hóa, cuộn độc lập):**
    1. **Tab 1 — Kiến thức cốt lõi:** Render nội dung từ file `MDX` (hiển thị tĩnh ngay khi mở trang), gồm giải thích khái niệm, mốc `[HH:MM:SS]`, sơ đồ/công cụ giải phẫu tương tác, bảng so sánh Junior vs Senior.
    2. **Tab 2 — Live Inspector:** Thanh hành trình gói tin / tầng xử lý (tô sáng từng bước), Raw HTTP Request & Response (font mono, nền `--code-bg`), bảng tùy chỉnh request thủ công (Playground) nếu module hỗ trợ, và hộp phân tích "Chuyện gì vừa xảy ra".
    3. **Tab 3 — Thử thách thực hành:** Danh sách Challenge của module kèm trạng thái `Đạt` / `Chưa đạt`, điều kiện kiểm chứng thực tế, nút xem gợi ý, và phản hồi trực tiếp (`aria-live="polite"`) khi thao tác bên trái đạt yêu cầu.

### C4. Ngăn kéo Ghi chú (`NotesDrawer`, 480px) `[GĐ2]`
- Mở từ nút `Ghi chú` trong Command bar của Lab.
- Cho phép tạo, sửa, xóa ghi chú gắn với `course_slug`, `module_slug` và mốc thời gian video (`[HH:MM:SS]`). Lưu trực tiếp vào bảng `user_notes` trong SQLite.

### C5. Hộp thoại Tra cứu nhanh (`CheatSheetModal`) `[GĐ1]`
- Tra cứu nhanh dạng bảng gọn có tab: (1) 10 HTTP Methods & thuộc tính Safe/Idempotent, (2) HTTP Status Codes 1xx–5xx, (3) Ma trận chọn REST vs GraphQL vs gRPC & các Header chuẩn.

### C6. Tiến độ & Lịch sử Sandbox (`/progress`) `[GĐ2]`
- Bảng lịch sử các lần chạy mô phỏng gần nhất (`sandbox_runs`): Thời gian, Khóa học, Module, Chế độ (`Junior`/`Senior`), Hành động, HTTP Status, Kết quả phân tích.
- Khu vực quản lý dữ liệu học tập: Đặt lại tiến độ theo từng khóa học hoặc toàn bộ (Modal xác nhận gõ `XOA`).

---

## Phần D. Quy tắc nghiệp vụ & sư phạm

- **D1. Content-as-Code là nguồn sự thật nội dung:** Mọi khóa học và module khai báo tại `content/courses/<course-slug>/`. Script `pnpm courses:sync` validate toàn bộ JSON/MDX bằng Zod trước khi upsert vào SQLite. Không chỉnh sửa nội dung bài học trực tiếp trong DB.
- **D2. Bảo toàn tiến độ người học:** Khi chạy `pnpm courses:sync` để cập nhật lý thuyết hoặc thêm module mới, tuyệt đối không xóa dữ liệu trong `challenge_progress` và `user_notes`.
- **D3. Tách biệt Engine thuần:** Mọi module đặt logic tại `src/labs/<course>/<module>/engine.ts`. Hàm xử lý nhận `(state, action, mode)` và trả về đối tượng bất biến gồm `nextState`, `trace` (request, response, hops, layers), `analysis`, và `challengeEvaluations`.
- **D4. Chấm điểm Challenge tự động:** Khi `challengeEvaluations` báo một Challenge đạt chuẩn, client gọi `POST /api/progress` để ghi nhận trạng thái `PASSED` và `passed_at` (UTC) vào SQLite.
- **D5. Cách ly Lab bảo mật:** Các thao tác tấn công mô phỏng (SQLi, XSS, BOLA, Mass Assignment, JWT tampering) chỉ thực thi trên dữ liệu mảng/object trong bộ nhớ của `engine.ts`; không bao giờ chạy câu lệnh thô lên `data/techlab.db`.

---

## Phần E. Dữ liệu SQLite (`data/techlab.db`)

Chế độ kết nối bắt buộc: `journal_mode=WAL`, `foreign_keys=ON`, `busy_timeout=30000`, `synchronous=NORMAL`, `auto_vacuum=INCREMENTAL`.

| Bảng | Mục đích | Cột chính |
|---|---|---|
| `courses` | Danh mục khóa học đồng bộ từ `content/courses/` | `slug` (PK), `title`, `description`, `source_url`, `channel_name`, `module_count`, `updated_at` |
| `modules` | Danh mục module theo khóa học | `id` (PK, `<course>/<module>`), `course_slug` (FK), `slug`, `order_index`, `title`, `video_timestamp`, `challenge_count`, `updated_at` |
| `challenges` | Danh mục thử thách của từng module | `id` (PK), `module_id` (FK), `order_index`, `title`, `description`, `mode_required` (`junior`/`senior`/`both`) |
| `challenge_progress` | Tiến độ hoàn thành thử thách của người học | `id` (PK), `user_id` (`DEFAULT 'local'`), `challenge_id` (FK), `status` (`NOT_STARTED`/`PASSED`), `attempts`, `passed_at`, `updated_at` |
| `user_notes` | Ghi chú cá nhân gắn theo module và mốc video | `id` (PK), `user_id` (`DEFAULT 'local'`), `module_id` (FK), `video_timestamp`, `content`, `created_at`, `updated_at` |
| `sandbox_runs` | Lịch sử các lần chạy mô phỏng gần đây | `id` (PK), `user_id` (`DEFAULT 'local'`), `module_id` (FK), `mode`, `action_name`, `http_method`, `http_path`, `http_status`, `summary`, `created_at` |

---

## Phần F. Công nghệ và quy trình

- Xem chi tiết trong `AGENTS.md`, `.agents/rules/` (`ui-web`, `database`, `engine`, `security`) và `.agents/skills/` (`lam-task`, `tao-task`, `dong-task`, `ra-soat-ui`, `phan-tich-nguon`, `tao-module-lab`).
- **Definition of Done (mọi task):** TDD (viết test trước khi code); `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm security:check` xanh; task có nội dung khóa học chạy `pnpm courses:sync --check` xanh; task có giao diện chạy Playwright E2E ở 1366×768 và 1440×900 (Light & Dark, không cuộn toàn cục) kèm ảnh chụp.

---

## Phần G. Giai đoạn xây dựng

| GĐ | Task dự kiến | Kết quả đạt được |
|---|---|---|
| **GĐ0. Nền tảng** | `00-repo-setup`, `01-app-lab-shell` | Repo Next.js + TS + SQLite/Drizzle + Tokens + CI chạy trên Windows; hoàn thiện khung `<AppShell>`, `<LabShell>`, `<ModeToggle>`, `<InspectorPanel>`, `<ChallengePanel>`, `<CheatSheetModal>` và trang chủ `/`. |
| **GĐ1. Khóa REST API (10 Module)** | `02-rest-m01-network` → `11-rest-m10-graphql-grpc` | Hoàn thiện đầy đủ 100% kiến thức video *REST API Design Like a Senior Engineer* theo `docs/courses/rest-api/curriculum.md`, mỗi module có MDX, pure engine, Simulator, Inspector và Challenge tự chấm. |
| **GĐ2. Trải nghiệm & Mở rộng** | `12-notes-history`, `13-course-expansion` | Ngăn kéo ghi chú gắn timestamp, trang `/progress` xem lịch sử & reset tiến độ, nạp khóa học mới thứ 2 từ kênh YouTube bằng skill `phan-tich-nguon`. |
| **GĐ3. Đa người dùng (Sau)** | `14-auth-multiuser` | Bổ sung đăng nhập (argon2id, session cookie) sử dụng sẵn cột `user_id` trong SQLite. |
