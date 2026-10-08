/* Say-it-back lines, loop gain from zero + Lec 15–17: core concepts and formulas only. */
'use strict';
setRecall([
  ['The feedback loop: what βA means', ['Loop gain $\\beta A$: the gain once round the loop. $A_f = A/(1 + \\beta A)$.']],
  ['Complex numbers as arrows: size and angle', ['Gains multiply: sizes multiply, angles add. A pole subtracts its angle.']],
  ['Where Lec 14 left you: the walk to the cliff', ['Run out of gain before you run out of phase.']],
  ['Your page: one pole on the Bode plot', ['At the pole: minus 3 dB and minus 45°; the phase moves from $0.1\\omega_p$ to $10\\omega_p$.']],
  ['Two poles: sizes multiply, angles add', ['$\\angle\\beta A = -\\tan^{-1}\\frac{\\omega}{\\omega_{p1}} - \\tan^{-1}\\frac{\\omega}{\\omega_{p2}}$.']],
  ['β slides the loop gain down', ['Smaller β lowers $|\\beta A|$: more stable. β = 1 is the worst case.']],
  ['Gain crossover, phase crossover, and the two margins', [
    '$PM = 180° + \\angle\\beta A(\\omega_{GX})$.',
    '$GM = -20\\log|\\beta A(\\omega_{PX})|$.',
  ]],
  ['One pole: always stable, PM = 90°', ['One pole: PM = 90°; the closed-loop pole moves to $\\omega_{p1}(1 + \\beta A_0)$.']],
  ['Two poles: the second pole decides the margin', ['$PM = 90° - \\tan^{-1}(\\omega_{GX}/\\omega_{p2})$: 45° at $\\omega_{p2} = \\omega_{GX}$, 60° at $1.73\\,\\omega_{GX}$.']],
  ['Why a small PM makes a big peak: two arrows', ['$|A_f(\\omega_{GX})| = \\frac{1}{\\beta}\\cdot\\frac{1}{2\\sin(PM/2)}$.']],
  ['Your page’s three numbers: 5°, 45°, 60°', ['5° gives 11.5, 45° gives 1.3, 60° gives 1, all times $1/\\beta$.']],
  ['Peaking in frequency is ringing in time', ['60° is fast with a small overshoot; 90° is smooth but slow.']],
  ['The 1/β line: reading βA off the open-loop plot', ['$20\\log|A| - 20\\log\\frac{1}{\\beta} = 20\\log|\\beta A|$.']],
  ['The problem: 100 dB and three poles', ['Compensation: the loop gain must reach 1 before the phase reaches −180°, down to β = 1.']],
  ['Dominant-pole compensation: lift your foot early', ["$f_{p1}' = f_{GX}/(\\beta A_0)$."]],
  ['The Miller effect: a capacitor across a gain', ['$C_{in} = C_c(1 + A_2)$, $C_{out} = C_c(1 + 1/A_2)$.']],
  ['Before and after: P1′ ≈ 1/(R1A2Cc), and pole splitting', ["$P_1' \\approx \\frac{1}{R_1A_2C_c}$, $P_2' \\approx \\frac{G_{m2}}{C_L}$."]],
  ['Your page’s two-stage op amp (M1–M7)', ['$P_1 = \\frac{1}{(r_{O2}\\parallel r_{O4})C_1}$, $P_2 = \\frac{1}{(r_{O6}\\parallel r_{O7})C_2}$.']],
  ['GBW = Gm1/Cc, and choosing Cc for the margin', [
    '$\\omega_u = G_{m1}/C_c$.',
    '$C_c = \\frac{G_{m1}C_L\\tan PM}{G_{m2}}$; Allen: $C_c \\ge 0.22\\,C_L$.',
  ]],
  ['The full transfer function and the RHP zero', [
    '$\\omega_z = G_{m2}/C_c$, it lags like a pole; $R_z = 1/G_{m2}$ removes it.',
    '$PM = 90° - \\tan^{-1}\\frac{\\omega_u}{\\omega_{p2}} - \\tan^{-1}\\frac{\\omega_u}{\\omega_z}$.',
  ]],
  ['Slew rate of the two-stage op amp', ['$SR = \\min(I_5/C_c,\\,(I_7 - I_5)/C_L)$.']],
]);
