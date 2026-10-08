import { describe, expect, it } from 'vitest';
import { checkAnswer } from './checker';
import { discardLog, generate, traceDisagreement } from './generate';
import { FOUNDATION_GENERATORS } from './generators/foundations';
import { ALL_GENERATORS } from './generators';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { FIGURES } from '../circuits/registry';
import { FIXED_BANK } from './bank';
import { M3_BANK } from './bankM3';
import { M4_BANK } from './bankM4';
import { M5_BANK } from './bankM5';
import { M6_BANK } from './bankM6';
import { DIGITAL_BANK } from './bankD';
import { LAB_BANK } from './bankLabs';
import { CHAT_BANK } from './bankChat';
import { formatSI } from './units';

describe.each(ALL_GENERATORS.map((g) => [g.id, g] as const))('generator %s', (_id, gen) => {
  it('produces 300 valid problems whose two solves agree', () => {
    const before = discardLog.length;
    for (let seed = 1; seed <= 300; seed++) {
      const p = generate(gen, seed);
      expect(traceDisagreement(p)).toBeUndefined();
      for (const u of p.unknowns) {
        const v = p.answers[u.key];
        expect(Number.isFinite(v), `${u.key}=${v}`).toBe(true);
        if (u.choices) expect(v).toBeLessThan(u.choices.length);
      }
      expect(p.hints).toHaveLength(4);
      if (p.figure) expect(FIGURES, p.figure.kind).toHaveProperty(p.figure.kind);
      expect(p.statement.length).toBeGreaterThan(20);
    }
    const discarded = discardLog.slice(before).filter((d) => d.generator === gen.id);
    // No problem may ever be discarded for a two-solve disagreement.
    expect(discarded.filter((d) => d.reason.startsWith('two solves'))).toEqual([]);
  });

  it('accepts the right answer typed with a prefix, and diagnoses predicted mistakes', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const p = generate(gen, seed);
      for (const u of p.unknowns) {
        if (u.choices) {
          expect(checkAnswer(p, u.key, String(p.answers[u.key])).status).toBe('correct');
          continue;
        }
        const typed = formatSI(p.answers[u.key], u.unit, 4).replace('−', '-');
        const r = checkAnswer(p, u.key, typed);
        expect(r.status, `${u.key}: typed "${typed}" → ${r.message}`).toBe('correct');
        for (const w of p.wrong[u.key] ?? []) {
          // Only meaningful when the wrong value is actually distinguishable from the right one.
          if (Math.abs(w.value - p.answers[u.key]) <= Math.abs(p.answers[u.key]) * 0.05) continue;
          const rw = checkAnswer(p, u.key, String(w.value));
          expect(rw.status).toBe('wrong');
          expect(rw.mistake).toBeDefined();
        }
      }
    }
  });
});

describe.each(ALL_GENERATORS.map((g) => [g.id, g] as const))('figure of %s', (_id, gen) => {
  it('renders without throwing for 20 seeds', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const p = generate(gen, seed);
      if (!p.figure) continue;
      const html = renderToString(createElement(FIGURES[p.figure.kind], p.figure.props ?? {}));
      expect(html).toContain('<svg');
      expect(html).not.toContain('NaN');
    }
  });
});

describe('checker generic diagnosis', () => {
  const p = generate(FOUNDATION_GENERATORS.find((g) => g.id === 'u3-nmos-analysis')!, 42);
  it('spots a 1000× prefix slip', () => {
    const r = checkAnswer(p, 'id', String(p.answers.id * 1000));
    expect(r.mistake).toBe('unitPrefix');
  });
  it('rejects an unreadable answer without marking it wrong', () => {
    expect(checkAnswer(p, 'id', 'banana').status).toBe('invalid');
  });
});

describe('fixed bank', () => {
  it('every fixed problem has a traced step for each unknown that agrees with the physics answer', () => {
    for (const p of [...FIXED_BANK, ...M3_BANK, ...M4_BANK, ...M5_BANK, ...M6_BANK, ...DIGITAL_BANK, ...LAB_BANK, ...CHAT_BANK]) expect(traceDisagreement(p), p.id).toBeUndefined();
  });
  it('every fixed problem figure renders, and the right answers are accepted', () => {
    for (const p of [...FIXED_BANK, ...M3_BANK, ...M4_BANK, ...M5_BANK, ...M6_BANK, ...DIGITAL_BANK, ...LAB_BANK, ...CHAT_BANK]) {
      if (p.figure) expect(renderToString(createElement(FIGURES[p.figure.kind], p.figure.props ?? {}))).not.toContain('NaN');
      for (const u of p.unknowns) {
        const typed = formatSI(p.answers[u.key], u.unit, 4).replace('−', '-');
        expect(checkAnswer(p, u.key, typed).status, `${p.id} ${u.key} ${typed}`).toBe('correct');
      }
    }
  });
  it('exam (e) accepts all three buffer-bandwidth answers from the key and the chat', () => {
    const ex = M3_BANK.find((p) => p.id === 'bank-exam-q1')!;
    for (const v of ['31.8 MHz', '31.95 MHz', '32.19 MHz']) expect(checkAnswer(ex, 'fb', v).status, v).toBe('correct');
  });
});
