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
    .readdirSync(path.resolve(process.cwd(), 'docs', 'tasks'), {
      withFileTypes: true,
    })
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        dirent.name !== '_template' &&
        dirent.name !== '_archive'
    )
    .map((dirent) => dirent.name);

  const tasksData: Array<{
    id: string;
    title: string;
    stage: string;
    status: string;
    branch: string;
    steps: Array<{
      step: string;
      content: string;
      status: string;
      date: string;
      commit: string;
    }>;
  }> = [];

  for (const dir of taskDirs) {
    const progressPath = path.resolve(
      process.cwd(),
      'docs',
      'tasks',
      dir,
      'progress.md'
    );
    let taskStatus = '⬜';
    const steps: Array<{
      step: string;
      content: string;
      status: string;
      date: string;
      commit: string;
    }> = [];

    if (fs.existsSync(progressPath)) {
      const progContent = fs.readFileSync(progressPath, 'utf-8');
      const statusMatch = progContent.match(/Trạng thái:\s*([^\r\n]+)/);
      if (statusMatch) {
        taskStatus = statusMatch[1].trim();
      }

      const tableLines = progContent.split('\n');
      for (const line of tableLines) {
        const rowMatch = line.match(
          /^\|\s*(\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]*)\s*\|\s*([^|]*)\s*\|/
        );
        if (rowMatch) {
          steps.push({
            step: rowMatch[1].trim(),
            content: rowMatch[2].trim(),
            status: rowMatch[3].trim(),
            date: rowMatch[4].trim(),
            commit: rowMatch[5].trim(),
          });
        }
      }
    }

    tasksData.push({
      id: dir,
      title: dir,
      stage: 'GĐ0',
      status: taskStatus,
      branch: `feat/${dir}`,
      steps,
    });
  }

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TechLab — Bảng điều khiển Task</title>
  <style>
    :root {
      --bg: #F5F5F5;
      --surface: #FFFFFF;
      --surface-2: #FAFAFA;
      --line: #E0E0E0;
      --ink: #242424;
      --ink-soft: #616161;
      --primary: #0F6CBD;
      --primary-soft: #EBF3FC;
      --ok: #107C10;
      --ok-soft: #F1FAF1;
      --warn: #BC4B09;
      --warn-soft: #FFF9F5;
    }
    body {
      font-family: "Segoe UI", Roboto, Arial, sans-serif;
      background: var(--bg);
      color: var(--ink);
      margin: 0;
      padding: 24px;
      font-size: 13px;
    }
    header {
      margin-bottom: 20px;
      border-bottom: 1px solid var(--line);
      padding-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    h1 {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
    }
    .legend {
      color: var(--ink-soft);
      font-size: 12px;
    }
    .task-card {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.06);
    }
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      border-bottom: 1px solid var(--line);
      padding-bottom: 8px;
    }
    .task-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--ink);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      background: var(--primary-soft);
      color: var(--primary);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    th, td {
      padding: 6px 10px;
      text-align: left;
      border-bottom: 1px solid var(--line);
    }
    th {
      background: var(--surface-2);
      font-weight: 600;
      color: var(--ink-soft);
      font-size: 11px;
      text-transform: uppercase;
    }
    code {
      font-family: Consolas, monospace;
      font-size: 11px;
      background: var(--surface-2);
      padding: 2px 4px;
      border-radius: 3px;
      border: 1px solid var(--line);
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>TechLab — Bảng điều khiển Task</h1>
      <div class="legend">Theo dõi tiến độ phát triển theo Content-as-Code & TDD</div>
    </div>
    <div class="legend">Trạng thái: ⬜ chưa làm · 🔄 đang làm · ❓ có code chưa rà soát · ⚠️ khác task.md · ❌ thiếu · ✅ xong</div>
  </header>
  <main>
    ${tasksData
      .map(
        (t) => `
      <div class="task-card">
        <div class="task-header">
          <div>
            <span class="task-title">${t.title}</span>
            <span style="margin-left: 8px; color: var(--ink-soft); font-size: 12px;">(Nhánh: <code>${t.branch}</code>)</span>
          </div>
          <span class="badge">Trạng thái: ${t.status}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 50px;">Bước</th>
              <th>Nội dung</th>
              <th style="width: 80px; text-align: center;">Trạng thái</th>
              <th style="width: 100px;">Ngày</th>
              <th style="width: 120px;">Commit</th>
            </tr>
          </thead>
          <tbody>
            ${t.steps
              .map(
                (s) => `
              <tr>
                <td><strong>${s.step}</strong></td>
                <td>${s.content}</td>
                <td style="text-align: center;">${s.status}</td>
                <td>${s.date || '—'}</td>
                <td>${s.commit ? `<code>${s.commit.replace(/`/g, '')}</code>` : '—'}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>`
      )
      .join('\n')}
  </main>
</body>
</html>`;

  const outputPath = path.resolve(
    process.cwd(),
    'docs',
    'tasks',
    'dashboard.html'
  );
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`Đã cập nhật dashboard: ${outputPath}`);
}

generateDashboard();
