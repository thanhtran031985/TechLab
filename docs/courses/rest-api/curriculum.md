# Bản đồ kiến thức khóa học: REST API Design Like a Senior Engineer

- **Mã khóa học (`course_slug`):** `rest-api`
- **Nguồn video:** System Design Lab — *REST API Design Like a Senior Engineer (REST, GraphQL, Networking, Pagination, Auth, Security)*
- **URL:** `https://www.youtube.com/watch?v=BvtIqaiabJA`
- **Thời lượng:** `02:24:33`
- **Ứng dụng mô phỏng xuyên suốt:** **JaneGram** (ứng dụng chia sẻ ảnh có Feed, Like, Comment, Upload ảnh/video, Profile, Follow, Notifications).

---

## Tổng quan 10 Module (Bao phủ 100% nội dung video)

| # | Slug | Tên Module | Mốc video | Kịch bản Junior (Lỗi) vs Senior (Chuẩn) |
|---|---|---|---|---|
| 01 | `01-network-http-rest` | Nền tảng Mạng, HTTP & REST | `[00:00:00]` – `[00:19:34]` | Junior gọi URL tùy hứng (`/likeIt`), bỏ qua TLS/Stateless vs Senior áp dụng 4 thói quen REST, HTTPS/TLS, Stateless và chuẩn hóa JSON. |
| 02 | `02-resource-modeling` | Mô hình hóa Tài nguyên & URL | `[00:19:35]` – `[00:28:55]` | Junior đưa động từ vào URL (`/getUserPosts`), lồng 4 cấp, dùng username làm khóa vs Senior tách Entity/Attribute, Collection/Item, ID bất biến, nested tối đa 1 cấp, `:customMethod`. |
| 03 | `03-methods-status-caching` | Methods, Status Codes & Caching | `[00:28:56]` – `[00:57:55]` | Junior dùng `POST` cho Like (double-tap nhảy 2 tim), đẩy ảnh nặng qua API server, trả 200/500 cho mọi lỗi vs Senior dùng `PUT` Idempotent, `ETag`/`304`, Signed URL, `202 Accepted`, `QUERY`, Redirect đúng mã, Retry có Jitter. |
| 04 | `04-read-errors-pagination` | Thiết kế Read, Chuẩn lỗi & Phân trang | `[00:57:56]` – `[01:12:54]` | Junior gọi N+1 (21 request cho 10 post), tên trường lẫn lộn, phân trang Offset bị trùng bài khi có bài mới vs Senior dùng 1 call Screen-driven, Embed + Link, RFC 9457, Cursor/Keyset Pagination & `since=`. |
| 05 | `05-write-safety-reliability` | An toàn Ghi dữ liệu & Độ tin cậy | `[01:12:55]` – `[01:20:29]` | Junior retry `POST` khi rớt mạng tạo 2 bài trùng, 2 thiết bị cùng sửa gây Lost Update, Webhook không ký vs Senior dùng `Idempotency-Key`, Optimistic Locking (`If-Match`/`412`), Webhook ký HMAC + Event ID. |
| 06 | `06-architecture-versioning` | Kiến trúc 3 tầng & API Versioning | `[01:20:30]` – `[01:40:22]` | Junior gộp SQL trong handler, lộ stack trace DB, đổi `likes` sang `reactions` làm sập App v1.0 vs Senior tách 3 tầng + SQL Join, Expand & Contract, Versioning (`/v2` + adapter), `Deprecation`/`Sunset` -> `410 Gone`. |
| 07 | `07-auth-authorization` | Xác thực (AuthN) & Phân quyền (AuthZ) | `[01:40:23]` – `[01:56:27]` | Junior lưu mật khẩu yếu, gửi API key trên URL, nhầm 401/403, không kiểm `iss`/`aud` của JWT vs Senior dùng Argon2id+Salt, Session Cookie `HttpOnly`, JWT cặp khóa + Refresh Token Rotation, OAuth 2.0 + PKCE + OIDC, RBAC/ABAC/ACL. |
| 08 | `08-api-security` | Bảo mật API chuyên sâu (Red-Team) | `[01:56:28]` – `[02:05:08]` | Junior bỏ qua kiểm tra quyền theo đối tượng (BOLA), copy thẳng body (Mass Assignment), không giới hạn spam vs Senior chặn BOLA (`404`/`403`), Allow-list trường ghi, Token Bucket (`429`), CORS Preflight, CSRF Token, Parameterized Query & XSS Escaping. |
| 09 | `09-openapi-documentation` | Tài liệu hóa & OpenAPI Contract | `[02:05:09]` – `[02:11:52]` | Junior viết docs tay trên wiki bị lệch thực tế (`text` vs `body`) vs Senior dùng OpenAPI 3.1/3.2 (Design-First), tái sử dụng `components/schemas`, sinh 4 đầu ra tự động, dùng Diff & Linter chặn Breaking Change. |
| 10 | `10-graphql-grpc` | Ngoài REST: GraphQL & gRPC | `[02:11:53]` – `[02:24:33]` | Junior dùng 1 endpoint REST cố định gây Overfetching trên Smartwatch và Underfetching trên Web, không đặt timeout nội bộ vs Senior dùng GraphQL + DataLoader (hiểu rõ 4 chi phí) và gRPC (`.proto`, HTTP/2, Deadline). |

