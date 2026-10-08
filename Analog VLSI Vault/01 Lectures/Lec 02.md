---
tags: ["lecture", "lec/02"]
aliases: ["Performance parameters; one-stage op amps (fully differential and 5-T OTA)"]
date: "5 Aug"
---
# Lec 02 · Performance parameters; one-stage op amps (fully differential and 5-T OTA)

**Date:** 5 Aug · **Handout:** L1–L2 · **Topics:** [[U0 Circuit language]] · [[U1 The MOSFET]] · [[U2 Triode, saturation, pinch-off]] · [[U3 DC recipe and PMOS]] · [[U4 Small signal]] · [[U5 First amplifier common source]] · [[U6 Impedance rules, sources, diodes, mirrors]] · [[U7 CS with every load + degeneration]] · [[U8 Source follower and common gate]] · [[U9 Cascode]] · [[U10 Differential pair]] · [[U11 Five-transistor OTA]] · [[U12 Poles and bandwidth]] · [[L1 Performance parameters]] · [[L2 One-stage op amps]]

> [!abstract] In one paragraph
> The list of op-amp specs, GBW, then the two one-stage op amps: gain, input CM range, output swing and bandwidth for each.

**Before:** [[Lec 01]] · **Next:** [[Lec 03]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec02.webp]]

Original PDF: [[Notes – lecture-02-05082026.pdf]]

## The page, item by item

### The performance parameters

Every op-amp spec on your list: **1 gain, 2 bandwidth, 3 output voltage swing, 4 linearity, 5 noise, (6) offset** — plus supply rejection from the handout. Gain and bandwidth are traded through the GBW below; swing is set by the stack of transistors at the output.

### Bandwidth and GBW of a single-pole system

A one-pole op amp has flat gain $A_0$ up to its pole $\omega_0$, then falls at −20 dB/decade and crosses gain 1 at $\omega_u$. Gain × bandwidth is constant: the **gain-bandwidth product**.

$$\omega_u = A_0\,\omega_0 = \text{GBW}$$

> [!question] Asked in exams
> Settling-time questions (Ex 9.2) ask for the minimum ωu or fu.

### The saturation fence (margin note)

Every swing and CM-range limit below comes from this one condition: an NMOS stays saturated while its drain is no lower than one threshold below its gate.

$$V_{DS} \ge V_{GS} - V_{th} \iff V_D \ge V_G - V_{th}$$

### Fully differential pair with PMOS current-source loads (M1–M4, ISS, two CL)

Each output sees $r_{O1,2}$ down and $r_{O3,4}$ up, so the gain is $g_m$ times their parallel value. The input CM range: the bottom is set by the tail needing $V_{ISS}$ plus $V_{GS1}$; the top by M1 leaving saturation when its gate climbs more than $V_{th}$ above its drain, and the drain sits at $V_{DD} - |V_{ov3}|$.

$$A_v = g_{m1,2}\,(r_{O1,2} \parallel r_{O3,4})$$

$$V_{in,CM,min} = V_{ISS} + V_{GS1}$$

$$V_{in,CM,max} = V_{DD} - |V_{ov3}| + V_{thn}$$

### Its output swing (differential)

Each output can rise to $V_{DD} - |V_{ov3,4}|$ (PMOS at its edge) and fall to $V_{ISS} + V_{ov1,2}$ (tail plus M1 at its edge). The differential output $V_{out1} - V_{out2}$ swings twice as far as one side.

$$V_{out1,max} = V_{DD} - |V_{ov3}|,\quad V_{out2,max} = V_{DD} - |V_{ov4}|$$

$$V_{out1,min} = V_{ISS} + V_{ov1},\quad V_{out2,min} = V_{ISS} + V_{ov2}$$

$$V_{out,max} = V_{out1,max} - V_{out2,min},\quad V_{out,min} = V_{out1,min} - V_{out2,max}$$

$$\text{swing} = 2\,(V_{DD} - |V_{ov3}| - |V_{ov1}| - V_{ISS})$$

### Its bandwidth

One pole at the output: the output resistance times the load capacitor.

$$BW = \omega_{p1} = \dfrac{1}{(r_{O2}\parallel r_{O4})\,C_L}$$

### Five-transistor OTA (diode M3, mirror M4, single output)

The mirror copies M1’s signal current to the output, so the full $g_m$ reaches the output (not half): same gain as one side of the differential version. The input CM top is now set by the **diode** M3: M1’s drain sits at $V_{DD} - |V_{GS3}|$, a full threshold lower.

