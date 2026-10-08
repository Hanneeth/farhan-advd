/**
 * Milestone 3 lessons: U10 differential pair, U11 five-transistor OTA, U12 poles and bandwidth.
 * Same §5.2 template. Tutorial 1 and the exam question are the worked examples where they fit.
 */
import type { Lesson } from '../types';

export const DIFF_LESSONS: Lesson[] = [
  // ─── U10 ─────────────────────────────────────────────────────────────────
  {
    id: 'u10-steering',
    unit: 'U10',
    title: 'The differential pair: CM, DM and current steering',
    minutes: 12,
    refs: { razavi: '§4.2', conversation: 'Part 3, Module 17 (see-saw)' },
    why: 'Every op amp in the course starts with this pair, and Tutorial 1 is all about it. It only listens to the difference between its inputs.',
    picture: {
      visual: { widget: 'pairSteer' },
      caption: 'Move both inputs together, then move them apart. Watch where the tail current goes.',
    },
    predict: {
      prompt: 'Both gates rise by 100 mV together. What happens to ID1 and ID2?',
      choices: ['Both rise', 'Nothing: they stay at ISS/2 each', 'ID1 rises, ID2 falls'],
      answer: 1,
      explain: 'The tail fixes ID1 + ID2 = ISS, and by symmetry each gets half. A common move just lifts the tail node P by the same 100 mV.',
    },
    idea: `Two matched transistors share one **tail current** {{ISS}}. Split the inputs into a **common part** {{VCM}} $= (V_{in1}+V_{in2})/2$ and a **difference** {{vd}} $= V_{in1} - V_{in2}$.

A common move changes nothing: the tail node simply rides up and down, and each side keeps $I_{SS}/2$. A difference **steers** the current: one side gains exactly what the other loses. For small $v_d$ the extra current is $g_m v_d/2$ on each side.

When $|v_d|$ reaches $\\sqrt{2}\\,V_{ov}$ (with $V_{ov}$ at balance), **all** of $I_{SS}$ is on one side and the other transistor is off.`,
    analogy: 'Two kids on a see-saw: lift both ends together and nothing tips; push one down and the other goes up by the same amount.',
    rule: {
      tex: ['V_{CM} = \\tfrac{V_{in1}+V_{in2}}{2},\\quad v_d = V_{in1}-V_{in2}', 'I_{D1}+I_{D2} = I_{SS},\\quad \\Delta I_{D1} \\approx +\\tfrac{g_m v_d}{2},\\ \\Delta I_{D2} \\approx -\\tfrac{g_m v_d}{2}', '|v_d|_{max} = \\sqrt{2}\\,V_{ov},\\quad V_{ov} = \\sqrt{\\tfrac{I_{SS}}{\\mu_n C_{ox} W/L}}'],
      symbols: ['ISS', 'VCM', 'vd', 'Vov', 'gm'],
    },
    worked: { generator: 'u10-steering', seed: 8 },
    yourTurn: { generators: ['u10-steering'], count: 2 },
    lockIn: {
      summary: 'The pair ignores VCM and steers ISS with vd: ±gm·vd/2 on each side, all of it past √2·Vov.',
      hook: '“Two kids on a see-saw.”',
      cards: [
        { id: 'c-u10-split', front: 'Split Vin1, Vin2 into CM and DM parts.', back: 'VCM = (Vin1 + Vin2)/2; vd = Vin1 − Vin2.' },
        { id: 'c-u10-steer', front: 'At what vd is the tail fully steered?', back: '√2·Vov, where Vov is the overdrive at balance (ID = ISS/2).' },
      ],
    },
    lab: { id: 'diffpair' },
  },
  {
    id: 'u10-half',
    unit: 'U10',
    title: 'Half circuits: Ad, ACM with 2RSS, and CMRR',
    minutes: 14,
    refs: { razavi: '§4.3–4.4', conversation: 'Part 3, Module 18; Tutorial 1 Q4' },
    why: 'Tutorial 1 Q4 asks for Ad, the CM gain and the CM step that pushes the pair into triode. All three come from two half circuits.',
    picture: {
      visual: { widget: 'halfCircuits' },
      caption: 'Switch between the DM and CM half circuits and slide RSS. Watch the CM gain collapse while Ad stays put.',
    },
    predict: {
      prompt: 'In the common-mode half circuit, what resistance sits under each transistor’s source if the tail is a resistor RSS?',
      choices: ['0 (AC ground)', 'RSS', '2RSS'],
      answer: 2,
      explain: 'Both halves push the same current into RSS, so the voltage there rises by 2i·RSS. To one half it looks like 2RSS of its own.',
    },
    idea: `Cut the symmetric circuit in half along its mirror line.

**Differential mode:** one side goes up, the other down, so the tail node P **does not move**. It is AC ground, and each half is a plain CS stage: $A_d = g_m R_D$ (differential output).

**Common mode:** both sides move together and push the same current into the tail. Each half sees **2RSS** under its source, so by the ratio rule $A_{CM} = -R_D/(1/g_m + 2R_{SS})$: small.

The pair’s quality is how much bigger {{Ad}} is than {{ACM}}: the **CMRR**, usually quoted as $20\\log_{10}|A_d/A_{CM}|$.`,
    rule: {
      tex: ['A_d = g_m R_D\\ (\\text{DM half circuit, P = AC ground})', 'A_{CM} = -\\dfrac{R_D}{1/g_m + 2R_{SS}}\\ (\\text{CM half circuit})', '\\text{CMRR} = 20\\log_{10}\\left|\\dfrac{A_d}{A_{CM}}\\right|'],
      symbols: ['Ad', 'ACM', 'gm', 'RD'],
      note: 'An ideal tail (RSS → ∞) gives ACM = 0 for a perfectly matched pair. Mismatch brings it back.',
    },
    worked: { bank: 'bank-t1q4' },
    yourTurn: { generators: ['u10-cm'], count: 3 },
    lockIn: {
      summary: 'DM: P is AC ground, Ad = gm·RD. CM: each half sees 2RSS, ACM = −RD/(1/gm + 2RSS). CMRR = 20·log|Ad/ACM|.',
      hook: '“DM: ground the tail. CM: double the tail.”',
      cards: [
        { id: 'c-u10-dm', front: 'Why is the tail node AC ground for a differential signal?', back: 'One side’s current rises exactly as much as the other’s falls, so the tail current and VP do not change.' },
        { id: 'c-u10-cm', front: 'CM gain of a resistor-loaded pair with tail RSS?', back: 'ACM = −RD/(1/gm + 2RSS): each half sees 2RSS.' },
      ],
    },
  },
  {
    id: 'u10-cmrange',
    unit: 'U10',
    title: 'Input CM range: a fence at each end',
    minutes: 12,
    refs: { razavi: '§4.2.1', conversation: 'Tutorial 1 Q1 walkthrough' },
    why: 'Tutorial 1 Q1 ends with “what is the input common-mode range?” It is two fence checks: one on the tail, one on the input pair.',
    picture: {
      visual: { widget: 'cmRange' },
      caption: 'Slide VCM. Too low and the tail source Q3 runs out of room; too high and Q1’s gate climbs past its drain + Vth.',
    },
    predict: {
      prompt: 'You raise the input CM. Which node follows it up, one VGS below?',
      choices: ['The drains', 'The tail node P', 'VSS'],
      answer: 1,
      explain: 'The current in each device is fixed by the tail, so VGS is fixed: the sources (node P) follow the gates. The drains stay put (fixed current through RD).',
    },
    idea: `Raising {{VCM}} lifts the tail node P with it (P = VCM − VGS1), while the drains stay where RD puts them.

**Floor:** P must stay high enough for the tail source to stay saturated. P ≥ VSS + {{VISS}}, so
$V_{CM,min} = V_{SS} + V_{ISS} + V_{GS1}$.

**Ceiling:** Q1’s fence: its drain must stay above its gate minus a threshold, so
$V_{CM,max} = V_{D1} + V_{th}$.

Inside that window every transistor is saturated and the pair works.`,
    rule: {
      tex: ['V_{in,CM,min} = V_{SS} + V_{ISS} + V_{GS1}', 'V_{in,CM,max} = V_{D1} + V_{th}\\;(\\text{resistor load})', 'V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{thn}\\;(\\text{mirror load, 5-T OTA})'],
      symbols: ['VCM', 'VISS', 'VGS', 'Vth'],
    },
    worked: { bank: 'bank-t1q1' },
    yourTurn: { generators: ['u10-pair-bias'], count: 2 },
    lockIn: {
      summary: 'CM range: floor = tail headroom + VGS1; ceiling = input device fence (drain + Vth). P follows VCM one VGS below.',
      hook: '“A fence at each end.”',
      cards: [
        { id: 'c-u10-cmmin', front: 'Lowest input CM of an NMOS pair?', back: 'VSS + VISS + VGS1 (tail headroom plus a full VGS).' },
        { id: 'c-u10-cmmax', front: 'Highest input CM of a resistor-loaded NMOS pair?', back: 'VD1 + Vth (Q1’s fence).' },
      ],
    },
    lab: { id: 'diffpair' },
  },

  // ─── U11 ─────────────────────────────────────────────────────────────────
  {
    id: 'u11-ota',
    unit: 'U11',
    title: 'Five-transistor OTA: the mirror recovers the lost half',
    minutes: 14,
    refs: { razavi: '§5.3, §9.2.1', notes: 'Lec 02', conversation: 'Five-transistor OTA lecture; Tutorial 1 Q5' },
    why: 'Your exam question is this circuit. Part (b), its gain gm1(rO2 ‖ rO4), is four marks for one line.',
    picture: {
      visual: { widget: 'otaSignal' },
      caption: 'Give the input a tiny differential push and follow the signal currents: +i through M1 and M3, a copy +i in M4, −i in M2.',
    },
    predict: {
      prompt: 'A resistor-loaded pair with a single-ended output uses only half the signal current. How much does the mirror-loaded pair deliver to the output?',
      choices: ['Half: i', 'All of it: 2i = gm·vd', 'None'],
      answer: 1,
      explain: 'M4 copies M1’s +i and pushes it into the output, while M2 pulls −i out. Both add at the output node: 2i = gm·vd.',
    },
    idea: `Replace the drain resistors by a PMOS **current mirror**: M3 is a diode, M4 copies it.

Follow a small $v_d$: M1 gains $+i$ and M2 loses $i$, with $i = g_m v_d/2$. M1’s $+i$ flows through diode M3, and M4 **copies** it: $+i$ pushed into the output. M2 **pulls** $i$ less out of the output, which is the same as another $+i$ in. Total: $2i = g_m v_d$.

So {{Gm}} $= g_{m1}$: the full pair’s transconductance, single-ended. The output node sees M2 looking down ($r_{O2}$) and M4 looking up ($r_{O4}$):
$A_v = g_{m1}(r_{O2} \\parallel r_{O4})$.`,
    rule: {
      tex: ['G_m = g_{m1}', 'R_{out} = r_{O2}\\parallel r_{O4}', 'A_v = g_{m1}\\,(r_{O2}\\parallel r_{O4})'],
      symbols: ['Gm', 'Rout', 'gm', 'rO'],
      note: 'Signs: Vin2 on the output side (M2) is the inverting input; Vin1 on the diode side is non-inverting. That is why a buffer feeds Vout back to M2’s gate.',
    },
    worked: { generator: 'u11-ota', seed: 14 },
    yourTurn: { generators: ['u11-ota'], count: 2 },
    lockIn: {
      summary: '5-T OTA: +i, copied +i, −i: the mirror adds both halves, Gm = gm1. Rout = rO2 ‖ rO4. Av = gm1(rO2 ‖ rO4).',
      hook: '“The mirror recovers the lost half.”',
      cards: [
        { id: 'c-u11-gain', front: 'Gain of a five-transistor OTA?', back: 'Av = gm1(rO2 ‖ rO4).' },
        { id: 'c-u11-gm', front: 'Why is Gm of the 5-T OTA equal to gm1 and not gm1/2?', back: 'The mirror copies M1’s signal current into the output, where it adds to M2’s: 2·(gm·vd/2) = gm·vd.' },
      ],
    },
    lab: { id: 'ota' },
  },
  {
    id: 'u11-ota-range',
    unit: 'U11',
    title: 'OTA CM range and swing: your exam, step by step',
    minutes: 16,
    refs: { razavi: '§9.2.1', notes: 'Lec 02', conversation: 'Exam Q1 walkthrough (Quiz 1 Part C)' },
    why: 'Exam Q1(a) and (c): size M1 and M3 from the CM range, then find the output swing. Ten marks from two fences.',
    picture: {
      visual: { widget: 'otaRange' },
      caption: 'Your exam OTA with its bias mirror. Slide the input CM to each end of the range and watch which transistor turns red.',
    },
    predict: {
      prompt: 'The exam gives Vin,CM,max = 1.45 V. Which transistor’s size does that number fix?',
      choices: ['M1', 'M3 (the PMOS diode)', 'M5'],
      answer: 1,
      explain: 'The ceiling is M1’s fence against the diode node VDD − |VGS3|. Fixing the ceiling fixes |VGS3|, hence |Vov3| and (W/L)3.',
    },
    idea: `The two CM limits are the design equations, run **backwards**:

**Floor** $V_{CM,min} = V_{ov5} + V_{GS1}$: the tail M5 needs its $V_{ov5}$ (set by I1 and $(W/L)_5$), then M1 needs a full {{VGS}}. Given the floor, that fixes $V_{ov1}$ and so $(W/L)_1$.

**Ceiling** $V_{CM,max} = V_{DD} - |V_{GS3}| + V_{thn}$: fixes $|V_{ov3}|$ and so $(W/L)_3$.

**Output swing:** the output can rise to $V_{DD} - |V_{ov4}|$ and fall to $V_{ov5} + V_{ov2}$ (with the input CM at its lowest).`,
    rule: {
      tex: ['V_{ov1} = V_{in,CM,min} - V_{ov5} - V_{thn}', '|V_{GS3}| = V_{DD} - V_{in,CM,max} + V_{thn}', 'V_{out} \\in [\\,V_{ov5} + V_{ov2},\\; V_{DD} - |V_{ov4}|\\,]'],
      symbols: ['Vov', 'VGS', 'VDD', 'Vth'],
      note: 'Every W/L then comes from the square law with ID = ISS/2.',
    },
    worked: { bank: 'bank-exam-q1' },
    yourTurn: { generators: ['u11-ota-design', 'u11-ota'], count: 3 },
    lockIn: {
      summary: 'Floor → Vov1 → (W/L)1. Ceiling → |VGS3| → (W/L)3. Swing from VDD − |Vov4| down to Vov5 + Vov2.',
      hook: '“Run the fences backwards.”',
      cards: [
        { id: 'c-u11-cm', front: '5-T OTA input CM range?', back: 'Vov5 + VGS1 ≤ Vin,CM ≤ VDD − |VGS3| + Vthn.' },
        { id: 'c-u11-swing', front: '5-T OTA output range?', back: 'Vov5 + Vov2 ≤ Vout ≤ VDD − |Vov4|.' },
      ],
    },
    lab: { id: 'ota' },
  },

  // ─── U12 ─────────────────────────────────────────────────────────────────
  {
    id: 'u12-poles',
    unit: 'U12',
    title: 'Poles and GBW: one pole per node',
    minutes: 14,
    refs: { razavi: '§6.1–6.2, §9.1.1', notes: 'Lec 02', conversation: 'Bandwidth lecture; Exam Q1(d–e)' },
    why: 'Exam Q1(d) and (e): the bandwidth with CL = 4 pF, then the bandwidth as a buffer. Both are one line once you see the pole.',
    picture: {
      visual: { widget: 'bodeMini' },
      caption: 'Change Rout: the gain and the bandwidth trade places but the unity-gain point stays put. Change gm or CL to move it.',
    },
    predict: {
      prompt: 'You double Rout of a one-stage OTA (same gm, same CL). What happens to its unity-gain frequency?',
      choices: ['It doubles', 'It halves', 'It stays the same'],
      answer: 2,
      explain: 'The gain doubles and the bandwidth halves. Their product gm/CL does not depend on Rout at all.',
    },
    idea: `A capacitor is a resistor that shrinks with frequency: $1/(\\omega C)$. On a node with resistance $R$ it starts to steal current when $1/(\\omega C) = R$: a **pole** at $\\omega_p = 1/(RC)$.

A one-stage OTA has one high-resistance node, the output, so one important pole: $\\omega_p = 1/(R_{out} C_L)$. Above it the gain falls 20 dB per decade and hits 1 at
$\\omega_u = A_0\\,\\omega_p = g_m R_{out}/(R_{out} C_L) = g_m/C_L$: the {{omegau}}, or **GBW**. Rout cancels.

In a **unity-gain buffer** Rout drops to about $1/g_m$, so the bandwidth becomes $g_m/C_L$: the GBW itself. Divide by $2\\pi$ for Hz.`,
    rule: {
      tex: ['\\omega_p = \\dfrac{1}{R_{out} C_L},\\quad f_{-3dB} = \\dfrac{1}{2\\pi R_{out} C_L}', '\\omega_u = A_0\\,\\omega_p = \\dfrac{g_m}{C_L}', 'f_{buffer} \\approx \\dfrac{g_m}{2\\pi C_L}'],
      symbols: ['CL', 'omegau', 'Rout', 'gm'],
      note: 'Forgetting the 2π is the most common slip: rad/s ÷ 6.28 = Hz.',
    },
    worked: { generator: 'u12-pole', seed: 4 },
    yourTurn: { generators: ['u12-pole'], count: 2 },
    lockIn: {
      summary: 'One pole per node: 1/(RC). One-stage OTA: f−3dB = 1/(2πRoutCL), GBW = gm/(2πCL), buffer bandwidth ≈ GBW.',
      hook: '“GBW = gm/CL: Rout cancels.”',
      cards: [
        { id: 'c-u12-pole', front: 'Pole of a node with resistance R and capacitance C?', back: 'ωp = 1/(RC); f = 1/(2πRC).' },
        { id: 'c-u12-gbw', front: 'GBW of a one-stage OTA?', back: 'ωu = gm/CL (fu = gm/(2πCL)), independent of Rout.' },
      ],
    },
    lab: { id: 'feedback' },
  },
  {
    id: 'u12-settling',
    unit: 'U12',
    title: 'Settling and slewing: the cake and the tap',
    minutes: 12,
    refs: { razavi: '§9.1.1, §9.1.4', notes: 'Settling-time example', conversation: 'Settling lecture; Problem Set 1 P2' },
    why: 'Razavi Ex 9.2 and Problem Set 1 P2 ask how fast an op amp settles to 0.1%. Big steps add slewing first.',
    picture: {
      visual: { widget: 'settleMini' },
      caption: 'Change the closed-loop gain and the GBW and watch the settling time. Tick “big step” to see slewing: a straight ramp before the curve.',
    },
    predict: {
      prompt: 'Settling to 1% takes 4.6 τ. How many τ does 0.1% take?',
      choices: ['About 4.6 again', 'About 6.9', '46'],
      answer: 1,
      explain: 'The error is e^(−t/τ). For 0.1% you need ln(1000) = 6.9 time constants: only 2.3 τ more for ten times better accuracy.',
    },
    idea: `In feedback, a one-pole op amp answers a small step like $1 - e^{-t/\\tau}$, with {{tau}} $= 1/(\\beta\\omega_u) = A_{closed}/\\omega_u$. Every τ the remaining error shrinks by $e$ — like eating a fixed share of what is left of a cake. To get within {{eps}}: $t = \\tau\\ln(1/\\varepsilon)$: 4.6τ for 1%, 6.9τ for 0.1%.

A **big** step would need a steeper start than the op amp can give: the tail current can only charge $C_L$ so fast. The output then ramps at the **slew rate** $SR = I_{SS}/C_L$ (a fixed tap filling a bucket), and only settles exponentially at the end.`,
    analogy: 'Settling: eating a fixed share of what is left of a cake every minute. Slewing: a fixed tap filling a bucket.',
    rule: {
      tex: ['\\tau = \\dfrac{1}{\\beta\\,\\omega_u} = \\dfrac{A_{closed}}{\\omega_u}', 't_s = \\tau\\,\\ln\\dfrac{1}{\\varepsilon}\\quad(1\\%: 4.6\\tau,\\ 0.1\\%: 6.9\\tau)', 'SR = \\dfrac{I_{SS}}{C_L}'],
      symbols: ['tau', 'eps', 'beta', 'omegau', 'SR'],
    },
    worked: { generator: 'u12-settle', seed: 3 },
    yourTurn: { generators: ['u12-settle', 'u12-pole'], count: 3 },
    lockIn: {
      summary: 'τ = Aclosed/ωu; settle in τ·ln(1/ε); a big step first slews at ISS/CL.',
      hook: '“Eat half the cake each minute; a tap fills the bucket at a fixed rate.”',
      cards: [
        { id: 'c-u12-tau', front: 'Closed-loop time constant of a one-pole op amp?', back: 'τ = 1/(β·ωu) = Aclosed/ωu.' },
        { id: 'c-u12-ln', front: 'How many τ to settle to 1%? to 0.1%?', back: 'ln(100) = 4.6; ln(1000) = 6.9.' },
        { id: 'c-u12-sr', front: 'Slew rate of a one-stage OTA?', back: 'SR = ISS/CL: the whole tail current charges the load.' },
      ],
    },
    lab: { id: 'feedback' },
  },
];
