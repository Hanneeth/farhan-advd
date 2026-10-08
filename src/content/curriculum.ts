/**
 * The curriculum map (CLAUDE.md §7). Foundations U0–U12, the analog handout lectures L1–L14 with the
 * 1st→2nd edition mapping and a pointer to your own lecture notes (numbered by date).
 */
import type { Unit } from './types';

export const UNITS: Unit[] = [
  { id: 'U0', title: 'Circuit language', short: 'Voltage drops, dividers, parallel', group: 'foundations', lessons: ['u0-drops', 'u0-parallel'], prereqs: [], milestone: 1 },
  { id: 'U1', title: 'The MOSFET', short: 'Gate, channel, Vth, Vov, W/L', group: 'foundations', lessons: ['u1-mosfet'], prereqs: ['U0'], ref: 'Razavi §2.1–2.2', milestone: 1 },
  { id: 'U2', title: 'Triode, saturation, pinch-off', short: 'The waterfall and the fence', group: 'foundations', lessons: ['u2-pinchoff', 'u2-squarelaw'], prereqs: ['U1'], ref: 'Razavi §2.2–2.3', milestone: 1 },
  { id: 'U3', title: 'DC recipe and PMOS', short: 'Assume, solve, walk, check', group: 'foundations', lessons: ['u3-recipe', 'u3-pmos-design'], prereqs: ['U2'], ref: 'Razavi §2.2, Tutorial 1 Q1', milestone: 1 },
  { id: 'U4', title: 'Small signal', short: 'gm three ways, rO, gm·rO', group: 'foundations', lessons: ['u4-gm', 'u4-ro'], prereqs: ['U3'], ref: 'Razavi §2.4.3', milestone: 1 },
  { id: 'U5', title: 'First amplifier: common source', short: 'Gain is a slope; Av = −Gm·Rout', group: 'foundations', lessons: ['u5-cs'], prereqs: ['U4'], ref: 'Razavi §3.3.1', milestone: 1 },
  { id: 'U6', title: 'Impedance rules, sources, diodes, mirrors', short: 'Gate ∞, drain rO, source 1/gm', group: 'foundations', lessons: ['u6-rules', 'u6-mirror'], prereqs: ['U5'], ref: 'Razavi §3.3, Ch 5', milestone: 2 },
  { id: 'U7', title: 'CS with every load + degeneration', short: 'The ratio rule', group: 'foundations', lessons: ['u7-loads', 'u7-degen'], prereqs: ['U6'], ref: 'Razavi §3.3', milestone: 2 },
  { id: 'U8', title: 'Source follower and common gate', short: 'Gain 1, Rout 1/gm; gain gm·RD, Rin 1/gm', group: 'foundations', lessons: ['u8-follower', 'u8-cg'], prereqs: ['U7'], ref: 'Razavi §3.4–3.5', milestone: 2 },
  { id: 'U9', title: 'Cascode', short: 'Shielding, gm·rO², the load trap', group: 'foundations', lessons: ['u9-cascode', 'u9-telescopic'], prereqs: ['U8'], ref: 'Razavi §3.6', milestone: 2 },
  { id: 'U10', title: 'Differential pair', short: 'CM/DM, half circuit, 2RSS', group: 'foundations', lessons: ['u10-steering', 'u10-half', 'u10-cmrange'], prereqs: ['U9'], ref: 'Razavi Ch 4 · Tutorial 1', milestone: 3 },
  { id: 'U11', title: 'Five-transistor OTA', short: 'The mirror recovers the lost half', group: 'foundations', lessons: ['u11-ota', 'u11-ota-range'], prereqs: ['U10'], ref: 'Razavi §5.3 · Quiz 1', milestone: 3 },
  { id: 'U12', title: 'Poles and bandwidth', short: 'GBW = gm/CL', group: 'foundations', lessons: ['u12-poles', 'u12-settling'], prereqs: ['U11'], ref: 'Razavi Ch 6', milestone: 3 },
  { id: 'L1', title: 'Performance parameters', short: 'Gain error, settling, slewing, swing', group: 'handout', lessons: ['l1-gain', 'l1-speed', 'l1-other'], prereqs: ['U12'], ref: 'Handout L1 · 1st ed §9.1 · 2nd ed §9.1', notes: 'Your notes: Lec 01, Lec 02, settling example', milestone: 4 },
  { id: 'L2', title: 'One-stage op amps', short: '5-T OTA, telescopic, buffer window', group: 'handout', lessons: ['l2-onestage', 'l2-buffer', 'l2-cmchoice'], prereqs: ['L1'], ref: 'Handout L2 · 1st ed §9.2.1 · 2nd ed §9.2.1', notes: 'Your notes: Lec 02, 03, 04, 05', milestone: 4 },
  { id: 'L3', title: 'Design procedure', short: 'Power → swing → Vov → W/L → gain', group: 'handout', lessons: ['l3-design', 'l3-scaling'], prereqs: ['L2'], ref: 'Handout L3 · 1st ed §9.2.2–9.2.3 · 2nd ed §9.2.2–9.2.3', notes: 'Your notes: Lec 04', milestone: 4 },
  { id: 'L4', title: 'Folded cascode', short: 'Folding flips the inequality', group: 'handout', lessons: ['l4-folding', 'l4-gain'], prereqs: ['L3'], ref: 'Handout L4 · 1st ed §9.2.4–9.2.5 · 2nd ed §9.2.4–9.2.6', notes: 'Your notes: Lec 05, 06', milestone: 4 },
  { id: 'L5', title: 'Two-stage op amp', short: 'High gain, then high swing', group: 'handout', lessons: ['l5-twostage'], prereqs: ['L4'], ref: 'Handout L5 · 1st ed §9.3 · 2nd ed §9.3', notes: 'Your notes: Lec 07', milestone: 5 },
  { id: 'L6', title: 'Gain boosting', short: 'Rout × (1 + A1)', group: 'handout', lessons: ['l6-boost'], prereqs: ['L5'], ref: 'Handout L6 · 1st ed §9.4 · 2nd ed §9.4', notes: 'Your notes: Lec 06–09 · Tutorial 4', milestone: 5 },
  { id: 'L7', title: 'CMFB: concept and sensing', short: 'Why fully differential outputs float', group: 'handout', lessons: ['l7-cmfb'], prereqs: ['L6'], ref: 'Handout L7 · 1st ed §9.7.1–9.7.2 · 2nd ed §9.7.1–9.7.2', notes: 'Your notes: Lec 09–11 · Tutorial 5', milestone: 5 },
  { id: 'L8', title: 'CMFB techniques', short: 'Triode sensing and the loop', group: 'handout', lessons: ['l8-cmfb', 'l8-replica'], prereqs: ['L7'], ref: 'Handout L8 · 1st ed §9.7.3 · 2nd ed §9.7.3', notes: 'Your notes: Lec 11–12 · Quiz 2', milestone: 5 },
  { id: 'L9', title: 'Input range and slew rate', short: 'SR = ISS/CL', group: 'handout', lessons: ['l9-slew'], prereqs: ['L8'], ref: 'Handout L9 · 1st ed §9.8–9.9 · 2nd ed §9.8–9.10', notes: 'Your notes: Lec 13–14 · Tutorial 6', milestone: 5 },
  { id: 'L10', title: 'PSRR and noise', short: 'Supply rejection, input-referred noise', group: 'handout', lessons: ['l10-psrr', 'l10-noisebasics', 'l10-noise'], prereqs: ['L9'], ref: 'Handout L10 · 1st ed §9.11–9.12 · 2nd ed §9.11–9.12', notes: 'Not in your notes yet: built from Razavi', milestone: 5 },
  { id: 'L11', title: 'Stability I', short: 'Barkhausen, multi-pole systems', group: 'handout', lessons: ['l11-barkhausen', 'l11-multipole'], prereqs: ['L10'], ref: 'Handout L11 · 1st ed §10.1–10.2 · 2nd ed §10.1–10.2', notes: 'Your notes: Lec 14–15', milestone: 5 },
  { id: 'L12', title: 'Stability II', short: 'Phase and gain margin', group: 'handout', lessons: ['l12-margins', 'l12-ringing'], prereqs: ['L11'], ref: 'Handout L12 · 1st ed §10.3 · 2nd ed §10.3', notes: 'Your notes: Lec 15–16', milestone: 5 },
  { id: 'L13', title: 'Compensation I', short: 'Dominant pole, Miller, pole splitting', group: 'handout', lessons: ['l13-dominant', 'l13-onestage', 'l13-miller'], prereqs: ['L12'], ref: 'Handout L13 · 1st ed §10.4 · 2nd ed §10.4–10.5', notes: 'Your notes: Lec 17', milestone: 5 },
  { id: 'L14', title: 'Compensation II', short: 'CC, the RHP zero, Rz, slewing', group: 'handout', lessons: ['l14-twostage', 'l14-rz'], prereqs: ['L13'], ref: 'Handout L14 · 1st ed §10.5 · 2nd ed §10.5–10.6', notes: 'Your notes: Lec 17 (start)', milestone: 5 },
  { id: 'L15', title: 'Inverter statics', short: 'VOH, VOL, VIL, VIH, noise margins', group: 'digital', lessons: ['d15-statics'], prereqs: ['L14'], ref: 'Handout L15 · Kang & Leblebici §5.1', milestone: 6 },
  { id: 'L16', title: 'Inverters with different loads', short: 'Resistor, depletion, pseudo-nMOS', group: 'digital', lessons: ['d16-loads'], prereqs: ['L15'], ref: 'Handout L16 · Kang & Leblebici §5.2–5.3', milestone: 6 },
  { id: 'L17', title: 'The CMOS inverter', short: 'VM, kR, the symmetric inverter', group: 'digital', lessons: ['d17-cmos'], prereqs: ['L16'], ref: 'Handout L17 · Kang & Leblebici §5.4', milestone: 6 },
  { id: 'L18', title: 'Switching parameters', short: 'τPHL, τPLH, load capacitance', group: 'digital', lessons: ['d18-switching'], prereqs: ['L17'], ref: 'Handout L18 · Kang & Leblebici §6.1–6.2', milestone: 6 },
  { id: 'L19', title: 'Calculating delay', short: 'Kang’s formula, sizing', group: 'digital', lessons: ['d19-delaycalc'], prereqs: ['L18'], ref: 'Handout L19 · Kang & Leblebici §6.3', milestone: 6 },
  { id: 'L20', title: 'Logic gates: static analysis', short: 'NAND/NOR as equivalent inverters', group: 'digital', lessons: ['d20-gates'], prereqs: ['L19'], ref: 'Handout L20 · Kang & Leblebici §7.1–7.2', milestone: 6 },
  { id: 'L21', title: 'CMOS logic circuits', short: 'Series for AND, parallel for OR, dual', group: 'digital', lessons: ['d21-cmoslogic'], prereqs: ['L20'], ref: 'Handout L21 · Kang & Leblebici §7.3', milestone: 6 },
  { id: 'L22', title: 'Complex gates, Euler paths', short: 'AOI/OAI sizing, one-strip layout', group: 'digital', lessons: ['d22-euler'], prereqs: ['L21'], ref: 'Handout L22 · Kang & Leblebici §7.4', milestone: 6 },
  { id: 'L23', title: 'RC delay model', short: 'Transistors as resistors, Elmore', group: 'digital', lessons: ['d23-rc'], prereqs: ['L22'], ref: 'Handout L23 · Weste & Harris §4.3', milestone: 6 },
  { id: 'L24', title: 'Linear delay model', short: 'd = g·h + p', group: 'digital', lessons: ['d24-linear'], prereqs: ['L23'], ref: 'Handout L24 · Weste & Harris §4.4', milestone: 6 },
  { id: 'L25', title: 'Logical effort of paths', short: 'F = GBH, f̂ = F^(1/N)', group: 'digital', lessons: ['d25-path'], prereqs: ['L24'], ref: 'Handout L25 · Weste & Harris §4.5', milestone: 6 },
  { id: 'L26', title: 'Power', short: 'αCVDD²f and leakage', group: 'digital', lessons: ['d26-power'], prereqs: ['L25'], ref: 'Handout L26 · Weste & Harris §5.2–5.3', milestone: 6 },
  { id: 'L27', title: 'Static CMOS design', short: 'Compound gates, bubble pushing', group: 'digital', lessons: ['d27-staticdesign'], prereqs: ['L26'], ref: 'Handout L27 · Weste & Harris §9.2.1', milestone: 6 },
  { id: 'L28', title: 'Ratioed circuits and CVSL', short: 'Pseudo-nMOS, dual rail', group: 'digital', lessons: ['d28-ratioed'], prereqs: ['L27'], ref: 'Handout L28 · Weste & Harris §9.2.2–9.2.3', milestone: 6 },
  { id: 'L29', title: 'Dynamic circuits', short: 'Precharge, domino, charge sharing', group: 'digital', lessons: ['d29-dynamic'], prereqs: ['L28'], ref: 'Handout L29 · Weste & Harris §9.2.4', milestone: 6 },
  { id: 'L30', title: 'Pass-transistor logic', short: 'Weak levels, TGs, chains', group: 'digital', lessons: ['d30-pass'], prereqs: ['L29'], ref: 'Handout L30 · Weste & Harris §9.2.5', milestone: 6 },
  { id: 'L31', title: 'Sequencing methods', short: 'Flip-flops, latches, pulsed latches', group: 'digital', lessons: ['d31-sequencing'], prereqs: ['L30'], ref: 'Handout L31 · Weste & Harris §10.1–10.2.1', milestone: 6 },
  { id: 'L32', title: 'Max and min delay', short: 'Setup and hold', group: 'digital', lessons: ['d32-maxmin'], prereqs: ['L31'], ref: 'Handout L32 · Weste & Harris §10.2.2–10.2.3', milestone: 6 },
  { id: 'L33', title: 'Clock skew', short: 'It taxes setup and hold', group: 'digital', lessons: ['d33-skew'], prereqs: ['L32'], ref: 'Handout L33 · Weste & Harris §10.2.5', milestone: 6 },
  { id: 'L34', title: 'Latch and flip-flop circuits', short: 'TG latch, master–slave', group: 'digital', lessons: ['d34-latches'], prereqs: ['L33'], ref: 'Handout L34 · Weste & Harris §10.3', milestone: 6 },
  { id: 'L35', title: 'Adder building blocks', short: 'Full adder, G and P', group: 'digital', lessons: ['d35-fulladder'], prereqs: ['L34'], ref: 'Handout L35 · Weste & Harris §11.2.1–11.2.2', milestone: 6 },
  { id: 'L36', title: 'Fast adders', short: 'Ripple, skip, lookahead', group: 'digital', lessons: ['d36-adders'], prereqs: ['L35'], ref: 'Handout L36 · Weste & Harris §11.2.2', milestone: 6 },
  { id: 'L37', title: 'Multipliers', short: 'Array, Booth radix-4', group: 'digital', lessons: ['d37-multiplier'], prereqs: ['L36'], ref: 'Handout L37 · Weste & Harris §11.9', milestone: 6 },
  { id: 'L38', title: 'SRAM', short: '6T cell, read and write', group: 'digital', lessons: ['d38-sram'], prereqs: ['L37'], ref: 'Handout L38 · Weste & Harris §12.2', milestone: 6 },
];


/** Exam dates from the course handout. */
export const EXAMS = [
  { name: 'Mid-semester exam', date: '2026-10-09', note: '90 min · closed book · 60 marks' },
  { name: 'Quiz III', date: '2026-10-30', note: '30 min · open book' },
  { name: 'Quiz IV', date: '2026-11-20', note: '30 min · open book' },
  { name: 'Comprehensive', date: '2026-12-08', note: '3 h · closed book' },
];
