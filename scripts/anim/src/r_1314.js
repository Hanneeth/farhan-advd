/* Say-it-back lines, frequency from zero + Lec 13–14: core concepts and formulas only. */
'use strict';
setRecall([
  ['A capacitor: current in, voltage up', ['$i = C\\,dv/dt$: a constant current gives a ramp of slope $I/C$.']],
  ['Charging through a resistor: the time constant τ', [
    '$v = V_0(1 - e^{-t/\\tau})$, $\\tau = RC$.',
    '63 percent at τ; 1 percent error after 4.6τ, 0.1 percent after 6.9τ.',
  ]],
  ['Sine waves: frequency, ω and phase', ['$\\omega = 2\\pi f$.']],
  ['Why gain falls at high frequency: the pole', ['A node with R and C makes a pole at $\\omega_p = 1/(RC)$.']],
  ['Decibels and the Bode plot', ['After the pole: minus 20 dB per decade; at the pole: minus 3 dB and minus 45°.']],
  ['The pole in s-language (and why it is also τ)', ['$\\tau = 1/\\omega_p$.']],
  ['Gain-bandwidth: why ω_u = g_m/C_L', ['$\\omega_u = A_0\\omega_p = g_m/C_L$.']],
  ['Feedback trades gain for bandwidth', ['Feedback: gain divided by $(1+\\beta A_0)$, pole times $(1+\\beta A_0)$; $\\tau_{cl} = 1/(\\beta\\omega_u)$.']],
  ['Your page: the RC step response by Laplace', ['Step is $V_0/s$; $1/(s+a)$ gives $e^{-at}$.']],
  ['The op amp in a loop: τ = R_out C_L / (1 + βA)', ['$\\tau = \\frac{R_{out}C_L}{1+\\beta A} = \\frac{1}{\\beta\\omega_u}$.']],
  ['5-T OTA, small step: why it is linear', ['Small step: output current $g_m\\Delta V$, linear settling.']],
  ['5-T OTA, large step: slewing', ['Slew rate: $SR = I_{SS}/C_L$.']],
  ['Full steering: why √2·V_ov', ['The pair is fully steered at $\\sqrt2V_{ov}$.']],
  ['When does it slew, and for how long?', [
    'It slews if $V_0A_{CL}/\\tau > SR$.',
    '$t_{slew} = (V_0A_{CL} - SR\\,\\tau)/SR$.',
  ]],
  ['Telescopic (fully differential) slewing', ['Telescopic: each output $I_{SS}/2C_L$, differential $I_{SS}/C_L$.']],
  ['Folded-cascode slewing: I_P decides', ['Folded cascode: need $I_P \\ge I_{SS}$, otherwise $I_P$ limits the slew rate.']],
  ['The concept of stability: the loop gain βA(s)', ['$A_f = A/(1+\\beta A)$; the loop gain is $\\beta A(s)$.']],
  ['Barkhausen: when the loop sustains itself', ['Barkhausen: $|\\beta A| = 1$ and phase $= -180°$ at the same frequency: oscillation.']],
  ['The complex numbers you need', ['Size $\\sqrt{a^2+b^2}$, angle $\\tan^{-1}(b/a)$; pole sizes multiply, angles add.']],
  ['Two poles under feedback: from slow to ringing', ['$s^2 + (\\omega_{p1}+\\omega_{p2})s + (1+\\beta A_0)\\omega_{p1}\\omega_{p2}$; Q of 0.707 is flat.']],
]);
