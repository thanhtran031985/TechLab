# Kế hoạch thực hiện (Implementation Plan) — 01-app-lab-shell

## 1. Mục tiêu
Chuyển đổi bộ khung tĩnh `designs/shell/` + `designs/pages/home.html` thành các component Next.js dùng chung (`<LabShell>`, `<ModeToggle>`, `<InspectorPanel>`, `<ChallengePanel>`, `<CheatSheetModal>`) và nối với SQLite qua `/api/courses`, `/api/progress`. Đảm bảo khi chuyển sang các task `02` → `11`, mỗi file `designs/pages/courses/<course-slug>/module-XX.html` được ghép trơn tru thành 1 trang module hoàn chỉnh trên cùng giao diện Dark Studio 3 cột.

---

## 2. Các bước thực hiện chi tiết

### Bước 1 — API chuẩn hóa (`/api/courses`, `/api/courses/[course]`, `/api/progress`)
- **Mục tiêu:**
  Xây dựng các API Route Handler kết nối trực tiếp với SQLite để lấy dữ liệu khóa học, chi tiết module, và đọc/ghi nhận tiến độ Challenge (`challenge_progress`).
- **Files tạo/sửa:**
  - `src/lib/api-response.ts`: Hàm trợ giúp trả response JSON chuẩn `{ ok: true, data }` và `{ ok: false, code, message, details }` theo quy tắc `AGENTS.md`.
  - `src/app/api/courses/route.ts`:
    - `GET`: Truy vấn danh sách khóa học kèm tổng số module, số challenge đã `PASSED` từ bảng `challenge_progress` cho `user_id = 'local'`.
  - `src/app/api/courses/[course]/route.ts`:
    - `GET`: Lấy chi tiết khóa học và danh sách 10 modules kèm số challenge đạt của từng module.
  - `src/app/api/progress/route.ts`:
    - `GET`: Lấy danh sách các `challenge_id` đã đạt (`PASSED`) của user `local`, tổng số đạt trên tổng 30.
    - `POST`: Nhận payload `{ challengeId: string, status?: 'PASSED' }`, validate bằng Zod schema:
      - Kiểm tra challenge tồn tại trong bảng `challenges`.
      - Upsert vào bảng `challenge_progress` với `status = 'PASSED'`, tăng `attempts`, cập nhật `passed_at = new Date().toISOString()`. Idempotent (gọi nhiều lần không lỗi).
      - Trả về `{ ok: true, data: { challengeId, status: 'PASSED', passedCount, totalCount } }`.
- **Test viết trước (TDD):**
  - `tests/integration/api-progress.test.ts`:
    - Test `GET /api/courses` trả danh sách khóa học và progress `0/30`.
    - Test `GET /api/courses/rest-api` trả chi tiết 10 module.
    - Test `POST /api/progress` với payload hợp lệ -> lưu vào SQLite, trả 200 `PASSED`.
    - Test `POST /api/progress` gọi lại lần 2 với cùng `challengeId` -> idempotent.
    - Test `POST /api/progress` với payload sai / thiếu -> trả HTTP 400 kèm message tiếng Việt có dấu.
    - Test `GET /api/progress` trả danh sách ID đã hoàn thành.
- **Lệnh kiểm tra:** `pnpm test tests/integration/api-progress.test.ts`.

---

### Bước 2 — Nạp tokens Dark Studio & Bộ thành phần dùng chung
- **Mục tiêu:**
  Cập nhật token CSS theo phong cách **Dark Studio Slate-950**, cấu hình Tailwind/Postcss, và xây dựng toàn bộ component dùng chung chuẩn hoá.
