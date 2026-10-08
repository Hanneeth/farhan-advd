/**
 * "Quick recall": when a lecture step leans on an idea from earlier, say in one line what it was and why it
 * matters. Each concept has the place it was introduced ("home"); it is only recalled on pages AFTER that
 * (or in foundation lessons, always), so a step never "recalls" what it is itself teaching.
 */
export interface Recall {
  id: string;
  name: string;
  /** Words that mean this concept appears in a step (tested on the step's text). */
  re: RegExp;
  /** One line: what it is + why it matters. */
  line: string;
  /** Where it was first met: a lecture id (lec01…) or 'base' for foundation material. */
  home: string;
  lesson: string;
}

export const RECALLS: Recall[] = [
  { id: 'fence', name: 'The saturation fence', re: /saturat|fence|edge|triode|headroom/i, line: 'A MOSFET stays saturated while its drain is no more than one Vth below its gate (NMOS: VD ≥ VG − Vth). Every swing / CM limit is this rule on one device.', home: 'base', lesson: 'u2-pinchoff' },
  { id: 'vov', name: 'Overdrive Vov', re: /overdrive|\bV_\{?ov|Vov/i, line: 'Vov = VGS − Vth: how hard the device is turned on. It sets the current (ID = ½µCox(W/L)Vov²) and the headroom each device eats.', home: 'base', lesson: 'u1-mosfet' },
  { id: 'gmro', name: 'gm and rO', re: /g_m ?r_O|g_mr_O|intrinsic gain|\br_O\b|r_\{O/i, line: 'gm = 2ID/Vov (how much current a gate wiggle makes); rO = 1/(λID) (the device’s own output resistance). gm·rO ≈ the most gain one transistor can give.', home: 'base', lesson: 'u4-ro' },
  { id: 'gmrout', name: 'Av = Gm × Rout', re: /G_m ?\\?times ?R_\{?out|G_mR_\{out|Gm ?× ?Rout|G_m R_\{out/i, line: 'Every gain in the course: the input device turns voltage into current (Gm), the output node turns it back into voltage (Rout).', home: 'base', lesson: 'u7-loads' },
  { id: 'rules', name: '“Up multiplies, down divides”', re: /up multiplies|down divides|looking (up|down|into)|looks like ?\$?1\/g|into (a|M\d)?.?s? ?source/i, line: 'Into a gate: ∞. Into a drain: rO, and a resistance under the source is multiplied by gm·rO. Into a source: ≈ 1/gm.', home: 'base', lesson: 'u6-rules' },
  { id: 'parallel', name: 'Smallest resistance wins', re: /in parallel|\\parallel|smaller resistance/i, line: 'Resistances on the same node add in parallel, and the result is below the smallest one — so the weakest path decides Rout.', home: 'base', lesson: 'u0-parallel' },
  { id: 'diode', name: 'Diode-connected device', re: /diode/i, line: 'Gate tied to drain: always saturated, looks like 1/gm, and costs a full VGS of headroom.', home: 'base', lesson: 'u6-mirror' },
  { id: 'mirror', name: 'Current mirror', re: /mirror/i, line: 'Same VGS on two devices → same current per unit W/L. Used to copy a current (and, in the 5-T OTA, to add the two halves of the signal).', home: 'base', lesson: 'u6-mirror' },
  { id: 'cs', name: 'Common-source stage', re: /common[- ]source|CS stage|\bCS\b/i, line: 'Input on the gate, output on the drain: gain −gm·Rout, inverts. The basic gain block (and the second stage of a two-stage op amp).', home: 'base', lesson: 'u5-cs' },
  { id: 'cg', name: 'Common-gate device', re: /common[- ]gate/i, line: 'Gate fixed, signal into the source, out of the drain: passes current through almost unchanged. This is what a cascode device is.', home: 'base', lesson: 'u8-cg' },
  { id: 'cascode', name: 'Cascode', re: /cascod/i, line: 'A common-gate device stacked on another: Rout × gm·rO (“up multiplies”), so gain ≈ (gm·rO)²/2 — paid for with one extra Vov of headroom per stacked device.', home: 'lec03', lesson: 'u9-cascode' },
  { id: 'telescopic', name: 'Telescopic op amp', re: /telescopic/i, line: 'Pair + NMOS cascodes + PMOS cascodes in one column: high gain (gm·rO)²/2, but five overdrives in the stack and a narrow buffer window.', home: 'lec03', lesson: 'u9-telescopic' },
  { id: 'pair', name: 'Differential pair', re: /differential pair|\bthe pair\b|input pair/i, line: 'Two matched devices sharing a tail current: a common move does nothing, a difference steers ±gm·vd/2 between the sides.', home: 'base', lesson: 'u10-steering' },
  { id: 'half', name: 'Half circuit, 2RSS', re: /half[- ]circuit|2R_\{?SS|common[- ]mode gain|A_\{?CM/i, line: 'Cut the symmetric circuit in half: differential → the tail is AC ground (gain gm·RD); common mode → each half sees 2RSS (tiny gain).', home: 'base', lesson: 'u10-half' },
  { id: 'ota', name: 'Five-transistor OTA', re: /5-T OTA|five-transistor|\bOTA\b/i, line: 'Pair + PMOS mirror + tail: gain gm(rO2 ‖ rO4), one output, the mid-sem circuit.', home: 'lec02', lesson: 'u11-ota' },
  { id: 'gbw', name: 'GBW', re: /GBW|gain[- ]bandwidth|\\omega_u|ωu/i, line: 'For one pole, gain × bandwidth is constant (ωu = A0·ω0 = gm/CL): closing the loop trades gain for speed one-for-one.', home: 'lec02', lesson: 'l1-speed' },
  { id: 'loop', name: 'Loop gain βA', re: /loop gain|\\beta A|βA|1 ?\+ ?\\beta/i, line: 'βA = gain once round the feedback loop. Error = 1/(1 + βA); feedback divides Rout and multiplies bandwidth by (1 + βA).', home: 'lec01', lesson: 'l1-gain' },
  { id: 'beta', name: 'Feedback factor β', re: /\\beta\b|β/i, line: 'β = the fraction of the output fed back (R2/(R1+R2)); the closed-loop gain is ≈ 1/β. β = 1 is the unity-gain buffer.', home: 'lec01', lesson: 'l1-gain' },
  { id: 'buffer', name: 'Unity-gain buffer window', re: /buffer|window/i, line: 'Output tied to an input (β = 1): the output also acts as a gate, so two fences box it in — for a telescopic only Vth − Vov wide.', home: 'lec03', lesson: 'l2-buffer' },
  { id: 'swing', name: 'Swing = what the stack leaves', re: /swing/i, line: 'The output can move only between the floor and ceiling the stacked devices allow: VDD minus every overdrive (and the tail) in its column.', home: 'lec02', lesson: 'l1-other' },
  { id: 'cmrange', name: 'Input CM range', re: /CM range|common[- ]mode range|input CM|V_\{?in,CM/i, line: 'Floor: the tail needs room, then the input device needs VGS. Ceiling: the input device’s fence against its drain (drain + Vth).', home: 'lec02', lesson: 'u10-cmrange' },
  { id: 'design', name: 'Design order (Ex 9.7)', re: /design|W\/L|square law/i, line: 'Power → currents; swing → overdrives; square law → W/L; then check the gain and lengthen the weak side.', home: 'lec04', lesson: 'l3-design' },
  { id: 'folding', name: 'Folding', re: /fold/i, line: 'Feed the cascode’s source sideways from an opposite-type input device: the input pair leaves the output stack, so more swing and a CM range past the rails.', home: 'lec05', lesson: 'l4-folding' },
  { id: 'divider', name: 'Current divider', re: /current divider|divider/i, line: 'A current arriving at a node splits towards the easier path; branch A gets I·RB/(RA + RB).', home: 'base', lesson: 'u0-parallel' },
  { id: 'twostage', name: 'Two-stage op amp', re: /two-stage|second stage|stage 2/i, line: 'Stage 1 for gain, a CS stage 2 for swing; gains multiply, but two high-impedance nodes give two poles.', home: 'lec07', lesson: 'l5-twostage' },
  { id: 'boost', name: 'Gain boosting', re: /boost|auxiliary|booster/i, line: 'An amplifier holds the cascode’s source still, so it fights back (1 + A1) times harder: Rout × (1 + A1), gain ≈ (gm·rO)³.', home: 'lec07', lesson: 'l6-boost' },
  { id: 'cmfb', name: 'CMFB', re: /CMFB|common[- ]mode feedback/i, line: 'Fully differential outputs sit between two current sources and float; CMFB senses the output CM, compares with VREF and corrects a current source.', home: 'lec09', lesson: 'l7-cmfb' },
  { id: 'deeptriode', name: 'Deep triode = resistor', re: /deep[- ]triode|triode devices|R_\{?on/i, line: 'With small VDS a MOSFET is a resistor 1/(µCox(W/L)(VGS − Vth)) set by its gate.', home: 'lec11', lesson: 'l8-cmfb' },
  { id: 'pole', name: 'One pole per node', re: /pole/i, line: 'Each high-resistance node with a capacitor makes a pole at 1/(R·C); a pole bends the gain down and eats up to 90° of phase.', home: 'base', lesson: 'u12-poles' },
  { id: 'slew', name: 'Slew rate', re: /slew/i, line: 'A big step steers the whole tail to one side: the output ramps at SR = I/C instead of following the exponential.', home: 'lec13', lesson: 'l9-slew' },
  { id: 'pm', name: 'Phase margin', re: /phase margin|\bPM\b/i, line: 'PM = 180° + phase of βA where |βA| = 1: how far from oscillation. 60° = fast and clean, small PM = peaking and ringing.', home: 'lec15', lesson: 'l12-margins' },
  { id: 'barkhausen', name: 'Barkhausen', re: /barkhausen|oscillat/i, line: '|βA| = 1 at −180° turns negative feedback positive: the loop oscillates.', home: 'lec14', lesson: 'l11-barkhausen' },
  { id: 'miller', name: 'Miller effect', re: /miller/i, line: 'A capacitor across a gain −A looks (1 + A) times bigger at the input, because its two ends swing in opposite directions.', home: 'lec17', lesson: 'l13-miller' },
];

const ORDER = ['base', 'lec01', 'settling', 'lec02', 'lec03', 'lec04', 'lec05', 'lec06', 'lec07', 'lec08', 'lec09', 'lec10', 'lec11', 'lec12', 'lec13', 'lec14', 'lec15', 'lec16', 'lec17'];

/** Earlier ideas a step leans on (introduced before this page), at most `max`. */
export function recallsFor(pageId: string, text: string, max = 3): Recall[] {
  const here = ORDER.indexOf(pageId);
  return RECALLS.filter((r) => ORDER.indexOf(r.home) < here && r.re.test(text))
    .sort((a, b) => ORDER.indexOf(b.home) - ORDER.indexOf(a.home))
    .slice(0, max);
}
