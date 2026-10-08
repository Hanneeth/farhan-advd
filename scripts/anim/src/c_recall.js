/* Lesson C: "say it back" lines at the end of each teaching scene: core concepts and formulas only, short enough to say from memory. */
'use strict';
[
  ['The picture first: a tap and a waterfall', [
    'Tap: $V_{th}$ is the entry fee, $V_{ov}$ is the opening, $I_D \\propto V_{ov}^2$.',
    'Waterfall: saturated while the cliff $V_{DS} \\ge V_{ov}$; the flow is set upstream.',
  ]],
  ['One transistor: entry fee, overdrive, saturation', [
    '$|V_{GS}| = |V_{th}| + |V_{ov}|$.',
    'Saturated: $|V_{DS}| \\ge |V_{ov}|$.',
    'NMOS: $V_D \\ge V_G - V_{th}$. PMOS: $V_D \\le V_G + |V_{th}|$.',
  ]],
  ['Check vs link: the two kinds of step', [
    'Check: source to drain, at least $V_{ov}$, can fail. Link: source to gate, exactly $V_{GS}$.',
  ]],
  ['How to read a tower', [
    'The limit is the first block squeezed to its $V_{ov}$.',
  ]],
  ['Look-in resistances and gain by two looks', [
    'Up multiplies: $g_mr_OR_S$. Down divides: $1/g_m$.',
    '$A_v = G_m(R_{up}\\parallel R_{down})$.',
  ]],
  ['The differential pair and V_CM', [
    '$V_{CM} = (V_{in1} + V_{in2})/2$, $v_d = V_{in1} - V_{in2}$.',
  ]],
  ['The cascode: pump, shield, and the headroom it costs', [
    '$R_{down} = g_{m2}r_{O2}r_{O1}$, so $A_v \\approx (g_mr_O)^2$.',
  ]],
  ['The fold: watch the input device move', [
    'KCL at the fold: $I_{D,casc} = I_B - I_{D,in}$.',
  ]],
  ['The folded-cascode op amp: gain by two looks', [
    '$R_{up} = g_{m5}r_{O5}r_{O7}$.',
    '$R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O9})$.',
    'Bottom source current $= I_{casc} + I_{SS}/2$.',
  ]],
  ['PMOS-input folded cascode: the input CM range', [
    '$V_{in,CM,max} = V_{DD} - |V_{ov11}| - |V_{GS1}|$.',
    '$V_{in,CM,min} = V_{ov9} - |V_{thp}|$, below ground.',
  ]],
  ['NMOS-input folded cascode: gain and CM range', [
    '$V_{in,CM,min} = V_{ov11} + V_{GS1}$.',
    '$V_{in,CM,max} = V_{DD} - |V_{ov10}| + V_{th1}$, above $V_{DD}$.',
    '$A_v = g_{m1}[g_{m8}r_{O8}(r_{O10}\\parallel r_{O2})\\parallel g_{m6}r_{O6}r_{O4}]$.',
  ]],
  ['Rail-to-rail input: both pairs at once', [
    'Rail-to-rail: NMOS and PMOS pairs in parallel; $G_m$ doubles in the middle.',
  ]],
  ['Background: the telescopic buffer window', [
    '$V_{b1} - V_{th4} \\le V_{out} \\le V_{b1} - V_{GS4} + V_{th2}$.',
    'Window width $= V_{th} - V_{ov4}$.',
  ]],
  ['Folded cascode with the output shorted to an input', [
    'Folded buffer: both are floors, the higher binds: $V_{out} \\ge V_{b2} - V_{th4}$.',
  ]],
  ['Background: the diode-stack mirror and its tax', [
    '$V_{out,max} = V_{DD} - |V_{ov8}| - |V_{ov6}| - |V_{thp}|$.',
  ]],
  ['The last circuit: a cascode load without the diode tax', [
    '$X = V_{DD} - |V_{GS7}|$.',
    '$V_{DD} - |V_{GS7}| - |V_{th5}| \\le V_b \\le V_{DD} - |V_{ov7}| - |V_{GS5}|$.',
  ]],
  ['Gain boosting begins: A_v = G_m × R_out', [
    '$A_v = G_m \\times R_{out}$.',
  ]],
].forEach(([title, lines]) => {
  const s = SCENES.find((x) => x.title === title);
  if (!s) throw new Error('recall: no scene ' + title);
  s.recall = lines;
});
