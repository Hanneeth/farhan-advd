/**
 * The words for every step of every lecture walk, in one fixed shape:
 *   see — what is in the boxed part of your page (so you know what you are looking at);
 *   why — the idea the way Razavi argues it: intuition first, "by inspection", then the formula.
 * Formulas and memory lines stay in walk.ts (f, m). Order matches walk.ts steps exactly.
 */
export interface StepText {
  see: string;
  why: string;
}

export const WALK_TEXT: Record<string, StepText[]> = {
  lec01: [
    {
      see: 'The problem statement (gain 10, error under 1%) and a one-transistor amplifier with $A_v = -g_mR_D$.',
      why: 'Razavi starts here on purpose: one transistor *can* give a gain of 10, but $g_m$ moves with temperature, process and signal level, so the gain is never exactly 10. The cure is not a better transistor — it is **feedback**: use a very large, sloppy gain and let two resistors decide the final gain.',
    },
    {
      see: 'The op amp with $R_1$, $R_2$ around it, and the same divider redrawn on its own with $V_f$ across $R_2$.',
      why: 'Follow the signal round the loop: the output is divided down by $R_1$, $R_2$ and fed back to the − input. **β is just the divider ratio** — what fraction of the output the op amp gets to "see" and compare with the input.',
    },
    {
      see: '$A_{closed} = A/(1+\\beta A)$ and $A_{ideal} = 1/\\beta = 1 + R_1/R_2 = 10$.',
      why: 'If $A$ were infinite, the op amp would force its two inputs equal, so $\\beta V_{out} = V_{in}$ and the gain is exactly $1/\\beta$. A real $A$ is finite, so the inputs differ by a tiny $V_{out}/A$ and the gain falls slightly short: $A/(1+\\beta A)$. Notice the resistors set the gain; $A$ only decides **how close** we get.',
    },
    {
      see: 'Error defined as $(A_{ideal}-A_{actual})/A_{ideal}$, and the exact inequality giving $A \\ge 990$ → 1000.',
      why: 'Error is simply "how far short, as a fraction". Put β = 1/10 in and ask for ≤ 1%: the exact answer is 990, and since nobody builds 990, round up to **1000**.',
    },
    {
      see: 'The algebra: $\\varepsilon = (1/\\beta - A/(1+\\beta A))/(1/\\beta)$ simplifying to $1/(1+\\beta A)$.',
      why: 'Common denominator, the $\\beta A$ terms cancel, and the error is **one over (one plus the loop gain)**. The loop gain $\\beta A$ is the hero of this chapter: more loop gain, less error.',
    },
    {
      see: '$\\varepsilon \\approx 1/(\\beta A)$, then $0.01 \\ge 10/A$, so $A \\ge 1000$.',
      why: 'Because $\\beta A \\gg 1$, drop the 1. Now the design rule is one line: **open-loop gain = closed-loop gain ÷ allowed error**. Razavi uses exactly this to explain why op amps need gains of thousands.',
    },
  ],
  lec02: [
    {
      see: 'The list of specs: gain, bandwidth, output swing, linearity, noise, offset.',
      why: 'Razavi’s point: an op amp is never "best" at everything. A design is a set of trade-offs — more gain costs swing, more swing costs noise and speed. Every later lecture improves one item and pays with another.',
    },
    {
      see: 'The single-pole Bode plot: flat at $A_0$, falling after $\\omega_0$, reaching 1 at $\\omega_u$; and $\\omega_u = A_0\\omega_0$.',
      why: 'Past the pole the gain falls in proportion to frequency, so gain × frequency stays constant. That constant is the **GBW**: if you want more bandwidth in closed loop, you give up gain one-for-one.',
    },
    {
      see: 'The margin note $V_{DS} \\ge V_{GS} - V_{th}$, i.e. $V_D \\ge V_G - V_{th}$.',
      why: 'This one line is the whole of "headroom". Razavi phrases it: the drain may fall to one threshold **below** the gate before the device leaves saturation. Every CM-range and swing limit in the course is this fence applied to one transistor.',
    },
    {
      see: 'The fully differential pair M1, M2 with PMOS current-source loads M3, M4, tail $I_{SS}$ and two $C_L$.',
      why: 'Replace the drain resistors by current sources: a current source is a very large resistance ($r_O$), so the gain jumps, and it does not eat a big DC drop like a resistor would.',
    },
    {
      see: '$A_v = g_{m1,2}(r_{O1,2}\\parallel r_{O3,4})$ and the two input CM limits.',
      why: 'By inspection: the input device turns $v_{in}$ into $g_mv_{in}$, and that current meets $r_O$ looking down and $r_O$ looking up — in parallel. For the CM range, push the input down until the tail runs out of room ($V_{ISS} + V_{GS1}$), and up until M1’s gate is one $V_{th}$ above its drain.',
    },
    {
      see: 'Each output’s max and min, $V_{out} = V_{out1} - V_{out2}$, the swing $2(V_{DD} - |V_{ov3}| - V_{ov1} - V_{ISS})$, and the bandwidth.',
      why: 'An output can rise until its PMOS has only $|V_{ov}|$ left and fall until M1 and the tail are at their edges. Because the two outputs move in **opposite** directions, the differential output swings **twice** that range — the big reason Razavi likes fully differential circuits.',
    },
    {
      see: 'The five-transistor OTA: diode-connected M3 mirrored by M4, single output $V_{out}$.',
      why: 'Single-ended output, but Razavi shows nothing is wasted: the mirror copies M1’s signal current to the output, where it **adds** to M2’s. So one output gets the full $g_mv_{in}$. Polarity to remember: raising $V_{in1}$ (diode side) raises $V_{out}$, raising $V_{in2}$ (output side) lowers it — **M2’s gate is the − input**.',
    },
    {
      see: '$A_v = g_{m2}(r_{O2}\\parallel r_{O4})$ and its CM range, with $|V_{GS3}|$ in the ceiling.',
      why: 'Same gain as one side of the differential pair (the mirror recovers the lost half). The ceiling is lower than before because M1’s drain now sits at the diode: a full $|V_{GS3}|$ below VDD, not just $|V_{ov}|$.',
    },
    {
      see: '$V_{out,max} = V_{DD} - |V_{ov4}|$, $V_{out,min} = V_{ISS} + V_{ov2}$, the swing and the bandwidth $1/((r_{O2}\\parallel r_{O4})C_L)$.',
      why: 'Read the output column top to bottom: M4 needs $|V_{ov4}|$, M2 needs $V_{ov2}$, the tail needs $V_{ISS}$. What is left is the swing. The only high-resistance node is the output, so it carries the only important pole.',
    },
  ],
  lec03: [
    {
      see: 'The op amp in unity feedback, the 5-T OTA with $V_{out}$ wired to the − input, and $A_{closed} = A_{open}/(1+A_{open}) \\approx 1$.',
      why: 'β = 1: the whole output is fed back — to **M2’s gate**, because M2 (output side) is the inverting input. The op amp keeps adjusting until $V_{out}$ equals $V_{in}$ to within $1/A$. That is a **buffer**: it copies a voltage without loading it (the input sees only a gate) and drives loads (the output becomes stiff). Its weak spot is accuracy: the 5-T OTA’s $A \\approx g_mr_O/2$ is small (≈ 25 → 4 % short). Hold on to that — it is why this lecture moves on to the cascode.',
    },
    {
      see: 'The Thevenin picture ($V_{in}A_{closed}$ behind $R_{out}$ driving $R_L$) and $R_{out,closed} = R_{out,open}/(1+\\beta A) = 1/g_{m2}$.',
      why: 'Razavi’s intuition: if the output sags under load, the loop sees it and pushes back with the full open-loop gain. So feedback makes the output **stiffer by the loop gain**. For the OTA the numbers cancel neatly to $1/g_{m2}$ — the same as looking into a source.',
    },
    {
      see: '$\\omega_{p,open} = 1/((r_{O2}\\parallel r_{O4})C_L)$ and $\\omega_{out,closed} = g_{m2}/C_L$.',
      why: 'The output pole is "resistance at the node × $C_L$". Close the loop and the resistance drops to $1/g_{m2}$, so the pole moves up to $g_{m2}/C_L$ — exactly the GBW. Feedback trades gain for speed, as the GBW said it would.',
    },
    {
      see: 'Two telescopic op amps: fully differential (M1–M8 + tail) and single-ended with a cascode mirror.',
      why: 'To raise gain without a second stage, Razavi **cascodes**: stack a common-gate device on each transistor. Each cascode **guards** the device below it (holds its drain still) and multiplies the resistance by $g_mr_O$ — "up multiplies". Both circuits on this page are **telescopic** (one straight column); neither is the folded cascode, which comes in Lec 5.',
    },
    {
      see: '$A_{open} = g_{m1,2}[g_{m4}r_{O4}r_{O2} \\parallel g_{m6}r_{O6}r_{O8}] = (g_{mN}r_{ON})^2/2$.',
      why: 'Looking down: $r_O$ multiplied by $g_mr_O$. Looking up: the same. Equal resistances in parallel halve. So the gain is the intrinsic gain **squared, then halved** — hundreds become tens of thousands.',
    },
    {
      see: 'The swing $2[V_{DD} - (|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ISS})]$ and the mirror version with an extra $|V_{th}|$.',
      why: 'The price of stacking: every device in the column needs its own overdrive, so the output has five overdrives less room (×2 for the differential output). In the mirror-loaded version the cascode gate is set by **two diodes**: each takes a whole $|V_{GS}| = |V_{ov}| + |V_{thp}|$, but the output (a PMOS drain) may sit $|V_{thp}|$ above that gate and gets **one** back. Net loss: exactly one $|V_{thp}|$ — the **diode tax**, sitting wasted across the top current source.',
    },
    {
      see: 'The two saturation conditions when $V_{out}$ is tied to M2’s gate: ① for M4 and ② for M2.',
      why: 'In a buffer the output is also an **input**. M4 still needs the output high enough ($V_{out} \\ge V_{b1} - V_{th4}$). But M2’s gate now rises with $V_{out}$ while its drain X is pinned at $V_{b1} - V_{GS4}$ — so M2 leaves saturation if the output rises too far. Two fences, from opposite sides.',
    },
    {
      see: 'The sketch of the band between $V_{b1} - V_{th4}$ and $V_{b1} - V_{GS4} + V_{th2}$.',
      why: 'Subtract the two limits: the window is only $V_{th} - V_{ov4}$, about half a volt, and moving $V_{b1}$ only slides it ($V_{b1}$ cancels). The whole lecture in one line: **a buffer needs big $A$ → cascoding gives it → stacking eats swing → and as a buffer the telescopic has only a half-volt window**. The fix is the folded cascode (Lec 5), which takes the input pair out of the output column.',
    },
  ],
  lec04: [
    {
      see: 'The telescopic buffer again, the derivation of both limits, and the shaded band.',
      why: 'Same two fences as Lec 3, drawn as a picture: the output may only live in the shaded strip under $V_{b1}$.',
    },
    {
      see: 'The spec list for Razavi Ex 9.7 and the order ① ID ② Vov ③ W/L ④ gm ⑤ rO.',
      why: 'Razavi’s design method is a fixed order: **currents come from power**, **overdrives come from swing**, **sizes come from the square law**, and only then do you check the gain. Never pick W/L first.',
    },
    {
      see: 'The circuit with its bias branch, and $P = V_{DD}I_{total}$ → 3.33 mA → 1.5 mA per side.',
      why: 'Power is the first budget: 10 mW at 3 V is 3.33 mA in total. Keep a little for the bias generator, give the rest to the tail — 1.5 mA in each half.',
    },
    {
      see: 'The swing equation solved for the sum of overdrives, then the choice 0.5 / 0.3 / 0.2 V.',
      why: 'Swing is the second budget: each output must move 1.5 V, so all five overdrives together may use only the other 1.5 V. Give the most to the tail (it carries the most current) and the least to the NMOS (they have the higher mobility).',
    },
    {
      see: 'The square law solved for each W/L: 1250, 1111 (≈ 555/0.5), 400.',
      why: 'With $I_D$ and $V_{ov}$ fixed, W/L is no longer a choice — it is forced by $I_D = \\frac12\\mu C_{ox}\\frac WL V_{ov}^2$.',
    },
    {
      see: '$A_v = g_{m1,2}(R_{up}\\parallel R_{down})$ with $g_m$, $r_O$ worked out, giving 1428 — "needs to be improved".',
      why: 'Now check. The PMOS side has the bigger λ, so its $r_O$ and $R_{up}$ are small, and **the smaller resistance in parallel wins**. The gain falls short of 2000 because of the PMOS side alone.',
    },
    {
      see: '$g_mr_O \\propto \\sqrt{WL/I_D}$, λ ∝ 1/L, L = 1 µm for M5–M8, new $R_{up}$ and $A_v ≈ 4000$.',
      why: 'Razavi’s fix: **make the weak devices longer**. Doubling W and L keeps W/L (so the overdrive and the swing do not change) but halves λ, doubling $r_O$. Only the side that limits the gain needs it.',
    },
  ],
  lec05: [
    {
      see: 'A fully differential op amp closed through $C_1R_1R_2$ / $C_2R_3R_4$, and its telescopic version.',
      why: 'Follow the DC path into M1’s gate: $C_1$ blocks DC from the input and the gate draws no current, so **no DC current flows through $R_2$** and it drops nothing. M1’s gate therefore sits exactly at $V_{out1}$’s DC level: **input CM = output CM**, and you can no longer choose the input level. In the telescopic that forces X ≥ $V_{out,CM} - V_{th1}$, so each output can fall only $V_{th1} - V_{ov3}$ ≈ 0.5 V below its CM — wherever the CM is (Razavi Ex 9.6). That is exactly the problem folding solves next.',
    },
    {
      see: 'A cascode (M1 under M2) redrawn with M1 flipped and feeding M2’s source from the side, plus the PMOS version.',
      why: 'The idea of **folding**: the cascode device only needs a signal current at its source; it does not care whether that current comes from below or from the side. So turn the input device upside down and plug it in sideways — the input no longer sits in the output stack.',
    },
    {
      see: 'A differential pair folded the same way, with $I_{SS1}$ on top and $I_{SS2}$ at the bottom.',
      why: 'Do it to a whole pair. The bottom sources now carry their own branch current **plus** half the tail, because the folded current has to go somewhere.',
    },
    {
      see: 'The PMOS-input folded cascode (M1–M11) and the arrows for $R_{up}$, $R_{down}$.',
      why: 'Looking up: an ordinary PMOS cascode, $g_mr_Or_O$. Looking down: the NMOS cascode — but its source node is the fold node, where M1’s $r_O$ hangs in parallel with the bottom source. So $R_{down}$ uses $r_{O1}\\parallel r_{O9}$.',
    },
    {
      see: 'The fold node redrawn as a current divider between $1/g_{m3}$ and $r_{O1}\\parallel r_{O9}$, giving $G_m \\approx g_{m1}$.',
      why: 'M1’s signal current reaches the fold node and must choose: up into M3’s source (about $1/g_{m3}$ — easy) or down into $r_O \\parallel r_O$ (hard). Nearly all goes up, so the folded cascode has the same $G_m$ as a plain pair.',
    },
  ],
  lec06: [
    {
      see: 'The PMOS-input folded cascode and the input CM limits: max $V_{DD} - |V_{ov11}| - |V_{GS1}|$, min $V_{ov9} - |V_{thp}|$ (= −0.3 V).',
      why: 'Folding moved M1’s drain down to the fold node, near ground. A PMOS stays saturated until its gate is $|V_{th}|$ **below** its drain — so the input can sit **below ground**. Razavi calls this the main gift of folding.',
    },
    {
      see: 'The NMOS-input folded cascode, its gain and CM limits.',
      why: 'The mirror image: NMOS pair folded into PMOS sources at the top. Now M1’s drain is near VDD, so the CM range extends **above** VDD.',
    },
    {
      see: 'An NMOS pair and a PMOS pair both folded into the same cascode branches.',
      why: 'Put both pairs in parallel: near ground the PMOS pair works, near VDD the NMOS pair works, in the middle both do. Together they accept **any** input CM — the rail-to-rail input of handout L9.',
    },
    {
      see: '"If we short output with one of the input": the fences for M4 and M2 with $V_{out}$ on M2’s gate.',
      why: 'The buffer question again, for the folded cascode. Write each fence with the output as M2’s gate; the stricter one (here $V_{b2} - V_{th4}$) is the real floor. Because the input pair is no longer in the output stack, the window is much wider than in the telescopic.',
    },
    {
      see: 'A telescopic whose top devices M7, M8 have their gates tied to X (the drain of M5), with $V_{b1} = V_{DD} - |V_{GS7}| - |V_{th5}|$ and $V_{P,max} = V_{DD} - |V_{ov7}|$.',
      why: 'A low-voltage cascode load: the top gates come from X, not from a diode, so $V_{b1}$ can sit between two fences and the output keeps its full swing. (Your last line should read $+|V_{th7}|$.)',
    },
    {
      see: '"Gain Boosting" and $A_v = G_mR_{out}$.',
      why: 'The next topic in one line: if gain is $G_m \\times R_{out}$, and $G_m$ is set by the input device, then the way to more gain is a bigger $R_{out}$.',
    },
  ],
  lec07: [
    {
      see: 'The two-stage op amp with the red loop (stage 1) and the green loops (stage 2), and $A_1$, $A_2$, $A = A_1A_2$.',
      why: 'Razavi’s argument: a cascode buys gain but every stacked device steals swing. So **separate the jobs** — stage 1 for gain, stage 2 (a simple CS stage, one device to each rail) for swing. Gains in cascade multiply.',
    },
    {
      see: 'The block diagram: high-gain amplifier → high-swing amplifier.',
      why: 'That is the whole two-stage idea in one picture.',
    },
    {
      see: 'A telescopic first stage driving CS stages M9, M10 with sources M11, M12, and the two-pole Bode sketch.',
      why: 'Use the telescopic for stage 1 to get a very large $A_1$. The cost is visible in the sketch: two high-impedance nodes mean **two poles**, and the phase drops fast — which is why two-stage op amps need compensation (Lec 17).',
    },
    {
      see: 'The single-ended version with M11 as a diode and M12 its mirror.',
      why: 'Mirror the left second stage to the right so one output carries the full differential gain, just as the 5-T OTA did for one stage.',
    },
    {
      see: '$A_v = G_m \\times R_{out}$ with "very hard to improve" / "needs to be improved", and the stacked cascode with its resistances.',
      why: '$G_m$ is pinned by the input device. $R_{out}$ can grow: each cascode multiplies it by $g_mr_O$. But each also costs an overdrive of headroom — so Razavi asks: can we get the multiplication **without** stacking?',
    },
    {
      see: 'An amplifier $A_1$ in front of M1/M2 with $R_S$, and the algebra ending in "No improvement".',
      why: 'First try: amplify the input before the transistor. With a source resistor, the source moves with the current and cancels the extra drive — the result is still limited by $R_S$. **Boosting the input does not help.**',
    },
    {
      see: 'The amplifier sensing M2’s source and driving its gate, with a test source $V_X$, $I_X$ and the result $R_S + r_{O2} + g_{m2}(1+A_1)R_Sr_{O2}$.',
      why: 'Second try — the one that works: let the amplifier **watch the source** and push the gate the opposite way. If the drain tries to move the source, the gate is pulled $A_1$ times harder against it, so M2 fights back $(1 + A_1)$ times harder: $R_{out}$ is multiplied by $(1 + A_1)$.',
    },
  ],
  lec08: [
    {
      see: 'The Gm derivation with $V_G = (V_{in} - I_{out}R_S)A_1$, $V_S = I_{out}R_S$, ending at $A_1g_m/(R_S + (1+A_1)g_mr_OR_S)$.',
      why: 'Redone carefully, the conclusion is the same: the auxiliary amplifier does not raise $G_m$ in any useful way. Its job is the **output resistance**.',
    },
    {
      see: '$R_{out} = R_S + r_O + (1+A_1)g_mR_Sr_O$.',
      why: 'The boosted output resistance from Lec 7 — the multiplication by $(1 + A_1)$.',
    },
    {
      see: 'Looking into M1’s source with and without the amplifier: $\\frac{R_D + r_O}{1 + g_mr_O}$ becomes $\\frac{R_D + r_O}{1 + (1+A_1)g_mr_O}$.',
      why: 'The same "fight back" seen from below: the source of a boosted device is $(1+A_1)$ times **stiffer**, so the resistance looking into it is $(1+A_1)$ times smaller. Up multiplies, down divides — now by $(1+A_1)g_mr_O$.',
    },
    {
      see: 'The boosted cascode (M2 boosted on M1) and $I_{out} = g_{m1}V_{in}\\frac{r_{O1}}{r_{O1} + 1/((1+A_1)g_{m2})}$, with the current-divider box.',
      why: 'M1’s current arrives at M2’s source, which now looks like almost zero resistance, so all of it goes up to the output: $G_m \\approx g_{m1}$ — boosting does not cost any $G_m$.',
    },
    {
      see: '$R_{out} ≈ (1+A_1)g_{m2}r_{O1}r_{O2}$, gain $\\approx g_{m1}(1+A_1)g_{m2}r_{O1}r_{O2} \\approx (g_mr_O)^3$.',
      why: 'Put it together: a plain cascode gives $(g_mr_O)^2$; boost it with a one-transistor amplifier ($A_1 = g_mr_O$) and you get $(g_mr_O)^3$ — a third "stage" of gain with **no extra device in the output stack**.',
    },
    {
      see: 'Implementation 1: M3 with current source $I_2$ (circled), "Minimum voltage = $V_{GS3}$ and not $V_{ov1}$", the gain and $V_{out,min} = V_{GS3} + V_{ov2}$.',
      why: 'The simplest booster is a common-source stage M3: gate on M2’s source, drain on M2’s gate. It works — but it forces M2’s source up to $V_{GS3}$, so the output cannot fall as low as before. That lost headroom is the **disadvantage** your page marks.',
    },
    {
      see: 'Implementation 2: a PMOS M3 as the booster, its saturation condition and $V_{GS2} \\le |V_{th3}|$.',
      why: 'Try a PMOS booster to avoid the headroom loss. Its saturation fence says M2’s gate cannot be more than $|V_{th3}|$ above its source — so M2 would have to run with $V_{GS2} \\le |V_{th}|$, i.e. barely on. It does not work well.',
    },
    {
      see: 'Implementation 3: PMOS M3 folded into NMOS cascode M4 with $I_2$, $I_3$; $A_v = G_m(1+A_1)\\ldots$ and $A_1 = g_{m3}g_{m4}r_{O4}r_{O3}$.',
      why: 'Fold the PMOS booster into an NMOS cascode (Lec 5’s trick): the input-level problem disappears and the booster itself becomes a cascode, so $A_1$ is $(g_mr_O)^2$-sized.',
    },
  ],
  lec09: [
    { see: 'The circled folded booster and the gain formulas with $A_{aux} = G_{m,aux}R_{out,aux}$.', why: 'The booster is just another amplifier: its gain is its own $G_m$ times its own $R_{out}$.' },
    { see: 'A pair with a booster on each cascode, and the equivalent with one differential booster.', why: 'The two sides move in opposite directions, so one differential amplifier can watch both cascode sources at once.' },
    { see: 'A booster built from a pair with its own tail, and $V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}$.', why: 'The booster’s own tail and $V_{GS}$ sit under the output, so the output floor rises.' },
    { see: 'A full folded cascode used as the booster, and its $A_{aux}$.', why: 'Use the best single-stage amplifier we have as the booster: the folded cascode.' },
    { see: 'A telescopic with both cascodes boosted, notes "NMOS input" / "PMOS input".', why: 'Each booster’s input must sit where its cascode source sits: low for the NMOS cascodes (PMOS-input booster), high for the PMOS cascodes (NMOS-input booster).' },
    { see: '"Common Mode Feedback" with the resistor-loaded pair, the current-source-loaded pair and the $I_P$/$I_N$ picture.', why: 'With resistors, $V_{DD} - R_DI_{SS}/2$ fixes the output CM. With two current sources in series, nothing does — any mismatch drives the output to a rail.' },
  ],
  lec10: [
    { see: 'Inputs split into $(V_{in1}+V_{in2})/2 \\pm (V_{in1}-V_{in2})/2$, and the two sine waves.', why: 'Every input pair is a common part plus a difference part. The amplifier should amplify only the difference; CMFB looks after the common part of the output.' },
    { see: '$I_P = I_N + I_X$ with $R_P$, $R_N$.', why: 'The mismatch current has nowhere to go except the huge output resistance — so a tiny mismatch is a huge voltage error.' },
    { see: 'The general structure: CM sensing circuit → CMFB amplifier with $V_{REF}$ → tail source.', why: 'Razavi’s three blocks: **sense** the output CM, **compare** it with $V_{REF}$, **correct** one current source.' },
    { see: 'Two resistors between the outputs, superposition, and the gain with $R_1$ in parallel.', why: 'Equal resistors average the outputs. But they hang on the outputs, so they lower the gain — the price of the simplest sensor.' },
    { see: 'Followers M5, M6 before the resistors, with node levels 0.9 V and 0.5 V.', why: 'Buffer the outputs first so the resistors do not load them; the sensed level is one $V_{GS}$ lower, and the followers cost output swing.' },
  ],
  lec11: [
    { see: 'The telescopic with triode devices M10, M11 at the bottom, gates on the outputs.', why: 'Use the outputs to control a resistor in the tail.' },
    { see: 'Deep-triode $I_D$ and $R_{on} = 1/(\\mu C_{ox}\\frac WL(V_{GS}-V_{th}))$.', why: 'With tiny $V_{DS}$ a MOSFET is a resistor whose value the gate sets.' },
    { see: '$R_{total,P} = R_{on10}\\parallel R_{on11}$ with $V_{out1} + V_{out2}$.', why: 'In parallel, the two resistances depend only on the **sum** of the outputs — exactly the CM. Differential signals cancel in the sum.' },
    { see: 'VCCS note and the M10/M11 pair.', why: 'Saturated = current source set by the gate; deep triode = resistor set by the gate.' },
    { see: 'A differential-pair sensor with $V_{REF}$ and $I_D \\propto (V_{REF}-V_{out})^2$.', why: 'Comparing each output with $V_{REF}$ in a pair works, but the square law makes it nonlinear — fine only for small swings.' },
    { see: '"Feedback mechanism and comparison": two complete CMFB loops.', why: 'CMFB is ordinary negative feedback, so its error is about 1/(loop gain) — the Lec 1 idea again.' },
  ],
  lec12: [
    { see: 'Two op amps with the CMFB amplifier driving the tail or the bottom sources.', why: 'Any current source in the path can be the one CMFB adjusts.' },
    { see: '$V_{b1} - V_{GS3} = 2I_DR_{total,P}$ and the result for $V_{out1} + V_{out2}$.', why: 'The cascode bias fixes P; the tail current through the sense resistance then fixes the output sum.' },
    { see: 'The replica branch M14, M15 with $V_{REF}$ and the sizing rules.', why: 'Build a twin of the sensing branch with $V_{REF}$ on its gate: the circuit can only be balanced when the outputs average to $V_{REF}$.' },
    { see: 'M16–M18 added, "for removing finite error in $I_{D11}$ and $I_{D14}$".', why: 'Make the twin’s $V_{DS}$ match too, so the copy is exact.' },
  ],
  lec13: [
    { see: 'The RC low-pass, Laplace and partial fractions to $V_0(1-e^{-t/\\tau})$.', why: 'Every one-pole circuit answers a step with this exponential; its starting slope is $V_0/\\tau$.' },
    { see: 'A feedback amplifier with $R_{out}$ and $C_L$, and the KCL algebra.', why: 'Feedback divides the output time constant by $(1 + \\beta A)$ — the output node is "stiffer", as in Lec 3.' },
    { see: '$V_{out}(t)$ and $\\tau = C_LR_{out}/(1 + AR_2/(R_1+R_2))$.', why: 'Final value = closed-loop gain; speed = the stiffened time constant.' },
    { see: 'The OTA with a small step: $\\pm g_m\\Delta V/2$ currents and three small-step curves.', why: 'Small steps: the pair stays linear and the output follows the exponential.' },
    { see: 'A large step: M2 off, $I_{SS}$ into $C_L$, $i = C\\,dv/dt$, $SR = I_{SS}/C_L = 5$ V/µs.', why: 'Large steps: the whole tail current goes one way and charges $C_L$ at a constant rate — a straight ramp, the **slew rate**.' },
  ],
  lec14: [
    { see: 'Telescopic with M2 off and the slopes $I_{SS}/2C_L$ and $I_{SS}/C_L$.', why: 'Each output gets half the tail; the difference moves twice as fast.' },
    { see: 'Folded cascode with $I_P$ and $I_P - I_{SS}$ in the branches.', why: 'If a folding branch would need negative current it switches off, and the slew rate drops.' },
    { see: '"Concept of stability": the loop with $A$ and $\\beta$, $A/(1+\\beta A)$, loop gain $\\beta A$.', why: 'Whether feedback behaves depends entirely on the loop gain $\\beta A(s)$.' },
    { see: 'The boxed Barkhausen conditions and $A_f = \\infty$.', why: 'If at some frequency the loop gain is 1 and the phase has turned −180°, negative feedback has become positive: the circuit oscillates.' },
    { see: 'Complex numbers: $a + jb = Me^{j\\theta}$, $M$ and $\\theta$.', why: 'Each pole factor contributes $-\\tan^{-1}(\\omega/\\omega_p)$ of phase — the arithmetic of every PM question.' },
  ],
  lec15: [
    { see: '$A_f(s)$, $A(s)$ with two poles, and the Bode asymptotes with 0.1ωp and 10ωp.', why: 'Each pole bends the gain down at the pole but starts eating phase a decade earlier.' },
    { see: 'Loop-gain plots for β = 1 (blue) and β < 1 (red).', why: 'Smaller β lowers the whole curve, so it crosses 0 dB earlier, where less phase has been used: β = 1 (a buffer) is the hardest case.' },
    { see: 'Gain/phase crossovers marked, gain margin and phase margin, and PM = 180° + ∠βA at $\\omega_{GX}$.', why: 'PM = how far the phase is from −180° when the gain reaches 1 — the distance from oscillation.' },
    { see: 'Single-pole system: PM = 90°, the closed-loop algebra, "always unconditionally stable".', why: 'One pole can never reach −180°, so a one-pole loop cannot oscillate; closing the loop just moves the pole up by $(1+\\beta A_0)$.' },
    { see: 'Two-pole system plots.', why: 'Two poles approach −180°; the closer the second pole sits to crossover, the smaller the margin.' },
  ],
  lec16: [
    { see: 'The two-pole amplifier (β = 1) with −20 and −40 dB/decade.', why: 'After the second pole the gain falls twice as fast and the phase heads to −180°.' },
    { see: 'Gain and phase plots with $\\omega_{GX}$, GM and PM marked, and PM = 180° − |∠βA|.', why: 'Read the phase where the gain is 1.' },
    { see: 'PM = 5°: $|A_f(\\omega_{GX})| = \\frac1\\beta / |1 + e^{-j175°}| = 11.5/\\beta$.', why: 'At crossover $|\\beta A| = 1$, so the denominator $|1 + \\beta A|$ is a sum of two unit arrows almost opposite each other — nearly zero. Small PM means a **huge peak** near $\\omega_{GX}$.' },
    { see: 'PM = 45° → 1.3/β and PM = 60° → 1/β.', why: 'The arrows open up with more margin: 45° still peaks by 30%, 60° gives exactly the ideal gain — no peak.' },
    { see: 'Step responses for PM 60° (red) and 90° (green).', why: 'Peaking in frequency = ringing in time. 60° is the sweet spot: fast with only a small overshoot.' },
    { see: '$20\\log A - 20\\log(1/\\beta)$ with the 1/β line on the plot.', why: 'Draw the $1/\\beta$ line on the open-loop gain plot; where they meet is the crossover of the loop gain.' },
  ],
  lec17: [
    { see: 'The 100 dB, three-pole Bode plot with the 1/β line, and the moved (green) dominant pole.', why: 'Compensation = make the loop gain fall to 1 **before** the phase gets dangerous, by pushing the first pole down.' },
    { see: 'Two stages with $C_c$ across the second, $C_c(1+A_2)$ and $C_c(1+1/A_2)$.', why: 'Razavi’s Miller intuition: the capacitor’s two ends move in opposite directions, so the voltage across it is $(1 + A_2)$ times bigger and it draws that much more current — it looks $(1+A_2)$ times larger.' },
    { see: '$P_1\' = 1/(R_1[C_1 + (1+A_2)C_c]) \\approx 1/(R_1A_2C_c)$.', why: 'A small $C_c$ gives a very low dominant pole.' },
    { see: 'The two-stage op amp M1–M7 with $C_1$, $C_2$ and the uncompensated poles.', why: 'Two high-impedance nodes, P and Q, give two poles close together — hard to stabilise without $C_c$.' },
    { see: 'The full transfer function with $(1 - sC_c/G_{m2})$ and the matched denominator.', why: '$C_c$ also feeds the signal forward straight to the output: that path creates a right-half-plane zero at $G_{m2}/C_c$, which costs phase.' },
  ],
  settling: [
    { see: 'The non-inverting amplifier, "settling time ≤ 5 ns … within 1%", target gain 10.', why: 'How fast must the op amp be? Translate "settle in 5 ns" into a required unity-gain frequency.' },
    { see: 'The closed-loop transfer function rearranged into $A_{dc}/(1 + s\\tau)$.', why: 'A one-pole op amp in feedback is still one pole — just moved up by $(1+\\beta A_0)$.' },
    { see: '$\\tau \\approx 1/(\\beta\\omega_u)$ and $A_{dc} \\approx 1/\\beta = 10$.', why: 'The closed-loop speed is β times the GBW.' },
    { see: 'The step response by partial fractions.', why: 'The familiar exponential towards $aA_{dc}$.' },
    { see: '$e^{-t/\\tau} = 0.01$ → $t = 4.605\\tau$ → $\\omega_u > 9.21$ Grad/s → $f_u > 1.47$ GHz.', why: 'Within 1% means $\\ln 100 = 4.6$ time constants; with β = 0.1 the op amp needs a GBW ten times faster than the settling suggests.' },
  ],
};