$$A_v = g_{m2}\,(r_{O2} \parallel r_{O4})$$

$$V_{in,CM,min} = V_{ISS} + V_{GS1}$$

$$V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{th1}$$

$$V_{out,max} = V_{DD} - |V_{ov4}|,\quad V_{out,min} = V_{ISS} + V_{ov2}$$

$$\text{swing} = V_{DD} - |V_{ov4}| - V_{ov2} - V_{ISS}$$

$$BW = \omega_{p1} = \dfrac{1}{(r_{O2}\parallel r_{O4})\,C_L}$$

> [!question] Asked in exams
> This is the mid-sem question (Quiz 1 Part C): sizes from the CM limits, gain, swing, f−3dB with 4 pF.

## Explained step by step

An op amp is judged on gain, bandwidth, output swing, linearity, noise and offset. Razavi’s point is that you can never be best at all of them: more gain costs swing, more swing costs speed or noise. Every later lecture improves one item and pays with another.

For the mid-sem the four you actually compute are **gain, bandwidth (GBW), swing and CM range** — the rest come later.

A one-pole op amp is flat at $A_0$ up to its pole $\omega_0$ (where the gain starts to fall), then drops 20 dB per decade until it reaches gain 1 at $\omega_u$. Past the pole, gain falls exactly as fast as frequency rises, so **gain × frequency stays constant**. That constant is the **GBW**, and it equals $\omega_u = A_0\omega_0$.

Think of it as a fixed pocket of coins: close the loop for gain 10 and you get one-tenth of $\omega_u$ as bandwidth.

Units trap: $\omega$ is in rad/s; divide by $2\pi$ at the very end if the question wants Hz.

This one line is the whole of “headroom”. An NMOS stays saturated while its **drain is no lower than one threshold below its gate**: $V_D \ge V_G - V_{th}$. (For a PMOS, flip it: drain no higher than gate + $|V_{th}|$.)

It is the same rule as $V_{DS} \ge V_{ov}$ — use that form when you know the **source**, and the gate form when you know the **gate**. The gate form shows something important: the drain may sit a whole $V_{th}$ away from the gate and the device is still happy.

Every CM-range and swing question is this fence applied to one transistor: find the device that runs out of room first.

Two outputs ($V_{out1}$, $V_{out2}$), an NMOS pair M1, M2, a tail current $I_{SS}$ — and on top, PMOS **current sources** M3, M4 instead of resistors.

Why current sources? Gain = $g_m \times$ (resistance at the output). A resistor big enough for a high gain would also drop a huge DC voltage ($I\cdot R$). A current source looks like a large $r_O$ to the signal but needs only $|V_{ov}|$ of DC room.

Two words you will meet constantly: the **input CM** $V_{in,CM} = (V_{in1}+V_{in2})/2$ is the common level both gates sit at — it changes neither current, because the tail fixes their sum. The **differential input** $v_d = V_{in1} - V_{in2}$ is the signal: it steers current from one side to the other, each side moving by $\pm g_mv_d/2$.

![[s-lec02-cmdm.svg]]

One thing this circuit does **not** do is set the outputs’ DC level: each output sits between two current sources, so any mismatch drives it to a rail. That is the job of CMFB (Lec 9–12); for now, assume the outputs sit where you need them.

Gain, by inspection. The input device turns $v_d/2$ into a current $g_mv_d/2$. At the output that current meets M1’s $r_O$ looking down and M3’s $r_O$ looking up — both go to AC ground, so they are in parallel: $A_v = g_{m1}(r_{O1}\parallel r_{O3})$.

Two notation questions answered: **$g_{m1,2}$** just means “$g_m$ of M1 or M2” — they are matched and carry the same $I_{SS}/2$, so they are equal. And the gain is written as a **magnitude**: a CS stage inverts, but exam answers ask for $|A_v|$.

![[s-lec02-pair.svg]]

Now the input CM range, read as a tower. The column is tail → P → M1 → drain, and P always sits one **link** below the input: $P = V_{in} - V_{GS1}$. **Floor**: pull the input down; P falls and the **tail** block is squeezed. Its check is $V_{ISS}$ (the least voltage a current source can live with — for a MOSFET tail, its own $V_{ov}$), so $V_{in,min} = V_{ISS} + V_{GS1}$. **Ceiling**: push the input up; P rises towards M1’s drain, which M3 lets rise to $V_{DD} - |V_{ov3}|$, and **M1’s** block is squeezed: $V_{in,max} = (V_{DD} - |V_{ov3}|) - V_{ov1} + V_{GS1} = V_{DD} - |V_{ov3}| + V_{th}$.

