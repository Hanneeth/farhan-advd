/* Lesson D (Lec 15–17): title, formula sheet, flashcards. Continues where the Lec 11–14 lesson stops. */
'use strict';
scene('Start here', 'Lectures 15–17: the plan', 24, (S) => {
  titleCard(S, 'LECTURES 15–17', 'Margins and compensation', 'how far a loop is from oscillating, what that looks like, and how one capacitor fixes it', ['Bode of βA', 'Phase margin', 'Peaking', 'Ringing', 'Compensation', 'Miller']);
  S.say(0.3, 'Lecture 14 ended with Barkhausen: a loop oscillates when the signal comes back the same size and turned by 180 degrees. These three lectures answer the next questions.');
  S.say(9, 'Lecture 15: how far a loop is from that cliff, read off a Bode plot. Lecture 16: what a small margin looks like, as a peak and as ringing. Lecture 17: how to fix it with compensation, and the Miller capacitor of the two-stage op amp.');
  S.say(18, 'Every mid-sem, quiz and tutorial question on these lectures comes after its theory, and you solve each part first, against the exam clock.');
});

FORMULAS = [
  ['Lec 15 · loop gain and margins', [
    ['Closed loop', 'A_f(j\\omega) = \\dfrac{A(j\\omega)}{1 + \\beta A(j\\omega)}'],
    ['Two-pole size', '|\\beta A| = \\dfrac{\\beta A_0}{\\sqrt{1+(\\omega/\\omega_{p1})^2}\\sqrt{1+(\\omega/\\omega_{p2})^2}}'],
    ['Angles add', '\\angle\\beta A = -\\tan^{-1}\\tfrac{\\omega}{\\omega_{p1}} - \\tan^{-1}\\tfrac{\\omega}{\\omega_{p2}}'],
    ['Crossovers', '|\\beta A(\\omega_{GX})| = 1,\\quad \\angle\\beta A(\\omega_{PX}) = -180^\\circ'],
    ['Phase margin', 'PM = 180^\\circ + \\angle\\beta A(j\\omega_{GX})'],
    ['Gain margin', 'GM = -20\\log|\\beta A(j\\omega_{PX})|'],
    ['One pole (always stable)', 'PM = 90^\\circ,\\quad \\omega_p\' = \\omega_{p1}(1+\\beta A_0)'],
    ['Second pole and PM', '\\omega_{p1}\\ll\\omega_{GX}:\\; PM = 90^\\circ - \\tan^{-1}\\tfrac{\\omega_{GX}}{\\omega_{p2}}'],
  ]],
  ['Lec 16 · what PM looks like', [
    ['Closed loop at ωGX', '|A_f(\\omega_{GX})| = \\dfrac{1}{\\beta}\\cdot\\dfrac{1}{|1 + e^{-j(180^\\circ - PM)}|} = \\dfrac{1}{\\beta}\\cdot\\dfrac{1}{2\\sin(PM/2)}'],
    ['Numbers to know', '5^\\circ \\to 11.5,\\;\\; 45^\\circ \\to 1.3,\\;\\; 60^\\circ \\to 1,\\;\\; 90^\\circ \\to 0.707\\;\\;(\\times 1/\\beta)'],
    ['PM from a peak', 'PM = 2\\sin^{-1}\\dfrac{1}{2K}'],
    ['Loop gain from the open-loop plot', '20\\log|A| - 20\\log\\tfrac{1}{\\beta} = 20\\log|\\beta A|'],
  ]],
  ['Lec 17 · compensation', [
    ['Dominant pole', "f_{p1}' = \\dfrac{f_{GX}}{\\beta A_0}\\;\\;(\\text{GX at } f_{p2} \\Rightarrow 45^\\circ)"],
    ['Miller', 'C_{in} = C_c(1 + A_2),\\quad C_{out} = C_c\\left(1 + \\tfrac{1}{A_2}\\right)'],
    ['Without Cc', 'P_1 = \\dfrac{1}{R_1C_1} = \\dfrac{1}{(r_{O2}\\parallel r_{O4})C_1},\\; P_2 = \\dfrac{1}{(r_{O6}\\parallel r_{O7})C_2}'],
    ['With Cc', "P_1' = \\dfrac{1}{R_1[C_1 + (1+A_2)C_c]} \\approx \\dfrac{1}{R_1A_2C_c},\\quad P_2' \\approx \\dfrac{G_{m2}}{C_L}"],
    ['GBW', '\\omega_u = \\dfrac{G_{m1}}{C_c}'],
    ['RHP zero', '\\omega_z = \\dfrac{G_{m2}}{C_c},\\quad R_z = \\dfrac{1}{G_{m2}} \\text{ removes it}'],
    ['PM of a two-stage', 'PM = 90^\\circ - \\tan^{-1}\\tfrac{\\omega_u}{\\omega_{p2}} - \\tan^{-1}\\tfrac{\\omega_u}{\\omega_z}'],
    ['Cc for a PM', 'C_c = \\dfrac{G_{m1}C_L\\tan PM}{G_{m2}}\\;(\\text{zero removed});\\; C_c \\ge 0.22C_L \\text{ (60°, } g_{m6} = 10g_{m1})'],
    ['Slew rate', 'SR = \\min\\left(\\dfrac{I_5}{C_c},\\; \\dfrac{I_7 - I_5}{C_L}\\right)'],
  ]],
];

CARDS = [
  ['Gain crossover vs phase crossover?', '$\\omega_{GX}$: $|\\beta A| = 1$. $\\omega_{PX}$: $\\angle\\beta A = -180°$. Stable when $\\omega_{GX}$ comes first.'],
  ['Phase margin?', '$PM = 180° + \\angle\\beta A(\\omega_{GX})$: degrees left before the cliff, measured where the gain runs out.'],
  ['Why is a one-pole loop always stable?', 'One pole lags at most 90°, so PM ≥ 90°.'],
  ['Smaller β: more or less stable?', 'More: the |βA| curve drops, $\\omega_{GX}$ moves left where the phase is kinder. β = 1 (buffer) is the hardest case.'],
  ['Two-pole loop, $\\omega_{GX}$ exactly at $\\omega_{p2}$?', 'PM = 45° (−90° from the first pole, −45° from the second).'],
  ['Closed-loop peak at PM = 45° and 60°?', '45° → 1.3/β; 60° → exactly 1/β (no peak).'],
  ['PM from a 50 % peak?', '$1/(2\\sin(PM/2)) = 1.5$ → PM = 38.9°.'],
  ['Why ≈ 60° as the target?', 'No peaking, little overshoot, fast settling. 90° is smooth but slow.'],
  ['Dominant-pole compensation?', 'Slide the first pole down until $|\\beta A|$ reaches 1 where the other poles still leave the PM: $f_{p1}\' = f_{GX}/(\\beta A_0)$.'],
  ['Miller effect?', 'A capacitor across an inverting gain $A_2$ sees $(1+A_2)v$: it looks like $C_c(1+A_2)$ at the input.'],
  ['Pole splitting?', '$C_c$ pushes $P_1$ down to $1/(R_1A_2C_c)$ and $P_2$ up to $G_{m2}/C_L$.'],
  ['GBW of a Miller two-stage?', '$\\omega_u = G_{m1}/C_c$.'],
  ['Where does the RHP zero come from?', '$C_c$ feeds the signal forward, opposite to M6’s current; they cancel at $G_{m2}/C_c$. It lags like a pole. Fix: $R_z = 1/G_{m2}$.'],
  ['Slew rate of a two-stage?', '$I_5/C_c$, unless $(I_7 - I_5)/C_L$ is smaller.'],
];
