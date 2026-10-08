import { describe, expect, it } from 'vitest';
import { BANK, BANK_BY_ID, LESSON_BY_ID, UNIT_BY_ID } from './index';
import { PACKS } from './sprint';
import { NOTES } from './notesAll';
import { NOTE_IMG, PAPER_IMG } from '../assets/papers';

describe('last-minute packs', () => {
  it('reference real problems, units and note pages', () => {
    const noteIds = new Set(NOTES.map((n) => n.id));
    for (const p of PACKS) {
      for (const u of p.units) expect(UNIT_BY_ID, u).toHaveProperty(u);
      for (const n of p.notes) expect(noteIds.has(n), n).toBe(true);
      for (const r of p.play) for (const id of r.ids) expect(BANK_BY_ID, `${p.id}: ${id}`).toHaveProperty(id);
    }
  });
});

describe('notes and paper images', () => {
  it('every note page has its scan and every link points somewhere real', () => {
    for (const n of NOTES) {
      if (n.img) expect(NOTE_IMG, n.id).toHaveProperty(n.img);
      for (const it2 of n.items)
        for (const l of it2.links ?? []) {
          const [kind, id] = l.to.split('/');
          if (kind === 'learn') expect(LESSON_BY_ID, l.to).toHaveProperty(id);
          if (kind === 'practice') expect(BANK_BY_ID, l.to).toHaveProperty(id);
        }
    }
  });
  it('every printed / key image exists', () => {
    for (const p of BANK) for (const im of [...(p.printed ?? []), ...(p.key ?? [])]) expect(PAPER_IMG, `${p.id}: ${im.img}`).toHaveProperty(im.img);
  });
});

import { LECTURE_PLAN, WALKS } from './walk';
describe('lecture plans', () => {
  it('every walk has a plan whose lessons and questions exist; every box is on the page', () => {
    for (const w of WALKS) {
      const p = LECTURE_PLAN[w.id];
      expect(p, w.id).toBeTruthy();
      for (const l of [...p.pre, ...p.lessons]) expect(LESSON_BY_ID, `${w.id}: ${l}`).toHaveProperty(l);
      for (const q of p.questions) expect(BANK_BY_ID, `${w.id}: ${q}`).toHaveProperty(q);
      for (const s of w.steps) {
        if (s.l) expect(LESSON_BY_ID, s.l).toHaveProperty(s.l);
        for (const q of s.q ?? []) expect(BANK_BY_ID, q).toHaveProperty(q);
        for (const [x, y, ww, h] of s.b) expect(x >= 0 && y >= 0 && x + ww <= 100.5 && y + h <= 100.5, `${w.id} ${s.t}`).toBe(true);
      }
    }
  });
});

import { WALK_TEXT } from './walkText';
import { WALK_BOXES } from './walkBoxes';
describe('walk text and boxes', () => {
  it('one text and one region list per step, on every page', () => {
    for (const w of WALKS) {
      expect(WALK_TEXT[w.id]?.length, w.id).toBe(w.steps.length);
      expect(WALK_BOXES[w.id]?.length, w.id).toBe(w.steps.length);
    }
  });
});
