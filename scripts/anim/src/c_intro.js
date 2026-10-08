/* Lesson C (Lec 6): title, formula sheet, flashcards. */
'use strict';
scene('Start here', 'Lecture 6: the plan', 20, (S) => {
  titleCard(S, 'LECTURE 6', 'The folded cascode, all the way', 'from one transistor to CM ranges, rail-to-rail, the folded buffer and the low-voltage load', ['Foundations', 'Folding', 'CM ranges', 'Buffers', 'Questions']);
  S.say(0.3, 'This lesson assumes you start at Lecture 6. First a foundations chapter builds every tool your page uses — fences, checks and links, towers, look-in resistances, the pair, the cascode and the fold itself.');
  S.say(9, 'Then your Lecture 6 page, region by region. Then <b>every</b> question tied to it — two from this lecture, plus the folded-cascode, buffer-window and low-voltage-load questions — each stopping for your answer first.');
});

FORMULAS = [
  ['Tools', [
    ['Gate–source', '|V_{GS}| = |V_{th}| + |V_{ov}|'],
    ['NMOS saturated', 'V_D \\ge V_G - V_{th}\\;\\;(|V_{DS}| \\ge V_{ov})'],
    ['PMOS saturated', 'V_D \\le V_G + |V_{th}|'],
    ['Square law', 'I_D = \\tfrac12\\mu C_{ox}\\tfrac WL V_{ov}^2,\\; g_m = \\frac{2I_D}{V_{ov}},\\; r_O = \\frac{1}{\\lambda I_D}'],
    ['Up multiplies', 'R \\approx g_mr_O\\,R_S'],
    ['Down divides', 'R_{in,src} = \\frac{R_D + r_O}{1 + g_mr_O} \\approx \\frac{1}{g_m}'],
    ['Gain', 'A_v = G_m(R_{up}\\parallel R_{down})'],
    ['Current divider', 'I_{R_2} = I\\,\\frac{R_1}{R_1 + R_2}'],
  ]],
  ['Folded cascode (Lec 5–6)', [
    ['KCL at the fold', 'I_{D,casc} = I_{bottom} - I_{D,in}'],
    ['PMOS input: look down', 'R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O9})'],
    ['PMOS input: CM ceiling', 'V_{in,CM,max} = V_{DD} - |V_{ov11}| - |V_{GS1}|'],
    ['PMOS input: CM floor', 'V_{in,CM,min} = V_{ov9} + |V_{ov1}| - |V_{GS1}| = V_{ov9} - |V_{thp}|'],
    ['NMOS input: gain', 'A_v = g_{m1}[g_{m8}r_{O8}(r_{O10}\\parallel r_{O2})\\parallel g_{m6}r_{O6}r_{O4}]'],
    ['NMOS input: CM range', 'V_{ov11} + V_{GS1} \\le V_{in,CM} \\le V_{DD} - |V_{ov10}| + V_{th1}'],
  ]],
  ['Buffers and loads', [
    ['Telescopic buffer window', 'V_{b1} - V_{th4} \\le V_{out} \\le V_{b1} - V_{GS4} + V_{th2}'],
    ['Folded buffer: both floors', 'V_{out} \\ge \\max(V_{b2} - V_{th4},\\; V_{b2} - V_{GS4} - |V_{th2}|)'],
    ['Diode-stack mirror ceiling', 'V_{out,max} = V_{DD} - |V_{ov8}| - |V_{ov6}| - |V_{thp}|'],
    ['Low-voltage load: X', 'X = V_{DD} - |V_{GS7}|'],
    ['V_b1 window', 'V_{DD} - |V_{GS7}| - |V_{th5}| \\le V_{b1} \\le V_{DD} - |V_{ov7}| - |V_{GS5}|'],
    ['Every gain', 'A_v = G_m R_{out}'],
  ]],
];
CARDS = [
  ['Why fold?', 'In a cascode the input device sits in the output column and fights the output for headroom. Folding moves it to the side.'],
  ['Why does the cascode keep working after folding?', 'It only needs a current pushed into its source — it does not care where it comes from.'],
  ['What is the fold node?', 'The cascode’s source, where the input device’s drain current joins from the side (KCL: I_casc = I_bottom − I_in).'],
  ['Why does a folded PMOS input reach below ground?', 'Its drain is the fold node, only $V_{ov9}$ up, and a PMOS gate may sit $|V_{th}|$ below its drain.'],
  ['Why V_ov for M11 but V_GS for M1 in the ceiling?', 'M11’s step is a check (through its channel); M1’s step is the link to its gate, where $V_{in}$ is.'],
  ['NMOS-input folded cascode passes which rail?', 'V_DD: its fold node hangs near the top and an NMOS gate may sit $V_{th}$ above its drain.'],
  ['Rail-to-rail input?', 'An NMOS pair and a PMOS pair in parallel; $G_m$ doubles where both are on.'],
  ['Telescopic buffer window?', 'M4 gives a floor, M2 a ceiling: width $V_{th} - V_{ov}$.'],
  ['Folded buffer?', 'Both fences are floors; the higher one binds — much wider range.'],
  ['Diode tax?', 'A diode-stack cascode mirror pins the cascode gate a whole $|V_{thp}|$ too low: the ceiling drops by $|V_{thp}|$.'],
  ['Low-voltage cascode load?', 'M7, M8 gates on X: $X = V_{DD} - |V_{GS7}|$, $V_{b1}$ between two fences, no diode tax.'],
  ['Why look at $R_{out}$ for more gain?', '$G_m$ is pinned by the input device; $R_{out}$ can be multiplied (cascodes, boosting).'],
];
