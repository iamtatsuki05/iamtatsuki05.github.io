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
  test.describe(`Blog index page (${label})`, () => {
    test.use(use);

    test.beforeEach(async ({ page }) => {
      await page.goto(localizedPath('ja', '/blogs/'));
    });

    test('lists blog posts with metadata', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1, name: '📝 ブログ' })).toBeVisible();

      const latestSection = page
        .locator('section')
        .filter({ has: page.getByRole('heading', { level: 2, name: '✨ 最新' }) })
        .first();
      expect(await latestSection.locator('li').count()).toBeGreaterThanOrEqual(1);

      const allPostsSection = page
        .locator('section')
        .filter({ has: page.getByRole('heading', { level: 2, name: '🗂 すべての記事' }) })
        .first();

      const firstItem = allPostsSection.locator('li').first();
      expect(await firstItem.locator('a[href*="/blogs/"]').count()).toBeGreaterThanOrEqual(1);
      await expect(firstItem).toContainText(/\d{4}[/-]\d{2}[/-]\d{2}/);
    });

    if (label === 'desktop') {
      test('navigates to detail when clicking a blog card', async ({ page }) => {
        const allPostsSection = page
          .locator('section')
          .filter({ has: page.getByRole('heading', { level: 2, name: '🗂 すべての記事' }) })
          .first();

        const detailLink = allPostsSection.locator('[data-testid="blog-card"] a[href*="/blogs/"]').first();
        const detailPath = await detailLink.getAttribute('href');
        await detailLink.click();
        const navigated = await page
          .waitForURL(/\/(?:ja\/)?blogs\/[\w-]+\/?$/, { timeout: 3000 })
          .then(() => true)
          .catch(() => false);
        if (!navigated && detailPath) {
          await page.goto(detailPath, { waitUntil: 'domcontentloaded' });
        }
        await expect.poll(() => new URL(page.url()).pathname).toMatch(/\/(?:ja\/)?blogs\/[\w-]+\/?$/);
      });

      test('blog detail sidebar tracks heading and progress smoothly', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });

        const allPostsSection = page
          .locator('section')
          .filter({ has: page.getByRole('heading', { level: 2, name: '🗂 すべての記事' }) })
          .first();

        const detailLink = allPostsSection.locator('[data-testid="blog-card"] a[href*="/blogs/"]').first();
        const detailPath = await detailLink.getAttribute('href');
        await detailLink.click();
        const navigated = await page
          .waitForURL(/\/(?:ja\/)?blogs\/[\w-]+\/?$/, { timeout: 3000 })
          .then(() => true)
          .catch(() => false);
        if (!navigated && detailPath) {
          await page.goto(detailPath, { waitUntil: 'domcontentloaded' });
        }
        await expect.poll(() => new URL(page.url()).pathname).toMatch(/\/(?:ja\/)?blogs\/[\w-]+\/?$/);

        const toc = page.getByTestId('blog-toc');
        await expect(toc).toBeVisible();
        await expect(toc).toHaveCSS('position', 'sticky');
        const tocLinks = toc.locator('a[data-toc-id]');
        await expect.poll(() => tocLinks.count()).toBeGreaterThan(1);
        const linkCount = await tocLinks.count();
        await expect
          .poll(() =>
            toc.evaluate((element) => Number.parseInt(element.style.getPropertyValue('--toc-item-count'), 10)),
          )
          .toBe(linkCount);

        const initialActive = (await toc.locator('a[aria-current="true"]').first().textContent())?.trim() ?? '';
        const progress = toc.getByTestId('blog-toc-progress');
        const initialProgress = await progress.evaluate((element) =>
          Number.parseInt((element as HTMLElement).style.width || '0', 10),
        );

        await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));

        await expect
          .poll(async () => (await toc.locator('a[aria-current="true"]').first().textContent())?.trim() ?? '')
          .not.toBe(initialActive);
        await expect
          .poll(() =>
            progress.evaluate((element) => Number.parseInt((element as HTMLElement).style.width || '0', 10)),
          )
          .toBeGreaterThan(initialProgress);
      });

      test('copies the full article as markdown from the detail header', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'clipboard content is verified in Chromium only');

        await page.addInitScript(() => {
          Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: {
              writeText: async (text: string) => {
                (window as unknown as { __copiedMarkdown__?: string }).__copiedMarkdown__ = text;
              },
            },
          });
        });
        await page.goto(localizedPath('ja', '/blogs/'));

        const allPostsSection = page
          .locator('section')
          .filter({ has: page.getByRole('heading', { level: 2, name: '🗂 すべての記事' }) })
          .first();

        const detailLink = allPostsSection.locator('[data-testid="blog-card"] a[href*="/blogs/"]').first();
        const detailPath = await detailLink.getAttribute('href');
        await detailLink.click();
        const navigated = await page
          .waitForURL(/\/(?:ja\/)?blogs\/[\w-]+\/?$/, { timeout: 3000 })
          .then(() => true)
          .catch(() => false);
        if (!navigated && detailPath) {
          await page.goto(detailPath, { waitUntil: 'domcontentloaded' });
        }
        await expect.poll(() => new URL(page.url()).pathname).toMatch(/\/(?:ja\/)?blogs\/[\w-]+\/?$/);

        const copyButton = page.getByRole('button', { name: '記事のMarkdownをコピー' });
        await expect(copyButton).toBeVisible();
        await copyButton.click();
        await expect(copyButton).toContainText('コピーしました');
        await expect
          .poll(() => page.evaluate(() => (window as unknown as { __copiedMarkdown__?: string }).__copiedMarkdown__ || ''))
          .toContain('---');
        await expect
          .poll(() => page.evaluate(() => (window as unknown as { __copiedMarkdown__?: string }).__copiedMarkdown__ || ''))
          .toContain('## ');
      });

      test('keeps english copy labels after entering a blog detail from english pages', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'clipboard content is verified in Chromium only');

        await page.addInitScript(() => {
          Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: {
              writeText: async (text: string) => {
                (window as unknown as { __copiedMarkdown__?: string }).__copiedMarkdown__ = text;
              },
            },
          });
        });
        await page.goto(localizedPath('en', '/blogs/'));

        const allPostsSection = page
          .locator('section')
          .filter({ has: page.getByRole('heading', { level: 2, name: '🗂 All Posts' }) })
          .first();

        const detailLink = allPostsSection.locator('[data-testid="blog-card"] a[href*="/blogs/"]').first();
        const detailPath = await detailLink.getAttribute('href');
        await detailLink.click();
        const navigated = await page
          .waitForURL(/\/blogs\/[\w-]+\/?$/, { timeout: 3000 })
          .then(() => true)
          .catch(() => false);
        if (!navigated && detailPath) {
          await page.goto(detailPath, { waitUntil: 'domcontentloaded' });
        }
        await expect.poll(() => new URL(page.url()).pathname).toMatch(/\/blogs\/[\w-]+\/?$/);

        const copyButton = page.getByRole('button', { name: 'Copy article markdown' });
        await expect(copyButton).toBeVisible();
        await expect(copyButton).toContainText('Copy Markdown');
        await expect(page.getByRole('button', { name: 'Share' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Share on X' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Share on LinkedIn' })).toBeVisible();
        await expect(page.getByTestId('blog-toc-fab')).toContainText('Contents');
        await expect(page.locator('article.prose p').first()).toContainText('2025-');
        await copyButton.click();
        await expect(copyButton).toContainText('Copied');
      });
    }
  });

  test.describe(`Links page (${label})`, () => {
    test.use(use);

    test.beforeEach(async ({ page }) => {
      await page.goto(localizedPath('en', '/links/'));
    });

    test('groups external links by category', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1, name: 'Links' })).toBeVisible();

      const sections = page.locator('section');
      expect(await sections.count()).toBeGreaterThanOrEqual(1);

      const firstSection = sections.first();
      expect(await firstSection.locator('ul li').count()).toBeGreaterThanOrEqual(1);

      const firstLink = firstSection.locator('a').first();
      await expect(firstLink).toHaveAttribute('target', '_blank');
      await expect(firstLink).toHaveAttribute('rel', /noreferrer/);
      await expect(firstLink).toHaveAttribute('href', /^https?:\/\//);
    });

    if (label === 'desktop') {
      test('keeps current page when clicking external link with ctrl+click simulation', async ({ page }) => {
        const firstExternalLink = page.locator('section').first().locator('a[target="_blank"]').first();
        const href = await firstExternalLink.getAttribute('href');
        expect(href).toMatch(/^https?:\/\//);

        const beforePath = new URL(page.url()).pathname;
        const popupPromise = page.waitForEvent('popup', { timeout: 3000 }).catch(() => null);
        await firstExternalLink.click({ modifiers: ['Control'], force: true });
        const popup = await popupPromise;
        if (popup) {
          await popup.close();
        }

        expect(new URL(page.url()).pathname).toBe(beforePath);
      });
    }
  });

  test.describe(`Publications page (${label})`, () => {
    test.use(use);

    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        (window as unknown as { __publicationOpenCalls__?: string[] }).__publicationOpenCalls__ = [];
        window.open = ((url?: string | URL) => {
          const store = window as unknown as { __publicationOpenCalls__: string[] };
          store.__publicationOpenCalls__.push(String(url ?? ''));
          return null;
        }) as typeof window.open;
      });
      await page.goto(localizedPath('en', '/publications/'));
    });

    test('shows publication list with outbound links', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1, name: 'Publications' })).toBeVisible();

      const papersSection = page
        .locator('section')
        .filter({ has: page.getByRole('heading', { level: 2, name: '📄 Papers' }) })
        .first();

      const publicationItems = papersSection.locator('li');
      expect(await publicationItems.count()).toBeGreaterThanOrEqual(1);
      expect(await publicationItems.first().locator('a[target="_blank"]').count()).toBeGreaterThanOrEqual(1);
    });

    test('opens the primary link when clicking a publication card', async ({ page }) => {
      await page.locator('[data-testid="publication-card"]').first().click();
      const openCalls = await page.evaluate(
        () => (window as unknown as { __publicationOpenCalls__?: string[] }).__publicationOpenCalls__ || [],
      );
      expect(openCalls.length).toBeGreaterThan(0);
    });

    test('keeps filter bar layout stable when opening tag filter', async ({ page }) => {
      const searchInput = page.getByRole('textbox', { name: 'Search...' });
      await expect(searchInput).toBeVisible();
      const before = await searchInput.boundingBox();
      expect(before).not.toBeNull();

      const typeFilter = page.locator('details').filter({ hasText: 'Types' }).first();
      const tagFilter = page.locator('details').filter({ hasText: 'Tags' }).first();
      await expect(typeFilter).toContainText('Types');
      await expect(tagFilter).toContainText('Tags');
      await typeFilter.locator('summary').click();
      await expect(typeFilter).toHaveAttribute('open', '');

      await tagFilter.locator('summary').click();
      await expect(typeFilter).not.toHaveAttribute('open', '');
      await expect(tagFilter).toHaveAttribute('open', '');
      const panel = tagFilter.locator('summary + div');
      await expect(tagFilter.locator('button').first()).toBeVisible();
      const viewport = page.viewportSize();
      expect(viewport).not.toBeNull();
      await expect
        .poll(async () => (await panel.boundingBox())?.x ?? Number.NEGATIVE_INFINITY)
        .toBeGreaterThanOrEqual(-1);
      await expect
        .poll(async () => {
          const box = await panel.boundingBox();
          if (!box) return Number.POSITIVE_INFINITY;
          return box.x + box.width;
        })
        .toBeLessThanOrEqual((viewport?.width || 0) + 1);

      const after = await searchInput.boundingBox();
      expect(after).not.toBeNull();
      expect(Math.abs((after?.y || 0) - (before?.y || 0))).toBeLessThanOrEqual(1);
      expect(Math.abs((after?.width || 0) - (before?.width || 0))).toBeLessThanOrEqual(1);
    });
  });
}

