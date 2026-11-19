import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

test.describe('Module 01: Nền tảng Mạng, HTTP & REST E2E Spec', () => {
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
    test(`verifies Module 01 interactive sandbox and challenges at ${vp.name}`, async ({
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

      // 1. Verify No Global Vertical Scroll
      const dimensions = await page.evaluate(() => ({
        scrollHeight: document.documentElement.scrollHeight,
        innerHeight: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(dimensions.scrollHeight).toBeLessThanOrEqual(
        dimensions.innerHeight + 1
      );
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth);

      // 2. Test Challenge 1: URL Anatomy Tool in Tab 1
      await expect(page.locator('#wb-tab-theory')).toHaveClass(/active/);
      const schemePill = page.locator('.url-pill[data-part="scheme"]');
      const hostPill = page.locator('.url-pill[data-part="host"]');
      const pathPill = page.locator('.url-pill[data-part="path"]');

      await schemePill.click();
      await expect(page.locator('#url-anatomy-explain')).toContainText(
        'Scheme (https://)'
      );

      await hostPill.click();
      await expect(page.locator('#url-anatomy-explain')).toContainText(
        'Host (api.janegram.com)'
      );

      await pathPill.click();
      await expect(page.locator('#url-anatomy-explain')).toContainText('Path');

      // Check Challenge 1 is passed
      await page.locator('#wb-tab-challenges').click();
      const ch1Card = page.locator(
        '[data-challenge-id="rest-api/01-network-http-rest/1"]'
      );
      await expect(ch1Card).toHaveClass(/passed/);

      // 3. Test Challenge 2: Wi-Fi Cafe (HTTP vs HTTPS TLS)
      // Run in Junior Mode
      await page.locator('#btn-mode-junior').click();
      await page.locator('#m1-sc-1').click();

      // Check Inspector for Junior errors
      await page.locator('#wb-tab-inspector').click();
      await expect(page.locator('#tl-raw-req')).toContainText(
        'GET /likeIt?user=janedoe'
      );
      await expect(page.locator('#tl-analysis')).toContainText('CẢNH BÁO JUNIOR');

      // Run in Senior Mode
      await page.locator('#btn-mode-senior').click();
      await page.locator('#m1-sc-1').click();

      // Check Inspector for Senior standards
      await expect(page.locator('#tl-raw-req')).toContainText(
        'PUT /v1/posts/42/likes'
      );
      await expect(page.locator('#tl-raw-req')).toContainText('[ENCRYPTED_TLS]');
      await expect(page.locator('#tl-raw-res')).toContainText('204 No Content');
      await expect(page.locator('#tl-analysis')).toContainText('CHUẨN SENIOR');

      // Check Challenge 2 is passed
      await page.locator('#wb-tab-challenges').click();
      const ch2Card = page.locator(
        '[data-challenge-id="rest-api/01-network-http-rest/2"]'
      );
      await expect(ch2Card).toHaveClass(/passed/);

      // 4. Test Challenge 3: BigInt JSON precision
      // Run Junior BigInt
      await page.locator('#btn-mode-junior').click();
      await page.locator('#m1-sc-3').click();

      // Check Inspector for precision loss
      await page.locator('#wb-tab-inspector').click();
      await expect(page.locator('#tl-raw-res')).toContainText('9007199254740992');
      await expect(page.locator('#tl-analysis')).toContainText('LỖI JUNIOR');

      // Run Senior BigInt
      await page.locator('#btn-mode-senior').click();
      await page.locator('#m1-sc-3').click();

      // Check Inspector for String preservation
      await expect(page.locator('#tl-raw-req')).toContainText('"tx_id": "9007199254740993"');
      await expect(page.locator('#tl-raw-res')).toContainText(
        '"processed_id": "9007199254740993"'
      );
      await expect(page.locator('#tl-analysis')).toContainText('CHUẨN SENIOR');

      // Check Challenge 3 is passed
      await page.locator('#wb-tab-challenges').click();
      const ch3Card = page.locator(
        '[data-challenge-id="rest-api/01-network-http-rest/3"]'
      );
      await expect(ch3Card).toHaveClass(/passed/);

      // Verify all 3 challenge cards passed
      const passedCards = page.locator('.challenge-card.passed');
      await expect(passedCards).toHaveCount(3);

      // 5. Screenshot
      await page.screenshot({
        path: path.join(screensDir, `module-01-${vp.name}.png`),
      });
    });
  }
});
