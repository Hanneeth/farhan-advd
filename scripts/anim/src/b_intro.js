/* Lesson B (Lec 11–14): title, formula sheet, flashcards. */
'use strict';
scene('Start here', 'Lectures 11–14: the plan', 22, (S) => {
  titleCard(S, 'LECTURES 11 – 14', 'Common mode, then speed', 'CMFB · frequency & poles from zero · settling · slewing · stability', ['Lec 10 recap', 'Lec 11–12 CMFB', 'Poles from zero', 'Lec 13 settling', 'Lec 14 slewing & stability']);
  S.say(0.3, 'Two halves. First the common-mode feedback of Lectures 10–12, with every CMFB question. Then <b>speed</b>: how fast an op amp’s output can move.');
  S.say(8, 'Speed needs frequency, poles and bandwidth. You have not met those yet, so a whole chapter builds them <b>from zero</b> — a capacitor, a time constant, a sine wave — before Lecture 13 uses them.');
  S.say(16, 'Every theory chapter ends with its questions, and every question stops for <b>your</b> answer before it is explained.');
});

FORMULAS = [
  ['Lec 10–12 · CMFB', [
    ['CM and DM', 'V_{CM} = \\frac{V_1 + V_2}{2},\\; v_d = V_1 - V_2'],
    ['Resistive sensing', 'V_{out,CM} = \\frac{V_{out1}+V_{out2}}{2},\\; A_v = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R)'],
    ['CM gain allowed by ±x %', '|A_{CM}| = \\frac{2x\\,V_{O,CM}}{\\Delta V_{in,CM}}'],
    ['CM half circuit', '|A_{CM}| = \\frac{r_{O3}}{1/g_{m1} + 2r_{O5}}'],
    ['CMFB closes the loop', '|A_{CM}|_{fb} = \\frac{|A_{CM}|}{1 + T}'],
    ['Deep triode', 'R_{on} = \\frac{1}{\\mu_nC_{ox}\\frac WL(V_{GS}-V_{th})}'],
    ['Pinned output CM', 'V_{out1}+V_{out2} = \\frac{2I_D}{\\mu_nC_{ox}(W/L)}\\cdot\\frac{1}{V_{b1}-V_{GS3}} + 2V_{th}'],
    ['Replica', '(W/L)_{14} = (W/L)_{11},\\; (W/L)_{15} = (W/L)_{12} + (W/L)_{13}'],
  ]],
  ['Frequency & poles (from zero)', [
    ['Capacitor', 'i = C\\frac{dv}{dt}\\;\\Rightarrow\\; \\text{constant } I:\\; \\frac{dv}{dt} = \\frac{I}{C}'],
    ['RC step', 'v(t) = V_0(1 - e^{-t/\\tau}),\\; \\tau = RC'],
    ['Time to within ε', 't = \\tau\\ln\\frac{1}{\\varepsilon}:\\; 1\\% = 4.6\\tau,\\; 0.1\\% = 6.9\\tau'],
    ['Rise time 10–90 %', 't_r = 2.2\\,\\tau'],
    ['Angular frequency', '\\omega = 2\\pi f'],
    ['Pole of a node', '\\omega_p = \\frac{1}{RC},\\; f_p = \\frac{1}{2\\pi RC}'],
    ['One-pole gain', '|A(j\\omega)| = \\frac{A_0}{\\sqrt{1 + (\\omega/\\omega_p)^2}},\\; \\angle A = -\\tan^{-1}\\frac{\\omega}{\\omega_p}'],
    ['Decibels', '\\text{dB} = 20\\log_{10}|A|'],
    ['Gain-bandwidth', '\\omega_u = A_0\\,\\omega_p,\\; \\text{OTA: } \\omega_u = \\frac{g_m}{C_L}'],
    ['Feedback moves the pole', '\\omega_{p,cl} = \\omega_p(1+\\beta A_0) \\approx \\beta\\omega_u,\\; \\tau_{cl} = \\frac{1}{\\beta\\omega_u} = \\frac{R_{out}C_L}{1+\\beta A}'],
  ]],
  ['Lec 13 · settling and slewing', [
    ['Closed-loop step', 'V_{out}(t) = V_0\\frac{A}{1+\\beta A}\\left(1 - e^{-t/\\tau}\\right)'],
    ['Initial slope (linear)', '\\left.\\frac{dV_{out}}{dt}\\right|_0 = \\frac{V_0A_{CL}}{\\tau}'],
    ['Slew rate (5-T OTA)', 'SR = \\frac{I_{SS}}{C_L}'],
    ['Slewing starts when', 'V_0 > V_{0,crit} = \\frac{SR\\,\\tau}{A_{CL}}'],
    ['Slewing time', 't_{slew} = \\frac{V_0A_{CL} - SR\\,\\tau}{SR}'],
    ['Pair fully steered', '\\Delta V_{in} = \\sqrt{2}\\,V_{ov}'],
  ]],
  ['Lec 14 · slewing and stability', [
    ['Telescopic, each output', '\\left|\\frac{dV_{out}}{dt}\\right| = \\frac{I_{SS}}{2C_L},\\; \\text{differential } \\frac{I_{SS}}{C_L}'],
    ['Folded cascode', 'SR = \\frac{\\min(I_P, I_{SS})}{C_L},\\; \\text{symmetric if } I_P \\ge I_{SS}'],
    ['Closed loop', 'A_f(s) = \\frac{A(s)}{1 + \\beta A(s)}'],
    ['Barkhausen', '|\\beta A(j\\omega_1)| = 1,\\; \\angle\\beta A(j\\omega_1) = -180^\\circ'],
    ['Complex number', 'a + jb = Me^{j\\theta},\\; M = \\sqrt{a^2+b^2},\\; \\theta = \\tan^{-1}\\frac ba'],
    ['Two-pole loop', 's^2 + (\\omega_{p1}+\\omega_{p2})s + (1+\\beta A_0)\\omega_{p1}\\omega_{p2} = 0'],
    ['Q of that loop', 'Q = \\frac{\\sqrt{(1+\\beta A_0)\\omega_{p1}\\omega_{p2}}}{\\omega_{p1}+\\omega_{p2}}:\\; 0.5 \\text{ coincident},\\; 0.707 \\text{ flat}'],
  ]],
];
CARDS = [
  ['Why does a fully differential amp need CMFB?', 'Two current sources in series set no voltage: $(I_P - I_N)(R_P\\parallel R_N)$ drives the CM to a rail.'],
  ['CMFB in three words?', 'Sense, compare (with $V_{REF}$), correct (a current source).'],
  ['Why does a triode pair sense only the CM?', 'Its conductance depends on $V_{out1}+V_{out2}$ only.'],
  ['A capacitor fed by a constant current…', '…ramps in a straight line at $I/C$. That is slewing.'],
  ['What is τ?', '$RC$: the time to reach 63 %; the initial slope reaches the final value in τ.'],
  ['How long to settle within 1 %? 0.1 %?', '$4.6\\tau$ and $6.9\\tau$ ($\\tau\\ln(1/\\varepsilon)$).'],
  ['What is a pole, physically?', 'The frequency where a node’s capacitor starts to steal the current: $1/(RC)$.'],
  ['−3 dB means?', 'Gain × $1/\\sqrt2$ (0.707). Bandwidth = the −3 dB frequency = the pole.'],
  ['Slope past a pole?', '−20 dB/decade: 10× the frequency, 1/10 the gain. Phase −90°.'],
  ['GBW of a 5-T OTA?', '$\\omega_u = g_m/C_L$; $R_{out}$ cancels.'],
  ['What does feedback do to the pole?', 'Moves it up by $(1+\\beta A_0)$ to ≈ $\\beta\\omega_u$; $\\tau_{cl} = 1/(\\beta\\omega_u)$.'],
  ['When does an OTA slew?', 'When the linear response would need more current than $I_{SS}$: $V_0A_{CL}/\\tau > SR$.'],
  ['Slew rate of a 5-T OTA?', '$I_{SS}/C_L$ both ways (the mirror copies).'],
  ['Telescopic fully differential slew?', 'Each output $I_{SS}/2C_L$, the difference $I_{SS}/C_L$.'],
  ['Folded cascode slew limited by?', '$I_P$ if $I_P < I_{SS}$ (a branch turns off). Need $I_P \\ge I_{SS}$.'],
  ['Barkhausen?', '$\\beta A = -1$: $|\\beta A| = 1$ and phase −180° at the same frequency → oscillation.'],
];