---

## Chi tiết kiến thức, mốc thời gian & thử thách từng Module

### Module 01 — Nền tảng Mạng, HTTP & REST (`01-network-http-rest`)
- **Kiến thức bắt buộc & mốc video:**
  - Vì sao server scale được nhưng API thiết kế kém thì không (ứng dụng cũ gọi shape cũ nhiều năm) `[00:00:07]`.
  - API Contract (Client vs Server) `[00:02:42]`.
  - Giải phẫu URL: Scheme, Host, Port (80/443), Path, Query String, Percent-encoding (`%20`), Fragment (`#top` không gửi lên server) `[00:03:54]`.
  - DNS & TTL (caching ở resolver) `[00:05:27]`; IP chọn máy, Port chọn tiến trình `[00:06:17]`.
  - TCP 3-Way Handshake (`SYN` → `SYN-ACK` → `ACK`), đánh số gói tin, retry với backoff, giới hạn của TCP (chỉ đảm bảo byte đến nơi, không đảm bảo server xử lý xong) `[00:06:58]`.
  - UDP vs TCP và HTTP/3 trên QUIC (tránh head-of-line blocking trên mạng di động yếu) `[00:09:39]`.
  - HTTP vs HTTPS (TLS mã hóa & xác thực server trên Wi-Fi công cộng) `[00:10:56]`.
  - Server Routing, 4 phần của HTTP Request (Method+Path, Headers, Body JSON) và Response (Status Code, Headers, JSON) `[00:11:48]`.
  - Lưu ý thực tế về JSON: không có kiểu Date (gửi chuỗi), ID quá lớn phải gửi dạng String tránh mất chữ số `[00:14:49]`.
  - Mô hình Stateless sau Load Balancer `[00:15:57]`.
  - 4 thói quen cốt lõi của REST (Resource URL, Uniform Verbs, Stateless, Representation) và Richardson Maturity Model (Hypermedia/HATEOAS) `[00:16:35]`.
- **Challenges (3):**
  1. Giải phẫu đủ 6 thành phần của URL mẫu trên công cụ tương tác.
  2. Gửi thao tác Like ở chế độ Junior để quan sát rủi ro HTTP thường và URL không nhất quán, sau đó chuyển sang Senior (HTTPS + RESTful) và kiểm tra đủ 5 chặng mạng.
  3. Phát hiện lỗi mất độ chính xác của ID số nguyên lớn (`> 2^53 - 1`) trong JSON payload và sửa sang kiểu chuỗi.

