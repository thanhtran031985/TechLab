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
      if (typeof val === 'string') {
        rootVars.push(`  --${key}: ${val};`);
      } else {
        if (val.light) rootVars.push(`  --${key}: ${val.light};`);
        if (val.dark) darkVars.push(`  --${key}: ${val.dark};`);
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
      const v = typeof val === 'number' ? (key.startsWith('radius') || key.endsWith('-h') || key.endsWith('-w') ? `${val}px` : val) : (val.value || val);
      rootVars.push(`  --${key}: ${v};`);
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

  const css = `/* SINH TỪ designs/tokens.json — KHÔNG SỬA TAY */
:root {
${rootVars.join('\n')}
}${darkVars.length > 0 ? `\n\n[data-theme="dark"] {\n${darkVars.join('\n')}\n}` : ''}
`;

  const cssPath = path.resolve(process.cwd(), 'designs', 'tokens.css');
  fs.writeFileSync(cssPath, css, 'utf-8');

  // Generate docs/DESIGN_SYSTEM.md
  const markdown = `# Hệ thống Thiết kế TechLab (Design System)

_Tự động sinh từ \`designs/tokens.json\` qua lệnh \`pnpm tokens:gen\`. Không sửa file này bằng tay._

## 1. Nguyên tắc cốt lõi (Senior API Lab Dark Studio)
- **Màn hình lớn trước:** Tối ưu chuẩn 1440×900, hiển thị tốt ở 1366×768.
- **Không cuộn toàn cục:** Ở độ phân giải ≥ 1366×768, \`document.documentElement.scrollHeight <= innerHeight\`. Cuộn xảy ra nội bộ trong từng panel (\`flex-1 min-h-0 overflow-y-auto\`).
- **Nền Dark Studio:** Slate-950 (\`#020617\`), Emerald/Teal (\`#10b981\`) cho Senior & bài đang học, Amber (\`#f59e0b\`) cho Junior (First-Try), Rose (\`#fb7185\`) cho cảnh báo lỗi.
- **Icon chuẩn:** Dùng duy nhất \`lucide-react\` kích thước nét 16px.

## 2. Bảng Màu (Colors)
| Token | Giá trị |
|---|---|
${Object.entries(tokens.color as Record<string, any>)
  .map(([k, v]) => `| \`--${k}\` | \`${typeof v === 'string' ? v : v.light || v.dark || '—'}\` |`)
  .join('\n')}

## 3. Kiểu Chữ (Typography)
- Phông giao diện: \`--font-ui\` (${tokens.font?.ui})
- Phông mã nguồn / HTTP / JSON: \`--font-mono\` (${tokens.font?.mono})

## 4. Kích thước chuẩn (Layout & Controls)
| Hạng mục | Token | Giá trị |
|---|---|---|
| Header cao | \`--header-h\` | 56px |
| Sidebar rộng | \`--sidebar-w\` | 248px |
| Simulator min width | \`--sim-min-w\` | 360px |
`;

  const docPath = path.resolve(process.cwd(), 'docs', 'DESIGN_SYSTEM.md');
  fs.writeFileSync(docPath, markdown, 'utf-8');

  console.log(`Đã sinh CSS: ${cssPath}`);
  console.log(`Đã sinh tài liệu: ${docPath}`);
}

if (process.argv[1] && process.argv[1].endsWith('gen-tokens.ts')) {
  generateTokens();
}
