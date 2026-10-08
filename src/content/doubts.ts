/**
 * “Doubts you might have here”: the questions you actually asked while studying Lec 1–5 (tutoring chat, 6–7 Oct
 * 2026), answered inside the lecture step where they come up — plus the same kinds of questions anticipated for
 * every later step. The doubts fell into five kinds, and each step answers the ones that apply:
 *   1. What does this symbol / node / subscript mean?   (gm1,2, X, P, VISS, |Vthp|, Vb1 …)
 *   2. Why this connection or this device?              (why feedback goes to M2, why a diode, why a buffer)
 *   3. Where does this term come from? (voltage bookkeeping: which fence, which device pays which Vov or Vth)
 *   4. What is the point — where is the lecture going?  (the story, and what comes next)
 *   5. Show it to me: a figure for the idea.
 * Text is RichText (**bold**, $tex$). Figures live in src/assets/doubts.
 */
export interface Doubt {
  q: string;
  a: string;
  /** Figures shown inside this answer (keys of FIG_CAPS). */
  figs?: string[];
}
export interface DoubtFig {
  key: string;
  cap: string;
}


/** Figures shown in a lecture step, keyed by page id → step index. */
export const WALK_FIGS: Record<string, Record<number, DoubtFig[]>> = {};

/** Captions for figures shown inside a doubt’s answer. */
export const FIG_CAPS: Record<string, string> = {};

/** Step-by-step simplification strips (scripts/doubtstrips.py): full circuit ⇒ simpler pictures ⇒ the formula. */
export const STRIP_CAPS: Record<string, string> = {
  's-lec01-feedback': 'Feedback in three pictures: the circuit, the same loop as blocks, and the one line of algebra.',
  's-lec02-pair': 'Differential pair simplified: full circuit ⇒ half circuit (P is AC ground) ⇒ small-signal picture ⇒ A_v = g_m(r_O1 ∥ r_O3).',
  's-lec02-ota': '5-T OTA simplified: follow the signal current, add the halves at the output, then the Norton picture of the output node.',
  's-lec02-cm': '5-T OTA CM range and swing as towers: move the input or output and find the block that gets squeezed.',
  's-lec03-buffer': 'Unity-gain buffer: feedback to M2, the load’s view (V_in behind ≈ 1/g_m), and the pole moving up to g_m/C_L.',
  's-lec03-tele': 'Telescopic gain simplified: one column ⇒ look down / look up (“up multiplies”) ⇒ g_m into R_down ∥ R_up ⇒ (g_m r_O)²/2.',
  's-lec05-fold': 'Folding: a cascode ⇒ the input device flipped and fed from the side ⇒ the same signal current reaches the output; panel 4 is the mirror version (NMOS input, PMOS cascode).',
  's-lec05-cascode': 'Cascode refresher: pump and shield, the four look-in resistances, G_m, R_out and the headroom price.',
  's-lec05-compare': 'Normal vs folded cascode: what folding changes and what it leaves alone.',
  's-lec03-tower': 'How to read a tower: one block per transistor, height = voltage across it, a red block is the squeezed device that sets the limit.',
  's-lec05-gm': 'Folded cascode by inspection: the current divider at the fold node gives G_m ≈ g_m1, then R_up, R_down and the gain.',
  's-lec06-cm': 'PMOS-input folded cascode CM range: red checks, the blue gate link, and the two towers (ceiling and floor).',
  's-lec06-start': 'Starting at Lec 6: the two fences, check vs link, and gain by two looks.',
  's-lec06-nfold': 'NMOS-input folded cascode: the circuit, its gain by two looks, and its CM ceiling above VDD.',
  's-lec06-r2r': 'Rail-to-rail input: an NMOS and a PMOS pair folded into the same cascodes; G_m doubles in the middle.',
  's-lec06-fbuf': 'Folded cascode as a buffer: two checks, both floors, the higher one binds.',
  's-lec06-lvc': 'The low-voltage cascode load: M7, M8 gates tied to X; V_b1 between two fences; no diode tax.',
  's-lec06-gmrout': 'A_v = G_m R_out: why the next lectures raise R_out.',
  's-lec07-twostage': 'Two-stage op amp: gain first, swing second — and the price, a second pole.',
  's-lec08-boost': 'Gain boosting simplified: a cascode ⇒ add an amplifier from source to gate ⇒ why R_out is multiplied by (1 + A_1) ⇒ (g_m r_O)³.',
  's-lec09-cmfb': 'Common-mode feedback: why it is needed, what it does, and triode sensing.',
  's-lec13-slew': 'Settling (an exponential) vs slewing (a straight ramp at I/C, then settling).',
  's-lec16-pm': 'Why small phase margin peaks: at crossover |1 + βA| = 2 sin(PM/2).',
  's-lec17-miller': 'Miller effect and pole splitting in three pictures.',
  's-lec02-cmdm': 'What V_CM and v_d mean: the shared level and the difference, and what each does to the pair.',
  's-lec02-swing': 'Why the differential swing is doubled: the two outputs move oppositely, so their difference moves twice as far.',
  's-lec03-headroom': 'Gain costs headroom (towers): every stacked device keeps one V_ov block; a diode stack wastes one extra |V_thp| (the diode tax).',
  's-lec03-vth': 'The diode tax: the gate pays |V_th|, the drain gives one back; with two diodes one |V_th| is never recovered.',
  's-lec03-window': 'Telescopic as a buffer: M4 sets a floor, M2 a ceiling; the window is only V_th − V_ov wide.',
  's-lec04-design': 'Ex 9.7 design flow: power → currents, swing → overdrives, square law → W/L, then check and fix the gain.',
  's-lec05-ex96': 'Ex 9.6: no DC through R_2, both CMs marked, the output seesaw, and the tower showing why each output can drop only V_th − V_ov.',
  's-lec05-folded': 'PMOS-input folded cascode: R_up is an ordinary cascode; R_down has r_O1 ∥ r_O9 at the fold node.',
  's-lec08-source': 'Looking into a boosted source: (1 + A_1) times stiffer, so the input current all goes up (G_m ≈ g_m1).',
  's-lec08-impl': 'The CS booster as towers: X is M3’s gate, so it sits a whole V_GS3 up and the output loses one V_th of swing.',
  's-lec08-compare': 'Plain vs gain-boosted cascode: what boosting changes and what it leaves alone.',
  's-lec07-swing': 'Why two stages: the telescopic’s five blocks vs the CS stage’s two, and the link that sets the level between the stages.',
  's-lec10-sense': 'Sensing the output CM: equal resistors average the outputs; followers stop them loading the outputs.',
  's-lec11-triode': 'Deep triode = a gate-controlled resistor; two in parallel sense only V_out1 + V_out2 (the CM).',
  's-lec12-replica': 'Replica CMFB: a twin with V_REF on its gate balances only when the outputs average to V_REF.',
  's-lec13-rc': 'One pole, one exponential: τ = RC, 63 % at τ, 99 % at 4.6τ; in feedback τ = 1/(βω_u).',
  's-lec14-bark': 'Barkhausen: gain 1 and −180° round the loop make the returning signal add — the circuit oscillates.',
  's-lec15-bode': 'Bode plots: each pole −20 dB/dec and up to −90°; PM = 180° + ∠βA at ω_GX.',
  's-lec16-steps': 'Step responses: small PM rings, PM ≈ 60° is fast with a small overshoot, 90° is slow.',
  's-lec17-comp': 'Dominant-pole compensation: push the first pole down until the loop gain reaches 0 dB at the second pole.',
};

/** Caption for any figure key (chat figures, strips). */
export function captionOf(key: string): string {
  if (STRIP_CAPS[key]) return STRIP_CAPS[key];
  if (FIG_CAPS[key]) return FIG_CAPS[key];
  for (const pg of Object.values(WALK_FIGS)) for (const fs of Object.values(pg)) for (const f of fs) if (f.key === key) return f.cap;
  return '';
}

