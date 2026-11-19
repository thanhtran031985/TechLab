/**
 * TechLab — REST API Design Like a Senior Engineer
 * Module 01: Nền tảng Mạng, HTTP & REST
 * Pure Simulation & Challenge Evaluation Engine
 */

export type LabMode = 'junior' | 'senior';

export interface HopTrace {
  label: string;
  status: 'idle' | 'lit' | 'err';
}

export interface ScenarioResult {
  scenarioId: string;
  mode: LabMode;
  hops: HopTrace[];
  rawRequest: string;
  rawResponse: string;
  analysis: string;
  analysisTone: 'ok' | 'warn' | 'crit';
  passedChallengeId?: string;
  workerNode?: string;
}

export interface UrlPartDetail {
  part: 'scheme' | 'host' | 'port' | 'path' | 'query' | 'frag';
  raw: string;
  label: string;
  description: string;
}

export interface ChallengeEvaluationInput {
  visitedParts: string[];
  history: ScenarioResult[];
}

/**
 * 1. Phân tích 6 thành phần của URL
 */
export function parseUrlAnatomy(urlString: string): UrlPartDetail[] {
  // Regex tách 6 thành phần:
  // 1: scheme (https://)
  // 2: host (api.janegram.com)
  // 3: port (:443)
  // 4: path (/v1/posts/42/comments)
  // 5: query (?sort=-created_at&limit=10)
  // 6: frag (#comments-section)
  const regex = /^(https?:\/\/)([^:/?#]+)(:\d+)?([^?#]*)(\?[^#]*)?(#.*)?$/;
  const match = urlString.match(regex);

  if (!match) {
    return [];
  }

  const [, scheme, host, port = '', path = '', query = '', frag = ''] = match;

  return [
    {
      part: 'scheme',
      raw: scheme,
      label: `Scheme (${scheme})`,
      description:
        'Quy định giao thức truyền tải. HTTPS = HTTP chạy bên trong đường hầm mã hóa bảo mật TLS.',
    },
    {
      part: 'host',
      raw: host,
      label: `Host (${host})`,
      description:
        'Tên miền định danh máy chủ. DNS phân giải tên này thành địa chỉ IP và lưu đệm theo TTL.',
    },
    {
      part: 'port',
      raw: port || (scheme === 'https://' ? ':443' : ':80'),
      label: `Port (${port || (scheme === 'https://' ? ':443' : ':80')})`,
      description:
        'Địa chỉ IP chọn đúng máy chủ vật lý, còn Port chọn đúng tiến trình ứng dụng đang lắng nghe.',
    },
    {
      part: 'path',
      raw: path,
      label: `Path (${path})`,
      description:
        'Đường dẫn tài nguyên trên máy chủ giúp Server Routing đưa request vào đúng hàm xử lý.',
    },
    {
      part: 'query',
      raw: query,
      label: `Query String (${query})`,
      description:
        'Tham số tùy chọn để lọc hoặc sắp xếp. Ký tự đặc biệt (khoảng trắng) được mã hóa phần trăm (%20).',
    },
    {
      part: 'frag',
      raw: frag,
      label: `Fragment (${frag})`,
      description:
        'Chỉ dùng ở client/trình duyệt để cuộn tới vị trí trang; TUYỆT ĐỐI không bao giờ gửi lên server.',
    },
  ];
}

/**
 * 2. Thực thi kịch bản giả lập (Junior vs Senior)
 */
export function executeScenario(
  scenarioId: 'sc-wifi' | 'sc-stateless' | 'sc-bigint' | 'like',
  mode: LabMode,
  options?: { workerNodeIndex?: number }
): ScenarioResult {
  const normId = scenarioId === 'like' ? 'sc-wifi' : scenarioId;

  if (normId === 'sc-wifi') {
    if (mode === 'junior') {
      return {
        scenarioId: 'sc-wifi',
        mode: 'junior',
        hops: [
          { label: '1. Client', status: 'lit' },
          { label: '2. DNS/TLS', status: 'err' },
          { label: '3. Gateway', status: 'idle' },
          { label: '4. Service', status: 'idle' },
          { label: '5. Database', status: 'idle' },
        ],
        rawRequest:
          'GET /likeIt?user=janedoe&post=42 HTTP/1.1\nHost: api.janegram.com\nAuthorization: Bearer secret-token-12345',
        rawResponse:
          'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"status": "ok", "message": "liked"}',
        analysis:
          'CẢNH BÁO JUNIOR: Request dùng GET cho hành động sửa dữ liệu, URL đặt động từ (/likeIt), chạy qua HTTP thuần không mã hóa TLS! Token nhạy cảm bị bắt gói tin thô trên Wi-Fi quán cafe.',
        analysisTone: 'warn',
      };
    } else {
      return {
        scenarioId: 'sc-wifi',
        mode: 'senior',
        hops: [
          { label: '1. Client', status: 'lit' },
          { label: '2. DNS/TLS', status: 'lit' },
          { label: '3. Gateway', status: 'lit' },
          { label: '4. Service', status: 'lit' },
          { label: '5. Database', status: 'lit' },
        ],
        rawRequest:
          'PUT /v1/posts/42/likes HTTP/1.1\nHost: api.janegram.com\nAuthorization: Bearer [ENCRYPTED_TLS]\nContent-Length: 0',
        rawResponse:
          'HTTP/1.1 204 No Content\nStrict-Transport-Security: max-age=31536000\nDate: Wed, 19 Nov 2026 13:45:00 GMT',
        analysis:
          'CHUẨN SENIOR: HTTPS + TLS 1.3 bảo mật kênh truyền. URL chuẩn RESTful (/v1/posts/42/likes) sử dụng PUT mang tính Idempotent (bấm like nhiều lần không bị cộng trùng lượt thích). Trả 204 No Content tối ưu băng thông.',
        analysisTone: 'ok',
        passedChallengeId: 'rest-api/01-network-http-rest/2',
      };
    }
  }

  if (normId === 'sc-bigint') {
    if (mode === 'junior') {
      return {
        scenarioId: 'sc-bigint',
        mode: 'junior',
        hops: [
          { label: '1. Client', status: 'lit' },
          { label: '2. DNS/TLS', status: 'lit' },
          { label: '3. Gateway', status: 'lit' },
          { label: '4. Service', status: 'err' },
          { label: '5. Database', status: 'idle' },
        ],
        rawRequest:
          'POST /v1/transactions HTTP/1.1\nHost: api.janegram.com\nContent-Type: application/json\n\n{"tx_id": 9007199254740993}',
        rawResponse:
          'HTTP/1.1 200 OK\n\n{"processed_id": 9007199254740992}',
        analysis:
          'LỖI JUNIOR: Số nguyên 9007199254740993 vượt quá Number.MAX_SAFE_INTEGER (2^53 - 1). JSON parser làm tròn thành 9007199254740992 gây sai lệch ID tài chính nghiêm trọng!',
        analysisTone: 'crit',
      };
    } else {
      return {
        scenarioId: 'sc-bigint',
        mode: 'senior',
        hops: [
          { label: '1. Client', status: 'lit' },
          { label: '2. DNS/TLS', status: 'lit' },
          { label: '3. Gateway', status: 'lit' },
          { label: '4. Service', status: 'lit' },
          { label: '5. Database', status: 'lit' },
        ],
        rawRequest:
          'POST /v1/transactions HTTP/1.1\nHost: api.janegram.com\nContent-Type: application/json\n\n{"tx_id": "9007199254740993"}',
        rawResponse:
          'HTTP/1.1 201 Created\n\n{"processed_id": "9007199254740993"}',
        analysis:
          'CHUẨN SENIOR: ID số nguyên lớn (> 2^53 - 1) và ngày giờ luôn được biểu diễn dưới dạng String trong JSON payload để bảo toàn 100% độ chính xác trên mọi client runtime.',
        analysisTone: 'ok',
        passedChallengeId: 'rest-api/01-network-http-rest/3',
      };
    }
  }

  // sc-stateless
  const workerNode =
    options?.workerNodeIndex === 1 ? 'worker-node-01' : 'worker-node-03';

  return {
    scenarioId: 'sc-stateless',
    mode,
    hops: [
      { label: '1. Client', status: 'lit' },
      { label: '2. DNS/TLS', status: 'lit' },
      { label: '3. Gateway', status: 'lit' },
      { label: '4. Service', status: 'lit' },
      { label: '5. Database', status: 'lit' },
    ],
    rawRequest:
      'GET /v1/profile HTTP/1.1\nHost: api.janegram.com\nAuthorization: Bearer jwt-token-with-signature',
    rawResponse: `HTTP/1.1 200 OK\nX-Served-By: ${workerNode}\n\n{"user": "janedoe", "stateless": true}`,
    analysis: `KIẾN TRÚC STATELESS: Server không lưu session state trong bộ nhớ cục bộ của tiến trình. Request được cân bằng tải vào bất kỳ worker node nào (${workerNode}) vẫn xác thực thành công nhờ token độc lập.`,
    analysisTone: 'ok',
    workerNode,
  };
}

/**
 * 3. Đánh giá hoàn thành Challenge thực chất
 */
export function evaluateChallenges(input: ChallengeEvaluationInput): string[] {
  const passed = new Set<string>();

  // Challenge 1: Bấm khám phá ít nhất 3 thành phần URL Anatomy
  if (input.visitedParts && input.visitedParts.length >= 3) {
    passed.add('rest-api/01-network-http-rest/1');
  }

  // Challenge 2: Phải chứng kiến lỗi ở Junior rồi chạy Senior chuẩn TLS 5 chặng
  const hasJuniorWifi = input.history.some(
    (h) => h.scenarioId === 'sc-wifi' && h.mode === 'junior'
  );
  const hasSeniorWifi = input.history.some(
    (h) =>
      h.scenarioId === 'sc-wifi' &&
      h.mode === 'senior' &&
      h.hops.every((hop) => hop.status === 'lit')
  );
  if (hasJuniorWifi && hasSeniorWifi) {
    passed.add('rest-api/01-network-http-rest/2');
  }

  // Challenge 3: Đã chạy kịch bản BigInt ở chế độ Senior với định dạng chuỗi
  const hasSeniorBigInt = input.history.some(
    (h) =>
      h.scenarioId === 'sc-bigint' &&
      h.mode === 'senior' &&
      h.rawRequest.includes('"tx_id": "9007199254740993"')
  );
  if (hasSeniorBigInt) {
    passed.add('rest-api/01-network-http-rest/3');
  }

  return Array.from(passed);
}
