import type { Page } from '@playwright/test';

// Astro removes the `ssr` attribute from an astro-island once hydration completes,
// so waiting for its removal guarantees the island's event handlers are attached.
export async function waitForIslandHydration(page: Page, componentExport: string): Promise<void> {
  await page.waitForSelector(`astro-island[component-export="${componentExport}"]:not([ssr])`, {
    state: 'attached',
  });
}
