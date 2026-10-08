/**
 * Extras for the existing fixed-bank problems: the question as printed in your paper, the class/official
 * solution where you have one, a one-glance "concept + formulas" box, and fx-991CW keystrokes.
 * Merged into BANK in src/content/index.ts. No numbers here are answers: formulas and keystrokes only.
 */
import type { Problem } from './schema';

type Extra = Pick<Problem, 'printed' | 'key' | 'inShort' | 'calc'>;

const P = (img: string, caption: string) => [{ img, caption }];
const T = (n: number, q: number) => P(`t${n}q${q}`, `Tutorial ${n}, Question ${q} (as printed)`);

const SQ = { what: 'W/L from the square law, in one line', keys: '2 × I ÷ ( µCox × Vov² )   e.g.  2 × 0.1[m] ÷ ( 400[µ] × 0.15² )', shows: '22.22' };
const VOV = { what: 'Vov from a current', keys: '√( 2 × I ÷ ( µCox × W/L ) )' };
const PAR = { what: 'Parallel resistors', keys: '( a⁻¹ + b⁻¹ )⁻¹   (⁻¹ is [SHIFT] [^] on the CW)' };
const ENG = { what: 'Type µ, m, k, M directly', keys: '[CATALOG] ▸ Engineer Symbol ▸ µ  (turn on: [SETTINGS] ▸ Calc Settings ▸ Engineer Symbol ▸ On)' };

const OTA = {
  concept: 'Five-transistor OTA: the mirror recovers the other half, so Gm = gm1 and Rout = rO2 ‖ rO4. The CM range is two fences (tail + VGS1 at the bottom, M1 against the diode M3 at the top); the swing is two overdrives at each rail; one pole at the output; as a buffer Rout → 1/gm.',
  formulas: [
    'V_{in,CM,min} = V_{ov5} + V_{GS1},\\quad V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{thn}',
    'A_v = g_{m1}(r_{O2}\\parallel r_{O4})',
    '\\text{swing} = (V_{DD} - |V_{ov4}|) - (V_{ov5} + V_{ov2})',
    'f_{-3dB} = \\dfrac{1}{2\\pi(r_{O2}\\parallel r_{O4})C_L},\\quad f_{buffer} = \\dfrac{g_{m2}}{2\\pi C_L}',
  ],
};

const CMFB_TRIODE = {
  concept: 'Two triode devices whose gates are the outputs act as one resistor set by Vout1 + Vout2. The tail current through that resistor fixes VP, so fixing VP (by the cascode bias) pins the output CM.',
  formulas: ['R_{tot} = \\dfrac{1}{\\mu_nC_{ox}(W/L)(V_{out1}+V_{out2}-2V_{th})}', 'V_P = 2I_D R_{tot},\\quad V_P = V_{b1} - V_{GS}', 'V_{out,min} = V_P + V_{ov} + V_{ov}'],
};

