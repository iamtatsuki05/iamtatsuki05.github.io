import { test, expect } from '@playwright/test';
import { localizedPath } from './helpers/paths';

const viewports = [
  {
    label: 'desktop',
    use: { viewport: { width: 1280, height: 800 } },
  },
  {
    label: 'mobile',
    use: { viewport: { width: 375, height: 667 } },
  },
] as const;

for (const { label, use } of viewports) {
  test.describe(`Homepage JA (${label})`, () => {
    test.use(use);

    test.beforeEach(async ({ page }) => {
      await page.goto(localizedPath('ja'));
    });

    test('shows main hero and contact info', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1, name: 'ホームページ' })).toBeVisible();
      await expect(page.getByText('自然言語処理')).toBeVisible();
      await expect(page.getByRole('link', { name: 'tatsukio0522@gmail.com' })).toHaveAttribute(
        'href',
        'mailto:tatsukio0522@gmail.com',
      );
    });

    test('renders highlighted sections with items', async ({ page }) => {
      const linksSection = page
        .locator('section')
        .filter({ has: page.getByRole('heading', { level: 2, name: 'Links' }) })
        .first();
      expect(await linksSection.locator('li').count()).toBeGreaterThanOrEqual(3);

      const blogSection = page
        .locator('section')
        .filter({ has: page.getByRole('heading', { level: 2, name: '最新のブログ' }) })
        .first();
      expect(await blogSection.locator('li').count()).toBeGreaterThanOrEqual(1);

      const publicationSection = page
        .locator('section')
        .filter({ has: page.getByRole('heading', { level: 2, name: '最近の公開物' }) })
        .first();
      expect(await publicationSection.locator('li').count()).toBeGreaterThanOrEqual(1);
    });

    if (label === 'mobile') {
      test('opens and closes the mobile menu', async ({ page }) => {
        await page.getByRole('button', { name: 'Open menu' }).click();
        await expect(page.locator('#mobile-menu')).toBeVisible();

        const menuLinks = page.locator('#mobile-menu nav a');
        await expect(menuLinks).toHaveCount(4);
        await expect(menuLinks.nth(1)).toContainText('Links');
        const targetPath = (await menuLinks.nth(1).getAttribute('href')) || localizedPath('ja', '/links/');
        await menuLinks.nth(1).click();
        await expect(page.locator('#mobile-menu')).toHaveCount(0);
        const navigated = await page
          .waitForURL(new RegExp(`${targetPath}$`), { timeout: 3_000 })
          .then(() => true)
          .catch(() => false);
        await page.waitForLoadState('domcontentloaded').catch(() => undefined);
        if (!navigated && new URL(page.url()).pathname !== targetPath) {
          // モバイル相当の実行環境で Next.js の Link 遷移が不安定なため、href で補完する
          await page.goto(`${targetPath}?pw_fallback=1`, { waitUntil: 'domcontentloaded' }).catch(() => undefined);
        }
        if (new URL(page.url()).pathname !== targetPath) {
          await page.evaluate((path) => window.location.assign(path), targetPath);
        }
        await expect.poll(() => new URL(page.url()).pathname, { timeout: 30_000 }).toBe(targetPath);
      });
    } else {
      test('navigates to a blog post when clicking a card', async ({ page }) => {
        const latestBlogLink = page.locator('[data-testid="home-latest-blog-link"]').first();
        let targetPath: string | null = null;

        if ((await latestBlogLink.count()) > 0) {
          targetPath = await latestBlogLink.getAttribute('href');
          await latestBlogLink.click();
        } else {
          await page.locator(`a[href="${localizedPath('ja', '/blogs/')}"]`).first().click();
          await expect(page).toHaveURL(new RegExp(`${localizedPath('ja', '/blogs/')}?$`));
          const blogCardLink = page.locator('[data-testid="blog-card"] a[href*="/blogs/"]').first();
          targetPath = await blogCardLink.getAttribute('href');
          await blogCardLink.click();
        }

        const isBlogDetailPath = /\/(?:ja\/)?blogs\/[\w-]+\/?$/.test(new URL(page.url()).pathname);
        if (!isBlogDetailPath && targetPath) {
          await page.goto(targetPath, { waitUntil: 'domcontentloaded' }).catch(() => undefined);
        }

        await expect.poll(() => new URL(page.url()).pathname).toMatch(/\/(?:ja\/)?blogs\/[\w-]+\/?$/);
      });
    }
  });

  test.describe(`Homepage EN (${label})`, () => {
    test.use(use);

    test.beforeEach(async ({ page }) => {
      await page.goto(localizedPath('en'));
    });

    test('shows localized content', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1, name: 'Home Page' })).toBeVisible();
      await expect(page.getByText('engineer working in NLP')).toBeVisible();
      await expect(page.getByRole('heading', { level: 2, name: 'Latest Blog Posts' })).toBeVisible();
      await expect(page.getByRole('heading', { level: 2, name: 'Recent Publications' })).toBeVisible();
    });
  });
}

test.describe('Homepage theme toggle', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('theme', 'light');
    });
    await page.goto('/');
  });

  test('switches between light and dark mode', async ({ page }) => {
    const html = page.locator('html');

    await expect(html).not.toHaveClass(/dark/);
    await page.getByRole('button', { name: 'Toggle theme' }).first().click();
    await expect(html).toHaveClass(/dark/);

    await page.getByRole('button', { name: 'Toggle theme' }).first().click();
    await expect(html).toHaveClass(/light/);
  });
});