### Module 02 — Mô hình hóa Tài nguyên & URL (`02-resource-modeling`)
- **Kiến thức bắt buộc & mốc video:**
  - Quy trình đọc màn hình ứng dụng trước khi viết URL `[00:19:46]`.
  - Phân loại Entity (có ID duy nhất, không đổi, ví dụ User, Post, Comment) vs Attribute (Caption, Avatar, Username có thể đổi) `[00:20:32]`.
  - Quan hệ 1-N và N-N; tách quan hệ thành Entity riêng khi mang dữ liệu đi kèm (như thời điểm Like/Follow) `[00:21:46]`.
  - Ánh xạ nút bấm thành CRUD và HTTP Method (`POST`, `GET`, `PUT`/`PATCH`, `DELETE`) `[00:23:18]`.
  - Collection URL (`/posts`, danh từ số nhiều) vs Item URL (`/posts/42`, dùng ID bất biến thay vì username) `[00:24:19]`.
  - Nested URL để lọc theo chủ sở hữu (`/posts/42/comments`), quy tắc giữ tối đa 1 cấp lồng và nhà ngắn riêng cho item (`/comments/99/likes`) `[00:25:41]`.
  - Biến hành động thành tài nguyên (`POST /posts/42/reports`) và Custom Method với dấu hai chấm khi không có danh từ phù hợp (`POST /posts/42:archive`) `[00:27:05]`.
- **Challenges (3):**
  1. Phân loại chính xác 8 danh từ của JaneGram vào 3 nhóm: Entity, Attribute và Relationship-Entity.
  2. Rút gọn một đường dẫn lồng sâu 4 cấp (`/users/7/posts/42/comments/99/likes`) về chuẩn 1 cấp.
  3. Thiết kế đúng endpoint cho hành động lưu trữ bài viết (`POST /posts/42:archive`) thay vì `GET /archivePost?id=42`.

