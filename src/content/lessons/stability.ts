/**
 * L8 (replica CMFB, Lec 12) and L10–L14: supply rejection and noise (Razavi §9.11–9.12, not yet in your
 * notes), stability (Lec 14–16, Razavi §10.1–10.3) and frequency compensation (Lec 17, Razavi §10.4–10.6).
 * Notation follows the notes: ωgx, ωpx, PM, GM, Af, A2, R1/C1, R2/C2, P1′, CC.
 */
import type { Lesson } from '../types';

export const STABILITY_LESSONS: Lesson[] = [
  {
    id: 'l8-replica',
    unit: 'L8',
    title: 'Replica CMFB: make the output CM equal VREF',
    minutes: 10,
    refs: { razavi: '§9.7.3', notes: 'Lec 12' },
    why: 'Lec 12’s last circuit sets the output CM of the folded cascode exactly to VREF with a copied (“replica”) branch: you size M14 and M15.',
    picture: {
      visual: { widget: 'replicaMini' },
      caption: 'Slide VREF and the size of M15. The output CM lands on VREF only when M15 is as wide as M12 and M13 together.',
    },
    predict: {
      prompt: 'M11 and M14 have the same W/L, the same gate voltage and the same current I1. Their source voltages are…',
      choices: ['equal', 'different: M11 carries signal', 'set by VREF alone'],
      answer: 0,
      explain: 'Same size, same current → same VGS. Same gate → same source voltage. So the resistance under M11 must equal the one under M14.',
    },
    idea: `The trick is a **twin**. M14 copies M11: same size, same gate, same current $I_1$, so the same $V_{GS}$ and the same source voltage.

Under M11 sit M12 and M13 in deep triode, gates on $V_{out1}$, $V_{out2}$. Under M14 sits M15, gate on {{VREF}}. Equal source voltages with equal currents means equal resistances, and deep-triode conductance is $\\mu C_{ox}(W/L)(V_G - V_{th})$:

$(W/L)_{15}(V_{REF} - V_{th}) = (W/L)_{12}(V_{out1} - V_{th}) + (W/L)_{13}(V_{out2} - V_{th})$.

Choose $(W/L)_{15} = (W/L)_{12} + (W/L)_{13}$ and the outputs must average to $V_{REF}$. Lec 12’s final fix adds M16–M18 so $V_{DS}$ of M11 and M14 match too.`,
    analogy: 'Two identical taps on the same pipe pressure: if one flows through a known opening (VREF), the other opening must be the same size.',
    rule: {
      tex: ['I_{D11} = I_{D14} = I_1,\\quad (W/L)_{14} = (W/L)_{11}', '(W/L)_{15} = (W/L)_{12} + (W/L)_{13} \\Rightarrow V_{out,CM} = V_{REF}'],
      symbols: ['VREF', 'WL', 'Vth'],
    },
    worked: { bank: 'bank-ps2-p5' },
    yourTurn: { generators: ['l8-replica'], count: 2 },
    lockIn: {
      summary: 'M14 is M11’s twin, M15 is the twin of M12 ‖ M13 with VREF on its gate: (W/L)15 = (W/L)12 + (W/L)13 forces Vout,CM = VREF.',
      hook: '“Copy the branch, swap the outputs for VREF.”',
      cards: [
        { id: 'c-l8-replica', front: 'Replica CMFB (Lec 12): sizes of M14 and M15?', back: '(W/L)14 = (W/L)11 (same I1, same gate); (W/L)15 = (W/L)12 + (W/L)13. Then Vout,CM = VREF.' },
        { id: 'c-l8-m16', front: 'Why do M16–M18 appear in Lec 12’s last figure?', back: 'VDS11 ≠ VDS14 leaves a small error in ID11 vs ID14; replicas of M1/M2 (M17, M18) make the drain voltages match.' },
      ],
    },
  },
  {
    id: 'l10-psrr',
    unit: 'L10',
    title: 'Supply rejection: how much of the VDD ripple reaches the output',
    minutes: 8,
    refs: { razavi: '§9.11' },
    why: 'Handout L10 (Razavi §9.11): a quiz asks for the PSRR of a 5-T OTA or why feedback does not improve it.',
    picture: {
      visual: { widget: 'psrrMini' },
      caption: 'Add ripple to VDD: the output ripples by almost the same amount, while the signal is amplified by the full gain.',
    },
    predict: {
      prompt: 'In the 5-T OTA, VDD rises by 10 mV. The diode-connected node X…',
      choices: ['stays put', 'rises by about 10 mV', 'falls by about 10 mV'],
      answer: 1,
      explain: 'The diode keeps its |VGS| (its current is fixed by the tail), so X sits a fixed amount below VDD and moves with it. The output follows X.',
    },
    idea: `Razavi’s way in: **wiggle VDD and watch.** The diode-connected PMOS keeps $|V_{GS3}|$ fixed, so node X rides up and down with VDD. With a symmetric circuit the output copies X: the supply reaches the output with gain ≈ 1.

The signal, meanwhile, is amplified by $g_m(r_{O2}\\|r_{O4})$. {{PSRR}} compares the two:
PSRR = (gain from input) ÷ (gain from supply) ≈ $g_{mN}(r_{OP}\\|r_{ON})$.

Feedback does not rescue it: the loop cuts the supply-to-output gain and the input-to-output gain by the same $1 + \\beta A$, so the ratio stays.`,
    analogy: 'Drawing on a bumpy bus: every bump of the bus (VDD) lands on the page almost 1:1, while your hand’s movement (the signal) is magnified.',
    rule: {
      tex: ['\\text{supply gain} \\approx 1 \\;\\text{(the diode clamps X to } V_{DD})', 'PSRR \\approx g_{mN}(r_{OP}\\,\\|\\,r_{ON}),\\quad 20\\log_{10}PSRR\\;\\mathrm{dB}'],
      symbols: ['PSRR', 'gm', 'rO', 'VDD'],
    },
    worked: { bank: 'bank-exam-psrr' },
    yourTurn: { generators: ['l10-psrr'], count: 2 },
    lockIn: {
      summary: 'In the 5-T OTA the diode lets VDD straight to the output (gain ≈ 1), so PSRR ≈ gm(rOP‖rON). Feedback scales both paths equally.',
      hook: '“Bumpy bus: the bumps reach the page 1:1.”',
      cards: [
        { id: 'c-l10-psrr', front: 'PSRR of a 5-T OTA?', back: '≈ gmN(rOP‖rON), equal to its gain, because the supply reaches the output with gain ≈ 1 (the diode clamps X to VDD).' },
        { id: 'c-l10-psrr-fb', front: 'Does feedback improve PSRR?', back: 'Not much: it divides the supply gain and the signal gain by the same (1 + βA).' },
      ],
    },
  },
  {
    id: 'l10-noisebasics',
    unit: 'L10',
    title: 'What noise is: power per hertz, and the kT/C surprise',
    minutes: 10,
    refs: { razavi: '§7.1–7.2 (UCLA EE215A handout #10)' },
    why: 'Every noise answer (op-amp input noise, sampling noise) is an area under a spectrum; kT/C is the one number you must know.',
    picture: {
      visual: { widget: 'ktcMini' },
      caption: 'Slide R: the curve gets taller but narrower. The total on C (the area) does not move.',
    },
    predict: {
      prompt: 'A resistor charges a 1 pF capacitor. You make the resistor 100 times bigger. The total noise on the capacitor…',
      choices: ['grows 10 times', 'stays the same', 'drops 10 times'],
      answer: 1,
      explain: 'More R means more noise per hertz (4kTR) but a narrower filter (1/(2πRC)). They cancel: the total is √(kT/C), set by C alone.',
    },
    idea: `Razavi’s picture: noise is random, so we cannot say its value at any instant, only how **strong** it is on average.

To see which frequencies carry it, pass it through a 1 Hz-wide window and measure the power that gets through. Do that at every frequency: that is the spectrum, in V²/Hz. A resistor’s is flat (“white”): 4kTR.

The total noise is the **area** under the spectrum after any filtering. On an RC, the area is $4kTR\\cdot\\frac{\\pi}{2}\\cdot\\frac{1}{2\\pi RC} = kT/C$.

Independent noises add as **powers**: $\\sqrt{v_1^2 + v_2^2}$, never $v_1 + v_2$.`,
    analogy: 'A river’s roar: you cannot predict each splash, but you can measure how loud it is in each pitch band.',
    rule: {
      tex: ['\\overline{V_n^2} = 4kTR\\;\\mathrm{(V^2/Hz)}', '\\overline{v_{n,C}^2} = \\frac{kT}{C}', 'v_{tot} = \\sqrt{v_1^2 + v_2^2}'],
      symbols: ['Vn', 'kT'],
      note: 'Noise bandwidth of one pole = (π/2)·f−3dB. 1 pF at 300 K: 64 µV rms.',
    },
    worked: { generator: 'l10-ktc', seed: 3 },
    yourTurn: { generators: ['l10-ktc'], count: 2 },
    lockIn: {
      summary: 'Spectrum = power per hertz; total = area. R on C leaves √(kT/C), whatever R. Independent noises add as squares.',
      hook: '“Taller but narrower: same area.”',
      cards: [
        { id: 'c-l10-ktc', front: 'Total noise a resistor leaves on C?', back: '√(kT/C): 64 µV rms for 1 pF at 300 K. R cancels (more noise per Hz, fewer Hz).' },
        { id: 'c-l10-add', front: 'Two independent noises of 30 µV and 40 µV rms together?', back: '√(30² + 40²) = 50 µV: they add as powers, not amplitudes.' },
      ],
    },
  },
  {
    id: 'l10-noise',
    unit: 'L10',
    title: 'Noise: wiggle each gate and see if the output moves',
    minutes: 12,
    refs: { razavi: '§9.12, §7.2' },
    why: 'Handout L10 (Razavi §9.12): find the input-referred noise of a 5-T OTA, telescopic or folded cascode, and say which devices matter.',
    picture: {
      visual: { widget: 'noiseMini' },
      caption: 'Each bar is a device’s share of the input noise. Give the current sources a bigger overdrive and their share shrinks.',
    },
    predict: {
      prompt: 'In a telescopic op amp, which devices add noticeable noise at low frequency?',
      choices: ['all nine', 'the input pair and the PMOS current sources', 'only the cascodes'],
      answer: 1,
      explain: 'Wiggle a cascode gate: its source follows and the output barely moves. Wiggle an input or current-source gate: the output current changes. Only those count.',
    },
    idea: `Every saturated MOSFET hisses: a random drain current with power density $4kT\\gamma g_m$ ({{gamma}} ≈ 2/3). Refer it to the input by dividing by the gain.

Razavi’s rule: **wiggle each gate a little**. If the output moves, that device counts. The tail does not (it moves both sides equally); cascodes barely do (their noise is degenerated). Input devices count fully; a current-source load counts as $g_{m,load}/g_{m1}^2$.

For the pair both halves add: {{Vn}}$^2 = 8kT\\gamma(1/g_{m1} + g_{m3}/g_{m1}^2)$. The folded cascode adds a second set of current sources, so it is noisier. Small load $g_m$ (big overdrive) means less noise but less swing.`,
    analogy: 'A crowded room: only the people standing next to the microphone (input devices) are loud; people behind a wall (cascodes) are muffled.',
    rule: {
      tex: ['\\overline{I_n^2} = 4kT\\gamma g_m', '\\overline{V_{n}^2} = 8kT\\gamma\\left(\\frac{1}{g_{m1}} + \\frac{g_{m3}}{g_{m1}^2}\\right)\\;\\text{(5-T, telescopic)}', '\\text{folded: } 8kT\\gamma\\left(\\frac{1}{g_{m1}} + \\frac{g_{m7}}{g_{m1}^2} + \\frac{g_{m9}}{g_{m1}^2}\\right)'],
      symbols: ['Vn', 'gamma', 'kT', 'gm'],
    },
    worked: { bank: 'bank-ps2-p6' },
    yourTurn: { generators: ['l10-noise'], count: 2 },
    lockIn: {
      summary: 'Wiggle each gate: inputs and current sources count, tails and cascodes do not. Vn² = 8kTγ(1/gm1 + gm_load/gm1²); the folded cascode adds another term.',
      hook: '“If wiggling the gate moves the output, it’s noisy.”',
      cards: [
        { id: 'c-l10-rule', front: 'Razavi’s quick test for which devices add noise?', back: 'Change each gate voltage a little: if the output moves, that device’s noise counts (inputs, current sources); tails and cascodes barely count.' },
        { id: 'c-l10-vn', front: 'Input noise of a 5-T OTA / telescopic?', back: '8kTγ(1/gm1 + gm3/gm1²) (both halves add; loads divided by gm1²).' },
        { id: 'c-l10-tradeoff', front: 'Noise vs swing trade-off?', back: 'Load gm = 2ID/Vov: a small overdrive (for swing) gives a big gm and more noise.' },
      ],
    },
  },
  {
    id: 'l11-barkhausen',
    unit: 'L11',
    title: 'Why feedback can oscillate: the loop feeds its own noise',
    minutes: 10,
    refs: { razavi: '§10.1', notes: 'Lec 14–15' },
    why: 'Every stability question (Lec 14–17, Razavi Ch 10) rests on one idea: a loop oscillates if what comes back lines up with what went in.',
    picture: {
      visual: { widget: 'barkhausenMini' },
      caption: 'Set the amplifier’s lag to 180° and the loop gain to 1: the returned wave lands exactly on the original. Anything more and it grows.',
    },
    predict: {
      prompt: 'Negative feedback flips the signal (180°). The amplifier then delays it by another 180° at some frequency. What comes back is…',
      choices: ['opposite to the original: it cancels', 'in phase with the original: it adds', 'at a different frequency'],
      answer: 1,
      explain: '180° + 180° = 360°: the “negative” feedback has turned positive at that frequency. If the loop gain is still ≥ 1 there, the circuit amplifies its own noise.',
    },
    idea: `Close the loop and write $A_f = \\dfrac{A}{1 + \\beta A}$ (your notes’ {{Af}}). The {{betaA}} is the gain once round the loop.

If at some frequency $\\omega_1$: $|\\beta A(j\\omega_1)| = 1$ and $\\angle\\beta A(j\\omega_1) = -180^\\circ$, the denominator is $1 - 1 = 0$: infinite gain, the circuit makes an output from nothing (its own noise). These are **Barkhausen’s criteria**.

A **single pole** can delay the signal by at most 90°, so a one-pole loop can never reach −180°: it is unconditionally stable (Lec 15). The closed-loop pole simply moves up to $\\omega_{p1}(1 + \\beta A_0)$.`,
    analogy: 'Pushing a swing: a push that arrives in step with the motion (360° round the loop) makes it grow, however small each push.',
    rule: {
      tex: ['A_f(s) = \\dfrac{A(s)}{1 + \\beta A(s)}', '|\\beta A(j\\omega_1)| = 1\\;\\text{ and }\\;\\angle\\beta A(j\\omega_1) = -180^\\circ \\Rightarrow \\text{oscillation}', '\\text{one pole: } \\omega_{p,closed} = \\omega_{p1}(1 + \\beta A_0)'],
      symbols: ['Af', 'betaA', 'beta', 'omegap1'],
    },
    worked: { generator: 'l11-onepole', seed: 11 },
    yourTurn: { generators: ['l11-onepole'], count: 2 },
    lockIn: {
      summary: 'Oscillation needs |βA| = 1 at ∠βA = −180° (Barkhausen). One pole gives at most −90°, so a one-pole loop is always stable.',
      hook: '“Flip twice and it comes back in step: the loop sings.”',
      cards: [
        { id: 'c-l11-bark', front: 'Barkhausen’s criteria?', back: '|βA(jω1)| = 1 and ∠βA(jω1) = −180°: the loop returns the signal in phase and at full size.' },
        { id: 'c-l11-measure', front: 'How do you find the loop gain of a real circuit (Razavi)?', back: 'Set the input to zero, break the loop, inject a test voltage Vt and measure what returns, VF: βA = −VF/Vt.' },
        { id: 'c-l11-onepole', front: 'Why is a one-pole feedback amplifier always stable?', back: 'One pole adds at most 90° of lag; the loop phase never reaches −180°.' },
      ],
    },
  },
  {
    id: 'l11-multipole',
    unit: 'L11',
    title: 'Two and three poles: the phase runs out before the gain does',
    minutes: 12,
    refs: { razavi: '§10.2', notes: 'Lec 15–16' },
    why: 'Lec 15–16 and Razavi 10.1–10.3: every real op amp has several poles, and the extra poles eat phase long before they cut gain.',
    picture: {
      visual: { widget: 'multiPoleMini' },
      caption: 'Switch between 1, 2 and 3 poles and lower β. Razavi’s two ways to go bad are one problem: too much gain or too much phase both mean |βA| is still ≥ 1 when the phase reaches −180°.',
    },
    predict: {
      prompt: 'You make the feedback weaker (smaller β, higher closed-loop gain). The loop becomes…',
      choices: ['less stable', 'more stable', 'no different'],
      answer: 1,
      explain: 'Smaller β shifts the whole |βA| curve down, so ωgx moves to lower frequency where the phase is kinder. The phase curve itself does not move (Razavi Ex 10.1).',
    },
    idea: `Each pole takes up to 90° of phase, but it starts eating phase a decade **before** the pole ($0.1\\omega_p$), while the magnitude only bends **at** the pole. So extra poles hurt the phase much more than the gain.

Two poles approach −180° only at infinity (still stable, but maybe barely). Three poles cross −180° at a finite frequency: the **phase crossover** {{omegapx}}. If the loop gain is still above 1 there, it oscillates.

Weaker feedback (smaller β) lowers $|\\beta A|$ and pulls the **gain crossover** {{omegagx}} left, into safer phase. The worst case is β = 1: the unity-gain buffer.`,
    analogy: 'Walking toward a cliff edge (−180°) while your energy (loop gain) runs out: you want to run out of energy well before the edge.',
    rule: {
      tex: ['A(s) = \\dfrac{A_0}{(1 + s/\\omega_{p1})(1 + s/\\omega_{p2})}', '\\angle\\beta A = -\\tan^{-1}\\tfrac{\\omega}{\\omega_{p1}} - \\tan^{-1}\\tfrac{\\omega}{\\omega_{p2}} - \\dots', '|\\beta A(\\omega_{gx})| = 1,\\quad \\angle\\beta A(\\omega_{px}) = -180^\\circ'],
      symbols: ['omegap1', 'omegap2', 'omegagx', 'omegapx', 'betaA'],
    },
    worked: { bank: 'bank-r10-3' },
    yourTurn: { generators: ['l12-pm', 'l11-onepole'], count: 3 },
    lab: { id: 'stability' },
    lockIn: {
      summary: 'Poles eat phase from 0.1ωp but cut gain only from ωp. Two poles: −180° only at ∞; three poles: a finite ωpx. Smaller β is more stable; β = 1 is the worst case.',
      hook: '“Run out of gain before you run out of phase.”',
      cards: [
        { id: 'c-l11-gxpx', front: 'Gain crossover vs phase crossover?', back: 'ωgx: |βA| = 1. ωpx: ∠βA = −180°. Stable when ωgx comes well before ωpx.' },
        { id: 'c-l11-beta', front: 'Does a higher closed-loop gain make a feedback amplifier more or less stable?', back: 'More stable: smaller β lowers |βA|, moving ωgx to lower frequency; the phase plot does not change.' },
      ],
    },
  },
  {
    id: 'l12-margins',
    unit: 'L12',
    title: 'Phase margin and gain margin: how far from the cliff',
    minutes: 12,
    refs: { razavi: '§10.3, Problems 10.1–10.3', notes: 'Lec 15–16' },
    why: 'Lec 15 defines PM = 180° + ∠βA at ωgx; Razavi 10.1–10.3 ask for PM or the largest A0 for a given PM.',
    picture: {
      visual: { widget: 'multiPoleMini' },
      caption: 'The green bar on the phase plot is the phase margin; the purple bar on the gain plot is the gain margin.',
    },
    predict: {
      prompt: 'At ωgx the loop phase is −135°. The phase margin is…',
      choices: ['135°', '45°', '−45°'],
      answer: 1,
      explain: 'PM = 180° + ∠βA(ωgx) = 180° − 135° = 45°: how many degrees are left before the −180° cliff.',
    },
    idea: `Two distances from Barkhausen’s cliff:

**Phase margin** {{PM}} = 180° + ∠βA at {{omegagx}}: how much more lag would make it oscillate.
**Gain margin** {{GM}} = how far below 0 dB |βA| is at {{omegapx}}.

To compute PM (Lec 15): first find ωgx where $|\\beta A| = 1$, then add up the pole angles there: $PM = 180^\\circ - \\sum\\tan^{-1}(\\omega_{gx}/\\omega_{pi})$.

Backwards (Razavi 10.1): pick the phase you need at ωgx, solve for that frequency, then choose $A_0$ so $|\\beta A| = 1$ there. Useful fact: if ωgx lands exactly on the second pole, PM = 45° (Razavi Ex 10.4).`,
    rule: {
      tex: ['PM = 180^\\circ + \\angle\\beta A(j\\omega_{gx})', 'GM = -20\\log_{10}|\\beta A(j\\omega_{px})|', '\\text{two poles: } PM = 180^\\circ - \\tan^{-1}\\tfrac{\\omega_{gx}}{\\omega_{p1}} - \\tan^{-1}\\tfrac{\\omega_{gx}}{\\omega_{p2}}'],
      symbols: ['PM', 'GM', 'omegagx', 'omegapx'],
    },
    worked: { bank: 'bank-ps2-p2' },
    yourTurn: { generators: ['l12-pm', 'l12-a0'], count: 3 },
    lab: { id: 'stability' },
    lockIn: {
      summary: 'PM = 180° + ∠βA at ωgx; GM = −20log|βA| at ωpx. Find ωgx first, then add the pole angles. ωgx on the second pole → 45°.',
      hook: '“Degrees left before the cliff.”',
      cards: [
        { id: 'c-l12-pm', front: 'Phase margin?', back: 'PM = 180° + ∠βA(ωgx), where |βA(ωgx)| = 1.' },
        { id: 'c-l12-gm', front: 'Gain margin?', back: 'GM = −20log|βA(ωpx)|, where ∠βA(ωpx) = −180°.' },
        { id: 'c-l12-45', front: 'Two-pole loop with ωgx exactly at ωp2 (ωp1 ≪ ωp2): PM?', back: '45° (Razavi Ex 10.4): −90° from ωp1, −45° from ωp2.' },
      ],
    },
  },
  {
    id: 'l12-ringing',
    unit: 'L12',
    title: 'What phase margin looks like: peaking and ringing',
    minutes: 10,
    refs: { razavi: '§10.3, Problem 10.4', notes: 'Lec 16' },
    why: 'Lec 16 works out |Af(ωgx)| for PM = 5°, 45°, 60°: 11.5/β, 1.3/β, 1/β. Razavi 10.4 asks the reverse.',
    picture: {
      visual: { widget: 'pmMini' },
      caption: 'Slide the phase margin. Below 45° the step response rings; at 60° it barely overshoots; at 90° it is slow and smooth.',
    },
    predict: {
      prompt: 'At PM = 60°, how much does the closed-loop gain peak at ωgx?',
      choices: ['not at all: exactly 1/β', '30% (1.3/β)', '11.5/β'],
      answer: 0,
      explain: 'At ωgx, βA = 1∠−120°, so 1 + βA = 0.5 − j0.866, whose size is exactly 1. |Af| = (1/β)·1/1.',
    },
    idea: `At {{omegagx}} the loop gain is $1\\angle(PM - 180^\\circ)$, so the closed loop there is
$|A_f(\\omega_{gx})| = \\dfrac{1}{\\beta}\\cdot\\dfrac{1}{|1 + \\beta A|} = \\dfrac{1}{\\beta}\\cdot\\dfrac{1}{2\\sin(PM/2)}$.

Lec 16’s three cases: PM 5° → 11.5/β (nearly an oscillator, rings for a long time); 45° → 1.3/β (30% peak, visible ringing); 60° → exactly 1/β (no peak, small overshoot, fastest clean settling). More than 60° is stable but sluggish.

That is why the target is about **60°**. Remember it is a small-signal idea: big steps also slew.`,
    analogy: 'A car’s suspension: too little damping (small PM) and it bounces; too much (90°) and it is stiff and slow; about 60° is the comfortable ride.',
    rule: {
      tex: ['|A_f(\\omega_{gx})| = \\dfrac{1}{\\beta}\\cdot\\dfrac{1}{2\\sin(PM/2)}', '5^\\circ \\to 11.5,\\quad 45^\\circ \\to 1.3,\\quad 60^\\circ \\to 1.0\\;(\\times 1/\\beta)'],
      symbols: ['Af', 'PM', 'beta'],
      note: 'Allen’s rule of thumb: fewer than about three rings in the step means PM ≥ 45°. PM is a small-signal guide; a big step also slews (Razavi).',
    },
    worked: { bank: 'bank-lec16' },
    yourTurn: { generators: ['l12-pm'], count: 2 },
    lockIn: {
      summary: '|Af(ωgx)| = (1/β)/(2 sin(PM/2)): 5° → 11.5, 45° → 1.3, 60° → 1.0. Aim for ≈ 60°: no peaking, fast settling.',
      hook: '“60° rides smoothly.”',
      cards: [
        { id: 'c-l12-peak', front: 'Closed-loop peaking at ωgx for PM = 45° and 60°?', back: '45° → 1.3/β (30% peak); 60° → exactly 1/β.' },
        { id: 'c-l12-rings', front: 'Allen’s rule of thumb for “stable enough” from a step response?', back: 'Fewer than about three rings: PM of at least 45°, preferably 60°. PM is a small-signal guide; big steps also slew (Razavi).' },
        { id: 'c-l12-why60', front: 'Why is ≈ 60° phase margin the usual target?', back: 'No frequency peaking, little overshoot, fast settling; more margin is slower, less rings.' },
      ],
    },
  },
  {
    id: 'l13-dominant',
    unit: 'L13',
    title: 'Compensation: make the gain fall before the phase gets dangerous',
    minutes: 12,
    refs: { razavi: '§10.4, Example 10.5', notes: 'Lec 17' },
    why: 'Lec 17 starts compensation with the 100 dB, three-pole Bode plot and the 20log(1/β) line: where must the first pole go?',
    picture: {
      visual: { widget: 'dominantMini' },
      caption: 'Top: the amplifier as built. Bottom: the first pole slid down so |A| meets the 1/β line where the other poles have used only 90° − PM.',
    },
    predict: {
      prompt: 'To stabilise the loop, which change helps?',
      choices: ['raise Rout (more gain)', 'move the dominant pole down (bigger C at that node)', 'move a non-dominant pole down'],
      answer: 1,
      explain: 'Lowering the dominant pole drops the gain earlier, pulling ωgx into a region of small phase shift. Raising Rout only raises the low-frequency gain; moving a high pole down makes it worse.',
    },
    idea: `Your notes draw $20\\log|A|$ and the line $20\\log(1/\\beta)$: their gap is $20\\log|\\beta A|$, and where they cross is {{omegagx}}.

**Dominant-pole compensation**: leave the fast poles alone and slide the first pole {{omegap1}} down (add capacitance at that node). Near ωgx the dominant pole’s phase is already ≈ −90°, so sliding it changes the gain, not the dangerous phase.

Hand method: the other poles may use only 90° − PM at ωgx. For one other pole: $\\omega_{gx} = \\omega_{p2}\\tan(90^\\circ - PM)$ (at 45°, ωgx = ωp2). Then $\\omega'_{p1} = \\omega_{gx}/(\\beta A_0)$. Cost: bandwidth. With β < 1 you may compensate 1/β less (Ex 10.5).`,
    analogy: 'Taking your foot off the accelerator early so the car stops before the cliff edge, rather than trying to move the edge.',
    rule: {
      tex: ['20\\log|A| - 20\\log\\tfrac{1}{\\beta} = 20\\log|\\beta A|', '\\omega_{gx} = \\omega_{p2}\\tan(90^\\circ - PM),\\quad \\omega\'_{p1} = \\dfrac{\\omega_{gx}}{\\beta A_0}'],
      symbols: ['omegap1', 'omegap2', 'omegagx', 'PM', 'beta'],
      note: 'Razavi’s shortcut on the Bode plot: start at the first non-dominant pole on the 0 dB line and draw a −20 dB/dec line back up to the flat gain. Where it meets is the new dominant pole (PM ≈ 45°).',
    },
    worked: { bank: 'bank-ps2-p3' },
    yourTurn: { generators: ['l13-dominant'], count: 2 },
    lab: { id: 'stability' },
    lockIn: {
      summary: 'Keep the fast poles, lower the dominant one: ωgx = ωp2·tan(90° − PM), ω′p1 = ωgx/(βA0). The compensated GBW cannot pass the first non-dominant pole.',
      hook: '“Lift your foot early; don’t move the cliff.”',
      cards: [
        { id: 'c-l13-dom', front: 'Dominant-pole compensation for PM = 45° with one fixed pole ωp2?', back: 'Put ωgx at ωp2: move the first pole to ωp2/(βA0).' },
        { id: 'c-l13-rout', front: 'Why does raising Rout not compensate an op amp?', back: 'It raises the low-frequency gain but leaves the high-frequency |βA| (and ωgx) unchanged.' },
      ],
    },
  },
  {
    id: 'l13-onestage',
    unit: 'L13',
    title: 'One stage vs two: the load capacitor helps one and hurts the other',
    minutes: 10,
    refs: { razavi: '§10.4 (UCLA EE215A handout #12)', notes: 'Lec 17' },
    why: 'A classic viva/quiz question: does a telescopic op amp need compensation, and what happens if you double CL?',
    picture: {
      visual: { widget: 'loadCapMini' },
      caption: 'Raise CL. Top (one stage): slower but calmer. Bottom (two stage): same speed, more ringing.',
    },
    predict: {
      prompt: 'A telescopic (one-stage) op amp in unity feedback rings a little. You add more load capacitance. It will…',
      choices: ['ring more', 'ring less, but settle more slowly', 'oscillate'],
      answer: 1,
      explain: 'In a one-stage op amp the output node IS the dominant pole. More CL lowers fu = gm/(2πCL) while the internal pole stays put: more phase margin.',
    },
    idea: `Razavi asks: does a telescopic op amp need compensation? Usually not. Its high-resistance output node carries CL, so it is already the **dominant pole**. The internal nodes (mirror, cascode sources) see about 1/gm and sit far above.

So CL is the compensation: fu = gm/(2πCL), and more CL only adds margin, at the cost of speed.

In a **two-stage** op amp the dominant pole is set by CC at the first stage, and CL sits on the **second** pole, Gm2/CL. More CL pulls that pole down towards fu: the margin shrinks and the step rings.`,
    analogy: 'A heavier trailer slows a steady truck (one stage) but makes a wobbly one (two stage) sway more.',
    rule: {
      tex: ['\\text{one stage: } f_u = \\frac{g_m}{2\\pi C_L},\\; PM \\approx 90^\\circ - \\tan^{-1}\\frac{\\beta f_u}{f_{nd}}', 'C_{L,min} = \\frac{\\beta g_m}{2\\pi f_{nd}\\tan(90^\\circ - PM)}', '\\text{two stage: } \\omega_{p2} \\approx \\frac{G_{m2}}{C_L}\\;(\\text{more } C_L \\Rightarrow \\text{less } PM)'],
      symbols: ['gm', 'CL', 'PM', 'beta', 'omegap2'],
      note: 'The hand CL is on the safe side: the exact margin comes out a few degrees higher.',
    },
    worked: { generator: 'l13-onestage', seed: 7 },
    yourTurn: { generators: ['l13-onestage'], count: 2 },
    lab: { id: 'stability' },
    lockIn: {
      summary: 'One stage: CL is the dominant pole; more CL = more margin, less speed. Two stage: CL sets P2 = Gm2/CL; more CL = less margin.',
      hook: '“CL steadies one stage and shakes two.”',
      cards: [
        { id: 'c-l13-onestage', front: 'Does a telescopic op amp need compensation?', back: 'Usually not: its output node (Rout·CL) is the dominant pole; internal poles sit near gm/C. CL itself compensates it.' },
        { id: 'c-l13-cl', front: 'Doubling CL: effect on a one-stage vs a two-stage op amp?', back: 'One stage: fu halves, PM rises. Two stage: fu = Gm1/CC unchanged, P2 = Gm2/CL halves, PM falls (rings).' },
      ],
    },
  },
  {
    id: 'l13-miller',
    unit: 'L13',
    title: 'Miller compensation: one small capacitor, two poles split apart',
    minutes: 14,
    refs: { razavi: '§10.5, §6.2', notes: 'Lec 17' },
    why: 'Lec 17: CC across the second stage gives P1′ ≈ 1/(R1A2CC) with a small capacitor, and pushes the output pole up.',
    picture: {
      visual: { widget: 'millerMini' },
      caption: 'Top: CC across A2. Bottom: its effect split between the nodes, CC(1 + A2) at node 1. Watch P1 fall and P2 rise.',
    },
    predict: {
      prompt: 'A 1 pF capacitor bridges a stage with gain −50. Seen from the stage’s input it looks like…',
      choices: ['1 pF', 'about 50 pF', 'about 51 pF'],
      answer: 2,
      explain: 'Its input end moves by v, its output end by −50v: 51v across it, so it draws 51 times the current of a grounded 1 pF: CC(1 + A2).',
    },
    idea: `A capacitor across a gain stage feels **both** ends move. Input moves by $v$, output by $-A_2 v$: the voltage across {{CC}} is $(1 + A_2)v$, so node 1 sees $C_C(1 + A_2)$. The dominant pole drops to $P_1' \\approx 1/(R_1 A_2 C_C)$ with only a small CC.

Bonus, **pole splitting**: at high frequency CC shorts M6’s gate to its drain, turning it into a diode ($\\approx 1/G_{m2}$). The output resistance collapses, so the output pole jumps up to $P_2' \\approx G_{m2}/C_2$.

Before: $P_1 = 1/(R_1C_1)$, $P_2 = 1/(R_2C_2)$, close together. After: far apart, exactly what a stable loop needs.`,
    analogy: 'A see-saw rope tied from the ground to the far end: pull the near end by 1 cm and the far end moves 50 cm, so the rope stretches 51 cm.',
    rule: {
      tex: ['C_{node1} = C_1 + C_C(1 + A_2),\\quad A_2 = G_{m2}R_2', "P_1' \\approx \\dfrac{1}{R_1 A_2 C_C},\\quad P_2' \\approx \\dfrac{G_{m2}C_C}{C_1C_2 + C_2C_C + C_1C_C} \\approx \\dfrac{G_{m2}}{C_2}"],
      symbols: ['CC', 'A2', 'R1', 'C1', 'R2', 'C2', 'Gm'],
    },
    worked: { generator: 'l13-miller', seed: 5 },
    yourTurn: { generators: ['l13-miller'], count: 2 },
    lockIn: {
      summary: 'CC across A2 looks like CC(1 + A2) at node 1: P1′ ≈ 1/(R1A2CC). At high f CC makes M6 a diode: P2′ ≈ Gm2/C2. The poles split.',
      hook: '“The rope stretches 1 + A2 times.”',
      cards: [
        { id: 'c-l13-miller', front: 'Miller-compensated dominant pole (Lec 17)?', back: 'P1′ ≈ 1/(R1[C1 + (1 + A2)CC]) ≈ 1/(R1A2CC), A2 = Gm2R2.' },
        { id: 'c-l13-split', front: 'Why does Miller compensation push the output pole UP?', back: 'At high f, CC shorts M6’s gate to its drain: M6 acts as a diode (≈ 1/Gm2), so the output pole becomes ≈ Gm2/C2.' },
      ],
    },
  },
  {
    id: 'l14-twostage',
    unit: 'L14',
    title: 'Compensating the two-stage op amp: GBW = Gm1/CC, choose CC for 60°',
    minutes: 14,
    refs: { razavi: '§10.5–10.6', notes: 'Lec 17' },
    why: 'Handout L14 and Lec 17’s circuit (5-T OTA + M6/M7): choose CC, then give GBW, the zero, Rz and the slew rate.',
    picture: {
      visual: { widget: 'twoStageCompMini' },
      caption: 'Slide CC and Gm2/Gm1; switch Rz. The bars show GBW and P2 moving; the step shows the ringing disappear as PM reaches 60°.',
    },
    predict: {
      prompt: 'You double CC in a two-stage op amp. The unity-gain bandwidth…',
      choices: ['doubles', 'halves', 'does not change'],
      answer: 1,
      explain: 'GBW = Gm1/CC: the first stage’s current charges CC. Twice the capacitor, half the bandwidth (and half the slew rate), but more phase margin.',
    },
    idea: `Above P1′ the gain is $G_{m1}/(\\omega C_C)$ (the first stage charging CC), so the unity-gain frequency is $\\omega_u = G_{m1}/C_C$, independent of the output stage.

For the phase margin (β = 1), the dominant pole gives −90°; the output pole $\\omega_{p2} \\approx G_{m2}/C_L$ may take only 90° − PM:
$\\omega_{p2} = \\omega_u\\tan PM$, so $C_C = \\dfrac{G_{m1}C_L\\tan PM}{G_{m2}}$.
45° → $C_C = (G_{m1}/G_{m2})C_L$ (Razavi Ex 10.6); 60° → 1.73×.

Slewing: the tail current charges CC, so $SR = I_{SS}/C_C$, unless M7 cannot also feed CL: then $(I_7 - I_{SS})/C_L$. A two-stage op amp gets **less** stable with more CL (P2 moves down).`,
    rule: {
      tex: ['\\omega_u = \\dfrac{G_{m1}}{C_C},\\quad \\omega_{p2} \\approx \\dfrac{G_{m2}}{C_L}', 'C_C = \\dfrac{G_{m1}C_L\\tan PM}{G_{m2}}\\;(\\text{zero removed})', 'SR = \\min\\left(\\dfrac{I_{SS}}{C_C},\\,\\dfrac{I_7 - I_{SS}}{C_L}\\right)'],
      symbols: ['CC', 'omegau', 'Gm', 'CL', 'PM', 'SR'],
      note: 'Allen’s check: RHP zero at ≥ 10·GBW and P2 ≥ 2.2·GBW give 60°, i.e. CC ≥ 0.22·CL when Gm2 = 10·Gm1. The tan formula with the zero kept gives the same 0.22.',
    },
    worked: { bank: 'bank-ps2-p4' },
    yourTurn: { generators: ['l14-cc', 'l13-miller'], count: 3 },
    lab: { id: 'stability' },
    lockIn: {
      summary: 'GBW = Gm1/CC; P2 ≈ Gm2/CL; CC = Gm1CL·tan(PM)/Gm2 (45° → Gm1CL/Gm2). SR = ISS/CC (or (I7 − ISS)/CL). More CL hurts a two-stage op amp.',
      hook: '“Gm1 charges CC: that is the bandwidth and the slew.”',
      cards: [
        { id: 'c-l14-gbw', front: 'GBW of a Miller-compensated two-stage op amp?', back: 'ωu = Gm1/CC.' },
        { id: 'c-l14-cc', front: 'CC for PM = 45° / 60° (zero removed, β = 1)?', back: 'CC = (Gm1/Gm2)CL for 45°; 1.73·(Gm1/Gm2)CL for 60°.' },
        { id: 'c-l14-allen', front: 'Allen’s CC ≥ 0.22·CL rule: where does it come from?', back: 'RHP zero at 10·GB and P2 ≥ 2.2·GB for 60°; with Gm2 = 10·Gm1 that is CC ≈ 0.22·CL, the same as our tan formula with the zero kept.' },
        { id: 'c-l14-sr', front: 'Slew rate of a two-stage op amp?', back: 'ISS/CC, unless the output current source runs out: (I7 − ISS)/CL.' },
      ],
    },
  },
  {
    id: 'l14-rz',
    unit: 'L14',
    title: 'The right-half-plane zero and the nulling resistor',
    minutes: 12,
    refs: { razavi: '§10.5 (Eq. 10.30–10.33), Example 10.7', notes: 'Lec 17' },
    why: 'The numerator in Lec 17, (1 − sCC/Gm2), is a right-half-plane zero; Razavi removes it with Rz = 1/Gm2 or uses it to cancel P2.',
    picture: {
      visual: { widget: 'twoStageCompMini' },
      caption: 'With “no Rz” the zero is in the right half plane and the phase margin suffers. Switch to Rz = 1/Gm2, then to “Rz cancels P2”.',
    },
    predict: {
      prompt: 'A right-half-plane zero affects the phase like…',
      choices: ['a zero: it adds phase (helps)', 'a pole: it removes phase (hurts)', 'nothing'],
      answer: 1,
      explain: 'The factor (1 − s/ωz) has phase −atan(ω/ωz): lag, like a pole. Yet its magnitude rises like a zero, so it also slows the gain’s fall. Double trouble (Razavi Ex 10.7).',
    },
    idea: `CC is also a **shortcut**: the input of the second stage reaches the output directly through CC, with the opposite sign to the main path through M6. At $\\omega_z = G_{m2}/C_C$ the two currents cancel ($G_{m2}v = sC_Cv$): a zero, in the **right** half plane.

A RHP zero lags the phase like a pole but lifts the gain like a zero: it costs $\\tan^{-1}(G_{m1}/G_{m2})$ of margin whatever CC is.

Fix: a resistor {{Rz}} in series with CC makes the shortcut weaker. The zero moves to $1/[C_C(1/G_{m2} - R_z)]$:
$R_z = 1/G_{m2}$ sends it to infinity; $R_z = (C_L + C_C)/(G_{m2}C_C)$ puts it in the left half plane, on top of P2.`,
    analogy: 'A leak in a pipe that carries water backwards: at one frequency the leak exactly cancels the main flow. A valve (Rz) in the leak fixes it.',
    rule: {
      tex: ['\\omega_z = \\dfrac{G_{m2}}{C_C}\\;\\text{(RHP)}', '\\omega_z = \\dfrac{1}{C_C(1/G_{m2} - R_z)}', 'R_z = \\dfrac{1}{G_{m2}}\\;(\\omega_z\\to\\infty),\\quad R_z = \\dfrac{C_L + C_C}{G_{m2}C_C}\\;(\\text{cancels } P_2)'],
      symbols: ['omegaz', 'Rz', 'CC', 'Gm', 'CL'],
    },
    worked: { bank: 'bank-ex10-6' },
    yourTurn: { generators: ['l14-cc'], count: 2 },
    lab: { id: 'stability' },
    lockIn: {
      summary: 'CC feeds forward: RHP zero at Gm2/CC, which lags like a pole. Rz = 1/Gm2 removes it; Rz = (CL + CC)/(Gm2CC) cancels P2. Do not try CC = CL to cancel P2 with the RHP zero.',
      hook: '“Close the backwards leak with a valve.”',
      cards: [
        { id: 'c-l14-rhp', front: 'Where does the RHP zero of a Miller two-stage op amp come from?', back: 'CC feeds the signal forward from M6’s gate to the output, opposing the main path; they cancel at ωz = Gm2/CC.' },
        { id: 'c-l14-rztrack', front: 'How does Razavi make Rz track 1/Gm2 over process and temperature?', back: 'Build Rz from a triode MOSFET whose gate is biased by a replica branch, so its resistance follows the output device’s 1/gm.' },
        { id: 'c-l14-rz', front: 'Nulling resistor values?', back: 'Rz = 1/Gm2 moves the zero to ∞; Rz = (CL + CC)/(Gm2CC) puts it on P2 in the LHP.' },
      ],
    },
  },
];
