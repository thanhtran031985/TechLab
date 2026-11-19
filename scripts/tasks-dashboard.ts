import fs from 'node:fs';
import path from 'node:path';

function generateDashboard(): void {
  const readmePath = path.resolve(process.cwd(), 'docs', 'tasks', 'README.md');
  if (!fs.existsSync(readmePath)) {
    console.error('docs/tasks/README.md not found');
    process.exit(1);
  }

  const readmeContent = fs.readFileSync(readmePath, 'utf-8');
  const taskDirs = fs
    .readdirSync(path.resolve(process.cwd(), 'docs', 'tasks'), { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== '_template' && dirent.name !== '_archive')
    .map((dirent) => dirent.name);

  const tasksData: Array<{ id: string; name: string; status: string; progressHtml: string }> = [];

  for (const dir of taskDirs) {
    const progressPath = path.resolve(process.cwd(), 'docs', 'tasks', dir, 'progress.md');
    let progressHtml = '<p>Chưa có tiến độ chi tiết</p>';
    let taskStatus = '⬜';

    if (fs.existsSync(progressPath)) {
      const progContent = fs.readFileSync(progressPath, 'utf-8');
      const statusMatch = progContent.match(/Trạng thái:\s*([^\r\n]+)/);
      if (statusMatch) {
        taskStatus = statusMatch[1].trim();
      }
      progressHtml = `<pre style="font-family: Consolas, monospace; font-size: 12px; background: #2E2E2E; color: #F0F0F0; padding: 8px; border-radius: 4px; overflow-x: auto;">${progContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')}</pre>`;
    }

    tasksData.push({
      id: dir,
      name: dir,
      status: taskStatus,
      progressHtml,
    });
  }

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TechLab — Bảng điều khiển Task</title>
  <style>
    body {
      font-family: "Segoe UI", Roboto, Arial, sans-serif;
      background: #F5F5F5;
      color: #242424;
      margin: 0;
      padding: 24px;
    }
    header {
      margin-bottom: 24px;
      border-bottom: 1px solid #E0E0E0;
      padding-bottom: 16px;
    }
    h1 {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      background: #EBF3FC;
      color: #0F6CBD;
    }
    .task-card {
      background: #FFFFFF;
      border: 1px solid #E0E0E0;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .task-title {
      font-size: 15px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <header>
    <h1>TechLab — Bảng điều khiển Task</h1>
    <div>Trạng thái: ⬜ chưa làm · 🔄 đang làm · ❓ có code chưa rà soát · ⚠️ khác task.md · ❌ thiếu · ✅ xong</div>
  </header>
  <main>
    ${tasksData
      .map(
        (t) => `
      <div class="task-card">
        <div class="task-header">
          <span class="task-title">${t.name}</span>
          <span class="badge">${t.status}</span>
        </div>
        ${t.progressHtml}
      </div>`
      )
      .join('\n')}
  </main>
</body>
</html>`;

  const outputPath = path.resolve(process.cwd(), 'docs', 'tasks', 'dashboard.html');
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`Đã cập nhật dashboard: ${outputPath}`);
}

generateDashboard();
