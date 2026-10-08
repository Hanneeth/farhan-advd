/* Lesson D closing playbook. */
'use strict';
scene('Exam playbook', 'How to attack any Lec 15–17 question', 40, (S) => {
  header(S, 'EXAM PLAYBOOK', 'Lectures 15–17 in five moves');
  remember(S, [
    '**PM:** find $\\omega_{GX}$ from $|\\beta A| = 1$ (one pole: $\\beta A_0f_p$; far above two poles: $\\sqrt{\\beta A_0f_{p1}f_{p2}}$), then $PM = 180° - \\sum\\tan^{-1}(\\omega_{GX}/\\omega_{pi})$ (degree mode).',
    '**Backwards:** pick the angle that leaves the PM, solve for $\\omega_{GX}$, then set $|\\beta A| = 1$ there for $A_0$ or for the pole.',
    '**Peaking:** $K = 1/(2\\sin(PM/2))$: 45° → 1.3, 60° → 1, 90° → 0.707; PM from K: $2\\sin^{-1}(1/2K)$.',
    '**Dominant pole:** $f_{p1}\' = f_{GX}/(\\beta A_0)$; capacitor grows by the same factor.',
    '**Miller two-stage:** $SR = I_5/C_c$ · $GBW = g_{m1}/2\\pi C_c$ · $A_0 = A_1A_2$ · $f_{p2} = g_{m6}/2\\pi C_L$ · $f_z = g_{m6}/2\\pi C_c$ · $PM = 90° - \\tan^{-1}\\frac{GBW}{f_{p2}} - \\tan^{-1}\\frac{GBW}{f_z}$ · $C_c \\ge 0.22C_L$.',
  ], 0.4, 'The playbook');
  S.say(0.4, 'One card for the exam: phase margin forwards and backwards, peaking, the dominant pole, and the Miller two-stage dictionary. Every question in this lesson used these.');
  S.say(16, 'Use the chapter list to replay any topic, and the Past papers tab to jump straight to a question. Good luck.');
});