- **Files tạo/sửa:**
  - `src/app/globals.css`:
    - Nạp `designs/shell/tokens.css`.
    - Thiết lập theme Dark Studio: nền `#020617`, chữ `#f1f5f9`, font `--font-ui` và `--font-mono`.
  - `tailwind.config.ts`:
    - Bổ sung các biến màu Dark Studio: `bg: #020617`, `surface: #0b1120`, `surface-2: #0f172a`, `surface-3: #1e293b`, `line-strong: #334155`, `junior: #f59e0b`, `senior: #10b981`, `accent-teal: #14b8a6`, etc.
  - `src/components/ModeToggle.tsx`:
    - Công tắc chuyển chế độ `Junior (First-Try)` (amber) ↔ `Senior (Chuẩn Hệ Thống)` (emerald) bám sát `designs/shell/shell.css` (`.mode-switch`, `.mode-btn`).
  - `src/components/InspectorPanel.tsx`:
    - Thanh hành trình mạng 5 chặng (`hops-bar`): 1. Client, 2. DNS/TLS, 3. Gateway, 4. Service, 5. Database (tô sáng hop xanh hoặc đỏ khi lỗi).
    - Hộp phân tích `analysis-box` (hỗ trợ tone: ok, warn, crit).
    - Raw HTTP Request & Raw HTTP Response trong khối mono `code-block`.
  - `src/components/ChallengePanel.tsx`:
    - Danh sách Challenge của module kèm trạng thái `Đạt` / `Chưa đạt`, nút gợi ý, vùng `aria-live="polite"`.
  - `src/components/CheatSheetModal.tsx`:
    - Modal tra cứu nhanh bám sát `designs/pages/home.html` và `shell.css`:
      - Bảng 1: HTTP Methods & thuộc tính (GET, POST, PUT, PATCH, DELETE, QUERY).
      - Bảng 2: Mã trạng thái & Kiến trúc (2xx, 3xx, 4xx, REST/GraphQL/gRPC).
      - Hỗ trợ đóng bằng nút hoặc phím `Esc`.
  - `src/components/ui/FeedbackStates.tsx`:
    - 4 trạng thái dữ liệu chuẩn PRD B & `ui-web.md`:
      - `LoadingSkeleton` (skeleton đúng kích thước).
      - `EmptyState` (icon + thông điệp + 1 hành động).
      - `ErrorAlert` (giữ dữ liệu cũ nếu có + nút Thử lại).
- **Test viết trước (TDD):**
  - `tests/unit/lab-components.test.tsx`:
    - Test render `ModeToggle` (chuyển đổi qua lại giữa junior và senior, trigger callback).
    - Test render `InspectorPanel` (hiển thị 5 chặng mạng, request/response, tone analysis).
    - Test render `ChallengePanel` (hiển thị trạng thái hoàn thành).
    - Test `CheatSheetModal` (mở/đóng bằng `Esc` hoặc nút đóng).
- **Lệnh kiểm tra:** `pnpm test tests/unit/lab-components.test.tsx`.

---

### Bước 3 — Khung `<LabShell>` 3 cột bám sát `designs/shell/shell.css`
- **Mục tiêu:**
  Xây dựng component `<LabShell>` duy nhất cho toàn bộ 10 module, đảm bảo bố cục Dark Studio 3 cột không cuộn toàn cục ở 1366×768 và 1440×900.
- **Files tạo/sửa:**
  - `src/components/LabShell.tsx`:
    - **Header 56px (`.lab-header`):**
      - Brand: Logo + "Senior API Lab" / "TechLab" + subtitle liên kết về trang chủ `/`.
      - Progress pill: Tiến độ tổng từ SQLite (`0/30`), thanh tiến độ có fill bar.
      - Center: `<ModeToggle>`.
      - Right: Nút `Cheat Sheet` mở `<CheatSheetModal>`.
    - **3-Column Workspace (`.lab-workspace`):**
      - **Cột 1 (`.module-sidebar`, 248px):** Danh sách 10 modules đọc từ registry / SQLite, có số thứ tự tròn, tiêu đề module, mô tả ngắn, module hiện tại được đánh dấu `active`, điều hướng bằng `next/link`.
      - **Cột 2 (`.sim-column`, 38%):** Thanh topbar (tiêu đề simulator + badge Junior/Senior) + slot simulator cuộn nội bộ `sim-scroll`.
      - **Cột 3 (`.workbench-column`, flex-1):** Thanh 3 tabs (1. Kiến Thức Cốt Lõi, 2. Live HTTP Inspector, 3. Nhiệm Vụ kèm badge tiến độ module `0/3`) + 3 panes chuyển đổi mượt mà.
