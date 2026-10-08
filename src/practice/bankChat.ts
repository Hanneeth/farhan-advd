/**
 * Numeric questions worked in the tutoring chat (beyond Problem Set 1 and the Part 1 worked examples):
 * the unity-gain buffer of Razavi Ex 9.4 and the telescopic buffer window. The chat's interactive quizzes
 * did not survive the export, so these are the ones whose numbers are in the text.
 */
import { gainError, parallel, pole, routClosed, unityGainWindow } from '../physics';
import type { Problem } from './schema';
import { texNum, texSI } from './tex';

function buffer94(): Problem {
  const gm = 1e-3, ro = 20e3, cl = 1e-12;
  const rOpen = parallel(ro, ro);
  const a = gm * rOpen;
  const rClosed = routClosed(rOpen, a, 1);
  return {
    id: 'bank-chat-buffer',
    source: 'Unity-gain buffer lecture (tutoring chat, Razavi Ex 9.4)',
    tags: ['L2', 'U12'],
    title: 'Chat: what feedback does to a 5-T OTA buffer',
    statement: 'A five-transistor OTA with gm2 = 1 mS and rO2 = rO4 = 20 kΩ drives CL = 1 pF. Find the open-loop Rout and gain, the open-loop pole, the closed-loop Rout as a unity-gain buffer, the closed-loop pole, and the buffer’s gain error.',
    figure: { kind: 'fiveT', props: { proc: { name: 'chat', kpn: 200e-6, kpp: 100e-6, vthn: 0.4, vthp: 0.5, lambdan: 0.1, lambdap: 0.1, vdd: 1.8 }, iss: 200e-6, wl12: 20, wl34: 20, wlTail: 20, vinCm: 1.1, buffer: true } },
    givens: [
      { sym: 'g_{m2}', value: gm, unit: 'S' },
      { sym: 'r_{O2} = r_{O4}', value: ro, unit: 'Ω' },
      { sym: 'C_L', value: cl, unit: 'F' },
    ],
    unknowns: [
      { key: 'ropen', sym: 'R_{out,open}', label: 'Open-loop Rout', unit: 'Ω' },
      { key: 'a', sym: 'A_{open}', label: 'Open-loop gain', unit: 'V/V' },
      { key: 'wp', sym: '\\omega_{p,open}', label: 'Open-loop pole', unit: 'rad/s' },
      { key: 'rclosed', sym: 'R_{out,closed}', label: 'Buffer Rout', unit: 'Ω' },
      { key: 'eps', sym: '\\varepsilon', label: 'Buffer gain error (fraction)', unit: '' },
    ],
    answers: { ropen: rOpen, a, wp: pole(rOpen, cl), rclosed: rClosed, eps: gainError(a, 1) },
    wrong: { rclosed: [{ mistake: 'betaVsBetaA', value: rOpen }] },
    steps: [
      { tag: 'C', title: 'rO2 ‖ rO4', tex: `R_{out} = 20\\mathrm{k}\\parallel 20\\mathrm{k} = ${texSI(10e3, 'Ω')}`, produces: 'ropen', value: (20e3 * 20e3) / 40e3 },
      { tag: 'D', title: 'Gm·Rout', tex: `A = 1\\,\\mathrm{mS}\\times 10\\,\\mathrm{k\\Omega} = ${texNum(1e-3 * 10e3)}`, produces: 'a', value: 1e-3 * 10e3 },
      { tag: '·', title: 'One pole at the output', tex: `\\omega_p = \\frac{1}{10\\mathrm{k}\\times 1\\mathrm{p}} = ${texSI(1 / (10e3 * 1e-12), 'rad/s')}`, produces: 'wp', value: 1 / (10e3 * 1e-12) },
      { tag: 'C', title: 'Voltage feedback makes the output stiff: Rout/(1 + βA), β = 1', tex: `R_{out,closed} = \\frac{10\\mathrm{k}}{11} = ${texSI(10e3 / 11, 'Ω')}\;\\approx 1/g_m`, produces: 'rclosed', value: 10e3 / 11 },
      { tag: '·', title: 'Gain error 1/(1 + A): the buffer’s gain is only 0.91', tex: `\\varepsilon = \\frac{1}{11} = ${texNum(1 / 11, 3)}`, produces: 'eps', value: 1 / 11 },
    ],
    hints: ['Open loop first: Gm·Rout.', 'Feedback divides Rout by (1 + βA).', 'The pole moves out by the same factor: gm/CL.', 'A = 10.'],
    flags: ['The chat’s nanometre example used Aopen ≈ 5 (ε ≈ 17%); with these numbers A = 10 and ε = 9%.'],
  };
}