/** Doubts per lecture step, keyed by page id → step index (same order as walk.ts). */
export const WALK_DOUBTS: Record<string, Record<number, Doubt[]>> = {
  lec01: {
    0: [
      { q: 'If one transistor already gives gain 10, why build an op amp at all?', a: '$g_m$ changes with temperature, process and even the signal, so $-g_mR_D$ is never **exactly** 10 and it is not linear. The course’s answer: use a huge but sloppy gain $A$ and put it in feedback, so two resistors (whose **ratio** is precise) set the gain.' },
      { q: 'What is the point of this whole lecture?', a: 'One sentence: **error = 1/(1 + βA)**, so to make a precise amplifier you need a big open-loop gain $A$. Lectures 2–8 are then all about getting big $A$ (cascodes, folding, two stages, boosting) without losing swing.' },
    ],
    1: [
      { q: 'Why is β = R₂/(R₁ + R₂) and not R₁/(R₁ + R₂)?', a: 'β is the fraction of $V_{out}$ that **arrives at the − input**. That input is tapped across $R_2$ (the bottom resistor), so by the voltage divider $V_f = V_{out}\\,R_2/(R_1+R_2)$.' },
      { q: 'Why does the feedback go to the − input?', a: 'It has to **oppose** the change: if $V_{out}$ rises, the − input rises, which pushes $V_{out}$ back down. Feeding the + input would push it further up (positive feedback → it latches to a rail).' },
    ],
    2: [
      { q: 'Where does A/(1 + βA) come from in one line?', a: 'The op amp amplifies the difference: $V_{out} = A(V_{in} - \\beta V_{out})$. Collect $V_{out}$: $V_{out}(1+\\beta A) = AV_{in}$, so $V_{out}/V_{in} = A/(1+\\beta A)$.' },
      { q: 'Why is the ideal gain 1/β = 1 + R₁/R₂?', a: 'Infinite $A$ forces the two inputs equal: $\\beta V_{out} = V_{in}$, so $V_{out}/V_{in} = 1/\\beta = (R_1+R_2)/R_2 = 1 + R_1/R_2$. For gain 10: $R_1 = 9R_2$.' },
      { q: 'If A is infinite, isn’t the input difference zero — so how does the op amp make any output?', a: 'The difference is not zero, it is **tiny**: $V_{out}/A$. With $A = 1000$ and $V_{out} = 1$ V it is 1 mV. That small leftover is exactly what causes the gain error.' },
    ],
    3: [
      { q: 'How exactly do you get 990?', a: '$\\varepsilon = 1/(1+\\beta A) \\le 0.01 \\Rightarrow 1 + \\beta A \\ge 100 \\Rightarrow \\beta A \\ge 99 \\Rightarrow A \\ge 99/\\beta = 990$ (β = 0.1). The approximate rule $A \\ge 1/(\\beta\\varepsilon)$ gives 1000 — that is why the page rounds.' },
      { q: 'Is A in V/V or dB?', a: 'Always V/V in these formulas. 1000 V/V = 60 dB ($20\\log_{10}1000$). Convert to dB only if the question asks.' },
    ],
    4: [{ q: 'Why does βA cancel in the algebra?', a: '$\\frac{1}{\\beta} - \\frac{A}{1+\\beta A} = \\frac{(1+\\beta A) - \\beta A}{\\beta(1+\\beta A)} = \\frac{1}{\\beta(1+\\beta A)}$. Divide by the ideal $1/\\beta$ and only $1/(1+\\beta A)$ is left.' }],
    5: [
      { q: 'When can I drop the “1 +”?', a: 'Whenever $\\beta A \\gg 1$ (say > 50): the difference between $1/(1+\\beta A)$ and $1/(\\beta A)$ is then under 2 %. In “≤ 1 % error” questions the exact and the approximate answers differ by one percent (990 vs 1000) — state which you used.' },
      { q: 'Same idea for a buffer?', a: 'Buffer: β = 1, so error ≈ $1/A$. A 5-T OTA with $A \\approx 25$ misses by about 4 %; a telescopic with $A \\approx 1250$ misses by 0.08 % — exactly the story of Lec 3.' },
    ],
  },
  lec02: {
    0: [{ q: 'Do I have to learn all the specs in detail now?', a: 'No — for the mid-sem you mainly compute **gain, bandwidth (GBW), swing and CM range**. Noise, offset, PSRR appear later. The list is here to show that improving one spec always costs another.' }],
    1: [
      { q: 'What is ω₀ vs ωᵤ?', a: '$\\omega_0$ = the open-loop pole (where the gain starts to fall). $\\omega_u$ = where the gain has fallen to 1 (0 dB). With one pole, $\\omega_u = A_0\\omega_0$ — this is the GBW.' },
      { q: 'rad/s or Hz?', a: '$\\omega$ is in rad/s, $f = \\omega/2\\pi$ in Hz. $g_m/C_L$ is in rad/s; questions usually want Hz, so divide by $2\\pi$ at the end.' },
    ],
    2: [
      { q: 'Why does this one line matter so much?', a: 'Every “how high/low can this node go” question is this fence applied to one transistor: **NMOS**: drain ≥ gate − $V_{th}$; **PMOS**: drain ≤ gate + $|V_{th}|$. Find the transistor that runs out of room first.' },
      { q: 'Is it the same as V_DS ≥ V_ov?', a: 'Yes — $V_{DS} \\ge V_{GS} - V_{th} = V_{ov}$. Use $V_{DS} \\ge V_{ov}$ when you know the **source**, and $V_D \\ge V_G - V_{th}$ when you know the **gate**. That second form is why a drain may sit a whole $V_{th}$ below (NMOS) or above (PMOS) its gate.' },
    ],
    3: [
      { q: 'Why current-source loads instead of resistors?', a: 'Gain = $g_m \\times R_{out}$. A resistor big enough for high gain would drop a huge DC voltage ($I\\cdot R$). A PMOS current source looks like a large $r_O$ to the signal but needs only $|V_{ov}|$ of DC room.' },
      { q: 'What sets the DC level of the two outputs here?', a: 'Nothing in this circuit! Each output sits between two current sources (PMOS on top, half the tail below); any tiny mismatch pushes it to a rail. That is why fully differential op amps need **CMFB** (Lec 9–12). For now assume the outputs sit where you need them.' },
      { q: 'What do V_CM and the “current difference” mean?', a: '$V_{in,CM} = (V_{in1}+V_{in2})/2$ is the common level both gates sit at; $v_d = V_{in1} - V_{in2}$ is the signal. A difference steers the tail current: $I_{D1} - I_{D2} \\approx g_mv_d$ (each side moves by $\\pm g_mv_d/2$). A common move changes neither current.' },
    ],
    4: [
      { q: 'What does g_m1,2 mean?', a: '“$g_m$ of M1 or M2” — they are matched and carry the same $I_{SS}/2$, so $g_{m1} = g_{m2}$. Same for $r_{O1,2}$, $r_{O3,4}$.' },
      { q: 'Why no minus sign in the gain?', a: 'The page writes the **magnitude**. From $V_{in1}$ to $V_{out1}$ the gain is $-g_m(r_{O1}\\parallel r_{O3})$ (common source inverts); the differential gain $V_{out}/v_d$ also carries a sign that depends on which output you take. Exams ask for the magnitude.' },
      { q: 'What is V_ISS?', a: 'The minimum voltage the tail current source needs to stay a current source. For a MOSFET tail it is its own overdrive: $V_{ISS} = V_{ov,tail}$.' },
      { q: 'Where does each CM limit come from?', a: '**Floor**: walk up from ground: tail needs $V_{ISS}$, then M1 needs $V_{GS1}$ from P to its gate → $V_{ISS} + V_{GS1}$. **Ceiling**: M1’s fence: gate ≤ drain + $V_{th}$; the highest the drain can sit with M3 still saturated is $V_{DD} - |V_{ov3}|$.' },
      { q: 'Why is the input CM not the same as the drain voltage?', a: 'They are different nodes: the CM is on the **gate**, the drain is where the load connects. The fence only says the gate may be up to $V_{th}$ **above** the drain. That gap is exactly why the ceiling has “$+V_{th}$” in it.' },
    ],
    5: [
      { q: 'Why does the differential output swing twice as far?', a: 'Each output moves ±$s$ around its CM, but in **opposite** directions. $V_{out1} - V_{out2}$ then moves ±$2s$. Peak-to-peak differential = 2 × single-ended.' },
      { q: 'Why is V_ISS in the swing?', a: 'The output is M1’s drain. Going down, M1 needs $V_{ov1}$ above its source P, and P can go no lower than the tail’s $V_{ISS}$. Going up, M3 needs $|V_{ov3}|$ below VDD. Swing per side = what is left: $V_{DD} - |V_{ov3}| - V_{ov1} - V_{ISS}$.' },
      { q: 'Why is the pole only at the output?', a: 'A pole lives at a node with **big R and a capacitor**. The output sees $r_{O1}\\parallel r_{O3}$ (big) and $C_L$. Node P is AC ground for differential signals, and the gates are driven by the source. So one dominant pole: $1/((r_O\\parallel r_O)C_L)$.' },
    ],
    6: [
      { q: 'Which input is inverting in the 5-T OTA?', a: 'Follow a rise. $V_{in1}$ (diode side) ↑ → M1 pulls more → M3 diode carries more → M4 copies more **into** the output → $V_{out}$ ↑: **$V_{in1}$ is non-inverting (+)**. $V_{in2}$ (output side) ↑ → M2 pulls more **out of** the output → $V_{out}$ ↓: **$V_{in2}$ is inverting (−)**. That is why a buffer feeds $V_{out}$ back to **M2’s** gate.' },
      { q: 'Isn’t half the signal wasted with only one output?', a: 'No — that is the mirror’s job. M1’s signal current $+i$ goes through diode M3, M4 copies it into the output; M2 takes $i$ less out of the output. Both add: $2i = g_mv_d$ reaches the output. Nothing is wasted, so $G_m = g_m$.' },
      { q: 'What does each transistor do?', a: 'M1, M2: input pair (each a CS stage into its drain). M3: diode — converts M1’s current into a gate voltage. M4: copy of M3 — a current source to the output (looks like $r_{O4}$). M5: tail current source.' },
    ],
    7: [
      { q: 'Why does the ceiling now have |V_GS3| instead of |V_ov3|?', a: 'M1’s drain is the **diode** node: a diode always sits a whole $|V_{GS3}| = |V_{ov3}| + |V_{thp}|$ below VDD. So M1’s drain is lower than in the current-source version and M1 hits its fence sooner: $V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{th1}$. A diode costs a whole $V_{GS}$; a current source only a $V_{ov}$.' },
      { q: 'Is the floor the same as before?', a: 'Yes: tail $V_{ISS}$ + $V_{GS1}$. Nothing changed below the pair.' },
      { q: 'g_m2 or g_m1 in the gain?', a: 'Same thing ($g_{m1} = g_{m2}$, matched, same current). The page uses $g_{m2}$ because M2 is the device on the output node.' },
    ],
    8: [
      { q: 'Why V_out,min = V_ISS + V_ov2 — doesn’t it depend on the input CM?', a: 'It does. The exact floor is M2’s fence: $V_{out} \\ge V_{in2} - V_{th2}$. The formula assumes the input CM is at its lowest, so P sits at $V_{ISS}$ and M2’s drain may go down to $P + V_{ov2}$. With a higher input CM the floor rises with it.' },
      { q: 'Why no factor 2 here?', a: 'Single output: nothing moves the other way. The 5-T OTA swing is one $V_{DD} - |V_{ov4}| - V_{ov2} - V_{ISS}$.' },
      { q: 'Where is the pole of the mirror node?', a: 'The diode node sees $1/g_{m3}$ (small), so its pole is far away (a “mirror pole”, ≈ $g_{m3}/C$). The output node is the dominant one.' },
    ],
  },
  lec03: {
    0: [
      { q: 'Why does the feedback go to M2 and not M1?', a: 'M2’s gate is the **inverting** input of the 5-T OTA (raising it lowers $V_{out}$). Negative feedback must oppose a change, so $V_{out}$ goes back to M2. Fed to M1 it would be positive feedback.' },
      { q: 'Why is V_out = V_in?', a: 'β = 1, so $V_{out} = V_{in}\\cdot A/(1+A)$. With $A$ large this is ≈ $V_{in}$; the miss is ≈ $1/A$. For the 5-T OTA $A \\approx g_mr_O/2$ (e.g. 25 → 4 % short) — the weak spot that motivates the cascode.' },
      { q: 'Why would anyone want a gain of 1?', a: 'To copy a voltage **without loading it**: the input sees only a gate (∞ resistance), the output can drive a load because its resistance is tiny (next step). Sample-and-holds, reference buffers and ADC drivers all do this.' },
      { q: 'Why is A_open ≈ g_m r_ON/2?', a: '$A = g_m(r_{ON}\\parallel r_{OP})$. If the NMOS and PMOS $r_O$ are about equal, two equal resistances in parallel halve: $r_O/2$.' },
    ],
    1: [
      { q: 'What is R_L doing in the drawing?', a: 'It is a test load: the question is “how much does $V_{out}$ sag when we draw current?” Model the closed loop as a voltage $V_{in}A_{closed}$ behind $R_{out,closed}$. The sag is small only if $R_{out,closed} \\ll R_L$.' },
      { q: 'Why does feedback make R_out small?', a: 'Pull current from the output and it dips; the dip appears at M2’s gate (feedback), the op amp amplifies it by $A$ and pushes back. So the output looks $(1+A)$ times stiffer: $R_{out}/(1+\\beta A)$.' },
      { q: 'How does it cancel to exactly 1/g_m2?', a: '$R_{out,open} = r_{O2}\\parallel r_{O4}$ and $A = g_m(r_{O2}\\parallel r_{O4})$. So $R_{out,closed} = \\frac{r_{O2}\\parallel r_{O4}}{1 + g_m(r_{O2}\\parallel r_{O4})} \\approx \\frac1{g_m}$ — the same as looking into a source.' },
    ],
    2: [
      { q: 'Why does closing the loop make it faster?', a: 'The output pole is $1/(R\\cdot C_L)$. Feedback shrank $R$ from $r_{O2}\\parallel r_{O4}$ to $1/g_{m2}$ while $C_L$ stayed the same, so the pole jumped up to $g_{m2}/C_L$.' },
      { q: 'Is that the same as the GBW?', a: 'Yes. GBW = $A_0\\omega_0 = g_m(r_O\\parallel r_O)\\cdot\\frac{1}{(r_O\\parallel r_O)C_L} = g_m/C_L$. A buffer (gain 1) gets the whole GBW as its bandwidth. In Hz: $g_m/(2\\pi C_L)$.' },
    ],
    3: [
      { q: 'Which of these two is the folded cascode?', a: '**Neither** — both are **telescopic** cascodes (left: fully differential; right: single-ended with a cascode mirror). The folded cascode is introduced only in Lec 5, as the fix for the problems found at the end of this lecture.' },
      { q: 'What does the cascode device actually do?', a: 'It **guards** the device below it: its source barely moves (it looks like $1/g_m$), so the lower device’s drain is held almost still while the output swings. Seen from the output, the resistance is multiplied by $g_mr_O$ (“up multiplies”).' },
      { q: 'Why stack transistors instead of adding a second stage?', a: 'Stacking keeps **one** high-impedance node (one dominant pole: easy to stabilise) while squaring the gain. The cost is headroom — that trade is the whole lecture.' },
    ],
    4: [
      { q: 'Why is the gain squared and then halved?', a: 'Looking down: $r_{O2}$ guarded by M4 → $g_{m4}r_{O4}r_{O2}$. Looking up: $r_{O8}$ guarded by M6 → $g_{m6}r_{O6}r_{O8}$. Equal-sized, so in parallel they halve; times $g_m$: $(g_mr_O)^2/2$. With $g_mr_O = 50$: 1250.' },
      { q: 'Why is the gain written as a magnitude with g_m1,2?', a: '$g_{m1,2}$ = $g_m$ of either input device (matched). The sign is dropped because questions ask for $|A|$.' },
      { q: 'Does the cascode change G_m?', a: 'No: $G_m$ is still $g_{m1,2}$ (all of M2’s signal current goes up through M4’s low-resistance source). Only $R_{out}$ grew.' },
    ],
    5: [
      { q: 'Why five overdrives?', a: 'Each output column from VDD to ground holds M8, M6, M4, M2 and the tail. Each must stay saturated, so each keeps its own $V_{ov}$ (the tail’s is $V_{ISS}$). Whatever is left of VDD is the room the output can move in. ×2 because the differential output swings twice.' },
      { q: 'Why does the single-ended version lose only one |V_thp| when it has two diodes?', a: 'Both diodes take a $|V_{th}|$ (2 lost), but M6’s **drain gets one back** (a PMOS drain may sit $|V_{th}|$ above its gate). Net: 2 − 1 = **1** lost. In the fully differential version $V_{b2}$ is chosen freely: 1 taken, 1 given back = 0 lost.' },
      { q: 'What does |V_thp| actually do?', a: 'It is the gate’s “entry fee”: the gate must be $|V_{th}|$ below the source before any channel forms, and none of that produces current. The drain doesn’t pay it — it only needs $|V_{ov}|$ from the source. So **measured from the gate**, the drain may sit up to $|V_{th}|$ away. That is the “$+|V_{thp}|$” in $V_{out} \\le V_{G6} + |V_{thp}|$.' },
      { q: 'Where is the wasted voltage physically?', a: 'Across the top current source (M8 in the chat figure): the upper diode pins its drain one whole $V_{GS}$ below VDD, but it only needed one $V_{ov}$. The extra $|V_{th}|$ (0.8 V in the example) sits across it doing nothing — the “diode tax”. A wide-swing (low-voltage) cascode mirror removes it.' },
    ],
    6: [
      { q: 'What is node X and why is it fixed?', a: 'X is the drain of M2 (= source of the cascode M4). M4’s gate is held at $V_{b1}$ and it carries a fixed current, so its $V_{GS4}$ is fixed: $X = V_{b1} - V_{GS4}$. X does **not** follow the input — the cascode pins it.' },
      { q: 'Why does the output suddenly have a ceiling?', a: 'In a buffer the output is also **M2’s gate**. M2’s drain X is pinned, and an NMOS needs gate ≤ drain + $V_{th}$. So $V_{out} \\le X + V_{th2} = V_{b1} - V_{GS4} + V_{th2}$. Push $V_{out}$ higher and M2 falls into triode.' },
      { q: 'And the floor?', a: 'M4’s own fence: its drain (= $V_{out}$) ≥ its gate − $V_{th4}$ → $V_{out} \\ge V_{b1} - V_{th4}$. Lower and M4 falls into triode.' },
      { q: 'Why is V_in,CM not equal to X?', a: '$V_{in,CM}$ is on M2’s **gate**, X is on its **drain**: different nodes. For saturation the gate may sit up to $V_{th}$ above the drain, never more. In a buffer the gate is $V_{out}$, which is exactly why the ceiling appears.' },
    ],
    7: [
      { q: 'Why is the window only V_th − V_ov4 wide?', a: 'Ceiling − floor $= (V_{b1} - V_{GS4} + V_{th2}) - (V_{b1} - V_{th4}) = V_{th} - (V_{GS4} - V_{th4}) = V_{th} - V_{ov4}$ (equal $V_{th}$). $V_{b1}$ cancels — so moving $V_{b1}$ only slides the window, it never widens it. About 0.5 V.' },
      { q: 'So what was the point of this lecture?', a: 'One story in four steps: **(1)** a buffer needs a big $A$ (error ≈ 1/A) and the 5-T OTA’s $A$ is small; **(2)** cascoding squares the gain; **(3)** but stacking eats headroom (five overdrives, plus a $|V_{th}|$ with a diode stack); **(4)** and the telescopic is so cramped that, as a buffer, the output has only a ~0.5 V window. Fix → **folded cascode** (Lec 5): the input pair leaves the output column.' },
    ],
  },
  lec04: {
    0: [{ q: 'Is this different from Lec 3’s window?', a: 'No — same two fences (M4 floor, M2 ceiling), same width $V_{th} - V_{ov4}$; this page just shades the band. Exams ask for either limit or the width.' }],
    1: [
      { q: 'Why this order (ID → Vov → W/L → gm → rO)?', a: 'Each spec fixes one quantity: **power** fixes currents; **swing** fixes overdrives; then the square law has only one unknown left (W/L). $g_m$ and $r_O$ follow from $I_D$, $V_{ov}$, λ — and only then can you check the gain. Picking W/L first leaves you guessing.' },
      { q: 'Why is λ_p bigger than λ_n here?', a: 'Given in the spec (0.2 vs 0.1): the PMOS has worse channel-length modulation in this process, so smaller $r_O$ — the PMOS side will limit the gain (step ④).' },
    ],
    2: [{ q: 'Why 1.5 mA per side and not 3.33/2?', a: '$P/V_{DD} = 10\\,\\text{mW}/3\\,\\text{V} = 3.33$ mA is the **total**. Razavi keeps ≈ 0.33 mA for the bias branch that makes $V_{b1..3}$, leaving 3 mA for the tail: 1.5 mA in each half.' }],
    3: [
      { q: 'Where does “1.5 V for the overdrives” come from?', a: '3 V p-p differential → 1.5 V p-p per output. Per side: $V_{DD} - \\text{swing} = 3 - 1.5 = 1.5$ V must cover all five overdrives in the column.' },
      { q: 'Why give the tail the biggest overdrive?', a: 'It carries the most current (3 mA): a big $V_{ov}$ keeps its W/L reasonable. NMOS get the smallest (higher mobility → small $V_{ov}$ is affordable, and a small $V_{ov}$ raises $g_m = 2I_D/V_{ov}$).' },
    ],
    4: [{ q: 'Check the numbers?', a: 'NMOS: $2(1.5\\,\\text{m})/(60\\,\\mu\\cdot0.2^2) = 1250$. PMOS: $2(1.5\\,\\text{m})/(30\\,\\mu\\cdot0.3^2) = 1111$. Tail: $2(3\\,\\text{m})/(60\\,\\mu\\cdot0.5^2) = 400$.' }],
    5: [
      { q: 'How do I get R_up = 111 k and R_down = 666 k?', a: 'NMOS: $g_m = 2I_D/V_{ov} = 15$ mS, $r_O = 1/(0.1\\cdot1.5\\,\\text{m}) = 6.67$ k → $R_{down} = g_mr_O^2 = 666$ k. PMOS: $g_m = 10$ mS, $r_O = 1/(0.2\\cdot1.5\\,\\text{m}) = 3.33$ k → $R_{up} = 111$ k.' },
      { q: 'Why does the PMOS side decide the gain?', a: 'In parallel, **the smaller resistance wins**: $111\\,k\\parallel666\\,k = 95$ k, close to 111 k. $15\\,\\text{mS}\\times95\\,\\text{k} \\approx 1428$.' },
    ],
    6: [
      { q: 'Why doubling L (and W) fixes it without changing the swing?', a: 'W/L stays 1111, so $V_{ov}$ (and the swing budget) is unchanged. But λ ∝ 1/L halves → $r_{OP}$ doubles to 6.67 k → $R_{up} = 10\\,\\text{m}\\cdot(6.67\\,\\text{k})^2 = 444$ k. Gain $= 15\\,\\text{m}(444\\,k\\parallel666\\,k) \\approx 4000$.' },
      { q: 'Why only M5–M8?', a: 'Only the weak (PMOS) side limits the gain. Lengthening the NMOS too would cost area and capacitance (slower) for little extra gain.' },
    ],
  },
  lec05: {
    0: [
      { q: 'What exactly is happening in Ex 9.6?', a: 'The op amp is used **closed-loop through capacitors**. Follow the DC path into M1’s gate: C1 blocks DC from the input, and the gate draws no current, so **no DC current flows in R2** — no voltage drop. M1’s gate sits at exactly the DC level of $V_{out1}$: **input CM = output CM**. You no longer choose the input level.' },
      { q: 'Why does that limit the swing?', a: 'M1 needs X ≥ gate − $V_{th1}$, and the gate is now $V_{out,CM}$. So the lowest X can be biased is $V_{out,CM} - V_{th1}$, and the output must stay $V_{ov3}$ above X: $V_{out,min} = V_{out,CM} - V_{th1} + V_{ov3}$. Each output can fall only **$V_{th} - V_{ov}$ ≈ 0.5 V** below its CM — wherever the CM is.' },
      { q: 'Why does the folded cascode come right after it?', a: 'The root cause is that the input device’s drain X sits in the **same column** as the output. Folding moves X into its own column, set by a bias voltage instead of by the input level — so the output can go down to two overdrives above ground.' },
    ],
    1: [
      { q: 'How can the input device be “upside down” and still work?', a: 'The cascode only needs a **signal current** at its source; it does not care whether it arrives from below or from the side. Flip the input device to the opposite type, feed it with a current source, and its signal current still reaches the cascode and the output.' },
      { q: 'Why is it called folded?', a: 'The current path **turns** at the fold node X: the top source’s current splits, part goes down the input device, the rest turns into the cascode and flows to the output. The signal “folds” at X.' },
    ],
    2: [
      { q: 'Why must the bottom sources carry I_SS1 + I_SS/2?', a: 'KCL at the fold node: the cascode branch current plus the input device’s current both end up in the bottom source. With no signal the input device carries $I_{SS}/2$.' },
      { q: 'What if the input device steals all the current?', a: 'During a big step one input device can take the whole $I_{SS}$. If the branch source is smaller than that, the cascode starves and turns off — the slew rate drops (Lec 14). So design the folding sources ≥ $I_{SS}$.' },
      { q: 'What do I pay for folding?', a: '**Power** (the folding branch burns extra current), **a bit of gain** (the fold node has two $r_O$s in parallel), and an **extra pole** at the fold node. In return: more swing, and a CM range that can reach a rail.' },
    ],
    3: [
      { q: 'Why does R_down use r_O1 ∥ r_O9?', a: 'Below the NMOS cascode M3 is the fold node, where **two** things hang: the bottom source M9 ($r_{O9}$) and the input device M1’s drain ($r_{O1}$). The cascode multiplies whatever sits under it: $g_{m3}r_{O3}(r_{O1}\\parallel r_{O9})$.' },
      { q: 'Is the gain then lower than a telescopic?', a: 'Slightly: $R_{down}$ starts from about $r_O/2$ instead of $r_O$. Typically 2–3× less gain than the telescopic with the same devices.' },
    ],
    4: [
      { q: 'Why does almost all of M1’s current go up?', a: 'At the fold node it can go up into M3’s **source** (≈ $1/g_{m3}$, a few kΩ) or down into $r_{O1}\\parallel r_{O9}$ (hundreds of kΩ). Current divider: the tiny path takes nearly all. So $G_m \\approx g_{m1}$, same as a plain pair.' },
    ],
  },
  lec06: {
    0: [
      { q: 'How can the input CM go below ground?', a: 'For a PMOS the fence is gate ≥ drain − $|V_{th}|$. M1’s drain is the fold node, only $V_{ov9}$ above ground. So the gate may go as low as $V_{ov9} - |V_{thp}|$ — negative if $|V_{thp}| > V_{ov9}$ (e.g. 0.2 − 0.5 = −0.3 V).' },
      { q: 'And the ceiling?', a: 'Walk down from VDD: the PMOS tail needs $|V_{ov11}|$, then M1 needs $|V_{GS1}|$ from its source to its gate: $V_{DD} - |V_{ov11}| - |V_{GS1}|$.' },
    ],
    1: [{ q: 'Same rules, mirrored?', a: 'Yes. NMOS pair: floor = tail + $V_{GS1}$; ceiling = fold-node drain + $V_{th1}$ = $V_{DD} - |V_{ov10}| + V_{th1}$, which can exceed VDD.' }],
    2: [{ q: 'Does the gain stay constant across the CM range?', a: 'No — where both pairs are on, the total $G_m$ roughly doubles; near a rail only one pair works. Real rail-to-rail inputs add tricks to keep $G_m$ constant (not needed for the mid-sem).' }],
    3: [
      { q: 'Why is the folded buffer window so much wider?', a: 'The input pair is no longer in the output column. M2’s drain is the fold node (pinned by a bias), not a node right under the output, so the output can move without dragging M2 out of saturation. You only check two fences and keep the stricter one.' },
      { q: 'Why “keep the higher one”?', a: 'Both conditions are floors ($V_{out} \\ge$ …). The output must satisfy **both**, so the binding one is the larger.' },
    ],
    4: [{ q: 'Why tie M7’s and M8’s gates to X instead of making M7 a diode?', a: 'A diode stack fixes the cascode gate one whole $V_{GS}$ too low and costs the output an extra $|V_{thp}|$. Driving the top gates from X lets $V_{b1}$ be set separately, between $V_{DD} - |V_{GS7}| - |V_{th5}|$ (M5 saturated) and $V_{DD} - |V_{ov7}| - |V_{GS5}|$ (M7 saturated), and the output keeps the full swing.' }],
    5: [{ q: 'What comes next?', a: 'Two ways to more gain without more stacking: a **second stage** (Lec 7) and **gain boosting** (Lec 7–9), which multiplies $R_{out}$ by $(1 + A_1)$.' }],
  },
  lec07: {
    0: [
      { q: 'Why not just keep cascoding for more gain?', a: 'Each cascode costs an overdrive of swing. Two stages split the jobs: stage 1 gives gain, stage 2 (one device to each rail) gives swing. Gains multiply.' },
      { q: 'What is the catch?', a: 'Two high-impedance nodes → **two poles** close together → poor phase margin. That is why two-stage op amps need Miller compensation (Lec 17).' },
    ],
    1: [{ q: 'Is stage 2 inverting?', a: 'Yes — a CS stage. That is what makes Miller compensation work (a capacitor across an inverting gain looks multiplied).' }],
    2: [{ q: 'How do I get the total gain?', a: '$A = A_1A_2$: $A_1$ = the telescopic gain at the first-stage output; $A_2 = g_{m,CS}(r_O\\parallel r_O)$ at the final output. Compute each with Gm·Rout and multiply.' }],
    3: [{ q: 'Why a diode and a mirror in the second stage?', a: 'To turn the differential stage-2 into one output without losing half the signal — same trick as the 5-T OTA.' }],
    4: [{ q: 'Why can’t we raise G_m?', a: '$G_m$ is set by the input device ($g_m = 2I_D/V_{ov}$); more needs more current or a smaller $V_{ov}$ — both limited. $R_{out}$ can be multiplied, so attack $R_{out}$.' }],
    5: [{ q: 'Why does an amplifier before the gate not help?', a: 'With a source resistor the source moves with the current and cancels the extra drive; the result stays limited by $R_S$. Boosting the **input** doesn’t raise $R_{out}$.' }],
    6: [
      { q: 'What is the test source doing?', a: 'To find $R_{out}$, kill the input, apply $V_X$ at the output and measure $I_X$: $R_{out} = V_X/I_X$. The algebra gives $R_S + r_{O2} + g_{m2}(1+A_1)R_Sr_{O2}$.' },
      { q: 'Why (1 + A₁)?', a: 'The amplifier watches the source and drives the gate the **opposite** way, $A_1$ times harder. So the effective $V_{GS}$ change is $(1 + A_1)$ times bigger than without it, and the device fights back $(1 + A_1)$ times harder.' },
    ],
  },
  lec08: {
    0: [{ q: 'So is G_m changed by boosting?', a: 'No useful change: still ≈ $g_{m1}$. Boosting is for $R_{out}$ only.' }],
    1: [{ q: 'Formula to remember?', a: '$R_{out} \\approx (1 + A_1)g_{m2}r_{O2}R_S$ — the plain cascode result times $(1 + A_1)$.' }],
    2: [{ q: 'Why does the source look smaller?', a: 'Up multiplies, down divides — now by $(1 + A_1)g_mr_O$. A stiffer source = a smaller look-in resistance.' }],
    3: [{ q: 'Why is G_m ≈ g_m1?', a: 'M1’s current meets M2’s source, which now looks like almost zero resistance, so all of it goes up (current divider).' }],
    4: [{ q: 'Why (g_m r_O)³?', a: 'Plain cascode $(g_mr_O)^2$; a one-transistor booster has $A_1 \\approx g_mr_O$; multiply → $(g_mr_O)^3$ — a whole extra factor without stacking another device.' }],
    5: [{ q: 'Why is the minimum output V_GS3 + V_ov2?', a: 'The booster M3’s gate is M2’s source, so that node must sit at least $V_{GS3}$ above ground (not just $V_{ov1}$). Then M2 needs $V_{ov2}$ more.' }],
    6: [{ q: 'Why does the PMOS booster fail?', a: 'Its fence forces $V_{GS2} \\le |V_{th3}|$ — M2 would barely be on.' }],
    7: [{ q: 'Why fold the booster?', a: 'Folding fixes the input-level problem and makes the booster a cascode, so $A_1 \\sim (g_mr_O)^2$.' }],
  },
  lec09: {
    5: [{ q: 'Why is the output CM undefined with current-source loads?', a: 'Two current sources in series: if they differ by even 0.1 %, the difference has nowhere to go but the huge output resistance, so the output runs to a rail. With resistor loads the resistors set the level; with sources nobody does. CMFB fixes it.' }],
    1: [{ q: 'Why can one booster serve both sides?', a: 'The two cascode sources move in opposite directions (differential), so one differential amplifier can watch both at once.' }],
    2: [{ q: 'Why does the output floor rise?', a: 'The booster’s tail and its $V_{GS}$ now sit under the cascode source, so the output must stay above them.' }],
  },
  lec10: {
    0: [{ q: 'What do CM and DM mean, concretely?', a: 'CM = the average of the two signals (what both share); DM = half their difference (the signal). A good amplifier amplifies DM and rejects CM.' }],
    1: [{ q: 'Why is a tiny mismatch a big problem?', a: 'The mismatch current $I_X$ flows into $R_P\\parallel R_N$ — hundreds of kΩ or more. 1 µA × 500 kΩ = 0.5 V of CM error.' }],
    2: [{ q: 'Which current source does CMFB adjust?', a: 'Any one in the output path — the tail or the top/bottom sources. The loop adjusts it until $V_{out,CM} = V_{REF}$.' }],
    3: [{ q: 'Why does R lower the gain?', a: 'The sensing resistors hang on the outputs: $R_{out}$ becomes $r_O\\parallel r_O\\parallel R$. If $R$ isn’t huge, the gain drops.' }],
    4: [{ q: 'Why followers?', a: 'They isolate the outputs from the resistors (a gate draws no current); the price is a $V_{GS}$ shift and some swing.' }],
  },
  lec11: {
    1: [{ q: 'When is a MOSFET “a resistor”?', a: 'When $V_{DS} \\ll 2(V_{GS} - V_{th})$: the $V_{DS}^2$ term is negligible and $I_D \\approx \\mu C_{ox}\\frac WL(V_{GS}-V_{th})V_{DS}$ — a resistor $1/(\\mu C_{ox}\\frac WL V_{ov})$.' }],
    2: [{ q: 'Why does only the sum V_out1 + V_out2 appear?', a: 'Conductances in parallel add: $G = \\mu C_{ox}\\frac WL[(V_{out1}-V_{th}) + (V_{out2}-V_{th})]$. A differential signal raises one and lowers the other by the same amount — the sum (the CM) is unchanged.' }],
  },
  lec12: { 1: [{ q: 'How do I use the triode-sensing equation in a question?', a: 'P is fixed by the cascode bias ($V_P = V_{b1} - V_{GS3}$). The tail current $2I_D$ through $R_{tot}$ must drop $V_P$, which fixes $R_{tot}$, which fixes $V_{out1} + V_{out2}$. Solve for the output CM or the W/L.' }] },
  lec13: {
    0: [{ q: 'Why is the slope steepest at t = 0?', a: 'The capacitor charges through R with current $(V_0 - V_{out})/R$; at the start the gap is biggest, so the current (and slope $V_0/\\tau$) is biggest.' }],
    4: [{ q: 'How do I know if a step slews?', a: 'Compare the linear starting slope $V_{step}\\cdot A_{cl}/\\tau$ with $SR = I_{SS}/C_L$. If the linear response would need a faster slope than SR, the output ramps at SR first.' }],
  },
  lec14: {
    0: [{ q: 'Why I_SS/2C_L per side?', a: 'When one input device takes all of $I_{SS}$, each output’s load cap sees a current change of $I_{SS}/2$ relative to balance; the differential output moves twice as fast.' }],
    3: [{ q: 'Why does −180° make negative feedback positive?', a: 'A −180° phase shift is a sign flip: what comes back adds to the input instead of subtracting. If the loop gain is also 1, the signal sustains itself.' }],
  },
  lec15: {
    2: [{ q: 'Which crossover do I use for PM?', a: '$\\omega_{GX}$ — where $|\\beta A| = 1$. Find it first, then add the pole phases there; PM = 180° minus their total.' }],
    3: [{ q: 'Why can one pole never oscillate?', a: 'One pole gives at most −90°, so the loop never reaches −180°.' }],
  },
  lec16: { 2: [{ q: 'Where does 1/(2 sin(PM/2)) come from?', a: 'At $\\omega_{GX}$: $|1 + \\beta A| = |1 + e^{-j(180°-PM)}|$ = the length of the sum of two unit arrows separated by PM = $2\\sin(PM/2)$.' }] },
  lec17: {
    1: [{ q: 'Why does a capacitor across a gain look bigger?', a: 'Its two ends move in opposite directions: input $v$, output $-A_2v$. The voltage across it is $(1+A_2)v$, so it draws $(1+A_2)$ times more current — like a $(1+A_2)$-times bigger capacitor to ground.' }],
    4: [{ q: 'Why is the RHP zero bad?', a: 'It adds gain like a zero but **subtracts** phase like a pole — it eats phase margin. Fix: a nulling resistor in series with $C_c$.' }],
  },
  settling: {
    2: [{ q: 'Why τ = 1/(β ω_u)?', a: 'Closed loop the pole moves to $\\omega_0(1+\\beta A_0) \\approx \\beta A_0\\omega_0 = \\beta\\omega_u$. τ is its inverse.' }],
    4: [{ q: 'Where do 4.6 and 6.9 come from?', a: '$e^{-t/\\tau} = \\varepsilon \\Rightarrow t = \\tau\\ln(1/\\varepsilon)$: $\\ln 100 = 4.6$ (1 %), $\\ln 1000 = 6.9$ (0.1 %).' }],
  },
};

