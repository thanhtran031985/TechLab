import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

test.describe('TechLab AppShell & Home Page Smoke Test', () => {
  const screensDir = path.resolve(process.cwd(), 'tests', 'e2e', '__screens__');

  test.beforeAll(() => {
    if (!fs.existsSync(screensDir)) {
      fs.mkdirSync(screensDir, { recursive: true });
    }
  });

  const viewports = [
    { name: '1366x768', width: 1366, height: 768 },
    { name: '1440x900', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    test(`renders home page without global scroll at ${vp.name} (Light & Dark)`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Verify no critical console errors
      expect(consoleErrors).toEqual([]);

      // Check header and content are visible
      await expect(page.locator('text=Danh sách khóa học')).toBeVisible();
      await expect(
        page.locator('text=REST API Design Like a Senior Engineer')
      ).toBeVisible();

      // Check NO global vertical scroll: document.documentElement.scrollHeight <= window.innerHeight
      const dimensions = await page.evaluate(() => ({
        scrollHeight: document.documentElement.scrollHeight,
        innerHeight: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));

      expect(dimensions.scrollHeight).toBeLessThanOrEqual(
        dimensions.innerHeight + 1
      ); // allow 1px rounding
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth);

      // Screenshot Light Mode
      await page.screenshot({
        path: path.join(screensDir, `home-${vp.name}-light.png`),
      });

      // Toggle Dark Mode
      const themeToggle = page.locator(
        'button[aria-label="Chuyển sang chế độ Tối"]'
      );
      await themeToggle.click();

      // Verify data-theme="dark" on <html>
      const themeAttr = await page.getAttribute('html', 'data-theme');
      expect(themeAttr).toBe('dark');

      // Screenshot Dark Mode
      await page.screenshot({
        path: path.join(screensDir, `home-${vp.name}-dark.png`),
      });

      // Toggle back to Light Mode
      const lightToggle = page.locator(
        'button[aria-label="Chuyển sang chế độ Sáng"]'
      );
      await lightToggle.click();
      const themeAttrLight = await page.getAttribute('html', 'data-theme');
      expect(themeAttrLight).toBe('light');
    });
  }

  test('calls /api/health directly and verifies status', async ({
    request,
  }) => {
    const res = await request.get('/api/health');
    expect(res.ok()).toBe(true);
    const json = await res.json();
    expect(json).toEqual({
      ok: true,
      data: {
        status: 'up',
        db: 'sqlite',
        journalMode: 'wal',
      },
    });
  });
});
