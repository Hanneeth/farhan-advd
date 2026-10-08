import { NOTES_A } from './notes';
import { NOTES_B } from './notes2';
export type { NoteItem, NotePage } from './notes';
/** Lecture notes in order (Lec 01–17), then the settling example and the current-mirror handout. */
export const NOTES = [...NOTES_A, ...NOTES_B.filter((n) => n.lec > 0), ...NOTES_B.filter((n) => n.lec === 0)];