/** Figures woven into a lesson’s Idea step. */
const LF = (...keys: string[]): DoubtFig[] => keys.map((key) => ({ key, cap: '' }));
export const LESSON_FIGS: Record<string, DoubtFig[]> = {
  'l1-gain': LF('s-lec01-feedback'),
  'u10-steering': LF('s-lec02-cmdm'),
  'u10-half': LF('s-lec02-pair'),
  'u10-cmrange': LF('s-lec03-tower', 's-lec02-cm'),
  'u11-ota': LF('s-lec02-ota'),
  'u11-ota-range': LF('s-lec02-cm'),
  'u9-cascode': LF('s-lec05-cascode', 's-lec03-tele'),
  'u9-telescopic': LF('s-lec03-tele', 's-lec03-headroom'),
  'l2-buffer': LF('s-lec03-buffer', 's-lec03-window'),
  'l2-onestage': LF('s-lec03-headroom', 's-lec02-swing'),
  'l2-cmchoice': LF('s-lec05-ex96'),
  'l3-design': LF('s-lec04-design'),
  'l4-folding': LF('s-lec05-fold', 's-lec05-compare', 's-lec06-cm'),
  'l4-gain': LF('s-lec05-folded', 's-lec05-gm', 's-lec06-nfold'),
  'l5-twostage': LF('s-lec07-twostage', 's-lec07-swing'),
  'l6-boost': LF('s-lec08-boost', 's-lec08-compare', 's-lec08-impl'),
  'l7-cmfb': LF('s-lec09-cmfb', 's-lec10-sense'),
  'l8-cmfb': LF('s-lec11-triode'),
  'l8-replica': LF('s-lec12-replica'),
  'u12-settling': LF('s-lec13-rc', 's-lec13-slew'),
  'l1-speed': LF('s-lec13-rc'),
  'u12-poles': LF('s-lec15-bode'),
  'l9-slew': LF('s-lec06-r2r', 's-lec13-slew'),
  'l11-barkhausen': LF('s-lec14-bark'),
  'l11-multipole': LF('s-lec15-bode'),
  'l12-margins': LF('s-lec15-bode'),
  'l12-ringing': LF('s-lec16-pm', 's-lec16-steps'),
  'l13-dominant': LF('s-lec17-comp'),
  'l13-miller': LF('s-lec17-miller'),
};