export const BANK_EXTRAS: Record<string, Extra> = {
  'bank-t1q1': {
    printed: T(1, 1),
    key: P('k-t1q1', 'Class solution (handwritten), Tutorial 1 Q1'),
    inShort: { concept: 'Bias design of a differential pair: split the tail current, drop the drain voltage across RD, square law backwards for each W/L, then the two CM fences.', formulas: ['R_D = \\dfrac{V_{DD} - V_D}{I_{SS}/2}', '\\dfrac{W}{L} = \\dfrac{2I_D}{\\mu_nC_{ox}V_{ov}^2}', 'V_{in,CM}: [V_{SS} + V_{ov3} + V_{GS1},\\; V_{D1} + V_{th}]'] },
    calc: [ENG, SQ],
  },
  'bank-t1q2': {
    printed: T(1, 2),
    key: P('k-t1q2', 'Class solution (handwritten), Tutorial 1 Q2'),
    inShort: { concept: 'A diode load looks like 1/gm3. Without rO the gain is a ratio of transconductances, and the bias current cancels.', formulas: ['A_d = g_{m1}\\left(r_{O1}\\parallel r_{O3}\\parallel \\tfrac{1}{g_{m3}}\\right) \\approx \\dfrac{g_{m1}}{g_{m3}} = \\sqrt{\\dfrac{\\mu_n(W/L)_1}{\\mu_p(W/L)_3}}'] },
  },
  'bank-t1q3': {
    printed: T(1, 3),
    inShort: { concept: 'PMOS current-source loads: the half circuit is a CS stage with rO ‖ rO. Size each device from its current and Vov; rO from the Early voltage.', formulas: ['A_d = g_{m1}(r_{O1}\\parallel r_{O3}) = g_m\\dfrac{r_O}{2}', 'r_O = \\dfrac{|V_A|}{I_D}'] },
    calc: [SQ],
  },
  'bank-t1q4': {
    printed: T(1, 4),
    key: P('k-t1q4', 'Class solution (handwritten), Tutorial 1 Q4'),
    inShort: { concept: 'Resistive tail: the source node is ISS·RSS. Differential half circuit gives Ad = gm·RD; the CM half circuit sees 2RSS, so ACM = −RD/(1/gm + 2RSS). The CM can rise until M1 hits its fence.', formulas: ['V_{CM} = V_{GS1} + I_{SS}R_{SS}', 'A_d = g_mR_D,\\quad A_{CM} = -\\dfrac{R_D}{1/g_m + 2R_{SS}}', '\\Delta V_{CM} = \\dfrac{V_D - V_{CM} + V_{th}}{1 - A_{CM}}'] },
  },
  'bank-t1q5': {
    printed: T(1, 5),
    inShort: { concept: 'Mirror-loaded pair: Ad = gm(rO/2). With gm = √(2k′(W/L)ID) and rO = VA/ID the gain ∝ 1/√ID: solve for ID, then I = 2ID.', formulas: ['A_d = \\sqrt{2k\'(W/L)I_D}\\,\\dfrac{V_A}{2I_D} = \\dfrac{V_A}{2}\\sqrt{\\dfrac{2k\'(W/L)}{I_D}}'] },
  },
  'bank-exam-q1': {
    printed: P('exam-q1', 'Mid-sem question (as printed)'),
    inShort: { concept: OTA.concept + ' Here the CM limits are given and the sizes are the unknowns: read each fence backwards.', formulas: OTA.formulas },
    calc: [ENG, VOV, SQ, { what: 'f−3dB', keys: '1 ÷ ( 2π × Rout × 4[p] )' }],
  },
  'bank-quiz1a': { key: P('k-quiz1', 'Official Quiz 1 key (all parts)'), inShort: OTA, calc: [ENG, SQ] },
  'bank-quiz1b': { key: P('k-quiz1', 'Official Quiz 1 key (all parts)'), inShort: OTA, calc: [ENG, SQ] },
  'bank-quiz2a': { key: P('k-quiz2', 'Official Quiz 2 key (all parts)'), inShort: CMFB_TRIODE, calc: [SQ] },
  'bank-quiz2b': { key: P('k-quiz2', 'Official Quiz 2 key (all parts)'), inShort: CMFB_TRIODE, calc: [SQ] },
  'bank-quiz2c': { key: P('k-quiz2', 'Official Quiz 2 key (all parts)'), inShort: CMFB_TRIODE, calc: [SQ] },
  'bank-t2q1': {
    printed: T(2, 1),
    inShort: { concept: 'Fully differential pair with PMOS current-source loads: gain gm1(rO1 ‖ rO3); each output swings between M1’s fence (Vin,CM − Vth) and VDD − |Vov3|. In triode a device’s rO becomes its (small) triode resistance.', formulas: ['A_v = g_{m1}(r_{O1}\\parallel r_{O3})', 'V_{out} \\in [V_{in,CM} - V_{thn},\\; V_{DD} - |V_{ov3}|]'] },
    calc: [VOV, PAR],
  },
  'bank-t2q2': {
    printed: T(2, 2),
    inShort: { concept: 'Telescopic with a diode-stacked cascode mirror. (a) M3 saturated needs the diode stack not to pull its drain too low → minimum PMOS W. (b) As a buffer (M2’s gate on Vout) the window is only Vth − Vov4 wide. (c) Gain gm1(Rup ‖ Rdown).', formulas: ['V_{b} - V_{th4} \\le V_{out} \\le V_b - V_{GS4} + V_{th2}', 'A_v = g_{m1}\\left(g_{m3}r_{O3}r_{O1}\\parallel g_{m5}r_{O5}r_{O7}\\right)'] },
    calc: [VOV, PAR],
  },
  'bank-t2q3': {
    printed: T(2, 3),
    inShort: { concept: 'Folded-cascode design: power → total current (half to the pair, half to the cascode branches); swing → four overdrives share VDD − swing; square law → W/L; gain = gm1(Rup ‖ Rdown). The PMOS input lets the CM go below 0 V.', formulas: ['I_{tot} = P/V_{DD}', '2|V_{ov,p}| + 2V_{ov,n} = V_{DD} - V_{swing,side}', 'V_{in,CM,min} = V_{ov5} - |V_{thp}|'] },
    calc: [SQ],
  },
  'bank-t3q1': {
    printed: T(3, 1),
    inShort: { concept: 'Telescopic with a low-voltage cascode mirror: X sits one |VGS7| below VDD; the buffer window is set by M4 and M2’s fences; Vb2 is bounded by M5 and M7 both staying saturated.', formulas: ['V_{in,CM,max} = V_{b1} - V_{GS3} + V_{th}', 'V_X = V_{DD} - |V_{GS7}|', 'V_{b1} - V_{th4} \\le V_{out} \\le V_{b1} - V_{GS4} + V_{th2}'] },
  },
  'bank-t3q2': {
    printed: T(3, 2),
    inShort: { concept: 'Two-stage op amp: X and Y must sit where the second-stage PMOS carries its current (VDD − |VGS5|); that caps the input CM. Gains multiply; the CS output stage swings almost rail to rail.', formulas: ['V_X = V_{DD} - |V_{GS5}|', 'A = g_{m1}(r_{O1}\\parallel r_{O3})\\cdot g_{m5}(r_{O5}\\parallel r_{O7})', 'V_{pp,diff} = 2(V_{DD} - |V_{ov5}| - V_{ov7})'] },
  },
  'bank-t3q3': {
    printed: T(3, 3),
    inShort: { concept: 'Telescopic first stage + CS second stage. X is fixed by M9’s VGS; the swing at X sets the overdrives below and above it; gain = (telescopic gain) × gm9(rO9 ‖ rO11).', formulas: ['V_X = V_{DD} - |V_{GS9}|', 'A = g_{m1}\\left[g_{m3}r_{O3}r_{O1}\\parallel g_{m5}r_{O5}r_{O7}\\right]\\cdot g_{m9}(r_{O9}\\parallel r_{O11})'] },
  },
  'bank-t4q1': {
    printed: T(4, 1),
    inShort: { concept: 'Regulated cascode: CS auxiliary M3 holds X; Rout multiplies by (1 + A1). Bias walks up from ground; the PMOS current source (part c) is the load trap.', formulas: ['V_X = V_{GS3},\\; V_{G2} = V_X + V_{GS2}', 'R_{out} = r_{O1} + r_{O2} + (1+A_1)g_{m2}r_{O2}r_{O1},\\; A_1 = g_{m3}r_{O3}', 'V_{out,min} = V_{GS3} + V_{ov2}'] },
    calc: [VOV, PAR],
  },
  'bank-t4q2': {
    printed: T(4, 2),
    inShort: { concept: 'PMOS auxiliary amplifier (Lec 8 implementation 2): its saturation needs VGS2 ≤ |Vth3|. A plain cascode with an ideal load gives ≈ (gm·rO)²; boosted, the load rO decides.', formulas: ['V_{D3} \\le V_P + |V_{thp}|', '|A_v| \\approx (g_mr_O)^2 \\;(\\text{plain cascode})'] },
  },
  'bank-t4q3': {
    printed: T(4, 3),
    inShort: { concept: 'Folded-cascode auxiliary (Lec 8 implementation 3): budget the currents from the power, size from equal VGS/mirror ratios, walk the bias string, then gain = gm1 × (boosted Rdown ‖ Rup).', formulas: ['I_{tot} = P/V_{DD}', '\\dfrac{(W/L)_a}{(W/L)_b} = \\dfrac{I_a}{I_b}\\;(\\text{same }V_{GS})'] },
  },
  'bank-t5q1': { printed: T(5, 1), inShort: CMFB_TRIODE, calc: [{ what: 'Full triode W/L', keys: '2 × 0.5[m] ÷ ( 135[µ] × ( 2 × 0.8 × 0.1 − 0.1² ) )', shows: '49.38' }] },
  'bank-t5q2': {
    printed: T(5, 2),
    inShort: { concept: 'The CMFB error amplifier’s input CM must be near its output’s needed level: choose the pair type that fits. Loop gain = sense gain × error-amp gain × how hard the controlled source moves Vout,CM.', formulas: ['T = A_{EA}\\cdot g_{m,ctrl}(R_{up}\\parallel R_{down})'] },
  },
  'bank-t5q3': {
    printed: T(5, 3),
    inShort: {
      concept: 'Without CMFB: Ad = gm(rO1 ‖ rO3 ‖ R), ACM ≈ rO3/(2rO5). Optimum VO,CM = middle of the output range. “±1%” (course rule): the output CM may move 2·1%·VO,CM over the whole input CM range. With CMFB the CM gain divides by (1 + loop gain).',
      formulas: ['A_d = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R),\\quad A_{CM} = \\dfrac{r_{O3}}{1/g_{m1} + 2r_{O5}}', 'A_{CM,req} = \\dfrac{2(0.01)V_{O,CM}}{V_{in,CM,max} - V_{in,CM,min}}', 'A_{CM,fb} = \\dfrac{A_{CM}}{1 + T}'],
    },
    calc: [PAR],
  },
  'bank-t6q1': {
    printed: T(6, 1),
    inShort: { concept: 'Linear settling: τ = RoutCL/(1 + βA); initial slope = final value/τ. If that slope exceeds SR = Imax/CL the output slews first, then settles.', formulas: ['A_{CL} = \\dfrac{A}{1+\\beta A},\\; \\tau = \\dfrac{R_{out}C_L}{1+\\beta A}', 'SR = \\dfrac{I_{max}}{C_L},\\quad V_{0,crit} = \\dfrac{SR\\cdot\\tau}{A_{CL}}'] },
    calc: [{ what: 'Output after t', keys: 'V0 × Acl × ( 1 − e^( −t ÷ τ ) )' }],
  },
  'bank-t6q2': {
    printed: T(6, 2),
    inShort: { concept: 'A 5-T OTA slews at ISS/CL until the input difference falls below √2·Vov, then settles linearly with τ = RoutCL/(1 + βA0).', formulas: ['SR = I_{SS}/C_L', '\\Delta V_{in,full} = \\sqrt2\\,V_{ov}', 't = \\tau\\ln\\dfrac{\\text{error at start}}{\\text{final error}}'] },
  },
  'bank-t6q3': {
    printed: T(6, 3),
    inShort: { concept: 'Folded cascode slewing: the output current is (IP − ID2) minus the mirrored (IP − ID1); a branch cannot go negative. Symmetric SR = ISS/CL needs IP ≥ ISS.', formulas: ['SR^+ = \\dfrac{I_P}{C_L}\\ \\text{or}\\ \\dfrac{I_{SS}}{C_L}\\ (\\text{smaller}),\\quad I_P \\ge I_{SS}'] },
  },
  'bank-ex91': { inShort: { concept: 'Gain error ε = 1/(1 + βA) ≈ 1/(βA). For ideal gain 1/β and error ε, A ≥ Aclosed/ε.', formulas: ['\\varepsilon \\approx \\dfrac{1}{\\beta A},\\quad A_{min} = \\dfrac{A_{closed}}{\\varepsilon}'] } },
  'bank-ex92': {
    inShort: { concept: 'One-pole closed loop: τ = 1/(βωu). Settling to ε takes ln(1/ε) time constants.', formulas: ['t_s = \\tau\\ln\\dfrac{1}{\\varepsilon} = \\dfrac{\\ln(1/\\varepsilon)}{\\beta\\omega_u}', 'f_u = \\omega_u/2\\pi'] },
    calc: [{ what: 'ωu in one line', keys: 'ln(100) ÷ ( 0.1 × 5[n] )', shows: '9.21G' }],
  },
  'bank-ex97': { inShort: { concept: 'Design recipe: power → currents; swing → overdrives; square law → W/L; check gain; if short, lengthen the weak side (doubling W and L keeps Vov, halves λ).', formulas: ['I = P/V_{DD}', '\\dfrac{W}{L} = \\dfrac{2I_D}{\\mu C_{ox}V_{ov}^2}', 'A_v = g_{m1}(R_{up}\\parallel R_{down})', 'g_mr_O \\propto \\sqrt{WL/I_D}'] }, calc: [SQ, PAR] },
  'bank-ex98': { inShort: { concept: 'Linear scaling by α: widths and currents ×α keep every Vov (so swing and gain), gm ×α, rO ÷α, power ×α.', formulas: ['\\alpha = C_{L,new}/C_{L,old}\\ (\\text{same }\\omega_u)', 'P_{new} = \\alpha P'] } },
  'bank-ps1p1': { inShort: OTA, calc: [VOV, PAR] },
  'bank-ps1p2': { inShort: { concept: 'Gain error 1/(1 + βA); minimum A = Aclosed/ε; τ = 1/(βωu) with ωu = gm/CL; settle to 0.1% in ln(1000) = 6.91τ.', formulas: ['\\varepsilon = \\dfrac{1}{1+\\beta A}', '\\tau = \\dfrac{1}{\\beta\\omega_u},\\; t = \\tau\\ln\\dfrac{1}{\\varepsilon}'] } },
  'bank-ps1p3': { inShort: { concept: 'Telescopic: gain gm1(Rup ‖ Rdown); differential swing 2[VDD − stack of overdrives]; bias voltages put the input pair and cascodes at their edges.', formulas: ['A = g_{m1}(g_{m3}r_{O3}r_{O1}\\parallel g_{m5}r_{O5}r_{O7})', 'V_{b1} = V_{in,CM} - V_{th} + V_{GS3}'] } },
  'bank-ps1p6': { inShort: { concept: 'Folded-cascode design from power and swing (same recipe as Tutorial 2 Q3).', formulas: ['I_{SS} = P/V_{DD}\\ (\\text{split})', '\\dfrac{W}{L} = \\dfrac{2I_D}{\\mu C_{ox}V_{ov}^2}', '\\omega_u = g_{m1}/C_L'] }, calc: [SQ] },
  'bank-ps1p7': { inShort: { concept: 'At the folding node M1’s current divides between the cascode source (1/gm3 ‖ rO3) and rO1 ‖ rO5.', formulas: ['G_m = g_{m1}\\dfrac{r_{O1}\\parallel r_{O5}}{(1/g_{m3}\\parallel r_{O3}) + (r_{O1}\\parallel r_{O5})}'] } },
  'bank-ps1p8': { inShort: { concept: 'PMOS-input folded cascode CM range: can go below ground (floor Vov5 − |Vthp|).', formulas: ['V_{in,CM}: [V_{ov5} - |V_{thp}|,\\; V_{DD} - V_{ISS} - |V_{GS1}|]'] } },
  'bank-r10-1': { inShort: { concept: 'PM = 60° → the second pole may take only 30° at ωgx; then set |βA| = 1 there.', formulas: ['PM = 180^\\circ - \\sum\\tan^{-1}(\\omega_{gx}/\\omega_{pi})'] }, calc: [{ what: 'Degree mode', keys: '[SETTINGS] ▸ Calc Settings ▸ Angle Unit ▸ Degree' }] },
  'bank-r10-2': { inShort: { concept: 'Two equal poles: each gives 60° at ωgx for PM 60°, i.e. ωgx = √3·ωp, where |βA| = βA0/4 = 1.', formulas: ['|\\beta A(\\omega_{gx})| = \\dfrac{\\beta A_0}{1 + (\\omega_{gx}/\\omega_p)^2}'] } },
  'bank-r10-3': { inShort: { concept: 'Solve |βA| = 1 (a quadratic in f²), then add the two arctangents.', formulas: ['(1 + f^2/f_{p1}^2)(1 + f^2/f_{p2}^2) = (\\beta A_0)^2'] }, calc: [{ what: 'Solve the quadratic in f²', keys: '[HOME] ▸ Equation ▸ Polynomial ▸ ax²+bx+c' }] },
  'bank-r10-4': { inShort: { concept: 'Peak K/β at ωgx → PM = 2 sin⁻¹(1/(2K)).', formulas: ['PM = 2\\sin^{-1}\\dfrac{1}{2K}'] }, calc: [{ what: 'PM from peaking', keys: '2 sin⁻¹( 1 ÷ ( 2 × 1.5 ) )', shows: '38.94' }] },
  'bank-lec16': { inShort: { concept: 'At ωgx the closed loop is (1/β)/(2 sin(PM/2)).', formulas: ['K = \\dfrac{1}{2\\sin(PM/2)}'] } },
  'bank-ps2-p2': { inShort: { concept: 'Find ωgx from |βA| = 1, then PM; with β < 1 the curve drops and ωgx moves left (more PM).', formulas: ['PM = 180^\\circ - \\tan^{-1}\\tfrac{f_{gx}}{f_{p1}} - \\tan^{-1}\\tfrac{f_{gx}}{f_{p2}}'] } },
  'bank-ps2-p3': { inShort: { concept: 'Dominant-pole compensation: keep the high poles, slide the first pole down until the loop gain hits 0 dB where the high poles leave the required PM.', formulas: ['f_D = f_{gx}/(\\beta A_0)\\ (-20\\text{ dB/dec})'] } },
  'bank-ps2-p4': { inShort: { concept: 'Miller two-stage: ωu = Gm1/CC, ωp2 = Gm2/CL; PM 60° → ωp2 = ωu·tan 60°. Rz = 1/Gm2 kills the RHP zero. SR is the smaller of ISS/CC and the output-stage limit.', formulas: ['C_C = \\dfrac{G_{m1}}{G_{m2}}C_L\\tan 60^\\circ', 'R_z = 1/G_{m2}'] } },
  'bank-ps2-p1': { inShort: { concept: 'Fully differential telescopic: each output slews at ISS/(2CL); the difference at ISS/CL.', formulas: ['\\dfrac{dV_{out,d}}{dt} = \\dfrac{I_{SS}}{C_L}'] } },
};
