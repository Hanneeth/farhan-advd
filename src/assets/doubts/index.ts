/** Figures drawn while answering your tutoring-chat doubts (Oct 2026), shown inside the lecture steps they explain. */
const figs = import.meta.glob(['./*.webp', './*.svg'], { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

export function doubtFig(key: string): string | undefined {
  return figs[`./${key}.webp`] ?? figs[`./${key}.svg`];
}