Notice the input CM (on the **gate**) and the drain voltage are different nodes; the “$+V_{th}$” in the ceiling is exactly the gap the fence allows between them.

Read each output column top to bottom. Going up, M3 needs $|V_{ov3}|$ below VDD. Going down, M1 needs $V_{ov1}$ above node P, and P can go no lower than the tail’s $V_{ISS}$. What is left is the range one output can move in: $V_{DD} - |V_{ov3}| - V_{ov1} - V_{ISS}$.

The two outputs move in **opposite** directions, each by $\pm s$. Their difference $V_{out1} - V_{out2}$ therefore moves by $\pm 2s$: the **differential swing is twice** one output’s range — the big reason Razavi likes fully differential circuits.

![[s-lec02-swing.svg]]

The pole: a pole lives at any node with a **big resistance and a capacitor**. The output has $r_O\parallel r_O$ and $C_L$. Node P is AC ground for differential signals, and the gates are driven by the source, so the output carries the only important pole: $1/((r_O\parallel r_O)C_L)$.

Same pair, but on top a **current mirror**: M3 is a **diode** (gate tied to drain — it turns M1’s current into a gate voltage) and M4 **copies** it into the output as a current source. M5 is the tail. One output: this is your mid-sem circuit.

“Isn’t half the signal wasted with only one output?” No — follow a small $v_d$. M1’s extra current $+i$ goes through diode M3; M4 copies it and pushes $+i$ **into** the output. M2 pulls $i$ **less** out of the output, which is another $+i$. Both add: $2i = g_mv_d$ reaches the output. Nothing is wasted.

![[s-lec02-ota.svg]]

The same picture tells you the polarity: raising $V_{in1}$ (diode side) raises $V_{out}$, raising $V_{in2}$ (output side) lowers it. **M2’s gate is the inverting (−) input** — remember this for the buffer in Lec 3.

Same gain as one side of the differential pair, because the mirror recovers the lost half: $A_v = g_m(r_{O2}\parallel r_{O4})$ ($g_{m1} = g_{m2}$; the page writes $g_{m2}$ because M2 sits on the output node).

The floor is unchanged (tail + $V_{GS1}$). The ceiling **drops**: M1’s drain is now the **diode** node X, and a diode’s block is stuck at a whole $|V_{GS3}| = |V_{ov3}| + |V_{thp}|$ — it can never shrink to $|V_{ov}|$ like a current source. So $X = V_{DD} - |V_{GS3}|$. Push the input up: P rises towards X and M1’s block is squeezed: $V_{in,max} = X - V_{ov1} + V_{GS1} = V_{DD} - |V_{GS3}| + V_{th1}$ (with the example numbers, $1.8 - 0.7 + 0.5 = 1.6$ V).

![[s-lec02-cm.svg]]

A diode costs a whole $V_{GS}$; a current source only a $V_{ov}$. You will meet this again as the “diode tax”.

Single output, read its column: M4 needs $|V_{ov4}|$ at the top, M2 needs $V_{ov2}$ and the tail $V_{ISS}$ at the bottom. Swing = $V_{DD} - |V_{ov4}| - V_{ov2} - V_{ISS}$ — **no factor 2**, because nothing moves the other way.

One subtlety: $V_{out,min} = V_{ISS} + V_{ov2}$ assumes the input CM is at its **lowest** (P at $V_{ISS}$). The exact floor is M2’s fence, $V_{out} \ge V_{in,CM} - V_{th2}$, so with a higher input CM the floor rises with it.

The only high-resistance node is the output ($r_{O2}\parallel r_{O4}$ with $C_L$), so it carries the dominant pole. The diode node sees only $1/g_{m3}$, so its “mirror pole” is far away.

## Questions that use this lecture