function cmRange94(): Problem {
  const vdd = 1, vth = 0.3, vov = 0.1;
  return {
    id: 'bank-chat-cm94',
    source: 'Unity-gain buffer lecture (tutoring chat, Razavi Ex 9.4)',
    tags: ['U11', 'L2'],
    title: 'Chat: input range of a 5-T OTA buffer on a 1 V supply',
    statement: 'A five-transistor OTA on VDD = 1 V, every |Vth| = 0.3 V, every overdrive 0.1 V (the tail needs VISS = 0.1 V). Find the input CM range.',
    givens: [
      { sym: 'V_{DD}', value: vdd, unit: 'V' },
      { sym: 'V_{th}', value: vth, unit: 'V' },
      { sym: 'V_{ov}', value: vov, unit: 'V' },
    ],
    unknowns: [
      { key: 'min', sym: 'V_{in,min}', label: 'Lowest input', unit: 'V' },
      { key: 'max', sym: 'V_{in,max}', label: 'Highest input', unit: 'V' },
    ],
    answers: { min: vov + vth + vov, max: vdd - (vth + vov) + vth },
    wrong: { min: [{ mistake: 'vovNotVgs', value: 2 * vov }] },
    steps: [
      { tag: '✓', title: 'Floor: VISS + VGS1', tex: `0.1 + 0.4 = ${texSI(0.1 + 0.3 + 0.1, 'V')}`, produces: 'min', value: 0.1 + 0.3 + 0.1 },
      { tag: '✓', title: 'Ceiling: VDD − |VGS3| + Vth1', tex: `1 - 0.4 + 0.3 = ${texSI(1 - 0.4 + 0.3, 'V')}`, produces: 'max', value: 1 - (0.3 + 0.1) + 0.3 },
    ],
    hints: ['Two fences.', 'Floor = tail headroom + VGS1.', 'Ceiling = diode node + Vth.', 'VGS = 0.4 V.'],
  };
}

function window(): Problem {
  const w = unityGainWindow({ vb1: 1.2, vgs4: 0.55, vth4: 0.4, vth2: 0.4 });
  return {
    id: 'bank-chat-window',
    source: 'Buffer window lecture (tutoring chat, Razavi Ex 9.5)',
    tags: ['L2'],
    title: 'Chat: the telescopic buffer window',
    statement: 'A telescopic op amp is used as a unity-gain buffer. Vth = 0.4 V, Vov4 = 0.15 V, Vb1 = 1.2 V. Find the lowest and highest output and the window width.',
    figure: { kind: 'mirrorTele', props: { proc: { name: 'chat', kpn: 200e-6, kpp: 100e-6, vthn: 0.4, vthp: 0.4, lambdan: 0.1, lambdap: 0.1, vdd: 2.5 }, iss: 400e-6, wlN: (2 * 200e-6) / (200e-6 * 0.0225), wlP: 200, vinCm: 1.0, vb1: 1.2, vout: 1.0, bias: 'diodes', buffer: true } },
    givens: [
      { sym: 'V_{th}', value: 0.4, unit: 'V' },
      { sym: 'V_{ov4}', value: 0.15, unit: 'V' },
      { sym: 'V_{b1}', value: 1.2, unit: 'V' },
    ],
    unknowns: [
      { key: 'lo', sym: 'V_{out,min}', label: 'Lowest output', unit: 'V' },
      { key: 'hi', sym: 'V_{out,max}', label: 'Highest output', unit: 'V' },
      { key: 'w', sym: '\\text{width}', label: 'Window width', unit: 'V' },
    ],
    answers: { lo: w.lower, hi: w.upper, w: w.width },
    wrong: {},
    steps: [
      { tag: '✓', title: 'M4 fence', tex: `V_{b1} - V_{th4} = ${texSI(1.2 - 0.4, 'V')}`, produces: 'lo', value: 1.2 - 0.4 },
      { tag: '✓', title: 'M2 fence (its gate is the output)', tex: `V_{b1} - V_{GS4} + V_{th2} = 1.2 - 0.55 + 0.4 = ${texSI(1.2 - 0.55 + 0.4, 'V')}`, produces: 'hi', value: 1.2 - 0.55 + 0.4 },
      { tag: '·', title: 'One threshold minus one overdrive', tex: `V_{th} - V_{ov4} = ${texSI(0.4 - 0.15, 'V')}`, produces: 'w', value: 0.4 - 0.15 },
    ],
    hints: ['In a buffer the output is a gate voltage.', 'Floor from M4, ceiling from M2.', 'Width = Vth − Vov4.', 'VGS4 = 0.55 V.'],
  };
}

export const CHAT_BANK: Problem[] = [buffer94(), cmRange94(), window()];
