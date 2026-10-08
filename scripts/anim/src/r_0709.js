/* Say-it-back lines, Lec 7–9: core concepts and formulas only. */
'use strict';
setRecall([
  ['Where Lec 6 left you: gain or swing', ['More cascodes: more gain, less swing. Two stages split the jobs.']],
  ['What a “stage” is', ['A stage is one input device and its load: $A = G_mR_{out}$; stages multiply.']],
  ['The two-stage op amp (circuit 1)', [
    '$A = A_1A_2$: stage 1 gives gain, stage 2 gives swing.',
    '$A_2 = g_{m5,6}(r_{O5,6}\\parallel r_{O7,8})$.',
  ]],
  ['Why stage 2 can swing (and why gain comes first)', ['A CS stage has two blocks per column: the output swings to within $V_{ov}$ of each rail.']],
  ['Telescopic first stage + CS second stage (circuit 2)', [
    '$A_1 = g_{m1}[g_{m5}r_{O5}r_{O7}\\parallel g_{m3}r_{O3}r_{O1}]$, $A_2 = g_{m9}(r_{O9}\\parallel r_{O11})$.',
    'Level between the stages is a link: $X = V_{DD} - |V_{GS9}|$.',
  ]],
  ['The price: two poles', ['Two stages means two poles, so the op amp needs compensation.']],
  ['One output: the mirror trick (circuit 3)', ['Single output: diode M11 and mirror M12, the two halves add.']],
  ['Gain boosting: which factor can grow?', ['$A_v = G_m \\times R_{out}$: $G_m$ is hard to raise, so raise $R_{out}$ without stacking.']],
  ['Attempt 1: an amplifier in front of the gate', ['An amplifier in front of the gate gives no improvement.']],
  ['Attempt 2: the amplifier watches the source', ['$R_{out} = R_S + r_O + (1 + A_1)g_mR_Sr_O$.']],
  ['G_m redone: the amplifier senses the source', ['$G_m \\approx 1/R_S$: $A_1$ cancels, so boosting raises $R_{out}$, not $G_m$.']],
  ['Looking in from the top and from the bottom', [
    'Down into a boosted drain: $R_S + r_O + (1+A_1)g_mR_Sr_O$.',
    'Up into a boosted source: $(R_D + r_O)/(1 + (1+A_1)g_mr_O)$.',
  ]],
  ['Boosted cascode: G_m ≈ g_m1 by current divider', ['Boosted cascode: $G_m \\approx g_{m1}$ by the current divider.']],
  ['Putting it together: (g_m r_O)³', ['$R_{out} \\approx (1+A_1)g_{m2}r_{O2}r_{O1}$, so the gain is about $(g_mr_O)^3$.']],
  ['Implementation 1: a CS booster (the circled M3)', [
    'CS booster: $A_1 = g_{m3}r_{O3}$.',
    'X sits at $V_{GS3}$, so $V_{out,min} = V_{GS3} + V_{ov2}$.',
  ]],
  ['Implementation 2: a PMOS booster (and why it fails)', ['PMOS booster: $V_{GS2} \\le |V_{th3}|$, M2 is barely on. It fails.']],
  ['Implementation 3: the folded booster', ['Folded booster: $A_1 = g_{m3}g_{m4}r_{O4}r_{O3}$, no swing lost.']],
  ['The booster is just another amplifier', ['$A_v = g_{m1}[1 + g_{m3}g_{m4}r_{O4}r_{O3}]g_{m2}r_{O2}r_{O1}$.']],
  ['Boosting a differential pair: one booster for both sides', ['Differential pair: $A_1 = A_2$ on each side, or one differential booster.']],
  ['Differential booster with M5, M6: the headroom bill', ['$V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}$: check, link, check.']],
  ['A whole folded cascode as the booster', [
    '$A_{aux} = g_{m5}[g_{m11}r_{O11}r_{O13}\\parallel g_{m7}r_{O7}(r_{O9}\\parallel r_{O5})]$.',
    '$R_{out} = (1+A_{aux})g_{m3}r_{O3}r_{O1}$.',
  ]],
  ['Boost both cascodes: which input type for each booster?', ['NMOS cascodes need a PMOS-input booster; PMOS cascodes need an NMOS-input booster.']],
  ['Why a fully differential op amp needs CMFB', ['$\\Delta V_{out,CM} = (I_P - I_N)(R_P\\parallel R_N)$: the output CM is undefined, so we need CMFB.']],
]);
