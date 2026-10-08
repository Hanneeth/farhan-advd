/* Lesson F closing playbook. */
'use strict';
scene('Exam playbook', 'How to attack any Lec 18–22 question', 44, (S) => {
  header(S, 'EXAM PLAYBOOK', 'Lectures 18–22 in five moves');
  remember(S, [
    '**Two-stage frequency question:** write $GB = g_{m1}/C_c$, $\\omega_{p2} = g_{m6}/C_L$, $\\omega_z = g_{m6}/C_c$ (rad/s! ×2π from Hz), then $PM = 90° - \\tan^{-1}\\frac{GB}{\\omega_{p2}} - \\tan^{-1}\\frac{GB}{\\omega_z}$.',
    '**Design question:** follow the order $C_c \\to I_5 \\to$ M3 $\\to$ M1 $\\to$ M5 $\\to$ M6 $\\to$ M7, then check power and PM. Name the devices as the sheet prints them.',
    '**Slewing:** $SR = I_5/C_c$ (two-stage); slews if $V_0/\\tau > SR$; $t_{slew} ≈ (V_0 - SR\\,\\tau)/SR$; 1 % settling $4.6\\tau$.',
    '**Resistive-load inverter:** compute $k_nR_L$ first (with $k_n = k_n\'\\,W/L$), then the five boxed results; $NM_L = V_{IL} - V_{OL}$, $NM_H = V_{OH} - V_{IH}$.',
    '**CMOS inverter:** $k_R = k_n/k_p$ → $V_{th}$; equal rise/fall sizing means symmetric → $(3V_{DD} + 2V_T)/8$ and $(5V_{DD} - 2V_T)/8$.',
  ], 0.4, 'The playbook');
  S.say(0.4, 'One card for the exam: the two-stage dictionary and phase margin, the design order, slewing, the resistive-load inverter from one product, and the CMOS shortcuts.');
  S.say(20, 'Use the chapter list to replay any topic and the Past papers tab to jump to a question. Good luck.');
});