/** Clarifications woven into the Idea step of a lesson. */
export const LESSON_DOUBTS: Record<string, Doubt[]> = {
  'u9-cascode': [
    { q: 'Why does the cascode behave like a CS stage?', a: 'The input device M1 is still a CS stage turning $v_{in}$ into $g_{m1}v_{in}$. The cascode M2 just passes that current up (its source is ≈ $1/g_m$, so it takes it all) while multiplying the resistance seen from the output. Same $G_m$, much bigger $R_{out}$.' },
    { q: 'Where does R_out ≈ g_m r_O² come from?', a: '“Up multiplies”: looking into a drain with $R_S$ under the source gives $r_O + (1 + g_mr_O)R_S \\approx g_mr_OR_S$. Here $R_S$ is M1’s $r_O$, so $R_{out} \\approx g_{m2}r_{O2}r_{O1}$.' },
    { q: 'What is the load trap?', a: 'The gain is $g_m\\times(R_{down}\\parallel R_{up})$. A huge $R_{down}$ is wasted with a simple PMOS load ($R_{up} = r_O$): the smaller one wins, gain ≈ $g_mr_O$ only. You need a cascode load too.' },
  ],
  'u9-telescopic': [
    { q: 'Is the telescopic the same as the folded cascode?', a: 'No. Telescopic = everything in one straight column (input, cascodes, loads). Folded = the input pair is moved into its own column (Lec 5). Both drawings on your Lec 3 page are telescopic.' },
    { q: 'Why is its swing so small?', a: 'Five devices in each column, each keeping its $V_{ov}$; the single-ended (mirror) version loses one $|V_{thp}|$ more (the diode tax).' },
  ],
  'u10-steering': [
    { q: 'What do V_CM and the current difference mean?', a: '$V_{CM}$: the common level both gates sit at — it does not change the currents (the tail fixes their sum). $v_d = V_{in1} - V_{in2}$: steers current from one side to the other, $\\Delta I = I_{D1} - I_{D2} \\approx g_mv_d$.' },
    { q: 'Why √2·V_ov to switch fully?', a: 'All of $I_{SS}$ in one device needs its overdrive to be $\\sqrt2$ times the balance value (square law: twice the current, √2 the overdrive), while the other device just turns off.' },
  ],
  'u10-half': [{ q: 'Why is P an AC ground for differential signals?', a: 'One side’s current goes up by $i$ exactly as the other goes down by $i$: the tail sees no change, so P doesn’t move. For CM, both move together and P moves — each half then sees $2R_{SS}$.' }],
  'u10-cmrange': [
    { q: 'What is the voltage across the tail current source?', a: 'Whatever is left: $V_P = V_{in,CM} - V_{GS1}$. An ideal current source accepts any voltage; a MOSFET source needs at least its $V_{ov}$ ($V_{ISS}$), which is why the floor is $V_{ISS} + V_{GS1}$.' },
    { q: 'Why does the ceiling use the drain?', a: 'Raising the gate with the drain fixed eventually puts the gate more than $V_{th}$ above the drain → triode. Ceiling = drain + $V_{th}$.' },
  ],
  'u11-ota': [
    { q: 'Which input is inverting?', a: '$V_{in2}$ (output side, M2) is inverting; $V_{in1}$ (diode side) is non-inverting. A buffer therefore wires $V_{out}$ to M2’s gate.' },
    { q: 'Why is G_m = g_m and not g_m/2?', a: 'Both halves of the signal reach the output: M4 copies M1’s $+i$ and M2 takes $i$ less out, so $2i = g_mv_d$.' },
    { q: 'Is “fully differential” better than the 5-T OTA?', a: 'Fully differential: two outputs, twice the swing, but needs CMFB. 5-T OTA: one output, no CMFB needed (the diode sets the levels), but its CM ceiling pays a whole $|V_{GS3}|$.' },
  ],
  'u11-ota-range': [
    { q: 'Why does the ceiling have |V_GS3|?', a: 'M1’s drain is the diode node, a full $|V_{GS3}|$ below VDD. Ceiling = that drain + $V_{th1}$.' },
    { q: 'Why does V_out,min depend on the input CM?', a: 'M2’s fence: $V_{out} \\ge V_{in,CM} - V_{th2}$. The textbook form $V_{ISS} + V_{ov2}$ assumes the input CM is at its lowest.' },
  ],
  'u12-poles': [
    { q: 'How do I find a pole quickly?', a: 'Kill the sources, find each node with a capacitor, find the resistance looking into it (gate ∞, drain $r_O$, source/diode $1/g_m$, smallest in parallel wins), then $\\omega_p = 1/(RC)$. Biggest RC = dominant pole.' },
    { q: 'Why does the gain × bandwidth stay constant?', a: 'Gain ∝ R, bandwidth ∝ 1/R, so the product $g_m/C$ doesn’t depend on R. Only $g_m$ or $C$ changes it.' },
  ],
  'u12-settling': [{ q: 'Is slewing the same as settling?', a: 'No. Settling = the exponential approach ($e^{-t/\\tau}$, small steps). Slewing = a straight ramp at $I/C$ when the step is too big for the pair to stay linear. A big step slews first, then settles.' }],
  'l1-gain': [
    { q: 'How do I get A_min in one line?', a: '$A \\ge A_{closed}/\\varepsilon$ (because $\\varepsilon \\approx 1/(\\beta A)$ and $1/\\beta = A_{closed}$). Gain 10, 1 % → 1000.' },
    { q: 'Exact or approximate?', a: 'Exact: $A \\ge (1/\\varepsilon - 1)/\\beta$ = 990. Approximate: 1000. Either is accepted if you say which.' },
  ],
  'l1-speed': [
    { q: 'What is GBW in plain words?', a: 'A fixed budget: open-loop gain × bandwidth $= \\omega_u = g_m/C_L$ for a one-pole op amp. Closing the loop with gain $1/\\beta$ gives bandwidth $\\beta\\omega_u$.' },
    { q: 'How do I go from settling time to ω_u?', a: '$t_s = \\tau\\ln(1/\\varepsilon)$ and $\\tau = 1/(\\beta\\omega_u)$ → $\\omega_u = \\ln(1/\\varepsilon)/(\\beta t_s)$; divide by $2\\pi$ for Hz.' },
    { q: 'What is slew rate and when does it matter?', a: '$SR = I_{SS}/C_L$ (the most current the stage can push into $C_L$). It matters for **large** steps; check whether the linear starting slope would exceed it.' },
  ],
  'l2-onestage': [
    { q: 'Why does more gain cost swing?', a: 'More gain = more stacked devices (cascodes), and each stacked device keeps one $V_{ov}$ of VDD for itself. Taller stack, more gain, less room.' },
    { q: 'Why is the differential swing 2× the single-ended?', a: 'The two outputs move oppositely by ±$s$, so their difference moves ±$2s$.' },
  ],
  'l2-buffer': [
    { q: 'Why does a telescopic make a poor buffer?', a: 'In a buffer the output is also M2’s gate. M4 needs the output high ($\\ge V_{b1} - V_{th4}$); M2 needs it low ($\\le V_{b1} - V_{GS4} + V_{th2}$). The window is only $V_{th} - V_{ov4}$ ≈ 0.5 V.' },
    { q: 'Does changing V_b1 help?', a: 'No — $V_{b1}$ cancels in the width; it only slides the window up or down.' },
  ],
  'l2-cmchoice': [{ q: 'Why does closing the loop through capacitors force input CM = output CM?', a: 'C blocks DC and the gate draws no current, so the feedback resistor carries no DC current and drops nothing: the gate sits at the output’s DC level.' }],
  'l3-design': [{ q: 'Why fix overdrives from the swing?', a: 'Swing per side = VDD − Σ(overdrives in the column). The required swing tells you how much the overdrives may use in total; split it, then the square law gives W/L.' }],
  'l3-scaling': [{ q: 'Why does a longer device have more gain?', a: '$\\lambda \\propto 1/L$, so $r_O \\propto L$; at fixed W/L and $I_D$ (same $g_m$, same $V_{ov}$), $g_mr_O$ grows with L.' }],
  'l4-folding': [
    { q: 'Where is the folded cascode on my notes?', a: 'Lec 5 (after Ex 9.6) and Lec 6. The Lec 3 circuits are telescopic.' },
    { q: 'Why does folding fix the buffer window?', a: 'The input device’s drain (fold node) is set by a bias, not by the output, so input and output no longer fight over the same half-volt.' },
  ],
  'l4-gain': [{ q: 'Why r_O1 ∥ r_O9 under the NMOS cascode?', a: 'The fold node has both the input device’s drain and the folding source on it; the cascode multiplies their parallel combination.' }],
  'l5-twostage': [{ q: 'How do the gains combine?', a: 'They multiply: $A = A_1A_2$, each found as Gm × Rout of its stage.' }],
  'l6-boost': [{ q: 'Does boosting change G_m?', a: 'No (≈ $g_{m1}$). It multiplies $R_{out}$ by $(1 + A_1)$, so the gain grows by the same factor.' }],
  'l7-cmfb': [{ q: 'Why does a fully differential op amp need CMFB?', a: 'Each output sits between two current sources; any mismatch drives the output CM to a rail. CMFB senses the CM, compares with $V_{REF}$ and corrects a current source.' }],
  'l9-slew': [{ q: 'Why can a folded cascode slew slower than expected?', a: 'If the folding branch current is smaller than $I_{SS}$, a big step turns that branch off and the available current drops.' }],
};

