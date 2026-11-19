import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

test.describe('TechLab Dark Studio & LabShell E2E Test Suite', () => {
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

  // 1. Home Page Portal Tests
  for (const vp of viewports) {
    test(`renders home portal at ${vp.name} without global scroll`, async ({
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

      expect(consoleErrors).toEqual([]);

      // Verify portal header elements
      await expect(page.locator('.brand-title')).toHaveText('TechLab Portal');
      await expect(page.locator('.progress-pill')).toBeVisible();
      await expect(page.locator('#btn-open-cheatsheet')).toBeVisible();

      // Verify home cards
      await expect(page.locator('text=REST API Design Like a Senior Engineer')).toBeVisible();
      await expect(page.locator('text=Khóa học tiếp theo')).toBeVisible();

      // Verify NO global vertical scroll
      const dimensions = await page.evaluate(() => ({
        scrollHeight: document.documentElement.scrollHeight,
        innerHeight: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));

      expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.innerHeight + 1);
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth);

      // Screenshot Home Portal
      await page.screenshot({
        path: path.join(screensDir, `home-portal-${vp.name}.png`),
      });

      // Test Cheat Sheet modal on Home Page
      await page.locator('#btn-open-cheatsheet').click();
      await expect(page.locator('#tl-cheatsheet-modal')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#tl-cheatsheet-modal')).not.toBeVisible();
    });
  }

  // 2. Navigation from Home to Lab
  test('navigates from home to Module 01 via "Vào ngay Module 01"', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const enterBtn = page.locator('text=Vào ngay Module 01');
    await expect(enterBtn).toBeVisible();
    await enterBtn.click();

    await page.waitForURL('**/courses/rest-api/01-network-http-rest');
    await expect(page.locator('.brand-title')).toHaveText('Senior API Lab');
  });

  // 3. Lab Module 01 Detailed Tests at 1366x768 and 1440x900
  for (const vp of viewports) {
    test(`renders Lab Module 01 at ${vp.name} without global scroll and interacts properly`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/courses/rest-api/01-network-http-rest');

      expect(consoleErrors).toEqual([]);

      // Check header elements
      await expect(page.locator('.brand-title')).toHaveText('Senior API Lab');
      await expect(page.locator('.mode-switch')).toBeVisible();
      await expect(page.locator('#btn-open-cheatsheet')).toBeVisible();

      // Check 3-column elements
      await expect(page.locator('.module-sidebar')).toBeVisible();
      await expect(page.locator('.sim-column')).toBeVisible();
      await expect(page.locator('.workbench-column')).toBeVisible();

      // Verify no global vertical scroll
      const dimensions = await page.evaluate(() => ({
        scrollHeight: document.documentElement.scrollHeight,
        innerHeight: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.innerHeight + 1);
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth);

      // Verify 10 modules listed in sidebar
      const moduleLinks = page.locator('.module-item');
      await expect(moduleLinks).toHaveCount(10);

      // Verify active module is module 01
      const activeModule = page.locator('.module-item.active');
      await expect(activeModule).toContainText('HTTP, REST & Mạng');

      // Screenshot Junior mode
      await page.screenshot({
        path: path.join(screensDir, `lab-${vp.name}-junior.png`),
      });

      // Switch to Senior Mode
      const seniorBtn = page.locator('#btn-mode-senior');
      await seniorBtn.click();
      await expect(seniorBtn).toHaveClass(/active-senior/);

      // Screenshot Senior mode
      await page.screenshot({
        path: path.join(screensDir, `lab-${vp.name}-senior.png`),
      });

      // Switch back to Junior Mode
      const juniorBtn = page.locator('#btn-mode-junior');
      await juniorBtn.click();
      await expect(juniorBtn).toHaveClass(/active-junior/);

      // Test Cheat Sheet Modal in Lab
      await page.locator('#btn-open-cheatsheet').click();
      await expect(page.locator('#tl-cheatsheet-modal')).toBeVisible();
      await expect(page.locator('text=API Cheat Sheet')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#tl-cheatsheet-modal')).not.toBeVisible();

      // Test Workbench Tabs
      // Tab 1 (Theory) is active by default
      await expect(page.locator('#wb-tab-theory')).toHaveClass(/active/);
      await expect(page.locator('#url-anatomy-explain')).toBeVisible();

      // Test URL Anatomy interactive pill click
      const schemePill = page.locator('.url-pill[data-part="scheme"]');
      await schemePill.click();
      await expect(page.locator('#url-anatomy-explain')).toContainText('Scheme (https://)');

      const hostPill = page.locator('.url-pill[data-part="host"]');
      await hostPill.click();
      await expect(page.locator('#url-anatomy-explain')).toContainText('Host (api.janegram.com)');

      // Switch to Tab 2 (Inspector)
      await page.locator('#wb-tab-inspector').click();
      await expect(page.locator('#wb-tab-inspector')).toHaveClass(/active/);
      await expect(page.locator('#tl-hops')).toBeVisible();

      // Switch to Tab 3 (Challenges)
      await page.locator('#wb-tab-challenges').click();
      await expect(page.locator('#wb-tab-challenges')).toHaveClass(/active/);
      await expect(page.locator('.challenge-card')).toHaveCount(3);

      // Execute Simulator action: Click like button in Junior mode
      const likeBtn = page.locator('#m1-btn-like');
      await expect(likeBtn).toBeVisible();
      await likeBtn.click();

      // Go back to Tab 2 (Inspector) and verify request/response
      await page.locator('#wb-tab-inspector').click();
      await expect(page.locator('#tl-raw-req')).toContainText('GET /likeIt?user=janedoe');
      await expect(page.locator('#tl-analysis')).toContainText('CẢNH BÁO JUNIOR');

      // Now switch to Senior Mode and trigger like again
      await page.locator('#btn-mode-senior').click();
      await likeBtn.click();
      await expect(page.locator('#tl-raw-req')).toContainText('PUT /v1/posts/42/likes');
      await expect(page.locator('#tl-analysis')).toContainText('CHUẨN SENIOR');

      // Check that Challenge 2 is marked PASSED
      await page.locator('#wb-tab-challenges').click();
      const passedCards = page.locator('.challenge-card.passed');
      await expect(passedCards.first()).toBeVisible();
    });
  }

  // 4. Test Sidebar Navigation across modules
  test('navigates between modules using left sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/courses/rest-api/01-network-http-rest');

    // Click module 02 link
    const module02Link = page.locator('.module-item[href*="02-resource-modeling"]');
    await module02Link.click();

    await page.waitForURL('**/courses/rest-api/02-resource-modeling');
    const activeModule = page.locator('.module-item.active');
    await expect(activeModule).toContainText('Resource & Cấu trúc URL');

    // Click module 01 link back
    const module01Link = page.locator('.module-item[href*="01-network-http-rest"]');
    await module01Link.click();

    await page.waitForURL('**/courses/rest-api/01-network-http-rest');
    await expect(page.locator('.module-item.active')).toContainText('HTTP, REST & Mạng');
  });
});
