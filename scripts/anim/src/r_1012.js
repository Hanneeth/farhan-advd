/* Say-it-back lines, Lec 10–12: core concepts and formulas only. */
'use strict';
setRecall([
  ['Common mode and differential mode', ['CM is $\\frac{V_1+V_2}{2}$, DM is $V_1 - V_2$. DM moves the outputs apart, CM moves them together.']],
  ['The CMFB loop: sense, compare, correct', ['CMFB: sense $V_{out,CM}$, compare with $V_{REF}$, correct a current source.']],
  ['Sensing with two resistors (and its cost)', [
    '$V_{out,CM} = \\frac{V_{out1}+V_{out2}}{2}$.',
    'The cost: $A_v = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R_1)$.',
  ]],
  ['Sensing through source followers', ['Follower sensing: $V_{sense} = V_{out,CM} - V_{GS}$, no loading, some swing lost.']],
  ['A transistor in deep triode is a resistor', ['$R_{on} = 1/(\\mu_nC_{ox}\\tfrac WL(V_{GS}-V_{th}))$.']],
  ['Triode sensing: the outputs drive the tail resistors', ['$R_{tot} = 1/(\\mu_nC_{ox}\\tfrac WL(V_{out1}+V_{out2}-2V_{th}))$: sees CM, blind to DM.']],
  ['Sensing with differential pairs (and why it is nonlinear)', ['Pair sensing: $I \\propto (V_{REF}-V_{out1})^2 + (V_{REF}-V_{out2})^2$, nonlinear, small swings only.']],
  ['CMFB is just a feedback loop (and where it acts)', ['CMFB is a feedback loop: the CM error is about $1/(\\beta A)$.']],
  ['The triode equation pins the output CM', ['$V_{b1} - V_{GS3} = 2I_DR_{tot,P}$ pins the output CM.']],
  ['Replica CMFB: a twin that sets the CM to V_REF', [
    '$(W/L)_{14} = (W/L)_{11}$, $(W/L)_{15} = (W/L)_{12}+(W/L)_{13}$.',
  ]],
]);
