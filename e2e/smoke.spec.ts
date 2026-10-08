/** Smoke test: every page loads, every lesson can be walked from "why" to "lock it in" without errors. */
import { expect, test } from '@playwright/test';

const LESSONS = ['u0-drops', 'u0-parallel', 'u1-mosfet', 'u2-pinchoff', 'u2-squarelaw', 'u3-recipe', 'u3-pmos-design', 'u4-gm', 'u4-ro', 'u5-cs', 'u6-rules', 'u6-mirror', 'u7-loads', 'u7-degen', 'u8-follower', 'u8-cg', 'u9-cascode', 'u9-telescopic', 'u10-steering', 'u10-half', 'u10-cmrange', 'u11-ota', 'u11-ota-range', 'u12-poles', 'u12-settling', 'l1-gain', 'l1-speed', 'l1-other', 'l2-onestage', 'l2-buffer', 'l2-cmchoice', 'l3-design', 'l3-scaling', 'l4-folding', 'l4-gain', 'l5-twostage', 'l6-boost', 'l7-cmfb', 'l8-cmfb', 'l8-replica', 'l9-slew', 'l10-psrr', 'l10-noisebasics', 'l10-noise', 'l11-barkhausen', 'l11-multipole', 'l12-margins', 'l12-ringing', 'l13-dominant', 'l13-onestage', 'l13-miller', 'l14-twostage', 'l14-rz', 'd15-statics', 'd16-loads', 'd17-cmos', 'd18-switching', 'd19-delaycalc', 'd20-gates', 'd21-cmoslogic', 'd22-euler', 'd23-rc', 'd24-linear', 'd25-path', 'd26-power', 'd27-staticdesign', 'd28-ratioed', 'd29-dynamic', 'd30-pass', 'd31-sequencing', 'd32-maxmin', 'd33-skew', 'd34-latches', 'd35-fulladder', 'd36-adders', 'd37-multiplier', 'd38-sram'];

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (e) => {
    throw e;
  });
});

for (const id of LESSONS) {
  test(`lesson ${id} walks through all 8 steps`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`#/learn/${id}`);
    for (let s = 0; s < 7; s++) {
      if (s === 2) await page.locator('.choice-card').first().click();
      await page.getByRole('button', { name: /^Next:/ }).click();
    }
    await expect(page.getByRole('heading', { name: 'Lock it in' })).toBeVisible();
    await expect(page.locator('.lockin')).toBeVisible();
    // Stepping back keeps the "Your turn" answers mounted.
    await page.getByRole('button', { name: 'Step 7: Your turn' }).click();
    await expect(page.locator('section.step-card:not([hidden]) .problem').first()).toBeVisible();
    await page.screenshot({ path: `test-results/shots/lesson-${id}-390.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}

for (const route of ['#/path', '#/learn', '#/labs', '#/labs/mosfet', '#/labs/dc', '#/labs/impedance', '#/labs/cs', '#/labs/cascode', '#/labs/diffpair', '#/labs/ota', '#/labs/feedback', '#/labs/headroom', '#/labs/folded', '#/labs/stability', '#/labs/inverter', '#/labs/effort', '#/practice', '#/practice/bank-t4q3', '#/topic/U3', '#/topic/U9', '#/topic/U10', '#/topic/U11', '#/topic/U12', '#/topic/L1', '#/topic/L2', '#/topic/L3', '#/topic/L4', '#/topic/L5', '#/topic/L6', '#/topic/L8', '#/topic/L9', '#/topic/L10', '#/topic/L12', '#/topic/L14', '#/review', '#/exam', '#/settings', '#/notes', '#/lectures', ...['lec01', 'lec02', 'lec03', 'lec04', 'lec05', 'lec06', 'lec07', 'lec08', 'lec09', 'lec10', 'lec11', 'lec12', 'lec13', 'lec14', 'lec15', 'lec16', 'lec17', 'settling'].map((n) => `#/lectures/${n}`), '#/sprint', '#/sprint/print', '#/calc', ...['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17'].map((n) => `#/notes/lec${n}`), '#/notes/settling', '#/notes/mirror', ...['pyq-m25-q1', 'pyq-m25-q2', 'pyq-m25-q4', 'pyq-m25-q5', 'pyq-m24-q1', 'pyq-m24-q2', 'pyq-m24-q3', 'pyq-m24-q4', 'pyq-m23-q3', 'pyq-m23-q5', 'pyq-q24a-q1', 'pyq-q24a-q2', 'pyq-q24b-q1', 'pyq-q24b-q2', 'pyq-q23-q2', 'pyq-t24-ex1', 'pyq-t24-ex2', 'pyq-t24-ex3', 'pyq-t24-ex4', 'pyq-t24-ex56'].map((id) => `#/practice/${id}`)]) {
  test(`page ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    for (const width of [1920, 1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await page.waitForTimeout(150);
      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollW, 'no horizontal page scroll').toBeLessThanOrEqual(width + 1);
      await page.screenshot({ path: `test-results/shots/page-${route.replace(/[#/]/g, '_')}-${width}.png`, fullPage: true });
    }
    expect(errors).toEqual([]);
  });
}

test('practice: a diagnosed mistake, then the right answer', async ({ page }) => {
  await page.goto('#/practice');
  await page.locator('summary', { hasText: 'Questions from our chat' }).click();
  await page.getByRole('button', { name: /WE1/ }).click();
  const input = page.getByLabel(/Drain current/);
  await input.fill('180u');
  await input.press('Enter');
  await expect(page.locator('.feedback.wrong').first()).toContainText('½');
  await input.fill('90 µA');
  await input.press('Enter');
  await expect(page.locator('.feedback.correct').first()).toBeVisible();
});

test('exam mode: start a paper, hand in, get marked', async ({ page }) => {
  await page.goto('#/exam');
  await page.getByRole('button', { name: /Quiz style/ }).click();
  await expect(page.locator('.exam-q')).toHaveCount(3);
  await page.getByRole('button', { name: 'Hand in' }).click();
  await expect(page.getByText(/Score \d+\/\d+/)).toBeVisible();
  await expect(page.locator('.exam-solution').first()).toBeVisible();
});

test('DC stepper reaches the fence check', async ({ page }) => {
  await page.goto('#/labs/dc');
  await page.getByRole('button', { name: 'Show all' }).click();
  await expect(page.locator('.fence-ok')).toBeVisible();
  await page.getByRole('button', { name: /Trap/ }).click();
  await page.getByRole('button', { name: 'Show all' }).click();
  await expect(page.locator('.fence-bad').first()).toBeVisible();
});

test('end-of-topic page: open a tutorial question, answer a part, it records progress', async ({ page }) => {
  await page.goto('#/topic/U10');
  await expect(page.getByRole('heading', { name: /End of topic/ })).toBeVisible();
  const first = page.locator('.sheet-toggle').first();
  await first.click();
  await expect(page.locator('.sheet-body .problem')).toBeVisible();
  const input = page.locator('.sheet-body input').first();
  await input.fill('1');
  await input.press('Enter');
  await expect(page.locator('.sheet-body .check-result, .sheet-body [role="status"]').first()).toBeVisible();
});