test.describe('Blog detail toc toggle (tablet)', () => {
  test.use({ viewport: { width: 900, height: 900 } });

  test('opens and closes floating toc panel', async ({ page }) => {
    await page.goto(localizedPath('ja', '/blogs/'));

    const allPostsSection = page
      .locator('section')
      .filter({ has: page.getByRole('heading', { level: 2, name: '🗂 すべての記事' }) })
      .first();
    const detailLink = allPostsSection.locator('[data-testid="blog-card"] a[href*="/blogs/"]').first();
    const detailPath = await detailLink.getAttribute('href');
    await detailLink.click();
    const navigated = await page
      .waitForURL(/\/(?:ja(?:-JP)?\/)?blogs\/[\w-]+\/?$/, { timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    if (!navigated && detailPath) {
      await page.goto(detailPath, { waitUntil: 'domcontentloaded' });
    }
    await expect.poll(() => new URL(page.url()).pathname).toMatch(/\/(?:ja(?:-JP)?\/)?blogs\/[\w-]+\/?$/);

    const fab = page.getByTestId('blog-toc-fab');
    await expect(fab).toBeVisible({ timeout: 10000 });
    await expect(fab).toHaveAttribute('aria-expanded', 'false');

    await fab.click();
    await expect(fab).toHaveAttribute('aria-expanded', 'true');
    const sheet = page.getByTestId('blog-toc-sheet');
    await expect(sheet).toBeVisible();
    await expect(sheet).toHaveAttribute('data-state', 'open');
    expect(await sheet.locator('a[data-toc-id]').count()).toBeGreaterThan(1);

    await sheet.getByRole('button', { name: '閉じる' }).click();
    await expect(sheet).toHaveAttribute('data-state', 'closed');
    await expect(page.getByTestId('blog-toc-sheet')).toHaveCount(0);
  });
});

test.describe('Localized page variants', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('renders the Japanese blog index', async ({ page }) => {
    await page.goto('/ja-JP/blogs/');
    await expect(page.getByRole('heading', { level: 1, name: '📝 ブログ' })).toBeVisible();
  });

  test('renders the English blog index', async ({ page }) => {
    await page.goto('/en-US/blogs/');
    await expect(page.getByRole('heading', { level: 1, name: '📝 Blog' })).toBeVisible();
  });
});

test.describe('Default locale fallback', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('renders Japanese links page at /links/', async ({ page }) => {
    await page.goto('/links/');
    await expect(page.getByRole('heading', { level: 1, name: '🔗 リンク' })).toBeVisible();
  });

  test('renders Japanese publications page at /publications/', async ({ page }) => {
    await page.goto('/publications/');
    await expect(page.getByRole('heading', { level: 1, name: '📚 公開物' })).toBeVisible();
  });
});

test.describe('Special route pages', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('renders custom not-found page', async ({ page }) => {
    const response = await page.goto('/ja-JP/this-path-does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1, name: 'ページが見つかりません' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ホームへ戻る' })).toHaveAttribute('href', '/');
  });
});
