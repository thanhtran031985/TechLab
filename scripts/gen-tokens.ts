import fs from 'node:fs';
import path from 'node:path';

export function generateTokens(): void {
  const jsonPath = path.resolve(process.cwd(), 'designs', 'tokens.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Token file not found at ${jsonPath}`);
  }

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const tokens = JSON.parse(raw);

  const rootVars: string[] = [];
  const darkVars: string[] = [];

  // Font
  if (tokens.font) {
    for (const [key, val] of Object.entries(tokens.font)) {
      rootVars.push(`  --font-${key}: ${val};`);
    }
  }

  // Colors
  if (tokens.color) {
    for (const [key, val] of Object.entries(tokens.color as Record<string, any>)) {
      if (val.light) {
        rootVars.push(`  --${key}: ${val.light};`);
      }
      if (val.dark) {
        darkVars.push(`  --${key}: ${val.dark};`);
      }
    }
  }

  // Typography
  if (tokens.type) {
    for (const [key, val] of Object.entries(tokens.type as Record<string, any>)) {
      if (val.size) rootVars.push(`  --type-${key}-size: ${val.size};`);
      if (val.line) rootVars.push(`  --type-${key}-line: ${val.line};`);
      if (val.weight) rootVars.push(`  --type-${key}-weight: ${val.weight};`);
    }
  }

  // Spacing
  if (tokens.space) {
    for (const [key, val] of Object.entries(tokens.space as Record<string, any>)) {
      rootVars.push(`  --space-${key}: ${val.value || val};`);
    }
  }

  // Radius
  if (tokens.radius) {
    for (const [key, val] of Object.entries(tokens.radius as Record<string, any>)) {
      rootVars.push(`  --radius-${key}: ${val.value || val};`);
    }
  }

  // Size
  if (tokens.size) {
    for (const [key, val] of Object.entries(tokens.size as Record<string, any>)) {
      rootVars.push(`  --size-${key}: ${val.value || val};`);
    }
  }

  // Elevation
  if (tokens.elevation) {
    for (const [key, val] of Object.entries(tokens.elevation as Record<string, any>)) {
      rootVars.push(`  --shadow-${key}: ${val.value || val};`);
    }
  }

  // Motion
  if (tokens.motion) {
    for (const [key, val] of Object.entries(tokens.motion as Record<string, any>)) {
      rootVars.push(`  --motion-${key}: ${val.value || val};`);
    }
  }

  const css = `/* SINH TỪ designs/tokens.json – không sửa tay */
:root {
${rootVars.join('\n')}
}

[data-theme="dark"] {
${darkVars.join('\n')}
}
`;

  const cssPath = path.resolve(process.cwd(), 'designs', 'tokens.css');
  fs.writeFileSync(cssPath, css, 'utf-8');

  // Generate docs/DESIGN_SYSTEM.md
  const markdown = `# Hệ thống Thiết kế TechLab (Design System)

_Tự động sinh từ \`designs/tokens.json\` qua lệnh \`pnpm tokens:gen\`. Không sửa file này bằng tay._

## 1. Nguyên tắc cốt lõi (Fluent Compact + Master–Detail)
- **Màn hình lớn trước:** Tối ưu chuẩn 1440×900, hiển thị tốt ở 1366×768.
- **Không cuộn toàn cục:** Ở độ phân giải ≥ 1366×768, \`document.documentElement.scrollHeight <= innerHeight\`. Cuộn xảy ra nội bộ trong từng panel (\`flex-1 min-h-0 overflow-y-auto\`).
- **Mặt sáng mặc định:** Nền \`#F5F5F5\`, bề mặt panel \`#FFFFFF\`, viền mảnh 1px.
- **Dark Mode:** Điều khiển bằng thuộc tính \`data-theme="dark"\` trên thẻ \`<html>\`.
- **Icon chuẩn:** Dùng duy nhất \`lucide-react\` kích thước nét 16px.

## 2. Bảng Màu (Colors)
| Token | Light Mode | Dark Mode | Mục đích |
|---|---|---|---|
${Object.entries(tokens.color as Record<string, any>)
  .map(([k, v]) => `| \`--${k}\` | \`${v.light || '—'}\` | \`${v.dark || '—'}\` | ${v.use || ''} |`)
  .join('\n')}

## 3. Kiểu Chữ (Typography)
- Phông giao diện: \`--font-ui\` (${tokens.font?.ui})
- Phông mã nguồn / HTTP / JSON: \`--font-mono\` (${tokens.font?.mono})

| Cấp bậc | Cỡ (Size) | Độ cao dòng (Line) | Độ đậm (Weight) |
|---|---|---|---|
${Object.entries(tokens.type as Record<string, any>)
  .map(([k, v]) => `| \`${k}\` | ${v.size} | ${v.line} | ${v.weight} |`)
  .join('\n')}

## 4. Kích thước chuẩn (Layout & Controls)
| Hạng mục | Token | Giá trị |
|---|---|---|
| Thanh bên (Sidebar mở rộng) | \`--size-nav\` | 200px |
| Thanh bên (Sidebar thu gọn) | \`--size-nav-collapsed\` | 48px |
| Thanh trên (Header 1 dòng) | \`--size-header\` | 44px |
| Control tiêu chuẩn (Input, Button) | \`--size-control\` | 30px |
| Control nhỏ gọn | \`--size-control-sm\` | 26px |
| Ngăn kéo Ghi chú | \`--size-drawer\` | 480px |
| Panel Chi tiết (Master–Detail) | \`--size-detail-panel\` | 320px |
| Command bar | \`--size-commandbar\` | 40px |
`;

  const docPath = path.resolve(process.cwd(), 'docs', 'DESIGN_SYSTEM.md');
  fs.writeFileSync(docPath, markdown, 'utf-8');

  console.log(`Đã sinh CSS: ${cssPath}`);
  console.log(`Đã sinh tài liệu: ${docPath}`);
}

if (process.argv[1] && process.argv[1].endsWith('gen-tokens.ts')) {
  generateTokens();
}
