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

        await allPostsSection
          .locator('[data-testid="blog-card"] a[href*="/blogs/"]')
          .first()
          .click();

        await expect(page).toHaveURL(/\/(?:ja\/)?blogs\/[\w-]+\/?$/);
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

test.describe('Localized page variants', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('renders the Japanese blog index', async ({ page }) => {
    await page.goto('/ja/blogs/');
    await expect(page.getByRole('heading', { level: 1, name: '📝 ブログ' })).toBeVisible();
  });

  test('renders the English blog index', async ({ page }) => {
    await page.goto('/en/blogs/');
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