### Module 03 — Methods, Status Codes & Caching (`03-methods-status-caching`)
- **Kiến thức bắt buộc & mốc video:**
  - Đầy đủ 10 HTTP Methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`, `TRACE`, `CONNECT` và `QUERY` mới (RFC 10008 — `GET` có body cho tìm kiếm phức tạp) `[00:29:14]`, `[00:49:44]`, `[00:52:22]`.
  - 5 họ mã trạng thái (`1xx`, `2xx`, `3xx`, `4xx`, `5xx`), chi tiết nhóm `2xx` (`200`, `201` + `Location`, `202 Accepted`, `204 No Content`) `[00:29:35]`, `[00:32:28]`.
  - Path parameter vs Query parameter (`sort=-created_at`, `%20`, `%26`), 4 vị trí đặt dữ liệu trong Request `[00:31:08]`, `[00:33:16]`, `[00:37:02]`.
  - Phân biệt lỗi `400`, `413`, `415`, `422` (parse lỗi vs vi phạm rule nghiệp vụ) `[00:37:49]`.
  - Upload file lớn bằng **Signed URL** thẳng lên S3/GCS, Resumable Upload, `Expect: 100-continue` và dọn file mồ côi `[00:39:13]`.
  - Tác vụ chậm (`202 Accepted` + `/jobs/77` Polling hoặc Webhook) `[00:40:55]`.
  - `PUT` (thay toàn bộ, rủi ro xóa field mới của app cũ) vs `PATCH` (JSON Merge Patch `null` vs JSON Patch) `[00:42:16]`.
  - Xóa tài nguyên (`204`), `404 Not Found` vs `410 Gone`, 4 mã Redirect (`301/308` vĩnh viễn vs `302/307` tạm thời; `307/308` giữ nguyên Method) `[00:43:50]`.
  - Caching: `ETag` + `If-None-Match` → `304 Not Modified`, `Cache-Control: max-age`, phân biệt `public` (Avatar) vs `private` (Feed cá nhân) `[00:45:36]`.
  - Tính Safe và Idempotent: lỗi double-tap `POST /posts/42/likes` vs `PUT /posts/42/likes/me` `[00:47:28]`.
  - Nhóm `4xx` khác (`401`, `403`, `405` + `Allow`, `409`, `429`) và nhóm `5xx` (`500`, `502`, `503` + `Retry-After`, `504` gateway timeout) kèm Retry có **Jitter** `[00:53:08]`, `[00:54:35]`.
- **Challenges (3):**
  1. Tái hiện lỗi nhảy 2 tim khi Double-Tap ở Junior Mode (`POST`), sau đó chuyển Senior Mode (`PUT`) xác nhận tính Idempotent.
  2. Tải lại Avatar 2 lần để xác nhận lần 2 gửi `If-None-Match` và nhận `304 Not Modified` (0 bytes body).
  3. Thực hiện quy trình upload ảnh lớn qua Signed URL (3 bước) mà không đẩy byte ảnh qua API Server.

### Module 04 — Thiết kế Read, Chuẩn lỗi & Phân trang (`04-read-errors-pagination`)
- **Kiến thức bắt buộc & mốc video:**
  - Thiết kế ngược từ màn hình (Screen-driven): xử lý bài toán **N+1 trên Client** (1 request `/feed` thay vì 21 requests) `[00:57:56]`.
  - Liên kết dữ liệu: Bare ID vs Link vs Embed tóm tắt (Embed những gì màn hình luôn vẽ, còn lại dùng ID + Link) `[00:59:26]`.
  - Chống Overfetching bằng `fields=` và `include=` (có giới hạn menu từ server) `[01:00:35]`.
  - Nhất quán đặt tên (`snake_case` JSON, kebab-case URL, timestamp chuẩn **RFC 3339 UTC** kết thúc bằng `Z`) `[01:01:22]`.
  - Chuẩn lỗi thống nhất **RFC 9457 Problem Details** (`type`, `status`, `detail`, `errors[]`, `request_id`, tuyệt đối giấu stack trace) `[01:02:46]`.
  - Phân trang 4 kiểu:
    - **Offset (`limit`/`offset`):** chậm ở trang sâu và bị trùng bài khi có bài mới đăng `[01:04:46]`.
    - **Page Number (`page`/`per_page`):** tốn chi phí `COUNT(*)` tổng dòng, chỉ hợp bảng admin ít đổi `[01:06:07]`.
    - **Cursor / Keyset Pagination:** đánh dấu theo cặp `(created_at, id)` dùng index, ổn định ở mọi độ sâu, token opaque/ngắn hạn `[01:07:11]`.
    - **Catch-up (`since=` / Sync Token):** dùng cho màn hình thông báo, phá hòa trùng giây bằng `(time, id)` do server cấp `[01:10:12]`.
- **Challenges (3):**
  1. Chèn 2 bài đăng mới lên đầu Feed rồi bấm "Tải Trang 2" ở chế độ Junior để thấy bài bị trùng lặp; chuyển Senior (Cursor) để tải trang 2 không trùng.
  2. Chuyển chế độ đọc Feed từ 21 requests (N+1) sang 1 request Screen-driven và kiểm tra mức giảm độ trễ.
  3. Gửi caption vượt giới hạn để kiểm tra response lỗi đạt chuẩn RFC 9457 có `errors` theo trường và `request_id`.

### Module 05 — An toàn Ghi dữ liệu & Độ tin cậy (`05-write-safety-reliability`)
- **Kiến thức bắt buộc & mốc video:**
  - Khoảng trống của TCP khi rớt mạng giữa đường về: Server đã lưu nhưng Client timeout và retry gây tạo 2 bài đăng trùng `[01:12:55]`.
  - **`Idempotency-Key`** cho `POST`: lưu sổ cái `(caller, key, payload_hash, response)` có TTL (vd 24 giờ); xử lý 3 trường hợp biên (trùng key nhưng khác payload → từ chối; retry đến khi request đầu đang chạy → khóa và trả `409 Conflict`; tách namespace theo caller) `[01:13:50]`.
  - Thiết kế ưu tiên Idempotent tự nhiên (`PUT`/`DELETE`) trước khi cần dùng Key `[01:16:29]`.
  - Chống **Lost Update** khi 2 thiết bị sửa cùng 1 bài: **Optimistic Locking** với header `If-Match: "<etag>"` → `412 Precondition Failed` (và `428 Precondition Required` nếu bắt buộc) `[01:17:14]`.
  - Độ tin cậy của **Webhook**: ký HMAC (body + timestamp chống replay), retry backoff nhiều ngày đến khi nhận `2xx`, gắn `event_id` để bên nhận chống xử lý lặp, trả `2xx` ngay rồi xử lý nền `[01:18:43]`.
- **Challenges (3):**
  1. Bật mô phỏng "Rớt mạng khi server vừa lưu xong" và đăng bài ở Junior Mode (thấy 2 bài trùng), sau đó lặp lại ở Senior Mode với `Idempotency-Key` (chỉ tạo 1 bài).
  2. Mô phỏng 2 thiết bị (Phone & Laptop) cùng sửa bài viết 43 để kích hoạt `412 Precondition Failed` ở Senior Mode và tải lại bản mới để lưu an toàn.
  3. Giả lập gửi lại một Webhook cũ (replay attack / duplicate event) và xác minh cơ chế kiểm tra chữ ký + `event_id` chặn xử lý trùng.

### Module 06 — Kiến trúc 3 tầng & API Versioning (`06-architecture-versioning`)
- **Kiến thức bắt buộc & mốc video:**
  - 3 tầng trong Server: **API Layer** (HTTP/Status/Routing) → **Business Layer** (Rules thuần, không biết HTTP) → **Data Layer** (SQL, Transaction, tách biệt tên cột DB `body` khỏi JSON `text`) `[01:20:59]`.
  - Bài toán N+1 ẩn bên trong DB và cách xử lý bằng **SQL Join** `[01:25:14]`.
  - Dịch lỗi qua từng ranh giới tầng (DB Foreign Key Error → `PostNotFound` → `404` Problem Details + `request_id`) `[01:26:26]`.
  - Phân biệt **Breaking Change** (xóa/đổi tên/đổi kiểu/thêm input bắt buộc/siết rule) vs **Non-breaking Change** & nguyên tắc **Tolerant Reader** `[01:28:04]`, `[01:31:25]`.
  - Kỹ thuật **Expand & Contract** để đổi tên trường mà không cần version mới `[01:32:43]`.
  - **4 vị trí đặt Version:** Path (`/v2`), Header (`X-API-Version` + bắt buộc `Vary`), Query (`?api-version=`), Media Type (`Accept`); so sánh Major Version vs Dated Version `[01:33:55]`, `[01:36:02]`.
  - Chạy song song v1 (`likes`) và v2 (`reactions`) trên **cùng 1 Database** nhờ tầng chuyển đổi (API Adapter) `[01:37:15]`.
  - Quy trình khai tử v1: header `Deprecation` + `Sunset`, theo dõi traffic + nhắc cập nhật ứng dụng, cuối cùng mới trả `410 Gone` `[01:38:02]`.
- **Challenges (3):**
  1. Chạy cùng lúc App v1.0 và v2.0 khi nâng cấp `likes` → `reactions`: thấy App v1.0 sập ở Junior Mode và hoạt động ổn định nhờ Adapter ở Senior Mode.
  2. Chạy đọc Feed ở tầng Data Layer để so sánh 11 câu SQL (N+1) vs 1 câu `SQL JOIN`.
  3. Điều khiển lộ trình khai tử v1 qua đủ 4 giai đoạn đến khi traffic về 0 và trả `410 Gone`.

### Module 07 — Xác thực (AuthN) & Phân quyền (AuthZ) (`07-auth-authorization`)
- **Kiến thức bắt buộc & mốc video:**
  - 2 chốt kiểm soát: **Authentication** (`401 Unauthorized` + `WWW-Authenticate`) vs **Authorization** (`403 Forbidden`) `[01:40:23]`.
  - 4 vị trí lưu bằng chứng danh tính & header `Authorization` (`Basic`, `Bearer`) `[01:41:20]`.
  - **Basic Auth** (Base64 chỉ là mã hóa hiển thị, bắt buộc HTTPS) và **API Key** (định danh ứng dụng/dự án, xoay vòng, tuyệt đối không đặt trong URL) `[01:42:35]`.
  - Lưu mật khẩu: băm chậm **Argon2id / bcrypt + Salt**, giới hạn số lần đăng nhập sai theo từng tài khoản `[01:44:02]`.
  - **Session Cookie** (`HttpOnly`, `Secure`, lưu shared store để server vẫn stateless) `[01:45:21]`.
  - **JWT** (Header.Payload.Signature — ký không phải mã hóa, phân biệt JWS vs JWE); kiểm tra bắt buộc `sub`, `exp`, `iss`, `aud` và khóa thuật toán ký; **Key Pair (Public/Private)** tốt hơn Shared Secret khi nhiều service `[01:46:25]`.
  - **Access Token ngắn hạn + Refresh Token Rotation** (thu hồi khi đăng xuất mọi thiết bị) `[01:49:52]`.
  - **OAuth 2.0 + PKCE** (mở trình duyệt hệ thống ngoài app, 4 bước đổi code lấy token) và **OpenID Connect (OIDC)** bổ sung `ID Token` cho SSO `[01:50:48]`.
  - Ma trận chọn cơ chế Auth theo loại Client (Web app, Mobile app, Partner server) `[01:53:24]`.
  - 3 mô hình phân quyền: **RBAC** (theo vai trò), **ABAC / ReBAC** (theo thuộc tính/quan hệ follower), **ACL** (danh sách Close Friends) `[01:54:31]`.
- **Challenges (3):**
  1. Chỉnh sửa trực tiếp trường `role: "admin"` trong Payload của JWT để chứng kiến chữ ký sai bị chặn `401`.
  2. Mô phỏng hết hạn Access Token và thực hiện quy trình Refresh Token Rotation để lấy token mới không cần đăng nhập lại.
  3. Chọn đúng cơ chế Auth và mô hình AuthZ cho 3 kịch bản (Web App, Mobile App dùng SSO, Partner Server).

### Module 08 — Bảo mật API chuyên sâu (`08-api-security`)
- **Kiến thức bắt buộc & mốc video:**
  - **BOLA / IDOR (OWASP API1):** Có token hợp lệ nhưng đổi ID URL sang bài riêng tư của người khác; kiểm tra quyền sở hữu/quan hệ trên mọi đối tượng, cân nhắc trả `404` để giấu sự tồn tại `[01:56:28]`.
  - **Mass Assignment (OWASP API3):** Gửi thêm `role: "admin"` trong `PATCH /users/me`; khắc phục bằng **Allow-list** trường cho phép ghi và đọc (không dùng block-list) `[01:58:11]`.
  - **Rate Limiting:** Thuật toán **Token Bucket** tại API Gateway, trả `429 Too Many Requests` + `Retry-After`; bucket theo User (đã login) và theo IP (chưa login) `[01:59:23]`.
  - **CORS & Preflight `OPTIONS`:** Kiểm soát Origin cho trình duyệt, trả `Access-Control-Allow-Origin` đích danh (không dùng `*` khi kèm cookie) `[02:00:28]`.
  - **CSRF:** Trình duyệt tự đính kèm cookie trên form ẩn từ trang độc hại; khắc phục chính bằng **CSRF Token** (`SameSite` cookie chỉ là lớp phụ) `[02:01:51]`.
  - **SQL Injection** (dùng Parameterized Query tách code và data) & **Stored XSS** (Output Escaping + validate kiểu/độ dài) `[02:02:55]`.
  - Nguyên tắc phòng thủ nhiều lớp (Defense in Depth) & ghi log kèm `request_id` `[02:04:09]`.
- **Challenges (3):**
  1. Thực hiện tấn công BOLA (`GET /posts/99_private`) và Mass Assignment (`PATCH /users/me` thêm `role: admin`) ở Junior Mode (thành công), sau đó kiểm chứng Senior Mode chặn triệt để.
  2. Spam Like vượt ngưỡng Token Bucket ở Senior Mode để kích hoạt `429 Too Many Requests` kèm `Retry-After`.
  3. Tái hiện lỗi SQL Injection / XSS trên Simulator giả lập và xác minh Parameterized Query + Output Escaping vô hiệu hóa payload.

### Module 09 — Tài liệu hóa & OpenAPI Contract (`09-openapi-documentation`)
- **Kiến thức bắt buộc & mốc video:**
  - Vì sao tài liệu Wiki viết tay luôn bị lệch khỏi code thực tế (`text` vs `body`) `[02:05:36]`.
  - Đọc cấu trúc file **OpenAPI 3.1.1 / 3.2.1** (`openapi`, `servers`, `paths`, `parameters`, `requestBody`, `responses`, `security`) `[02:06:23]`.
  - Tái sử dụng định nghĩa dữ liệu trong `components/schemas` (xây dựng trên JSON Schema) `[02:07:42]`.
  - **Design-First** (viết hợp đồng trước khi nhiều nhóm phụ thuộc) vs **Code-First** (khi tự làm cả hai đầu) `[02:09:00]`.
  - **4 đầu ra tự động** từ 1 file OpenAPI: Docs UI tương tác, Client SDK, Mock Server, Contract Tests `[02:09:43]`.
  - Tự động kiểm soát chất lượng hợp đồng trong CI bằng **Diff Tool** (bắt Breaking Change) và **Linter** (Spectral kiểm style guide) `[02:10:48]`.
- **Challenges (3):**
  1. So sánh 2 phiên bản file OpenAPI trên công cụ Diff để phát hiện chính xác thay đổi nào là Breaking Change.
  2. Tách một schema lặp lại vào `components/schemas` và trỏ `$ref` hợp lệ.
  3. Chạy Contract Test giả lập để phát hiện server trả sai tên trường (`text` thay vì `body`) so với file OpenAPI.

### Module 10 — Ngoài REST: GraphQL & gRPC (`10-graphql-grpc`)
- **Kiến thức bắt buộc & mốc video:**
  - Bài toán đa thiết bị của REST: **Overfetching** (Smartwatch chỉ cần số like) và **Underfetching** (Web Feed cần thêm bio tác giả + 2 comment đầu) `[02:11:53]`.
  - **GraphQL:** Typed Schema, 1 endpoint `/graphql`, **Query** (đọc — response phản chiếu đúng shape query) vs **Mutation** (ghi — chạy tuần tự ở top-level) `[02:13:33]`, `[02:16:09]`.
  - **Resolver & bài toán N+1 ẩn trong Server**, khắc phục bằng **DataLoader** (batching + cache theo từng request, không thay thế Redis) `[02:16:51]`.
  - **4 chi phí của GraphQL:** Mất HTTP GET caching, lỗi nằm trong response `2xx`, rủi ro truy vấn lồng sâu (cần Depth/Cost Limit hoặc Trusted Documents), tiến hóa schema bằng `@deprecated` `[02:18:42]`.
  - **gRPC** cho giao tiếp nội bộ giữa các service: hợp đồng `.proto` (Protobuf), chạy trên **HTTP/2** nhị phân gọn nhẹ (key theo số thứ tự), hỗ trợ Streaming 2 chiều, bắt buộc đặt **Deadline** (timeout), hạn chế trên trình duyệt (cần gRPC-Web + proxy) `[02:20:24]`.
  - **Ma trận quyết định:** Khi nào chọn REST, GraphQL, gRPC — và một hệ thống có thể kết hợp cả ba `[02:21:44]`.
- **Challenges (3):**
  1. So sánh số lượng request và dung lượng payload giữa REST và GraphQL cho cùng 2 thiết bị (Smartwatch & Web Feed).
  2. Bật/tắt DataLoader trên truy vấn 10 bài viết kèm tác giả để giảm số câu truy vấn DB từ 11 xuống 2.
  3. Cấu hình Deadline cho cuộc gọi gRPC nội bộ để tránh treo vô hạn khi service đích chậm, và chọn đúng giao thức cho 3 bài toán kiến trúc.
