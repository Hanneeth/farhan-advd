/* Lesson B closing playbook. */
'use strict';
scene('Exam playbook', 'How to attack any Lec 11–14 question', 40, (S) => {
  header(S, 'EXAM PLAYBOOK', 'Lectures 11–14 in five moves');
  remember(S, [
    '**CMFB:** output range’s middle = $V_{REF}$; triode sensing $V_P = 2I_DR_{tot}$; replica = copy above, sum below; CM gain ÷ $(1+T)$.',
    '**Time constant:** find τ first — $RC$, or closed-loop $\\frac{R_{out}C_L}{1+\\beta A} = \\frac{1}{\\beta\\omega_u}$. Settling: $\\tau\\ln(1/\\varepsilon)$; rise 2.2τ.',
    '**Frequency:** pole = $1/(RC)$ of a node; BW = pole; GBW $= A_0\\omega_p = g_m/C_L$; feedback moves the pole to $\\approx\\beta\\omega_u$. Hz = ÷2π.',
    '**Slewing:** SR = $I_{max}/C_L$ (5-T: $I_{SS}$; telescopic each side $I_{SS}/2$; folded: check $I_P$ vs $I_{SS}$). Slews if $V_0A_{CL}/\\tau > SR$; full steering at $\\sqrt2V_{ov}$.',
    '**Stability:** loop gain βA; sizes multiply, angles add; Barkhausen $|\\beta A| = 1$ at −180°; two-pole loop → Q from the quadratic.',
  ], 0.4, 'The playbook');
  S.say(0.4, 'One card: CMFB levels, the time constant, poles and bandwidth, slewing, stability. Every question in this lesson used these.');
  S.say(14, 'Use the chapter list to replay any topic, and the “Past papers” tab to jump straight to a question.');
});