/** Remaining later-lecture steps, so every step of every lecture has its doubts answered in place. */
const MORE: Record<string, Record<number, Doubt[]>> = {
  lec09: {
    0: [{ q: 'What is A_aux in the formula?', a: 'The booster’s own gain = its $G_m$ × its $R_{out}$. Plug it in as $A_1$: $R_{out} \\approx (1 + A_{aux})g_mr_Or_O$.' }],
    3: [{ q: 'Why use a whole folded cascode as the booster?', a: 'It gives a large $A_{aux}$ ($\\sim(g_mr_O)^2$) and its input CM range can reach the low (or high) level where the cascode source sits.' }],
    4: [{ q: 'Why PMOS-input booster for the NMOS cascodes?', a: 'The NMOS cascode sources sit low (near ground + a few overdrives); a PMOS-input amplifier accepts inputs near ground. The PMOS cascodes sit high, so their booster needs an NMOS input.' }],
  },
  lec11: {
    0: [{ q: 'Why put the sensing devices at the bottom?', a: 'There they replace the tail: their total resistance sets the tail current, so the output CM directly controls the current — that is the feedback loop.' }],
    3: [{ q: 'Saturation vs triode — which is which here?', a: 'Sensing devices M10, M11: deep **triode** (resistors set by their gates). Everything else: saturated (current sources).' }],
    4: [{ q: 'Why only for small swings?', a: 'The pair’s currents go as squares of $(V_{REF} - V_{out})$; for big swings the square terms don’t cancel and the sensed “CM” is wrong.' }],
    5: [{ q: 'How accurate is CMFB?', a: 'Like any feedback loop: CM error ≈ 1/(loop gain).' }],
  },
  lec12: {
    0: [{ q: 'Tail or bottom sources — does it matter?', a: 'Either works; the choice affects the CMFB loop’s speed and how much headroom the control device takes.' }],
    2: [{ q: 'Why (W/L)₁₅ = (W/L)₁₂ + (W/L)₁₃?', a: 'M15 copies the two sensing devices in parallel (widths add) with $V_{REF}$ on its gate; balance is reached only when the outputs average to $V_{REF}$.' }],
    3: [{ q: 'What is the copy error?', a: 'If the replica’s $V_{DS}$ differs from the real devices’, $r_O$ effects make their currents differ. M17, M18 equalise the $V_{DS}$.' }],
  },
  lec13: {
    1: [{ q: 'Why is τ divided by (1 + βA)?', a: 'Feedback lowers the output resistance by $(1+\\beta A)$ (Lec 3), and $C_L$ is unchanged, so $R\\cdot C$ falls by the same factor.' }],
    2: [{ q: 'What is the final value?', a: 'The closed-loop gain × the step: $V_0A/(1+\\beta A) \\approx V_0/\\beta$.' }],
    3: [{ q: 'Why does a small step stay linear?', a: 'A small $\\Delta V$ only steers $\\pm g_m\\Delta V/2$ — both input devices stay on, so the small-signal model holds.' }],
  },
  lec14: {
    1: [{ q: 'Why can the folded cascode slew slower?', a: 'If a folding branch must carry $I_P - I_{SS} < 0$, it turns off and the output current is limited by $I_P$, not $I_{SS}$.' }],
    2: [{ q: 'Is loop gain the same as open-loop gain?', a: 'Loop gain = $\\beta A$ (the gain once round the loop). For a buffer (β = 1) they coincide.' }],
    4: [{ q: 'How do I add phases?', a: 'Each pole contributes $-\\tan^{-1}(\\omega/\\omega_p)$ (degree mode). Add them at the frequency you care about.' }],
  },
  lec15: {
    0: [{ q: 'Why does phase start dropping before the pole?', a: 'Each pole’s phase goes from 0° to −90° over two decades: −6° at $0.1\\omega_p$, −45° at $\\omega_p$, −84° at $10\\omega_p$.' }],
    1: [{ q: 'Why is a buffer the hardest to stabilise?', a: 'β = 1 gives the highest loop-gain curve: it crosses 0 dB last, where more phase has already been eaten.' }],
    4: [{ q: 'How close may the second pole be?', a: 'For PM ≈ 60° the second pole should be about 1.7× above the crossover (≈ 2× the GBW is a common rule for 63°).' }],
  },
  lec16: {
    0: [{ q: 'Why −40 dB/dec after the second pole?', a: 'Each pole contributes −20 dB/dec; after both, −40.' }],
    1: [{ q: 'Where exactly do I read PM?', a: 'At the frequency where the loop-gain magnitude crosses 0 dB; PM = 180° − |phase| there.' }],
    3: [{ q: 'Why does 60° give no peak?', a: '$2\\sin(30°) = 1$, so $|1 + \\beta A| = 1$ at crossover — the closed-loop gain there equals $1/\\beta$ exactly.' }],
    4: [{ q: 'Peaking vs ringing?', a: 'The same thing in two domains: a peak in the frequency response ↔ overshoot and ringing in the step response.' }],
    5: [{ q: 'Why draw the 1/β line?', a: 'In dB, $|\\beta A| = |A| - |1/\\beta|$; the loop gain is 0 dB exactly where the $|A|$ curve meets the $1/\\beta$ line.' }],
  },
  lec17: {
    0: [{ q: 'How far must the dominant pole move?', a: 'So that the loop gain reaches 0 dB at (or before) the second pole: $f_D = f_{gx}/(\\beta A_0)$.' }],
    2: [{ q: 'Why does a small C_c give such a low pole?', a: 'Miller multiplies it by $(1 + A_2)$: e.g. 1 pF × 100 looks like 100 pF at stage 1’s output.' }],
    3: [{ q: 'Which nodes give the two poles?', a: 'Stage 1’s output P (big $r_O\\parallel r_O$) and the final output Q (big $r_O\\parallel r_O$, $C_L$). Both high-impedance → both low poles.' }],
  },
  settling: {
    0: [{ q: 'What does “within 1 %” mean?', a: 'The output must be within 1 % of its final value: $e^{-t/\\tau} \\le 0.01$.' }],
    1: [{ q: 'Is the closed loop still one pole?', a: 'Yes — one-pole op amp in feedback = one pole, moved up by $(1 + \\beta A_0)$.' }],
    3: [{ q: 'What is a in a·A_dc?', a: 'The input step height. Output = step × closed-loop gain × $(1 - e^{-t/\\tau})$.' }],
  },
};
for (const [pg, steps] of Object.entries(MORE)) WALK_DOUBTS[pg] = { ...(WALK_DOUBTS[pg] ?? {}), ...steps };
