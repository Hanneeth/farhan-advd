/** The single-file build opens straight from disk (file://) with no network. */
import { expect, test } from '@playwright/test';
import path from 'node:path';

test('single-file build works offline from file://', async ({ page, context }) => {
  await context.route('http*://**', (r) => r.abort());
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('file://' + path.resolve('dist-single/index.html') + '#/learn/u2-pinchoff');
  await expect(page.getByRole('heading', { name: /waterfall/ })).toBeVisible();
  await page.goto('file://' + path.resolve('dist-single/index.html') + '#/labs/mosfet');
  await expect(page.getByRole('heading', { name: 'MOSFET lab' })).toBeVisible();
  expect(errors).toEqual([]);
});
