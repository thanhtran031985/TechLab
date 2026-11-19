export interface LabModuleMeta {
  slug: string;
  order_index: number;
  title: string;
  desc: string;
  video_timestamp: string;
}

export const REST_API_MODULES: LabModuleMeta[] = [
  {
    slug: '01-network-http-rest',
    order_index: 1,
    title: 'HTTP, REST & Mạng',
    desc: 'DNS, TCP, TLS & 4 thói quen vàng',
    video_timestamp: '[00:00:00] – [00:19:34]',
  },
  {
    slug: '02-resource-modeling',
    order_index: 2,
    title: 'Resource & Cấu trúc URL',
    desc: 'Danh từ, Entity/Attribute & Nested',
    video_timestamp: '[00:19:35] – [00:28:55]',
  },
  {
    slug: '03-methods-status-caching',
    order_index: 3,
    title: 'Methods, Idempotency & Cache',
    desc: 'PUT vs POST, ETag 304, Signed URL',
    video_timestamp: '[00:28:56] – [00:57:55]',
  },
  {
    slug: '04-read-errors-pagination',
    order_index: 4,
    title: 'Read, Lỗi & Phân trang',
    desc: 'N+1, RFC 9457, Offset vs Cursor',
    video_timestamp: '[00:57:56] – [01:12:54]',
  },
  {
    slug: '05-write-safety-reliability',
    order_index: 5,
    title: 'An toàn Ghi & Độ tin cậy',
    desc: 'Idempotency-Key, If-Match, Webhook',
    video_timestamp: '[01:12:55] – [01:20:29]',
  },
  {
    slug: '06-architecture-versioning',
    order_index: 6,
    title: 'Kiến trúc 3 tầng & Versioning',
    desc: 'SQL Join, Expand-Contract, v1/v2',
    video_timestamp: '[01:20:30] – [01:40:22]',
  },
  {
    slug: '07-auth-authorization',
    order_index: 7,
    title: 'Xác thực & Phân quyền',
    desc: '401/403, JWT, OAuth+PKCE, RBAC',
    video_timestamp: '[01:40:23] – [01:56:27]',
  },
  {
    slug: '08-api-security',
    order_index: 8,
    title: 'Bảo mật API (Red-Team)',
    desc: 'BOLA, Mass Assignment, Rate Limit',
    video_timestamp: '[01:56:28] – [02:05:08]',
  },
  {
    slug: '09-openapi-documentation',
    order_index: 9,
    title: 'Tài liệu & OpenAPI',
    desc: 'OpenAPI 3.1, Schemas, Diff & Linter',
    video_timestamp: '[02:05:09] – [02:11:52]',
  },
  {
    slug: '10-graphql-grpc',
    order_index: 10,
    title: 'GraphQL & gRPC',
    desc: 'Overfetching, DataLoader, Protobuf',
    video_timestamp: '[02:11:53] – [02:24:33]',
  },
];
