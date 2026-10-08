/**
 * Where each item of your lecture notes is studied: the lesson it belongs to. An item goes to the first
 * lesson it links to; items without a lesson link go to their lecture's main lesson.
 */
import { LESSON_BY_ID, UNIT_BY_ID } from './index';
import { NOTES, type NoteItem, type NotePage } from './notesAll';

const PAGE_LESSON: Record<string, string> = {
  lec01: 'l1-gain',
  lec02: 'l2-onestage',
  lec03: 'l2-buffer',
  lec04: 'l3-design',
  lec05: 'l4-folding',
  lec06: 'l4-folding',
  lec07: 'l5-twostage',
  lec08: 'l6-boost',
  lec09: 'l6-boost',
  lec10: 'l7-cmfb',
  lec11: 'l8-cmfb',
  lec12: 'l8-cmfb',
  lec13: 'l9-slew',
  lec14: 'l11-barkhausen',
  lec15: 'l11-multipole',
  lec16: 'l12-ringing',
  lec17: 'l13-miller',
  settling: 'l1-speed',
  mirror: 'u6-mirror',
};

export interface PlacedNote {
  page: NotePage;
  item: NoteItem;
  index: number;
  lesson: string;
}

function lessonOf(page: NotePage, item: NoteItem): string {
  const l = item.links?.find((x) => x.to.startsWith('learn/'));
  const id = l ? l.to.slice('learn/'.length) : PAGE_LESSON[page.id];
  return LESSON_BY_ID[id] ? id : PAGE_LESSON[page.id];
}

export const PLACED_NOTES: PlacedNote[] = NOTES.flatMap((page) => page.items.map((item, index) => ({ page, item, index, lesson: lessonOf(page, item) })));

export function notesForLesson(lessonId: string): PlacedNote[] {
  return PLACED_NOTES.filter((n) => n.lesson === lessonId);
}

export function notesForUnit(unitId: string): PlacedNote[] {
  const u = UNIT_BY_ID[unitId];
  if (!u) return [];
  return u.lessons.flatMap((l) => notesForLesson(l));
}
