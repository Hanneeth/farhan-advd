/**
 * Diagram check (CLAUDE.md §9, §11.6): screenshot every figure at 1280 px and 390 px in light and dark mode,
 * and fail if any two text labels inside one SVG overlap.
 */
import { expect, test, type Page } from '@playwright/test';

async function overlaps(page: Page) {
  return page.evaluate(() => {
    const problems: string[] = [];
    document.querySelectorAll('figure[data-fig]').forEach((fig) => {
      const texts = Array.from(fig.querySelectorAll('svg text')) as SVGTextElement[];
      const boxes = texts
        .map((t) => ({ t: t.textContent ?? '', r: t.getBoundingClientRect() }))
        .filter((b) => b.r.width > 0 && b.t.trim() !== '');
      for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i].r, b = boxes[j].r;
          const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (w > 1.5 && h > 1.5) problems.push(`${fig.getAttribute('data-fig')}: "${boxes[i].t}" × "${boxes[j].t}"`);
        }
    });
    return problems;
  });
}

for (const width of [1280, 390]) {
  for (const scheme of ['light', 'dark'] as const) {
    test(`gallery ${width}px ${scheme}`, async ({ page }) => {
      test.setTimeout(600_000);
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('#/gallery');
      await page.waitForSelector('figure[data-fig]');
      const items = page.locator('figure[data-fig]');
      const n = await items.count();
      for (let i = 0; i < n; i++) {
        const el = items.nth(i);
        const id = await el.getAttribute('data-fig');
        await el.screenshot({ path: `test-results/shots/${width}-${scheme}-${id}.png` });
      }
      const bad = await overlaps(page);
      expect(bad, bad.join('\n')).toEqual([]);
    });
  }
}
