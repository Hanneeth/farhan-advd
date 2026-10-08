import type { Problem } from './schema';

/** Group the fixed bank by where each problem comes from. */
export function bankGroup(p: Problem): string {
  const s = p.source;
  if (/^Mid-sem 20/.test(s)) return 'Past mid-sems (2023–2025)';
  if (/^Quiz 1 20|^Quiz 2 20/.test(s)) return 'Past quizzes (2023–2025)';
  if (/^Past tutorial/.test(s)) return 'Past tutorials (2024-25)';
  if (/^Mid-sem|^Quiz/.test(s)) return 'Quizzes and mid-sem (PYQs)';
  if (/^Tutorial (\d+)/.test(s)) return `Tutorial ${s.match(/^Tutorial (\d+)/)![1]}`;
  if (/^Problem Set 1/.test(s)) return 'Problem Set 1 (L1–L4)';
  if (/^Problem Set 2/.test(s)) return 'Problem Set 2 (L8–L14)';
  if (/^Problem Set 3/.test(s)) return 'Problem Set 3 (digital)';
  if (/^Razavi Problem/.test(s)) return 'Razavi end-of-chapter problems';
  if (/^Razavi/.test(s)) return 'Razavi examples';
  if (/^Lecture notes/.test(s)) return 'Your lecture notes';
  if (/^Lab/.test(s)) return 'Lab sheets (calculations)';
  if (/^Kang|^Weste|^Rabaey|^Digital/.test(s)) return 'Digital VLSI examples';
  if (/chat|conversation/i.test(s)) return 'Questions from our chat';
  return 'Worked examples';
}
export const GROUP_ORDER = ['Past mid-sems (2023–2025)', 'Past quizzes (2023–2025)', 'Quizzes and mid-sem (PYQs)', 'Past tutorials (2024-25)', 'Tutorial 1', 'Tutorial 2', 'Tutorial 3', 'Tutorial 4', 'Tutorial 5', 'Tutorial 6', 'Tutorial 7', 'Tutorial 8', 'Problem Set 1 (L1–L4)', 'Problem Set 2 (L8–L14)', 'Problem Set 3 (digital)', 'Your lecture notes', 'Razavi examples', 'Razavi end-of-chapter problems', 'Digital VLSI examples', 'Lab sheets (calculations)', 'Questions from our chat', 'Worked examples'];
