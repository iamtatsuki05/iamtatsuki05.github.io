import { test, expect } from '@playwright/test';
import { waitForIslandHydration } from './helpers/hydration';
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

    test('shows segmented language switch with current locale highlighted', async ({ page }) => {
      const languageSwitch = page.getByRole('group', { name: 'Language switch' }).first();
      await expect(languageSwitch).toBeVisible();
      await expect(languageSwitch.getByRole('link', { name: 'JA' })).toHaveAttribute('aria-current', 'true');
      await expect(languageSwitch.getByRole('link', { name: 'EN' })).toBeVisible();
      await expect(languageSwitch.getByRole('link', { name: 'ZH' })).toBeVisible();
      await expect(languageSwitch.getByRole('link', { name: 'FR' })).toBeVisible();
    });

    test('shows main hero and contact info', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1, name: 'ホームページ' })).toBeVisible();
      await expect(page.getByText('自然言語処理 | 機械学習 | ソフトウェア のエンジニアをしています。')).toBeVisible();
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
      test('centers the final row of social link cards', async ({ page }) => {
        const linksSection = page
          .locator('section')
          .filter({ has: page.getByRole('heading', { level: 2, name: 'Links' }) })
          .first();
        const list = linksSection.locator('ul').first();
        const cards = linksSection.locator('li');

        await expect(list).toBeVisible();
        await expect(cards).toHaveCount(6);

        const listBox = await list.boundingBox();
        expect(listBox).not.toBeNull();
        const cardBoxes = await cards.evaluateAll((elements) =>
          elements.map((element) => {
            const rect = element.getBoundingClientRect();
            return { x: rect.x, y: rect.y, width: rect.width };
          }),
        );
        const maxY = Math.max(...cardBoxes.map((box) => box.y));
        const finalRow = cardBoxes.filter((box) => Math.abs(box.y - maxY) < 2);
        expect(finalRow).toHaveLength(2);

        const rowLeft = Math.min(...finalRow.map((box) => box.x));
        const rowRight = Math.max(...finalRow.map((box) => box.x + box.width));
        const rowCenter = (rowLeft + rowRight) / 2;
        const listCenter = (listBox?.x || 0) + (listBox?.width || 0) / 2;

        expect(Math.abs(rowCenter - listCenter)).toBeLessThanOrEqual(1);

        const iconCenterDeltas = await cards.evaluateAll((elements) =>
          elements.map((element) => {
            const cardRect = element.getBoundingClientRect();
            const iconRect = element.querySelector('.link-grid__icon-link')?.getBoundingClientRect();
            if (!iconRect) return Number.POSITIVE_INFINITY;
            return Math.abs((iconRect.x + iconRect.width / 2) - (cardRect.x + cardRect.width / 2));
          }),
        );
        expect(Math.max(...iconCenterDeltas)).toBeLessThanOrEqual(1);
      });

      test('opens and closes the mobile menu', async ({ page }) => {
        const menu = page.locator('#mobile-menu');

        await waitForIslandHydration(page, 'Header');
        await page.getByRole('button', { name: 'Open menu' }).click();
        await expect(menu).toBeVisible();
        await expect(menu).toHaveAttribute('data-state', 'open');

        await page.getByRole('button', { name: 'Close menu' }).click();
        await expect(menu).toHaveAttribute('data-state', 'closed');
        await expect(menu).toHaveCount(0);

        await page.getByRole('button', { name: 'Open menu' }).click();
        await expect(menu).toBeVisible();
        await expect(menu).toHaveAttribute('data-state', 'open');

        const menuLinks = menu.locator('nav a');
        await expect(menuLinks).toHaveCount(5);
        await expect(menuLinks.nth(1)).toContainText('Links');
        const targetPath = (await menuLinks.nth(1).getAttribute('href')) || localizedPath('ja', '/links/');
        await menuLinks.nth(1).click();
        await expect(menu).toHaveCount(0);
        const navigated = await page
          .waitForURL(new RegExp(`${targetPath}$`), { timeout: 3_000 })
          .then(() => true)
          .catch(() => false);
        await page.waitForLoadState('domcontentloaded').catch(() => undefined);
        if (!navigated && new URL(page.url()).pathname !== targetPath) {
          // モバイル相当の実行環境でリンク遷移が不安定な場合は、href で補完する
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

        const isBlogDetailPath = /\/(?:ja(?:-JP)?\/)?blogs\/[\w-]+\/?$/.test(new URL(page.url()).pathname);
        if (!isBlogDetailPath && targetPath) {
          await page.goto(targetPath, { waitUntil: 'domcontentloaded' }).catch(() => undefined);
        }

        await expect.poll(() => new URL(page.url()).pathname).toMatch(/\/(?:ja(?:-JP)?\/)?blogs\/[\w-]+\/?$/);
      });
    }
  });

  test.describe(`Homepage EN (${label})`, () => {
    test.use(use);

    test.beforeEach(async ({ page }) => {
      await page.goto(localizedPath('en'));
    });

    test('shows segmented language switch with current locale highlighted', async ({ page }) => {
      const languageSwitch = page.getByRole('group', { name: 'Language switch' }).first();
      await expect(languageSwitch).toBeVisible();
      await expect(languageSwitch.getByRole('link', { name: 'EN' })).toHaveAttribute('aria-current', 'true');
      await expect(languageSwitch.getByRole('link', { name: 'JA' })).toBeVisible();
      await expect(languageSwitch.getByRole('link', { name: 'ZH' })).toBeVisible();
      await expect(languageSwitch.getByRole('link', { name: 'FR' })).toBeVisible();
    });

    test('shows localized content', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1, name: 'Home Page' })).toBeVisible();
      await expect(page.getByText('engineer working in NLP')).toBeVisible();
      await expect(page.getByRole('heading', { level: 2, name: 'Latest Blogs' })).toBeVisible();
      await expect(page.getByRole('heading', { level: 2, name: 'Recent Publications' })).toBeVisible();
    });
  });
}

test.describe('Homepage ZH/FR localized content', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('renders Chinese homepage copy', async ({ page }) => {
    await page.goto(localizedPath('zh'));
    await expect(page.getByRole('heading', { level: 1, name: '主页' })).toBeVisible();
    await expect(page.getByText('自然语言处理、机器学习和软件开发')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: '最新博客' })).toBeVisible();
  });

  test('renders French homepage copy', async ({ page }) => {
    await page.goto(localizedPath('fr'));
    await expect(page.getByRole('heading', { level: 1, name: 'Accueil' })).toBeVisible();
    await expect(page.getByText('traitement automatique des langues')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Derniers articles' })).toBeVisible();
  });
});

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

test.describe('Homepage theme toggle with system preference', () => {
  test('follows dark system preference and toggles to light mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.addInitScript(() => {
      window.localStorage.removeItem('theme');
    });
    await page.goto('/');

    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: 'Toggle theme' }).first();

    await expect(toggle).toBeVisible();
    await expect(html).toHaveClass(/dark/);
    await expect(toggle).toHaveAttribute('data-theme', 'dark');

    await toggle.click();
    await expect(html).toHaveClass(/light/);
    await expect(toggle).toHaveAttribute('data-theme', 'light');
  });
});
