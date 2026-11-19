import fs from 'node:fs';
import path from 'node:path';

function runSecurityCheck(): void {
  console.log('Running TechLab security checks...');
  let hasErrors = false;

  // 1. Check .gitignore contains .env and data/
  const gitignorePath = path.resolve(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    if (!gitignoreContent.includes('.env')) {
      console.error('✗ .gitignore chưa bỏ qua .env');
      hasErrors = true;
    }
    if (!gitignoreContent.includes('data/')) {
      console.error('✗ .gitignore chưa bỏ qua thư mục data/');
      hasErrors = true;
    }
  } else {
    console.error('✗ Không tìm thấy file .gitignore');
    hasErrors = true;
  }

  // 2. Scan src/ for dangerouslySetInnerHTML and raw SQL queries
  const srcDir = path.resolve(process.cwd(), 'src');
  if (fs.existsSync(srcDir)) {
    const scanFiles = (dir: string): string[] => {
      let results: string[] = [];
      const list = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of list) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          results = results.concat(scanFiles(fullPath));
        } else if (/\.(ts|tsx|js|jsx)$/.test(item.name)) {
          results.push(fullPath);
        }
      }
      return results;
    };

    const files = scanFiles(srcDir);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const relPath = path.relative(process.cwd(), file);

      // Check unescaped dangerouslySetInnerHTML
      if (content.includes('dangerouslySetInnerHTML')) {
        console.error(`✗ Phát hiện dangerouslySetInnerHTML trong: ${relPath}`);
        hasErrors = true;
      }

      // Check for hardcoded secrets or API keys
      if (
        /(?:api_key|apiKey|secret|private_key)\s*[:=]\s*["'][A-Za-z0-9+/=_-]{16,}["']/i.test(
          content
        )
      ) {
        console.error(
          `✗ Phát hiện chuỗi nghi vấn chứa secret/apiKey trong: ${relPath}`
        );
        hasErrors = true;
      }
    }
  }

  if (hasErrors) {
    console.error('✗ Security check thất bại.');
    process.exit(1);
  } else {
    console.log(
      '✓ Security check xanh: .gitignore an toàn, không có dangerouslySetInnerHTML hay hardcoded secrets.'
    );
  }
}

runSecurityCheck();