- [[WE1 – analyse a common-source stage]] · Worked Example 1 (tutoring conversation, Part 1)
- [[WE2 – design a biased NMOS]] · Worked Example 2 (tutoring conversation, Part 1)
- [[WE3 – a PMOS with magnitudes]] · Worked Example 3 (tutoring conversation, Part 1)
- [[Tutorial 1 Q1 – design a pair with a mirror tail]] · Tutorial 1 Q1
- [[Tutorial 1 Q2 – pair with diode-connected PMOS loads]] · Tutorial 1 Q2
- [[Tutorial 1 Q3 – pair with PMOS current-source loads]] · Tutorial 1 Q3
- [[Tutorial 1 Q4 – a single-supply pair with an RSS tail]] · Tutorial 1 Q4
- [[Tutorial 1 Q5 – mirror-loaded pair, find the bias current]] · Tutorial 1 Q5
- [[Exam Q1 – five-transistor OTA (a–e)]] · Mid-sem exam Q1 (= Quiz 1 Part C)
- [[Tutorial 2 Q1 – fully differential pair with PMOS current-source loads]] · Tutorial 2 Q1 (Razavi Problem 9.1)
- [[Tutorial 2 Q2 – telescopic with a diode-connected cascode mirror]] · Tutorial 2 Q2 (Razavi Problem 9.2)
- [[Tutorial 3 Q1 – telescopic with a low-voltage cascode mirror]] · Tutorial 3 Q1 (Razavi Problem 9.4)
- [[Tutorial 3 Q2 – two-stage op amp, CM level at X and Y]] · Tutorial 3 Q2 (Razavi Problem 9.6)
- [[Ex 9.1 – how much open-loop gain for 1% gain error]] · Razavi Example 9.1
- [[Ex 9.2 – how fast must the op amp be to settle in 5 ns]] · Razavi Example 9.2
- [[PS1 P1 – five-transistor OTA, full analysis]] · Problem Set 1 P1 (tutoring chat)
- [[PS1 P2 – gain error and settling of the P1 op amp]] · Problem Set 1 P2 (tutoring chat)
- [[PS1 P3 – telescopic gain, swing and bias]] · Problem Set 1 P3 (tutoring chat)
- [[PS1 P4 – raising the input CM costs swing]] · Problem Set 1 P4 (tutoring chat)
- [[PS1 P5 – mirror-loaded telescopic and its buffer window]] · Problem Set 1 P5 (tutoring chat)
- [[Quiz 1 Part A – five-transistor OTA]] · Quiz 1 Part A
- [[Quiz 1 Part B – five-transistor OTA]] · Quiz 1 Part B
- [[Tutorial 6 Q1 – linear settling versus slewing]] · Tutorial 6 Q1
- [[Tutorial 6 Q2 – a 5-T OTA slews, then settles]] · Tutorial 6 Q2
- [[Lab 1 – first-order RC low-pass filter]] · Lab 1 (hand calculations)
- [[Lab 2 – design a resistor-loaded CS amplifier with V]] · Lab 2 (hand calculations)
- [[Lab 3 – CS versus cascode gain, bandwidth and GBW]] · Lab 3 (hand calculations)
- [[Lab 4 – PMOS source follower]] · Lab 4 (hand calculations)
- [[Lab 5 – simple versus low-compliance cascode mirror]] · Lab 5 (hand calculations)
- [[Lab 6 – design a PMOS-input resistive diff amp]] · Lab 6 (hand calculations)
- [[Lab 7 – turn the 5-T OTA specs into numbers]] · Lab 7 (hand calculations)
- [[Lab 8 – behavioural op amp in a capacitive non-inverting amplifier]] · Lab 8 (hand calculations)
- [[Chat – what feedback does to a 5-T OTA buffer]] · Unity-gain buffer lecture (tutoring chat, Razavi Ex 9.4)
- [[Chat – input range of a 5-T OTA buffer on a 1 V supply]] · Unity-gain buffer lecture (tutoring chat, Razavi Ex 9.4)
- [[Chat – the telescopic buffer window]] · Buffer window lecture (tutoring chat, Razavi Ex 9.5)
- [[2024 mid-sem Q3 – PMOS-input telescopic with a cascode mirror, and as a buffer]] · Mid-sem 2024-25 Q3 (10 marks)
- [[2024 Quiz 1 Q1 – five-transistor OTA from its sizes]] · Quiz 1 2024-25 Q1 (9 marks)
- [[2024 Quiz 1 Q2 – the same OTA sized for 10 V µs into 2 pF]] · Quiz 1 2024-25 Q2 (6 marks)

## Animated lessons

- [[Analog Lab Revision Lec 1-10 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – U0]] · [[Flashcards – U1]] · [[Flashcards – U2]] · [[Flashcards – U3]] · [[Flashcards – U4]] · [[Flashcards – U5]] · [[Flashcards – U6]] · [[Flashcards – U7]] · [[Flashcards – U8]] · [[Flashcards – U9]] · [[Flashcards – U10]] · [[Flashcards – U11]] · [[Flashcards – U12]] · [[Flashcards – L1]] · [[Flashcards – L2]]