- **Test viết trước (TDD):**
  - `tests/unit/lab-shell.test.tsx`:
    - Test `<LabShell>` render đầy đủ Header, Cột 1 (10 module items), Cột 2 (Simulator slot), Cột 3 (3 tabs).
    - Test chuyển tab Workbench (click tab 2 -> mở Inspector, click tab 3 -> mở Challenges).
    - Test click nút Cheat Sheet -> mở modal.
- **Lệnh kiểm tra:** `pnpm test tests/unit/lab-shell.test.tsx`.

---

### Bước 4 — Trang chủ `/` theo `designs/pages/home.html` & Route động `/courses/[course]/[module]`
- **Mục tiêu:**
  Hoàn thiện trang chủ `/` theo đúng `designs/pages/home.html` (đọc dữ liệu khóa học và tiến độ thật từ SQLite) và tạo route động `/courses/[course]/[module]` tích hợp `<LabShell>` với kịch bản mẫu Module 01 (JaneGram Mobile + URL Anatomy).
- **Files tạo/sửa:**
  - `src/labs/registry.ts`: Registry định nghĩa metadata và module component mapping cho các khóa học.
  - `src/labs/rest-api/01-network-http-rest/Simulator.tsx`: Mô phỏng JaneGram Mobile v2.4 (phone frame, like button, bigint test, 3 scenario buttons).
  - `src/labs/rest-api/01-network-http-rest/Theory.tsx`: Công cụ giải phẫu URL (6 thành phần pill màu: scheme, host, port, path, query, frag) + Bảng so sánh 4 thói quen vàng.
  - `src/app/page.tsx`: Cập nhật trang chủ theo đúng `designs/pages/home.html`:
    - Header Dark Studio kèm tiến độ `X/30`.
    - Tiêu đề "Danh sách khóa học tương tác" + nút "Vào ngay Module 01".
    - Lưới thẻ khóa học: Khóa REST API (10 modules, 30 nhiệm vụ, nút "Mở phòng Lab") và thẻ khóa học mở rộng.
  - `src/app/courses/[course]/[module]/page.tsx`:
    - Nạp metadata module từ SQLite / registry.
    - Render `<LabShell>` với Simulator, Theory, Inspector, Challenges.
- **Test viết trước (TDD & E2E):**
  - `tests/e2e/lab-shell.spec.ts`:
    - Mở `/` ở 1366×768 và 1440×900, kiểm tra 0 lỗi console, không cuộn toàn cục, nút chuyển sang Module 01.
    - Mở `/courses/rest-api/01-network-http-rest`:
      - Kiểm tra Header hiển thị đầy đủ (không rớt chữ).
      - Bấm chuyển đổi Junior (amber) ↔ Senior (emerald).
      - Bấm nút Cheat Sheet -> modal mở, bấm `Esc` -> modal đóng.
      - Chuyển tab Workbench (Tab 1, Tab 2, Tab 3).
      - Tương tác với công cụ Giải Phẫu URL ở Tab 1.
      - Bấm nút Like trên JaneGram Mobile -> quan sát Live Inspector hiển thị request và 5 chặng mạng.
      - Chuyển qua lại giữa các module qua sidebar cột 1.
      - Kiểm tra `scrollHeight <= innerHeight` và không có thanh cuộn toàn trang.
      - Chụp ảnh màn hình lưu vào `tests/e2e/__screens__/`.
- **Lệnh kiểm tra:**
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm test`
  - `pnpm test:e2e`
  - `pnpm security:check`
  - `pnpm tasks:dashboard`

---

## 3. Chi tiết suy ra từ Spec & Thiết kế
- Nhánh git: `feat/01-app-lab-shell`.
- Token giao diện: Sử dụng các biến CSS chuẩn Dark Studio từ `designs/shell/tokens.css` kết hợp với `designs/tokens.css`, bảo đảm tương thích cả các trang hiện có và bố cục Dark Studio 3 cột.
- Không cần cài package mới: Stack hiện tại (`next`, `react 19`, `lucide-react`, `drizzle-orm`, `better-sqlite3`, `zod`, `tailwindcss`) đã đầy đủ 100%.

## 4. Câu hỏi mở
- Không có.
