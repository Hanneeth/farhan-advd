/** Crops of your question papers, answer keys and notes (WebP), keyed by file name without extension. */
const papers = import.meta.glob('./*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const notes = import.meta.glob('../notes/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const key = (path: string) => path.replace(/^.*\//, '').replace(/\.webp$/, '');
export const PAPER_IMG: Record<string, string> = Object.fromEntries(Object.entries(papers).map(([k, v]) => [key(k), v]));
export const NOTE_IMG: Record<string, string> = Object.fromEntries(Object.entries(notes).map(([k, v]) => [key(k), v]));
