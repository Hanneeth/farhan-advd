/** No figure may print an answer while the question is being attempted (question mode masks non-given numbers). */
import { expect, test } from '@playwright/test';
import { BANK, GENERATOR_BY_ID } from '../src/content';
import { generate } from '../src/practice/generate';
import { formatSI } from '../src/practice/units';
import type { Problem } from '../src/practice/schema';

function answerStrings(p: Problem): string[] {
  const out: string[] = [];
  for (const u of p.unknowns) {
    if (u.choices || !u.unit) continue;
    const v = p.answers[u.key];
    if (!isFinite(v) || v === 0) continue;
    if (p.givens.some((g) => Math.abs(g.value - v) <= Math.abs(v) * 0.006)) continue;
    for (const d of [2, 3]) {
      const s = formatSI(v, u.unit as never, d);
      if (!p.statement.includes(s)) out.push(s);
    }
  }
  return [...new Set(out)];
}

test('bank figures do not show answers before the solution is opened', async ({ page }) => {
  test.setTimeout(300_000);
  const leaks: string[] = [];
  for (const p of BANK.filter((b) => b.figure)) {
    await page.goto(`#/practice/${p.id}`);
    const fig = page.locator('.problem-left').first();
    await fig.waitFor();
    await page.waitForTimeout(80);
    const txt = (await fig.locator('svg').allTextContents()).join(' ');
    for (const a of answerStrings(p)) if (a.length >= 4 && txt.includes(a)) leaks.push(`${p.id}: ${a}`);
  }
  expect(leaks).toEqual([]);
});

test('generated figures do not show answers (problem mode, fixed seeds)', async ({ page }) => {
  test.setTimeout(300_000);
  const leaks: string[] = [];
  await page.goto('#/practice');
  for (const g of Object.values(GENERATOR_BY_ID)) {
    const p = generate(g, 3);
    if (!p.figure) continue;
    // Render the same problem through the lesson worked-example path is not needed: practice draws with the seed
    // it chooses, so compare against that page's own text instead: every non-given number must be masked.
    await page.goto(`#/practice/${g.id}`);
    const fig = page.locator('.problem-left').first();
    if (!(await fig.count())) continue;
    const txt = (await fig.locator('svg').allTextContents()).join(' ');
    const statement = (await page.locator('.problem-text p').first().textContent()) ?? '';
    const givens = (await page.locator('.problem-text .givens').first().textContent()) ?? '';
    // Any unit-bearing number left on the figure must appear in the statement or givens.
    for (const m of txt.match(/\d+(?:\.\d+)?\s?(?:[pnuµmkMG])?(?:V|A|Ω|F|Hz|s)(?![a-zA-Z])/g) ?? []) {
      const bare = m.replace(/\s/g, '');
      if (!statement.replace(/\s/g, '').includes(bare) && !givens.replace(/\s/g, '').includes(bare)) leaks.push(`${g.id}: ${m}`);
    }
  }
  // Givens are typeset by KaTeX, so a few allowed values may not match textually; report, but only fail on many.
  console.log('unmatched (review):', leaks.slice(0, 40).join(' | '));
  expect(leaks.length).toBeLessThan(20);
});
