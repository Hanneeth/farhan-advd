/* Lesson F (Lec 18–22): title, formula sheet and flashcards. */
'use strict';
scene('Start here', 'Lectures 18–22: the plan', 26, (S) => {
  titleCard(S, 'LECTURES 18–22', 'Design it, then switch it', 'poles and slewing from zero, the two-stage op amp designed spec by spec, then the inverter', ['Poles from zero', 'Slewing', 'Lec 18 · PM', 'Lec 19 · design', 'Lec 20–22 · inverter']);
  S.say(0.3, 'If frequency, poles, bandwidth and slewing feel shaky, you are in the right place: the first chapter builds them from a bucket of water, and you solve a question after every idea.');
  S.say(10, 'Then Lecture 18: the two-stage op amp’s poles and the three phase-margin rules. Lecture 19: designing it spec by spec, with Tutorial 7 solved by you. Lectures 20 to 22: the inverter and its noise margins, with the resistive load worked out fully.');
  S.say(19, 'Orange stops are your turn. Every number is checked, every step has a hint, and the full method appears after you answer.');
});

FORMULAS = [
  ['Ground up · frequency, poles, slewing', [
    ['Capacitor', 'i = C\\,\\dfrac{dv}{dt},\\quad \\dfrac{dv}{dt} = \\dfrac{I}{C}'],
    ['RC step', 'v = V_0\\left(1 - e^{-t/\\tau}\\right),\\; \\tau = RC,\\; t_{1\\%} = 4.6\\tau'],
    ['Frequency', '\\omega = 2\\pi f'],
    ['One pole', '\\left|H\\right| = \\dfrac{1}{\\sqrt{1 + (\\omega/\\omega_p)^2}},\\; \\angle H = -\\tan^{-1}\\dfrac{\\omega}{\\omega_p},\\; \\omega_p = \\dfrac{1}{RC}'],
    ['One stage', 'A_0 = g_mR,\\; \\omega_{-3dB} = \\dfrac{1}{RC},\\; GBW = \\dfrac{g_m}{C}'],
    ['Phase margin', 'PM = 180^\\circ - \\text{lag at } |\\beta A| = 1'],
    ['Slewing', 'SR = \\dfrac{I_{max}}{C},\\; \\text{slews if } \\dfrac{V_0}{\\tau} > SR,\\; t_{slew} \\approx \\dfrac{V_0 - SR\\,\\tau}{SR}'],
  ]],
  ['Lec 18 · two-stage poles and PM rules', [
    ['DC gain', 'A_0 = G_{m1}R_1\\cdot G_{m2}R_2,\\; R_1 = r_{O2}\\parallel r_{O4},\\; R_2 = r_{O6}\\parallel r_{O7}'],
    ['Poles', '\\omega_{p1} \\approx \\dfrac{1}{G_{m2}R_2R_1C_c},\\quad \\omega_{p2} \\approx \\dfrac{G_{m2}}{C_1 + C_2} \\approx \\dfrac{g_{m6}}{C_L}'],
    ['RHP zero and GB', '\\omega_z = \\dfrac{G_{m2}}{C_c},\\quad GB = A_0\\omega_{p1} = \\dfrac{g_{m1}}{C_c}'],
    ['Phase margin', 'PM = 180^\\circ - \\tan^{-1}\\tfrac{GB}{\\omega_{p1}} - \\tan^{-1}\\tfrac{GB}{\\omega_{p2}} - \\tan^{-1}\\tfrac{GB}{\\omega_z}'],
    ['60° rules', '\\omega_z \\ge 10\\,GB,\\; \\omega_{p2} \\ge 2.2\\,GB \\Rightarrow g_{m6} \\ge 10g_{m1},\\; C_c \\ge 0.22\\,C_L'],
  ]],
  ['Lec 19 · the design recipe', [
    ['1–2', 'C_c = 0.22C_L,\\quad I_5 = SR\\cdot C_c'],
    ['3 · ICMR+', '\\left(\\tfrac WL\\right)_3 = \\dfrac{I_5}{\\mu_pC_{ox}[V_{DD} - V_{in,max} - |V_{th3}|_{max} + V_{th1,min}]^2}'],
    ['4 · GBW', 'g_{m1} = 2\\pi\\,GBW\\,C_c,\\quad \\left(\\tfrac WL\\right)_1 = \\dfrac{g_{m1}^2}{\\mu_nC_{ox}I_5}'],
    ['5 · ICMR−', 'V_{DS5} = V_{in,min} - \\sqrt{\\tfrac{I_5}{\\mu_nC_{ox}(W/L)_1}} - V_{th1,max},\\; \\left(\\tfrac WL\\right)_5 = \\dfrac{2I_5}{\\mu_nC_{ox}V_{DS5}^2}'],
    ['6–7 · second stage', 'g_{m6} = 10g_{m1},\\; \\left(\\tfrac WL\\right)_6 = \\dfrac{g_{m6}}{\\mu_pC_{ox}|V_{ov4}|},\\; I_6 = \\tfrac12g_{m6}|V_{ov4}|,\\; \\left(\\tfrac WL\\right)_7 = \\left(\\tfrac WL\\right)_5\\tfrac{I_6}{I_5}'],
    ['8 · checks', 'P = V_{DD}(I_{bias} + I_5 + I_6)\\le P_{max};\\; \\text{too high: lower } |V_{ov4,6}|'],
    ['Nulling resistor', '\\omega_z = \\dfrac{1}{C_c(1/g_{m6} - R_z)},\\; R_z = \\dfrac{1}{g_{m6}} \\text{ removes it}'],
  ]],
  ['Lec 20–22 · inverters', [
    ['Definitions', 'V_{IL}, V_{IH}: \\dfrac{dV_{out}}{dV_{in}} = -1;\\; V_{th}: V_{out} = V_{in}'],
    ['Noise margins', 'NM_L = V_{IL} - V_{OL},\\quad NM_H = V_{OH} - V_{IH}'],
    ['R-load: V_OH, V_OL', 'V_{OH} = V_{DD},\\; V_{OL} = a - \\sqrt{a^2 - \\tfrac{2V_{DD}}{k_nR_L}},\\; a = V_{DD} - V_{T0} + \\tfrac{1}{k_nR_L}'],
    ['R-load: V_IL, V_IH', 'V_{IL} = V_{T0} + \\tfrac{1}{k_nR_L},\\quad V_{IH} = V_{T0} + \\sqrt{\\tfrac{8V_{DD}}{3k_nR_L}} - \\tfrac{1}{k_nR_L}'],
    ['R-load: V_th, power', '\\tfrac{k_nR_L}{2}u^2 + u - (V_{DD} - V_{T0}) = 0,\\; V_{th} = V_{T0} + u;\\; P_D = \\tfrac{V_{DD}}{2}\\cdot\\tfrac{V_{DD} - V_{OL}}{R_L}'],
    ['CMOS (preview)', 'V_{th} = \\dfrac{V_{Tn} + \\sqrt{1/k_R}(V_{DD} - |V_{Tp}|)}{1 + \\sqrt{1/k_R}};\\; \\text{symmetric: } V_{IL} = \\tfrac{3V_{DD} + 2V_T}{8},\\; V_{IH} = \\tfrac{5V_{DD} - 2V_T}{8}'],
  ]],
];
CARDS = [
  ['What is a pole, in one sentence?', 'The speed $1/RC$ at which a node’s capacitor stops keeping up: size ÷√2, 45° late.'],
  ['Why does R cancel in GBW?', '$A_0 = g_mR$ and $\\omega_{-3dB} = 1/RC$: the product is $g_m/C$.'],
  ['When does an amplifier slew?', 'When the step wants a starting slope $V_0/\\tau$ larger than $SR = I_{max}/C$.'],
  ['Where does the dominant pole of a two-stage come from?', 'The Miller-multiplied $C_c$ at node P: $\\omega_{p1} \\approx 1/(G_{m2}R_2R_1C_c)$.'],
  ['Why is the RHP zero bad?', 'It lifts the gain like a zero but adds lag like a pole: $\\omega_z = g_{m6}/C_c$.'],
  ['The two PM-60° rules?', '$\\omega_z \\ge 10\\,GB$ (costs 5.71°) and $\\omega_{p2} \\ge 2.2\\,GB$ (24.3° left) → $g_{m6} \\ge 10g_{m1}$, $C_c \\ge 0.22C_L$.'],
  ['Which spec sizes M3, M4? M5? M1?', 'ICMR+ → M3, M4. ICMR− → M5. GBW → M1, M2. SR → $I_5$. PM → $C_c$.'],
  ['Power too high after the recipe?', 'Lower $|V_{ov4}| = |V_{ov6}|$ (wider M3, M4, M6): $I_6 = \\tfrac12g_{m6}|V_{ov}|$ drops, $g_{m6}$ stays.'],
  ['Why slope −1 for V_IL and V_IH?', 'Noise is multiplied by the slope; beyond $|$slope$| = 1$ it grows.'],
  ['V_IL of a resistive-load inverter?', '$V_{T0} + 1/(k_nR_L)$.'],
  ['Why did CMOS replace the resistive load?', 'Full swing, no static current, no big resistor.'],
];
