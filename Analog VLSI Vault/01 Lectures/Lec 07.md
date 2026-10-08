---
tags: ["lecture", "lec/07"]
aliases: ["Two-stage op amps; gain boosting: why Gm cannot be boosted, and Rout boosted by (1 + A1)"]
date: "17 Aug"
---
# Lec 07 · Two-stage op amps; gain boosting: why Gm cannot be boosted, and Rout boosted by (1 + A1)

**Date:** 17 Aug · **Handout:** L5, L6 · **Topics:** [[L5 Two-stage op amp]] · [[L6 Gain boosting]]

> [!abstract] In one paragraph
> Two-stage op amps (simple and telescopic first stage, fully differential and single-ended), the "high gain, then high swing" block diagram, and the two gain-boosting derivations.

**Before:** [[Lec 06]] · **Next:** [[Lec 08]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec07.webp]]

Original PDF: [[Notes – lecture-07-17082026.pdf]]

## The page, item by item

### Two-stage op amp, simple first stage (M1–M4 + CS second stages M5–M8)

Stage 1 (red loop on your page) is a differential pair with current-source loads: it makes the gain. Stage 2 (green) is a common-source stage on each side: one device to each rail, so it makes the swing. Gains multiply.

$$A_1 = g_{m1,2}(r_{O1,2}\parallel r_{O3,4})$$

$$A_2 = g_{m5,6}(r_{O5,6}\parallel r_{O7,8})$$

$$A = A_1 \times A_2$$

### The idea in one picture

**High-gain amplifier → high-swing amplifier.** A cascode gives gain but eats swing; a CS output stage gives swing but little gain. Put them in series and get both.

### Two-stage with a telescopic first stage (M1–M8 cascode, M9, M10 PMOS CS, M11, M12 current sources)

Now stage 1 is a full telescopic cascode: its gain is $g_{m1}$ times (PMOS cascode ∥ NMOS cascode). Stage 2 is PMOS M9 (M10) with an NMOS current source M11 (M12). The Bode sketch: two poles, so more gain but the phase drops faster — compensation later (L13–L14).

$$A_1 = g_{m1}\left[g_{m5}r_{O5}r_{O7} \parallel g_{m3}r_{O3}r_{O1}\right]$$

$$A_2 = g_{m9}(r_{O9}\parallel r_{O11})$$

> [!question] Asked in exams
> Tutorial 3 Q3 (Razavi Fig 9.24) is exactly this op amp: CM level at X, Y, sizes for the swing, overall gain.

### Single-ended version (M11 diode, M12 mirror)

Make M11 a diode and M12 its mirror: the left second stage now drives the mirror, and the right side gives a single output $V_{out}$ with the full differential gain.

### Gain boosting: Av = Gm × Rout

Stacking more cascodes multiplies Rout by $g_m r_O$ each time ($r_{O1} \to g_{m2}r_{O2}r_{O1} \to g_{m3}r_{O3}g_{m2}r_{O2}r_{O1}$) but costs headroom. Gm is "very hard to improve"; Rout "needs to be improved".

$$A_v = G_m \times R_{out}$$

### Trying to boost Gm with an amplifier in front: no improvement

Put an amplifier $A_1$ before M1: $G_m = A_1 g_m$ looks bigger. But with a degeneration resistor $R_S$ (a real source), work out the current: the extra gain is eaten by the source feedback.

- $I_o = (A_1 V_{in} - I_{out}R_S)\,g_{m2}$
- $I_{out} = I_o\dfrac{r_{O2}}{r_{O2}+R_S} = (A_1V_{in} - I_{out}R_S)\,g_{m2}\dfrac{r_{O2}}{r_{O2}+R_S}$
- $I_{out}\left[1 + \dfrac{g_{m2}r_{O2}R_S}{r_{O2}+R_S}\right] = A_1V_{in}\,g_{m2}\dfrac{r_{O2}}{r_{O2}+R_S}$
- "No improvement": $\dfrac{I_{out}}{V_{in}} = \dfrac{A_1g_{m2}r_{O2}}{r_{O2} + R_S + g_{m2}r_{O2}R_S}$

### Boosting Rout instead: the derivation with a test source

Without boosting, a degenerated device looks like $R_S + r_O + g_m R_S r_O$. Now let an amplifier $A_1$ watch the source and drive the gate the other way. Apply $V_X$, find $I_X$:

- $V_S = I_X R_S,\quad V_G = -A_1 I_X R_S$
- $I_o = g_{m2}(V_G - V_S) = g_{m2}[-A_1I_XR_S - I_XR_S] = -g_{m2}R_SI_X(1 + A_1)$
- $I_X = I_o + \dfrac{V_X - I_XR_S}{r_{O2}} = -g_{m2}R_SI_X(1 + A_1) + \dfrac{V_X - I_XR_S}{r_{O2}}$
- $\dfrac{V_X}{I_X} = R_S + r_{O2} + g_{m2}(1 + A_1)R_S r_{O2}$

$$R_{out} = R_S + r_O + (1 + A_1)\,g_m R_S r_O$$

> [!question] Asked in exams
> Tutorial 4 Q1–Q2 (gain-boosted cascode: bias, Rout, gain).

## Explained step by step

**First, what a “stage” is.** A stage is one amplifier block: an input device that turns a voltage into a current, and one high-resistance node where that current becomes the output voltage ($A = G_m R_{out}$). Every op amp so far — the 5-T OTA, the telescopic, the folded cascode — was **one** stage.

The problem they left: a telescopic gives a big gain, $(g_mr_O)^2/2$, but its output shares one column with five stacked devices. In tower language each device keeps its $V_{ov}$ block, and the output gets only what is left. Razavi’s answer is to **split the jobs** between two stages.

**Stage 1** (the red loop on your page) is a differential pair with current-source loads: its job is **gain**, $A_1 = g_{m1,2}(r_{O1,2}\parallel r_{O3,4})$.

**Stage 2** (the green loops) is a **common-source (CS) stage** on each side: one transistor whose gate is driven by stage 1, source on a rail, drain loaded by one current source. Its gain is modest, $A_2 = g_{m5,6}(r_{O5,6}\parallel r_{O7,8}) \approx g_mr_O/2$, but its column holds only **two** devices, so its output can swing to within one $V_{ov}$ of either rail: its job is **swing**.

![[s-lec07-twostage.svg]]

Gains in cascade **multiply**: $A = A_1A_2$ — stage 1 amplifies by $A_1$, and stage 2 amplifies that again by $A_2$.

The price, visible in the last picture: each stage’s output is a high-resistance node with its own capacitance, so there are now **two poles**, and the phase drops quickly. That is why two-stage op amps need compensation (Lec 17).

The whole idea as a block diagram: a **high-gain** amplifier followed by a **high-swing** amplifier.

Why in that order? The big signal only exists at the **final** output. Stage 1’s output only has to move by $V_{out}/A_2$ — a few tens of millivolts — so stage 1 can afford a tall, cramped stack of cascodes. Stage 2 must make the big swing, so it gets the short two-device column. Swap them and the cramped stage would have to make the big swing.

One detail that matters later: stage 2 is a CS stage, so it **inverts**. A capacitor placed across an inverting stage looks multiplied (the Miller effect) — that is exactly how Lec 17 compensates this amplifier.

Now stage 1 is a full **telescopic** (M1–M8, so $A_1$ is $(g_mr_O)^2$-sized) and stage 2 is a **PMOS** CS device M9 (M10 on the other side) loaded by an NMOS current source M11 (M12).

Read each gain off the circuit the usual way, $G_m\times R_{out}$. Stage 1: $A_1 = g_{m1}[g_{m5}r_{O5}r_{O7}\parallel g_{m3}r_{O3}r_{O1}]$ (look up, look down, in parallel). Stage 2: $A_2 = g_{m9}(r_{O9}\parallel r_{O11})$. With $g_mr_O = 50$: $A_1 \approx 1250$, $A_2 \approx 25$, so $A \approx 31\,000$.

![[s-lec07-swing.svg]]

**The DC level between the stages** (Tutorial 3 Q3 asks for it). X — stage 1’s output — is also **M9’s gate**. M9’s source is VDD and it carries a fixed current, so its $|V_{GS9}|$ is fixed: a **link**. So $X = V_{DD} - |V_{GS9}|$: stage 2 decides where stage 1’s output sits. Then check that the stage-1 devices around X still get their $V_{ov}$ blocks at that level.

The Bode sketch on your page shows the cost: two high-resistance nodes (X and $V_{out}$) give two poles; the gain falls at 20, then 40 dB/decade, and the phase heads towards −180°.

To get **one** output without wasting half the signal, use the 5-T OTA trick again. M11 becomes a **diode** (gate tied to drain: it turns the left side’s current into a gate voltage) and M12 **mirrors** it (copies that current to the right side).

Follow a signal: the left CS device’s current rises by $i$; M11 carries it and M12 copies it, pulling $i$ more out of the output. Meanwhile the right CS device, driven the opposite way, pushes $i$ less into it. Both changes move the output the same way — the two halves add, and the single output gets the full differential gain.

Every gain is $A_v = G_m\times R_{out}$ — the current the input device makes, times the resistance that current meets.

![[s-lec06-gmrout.svg]]

Which factor can we raise? $G_m$ is set by the input transistor, $g_m = 2I_D/V_{ov}$: more needs more current (power) or a smaller $V_{ov}$ — your page calls it “very hard to improve”. $R_{out}$ is different: each cascode multiplies it by $g_mr_O$ (“up multiplies”): $r_{O1} \to g_{m2}r_{O2}r_{O1} \to g_{m3}r_{O3}g_{m2}r_{O2}r_{O1}$. But each stacked cascode adds another $V_{ov}$ block to the tower.

So Razavi asks: can we get that multiplication **without** stacking another device? That is **gain boosting**.

Two new symbols first. $R_S$ is a resistance under the transistor’s source — it stands for whatever sits below the device (in a cascode, the input transistor’s $r_{O1}$). $A_1$ is a **separate small amplifier** (the “auxiliary” or “booster” amplifier) added to the circuit.

First attempt: put $A_1$ in **front** of the gate. It does not make the transistor any better. The transistor stage still turns each volt at its gate into the same current as before: $R_S$ feeds back — as the current rises, the source rises by $I_{out}R_S$ and takes away gate drive — so that current stays about $1/R_S$ per volt. $A_1$ merely pre-amplifies $V_{in}$; it is just another stage in front, not a better stage. Your page concludes “no improvement”.

Lesson: improving the **input side** is the wrong target. The amplifier has to fight the **output** resistance instead — next step.

Second attempt — the one that works: let the amplifier **watch the source** of the cascode device M2 (node X) and drive its **gate** the opposite way.

![[s-lec08-boost.svg]]

**How to find a resistance (the test-source method).** Switch the input off ($v_{in} = 0$, so the device below is just a resistance $R_S$). Connect a test voltage $V_X$ at the output and work out the current $I_X$ it pushes in. Then $R_{out} = V_X/I_X$.

**Why boosting multiplies it.** $V_X$ pushes current in, so the source rises by Δ = $I_XR_S$. Without the amplifier, M2’s $V_{GS}$ shrinks by Δ and M2 fights back in proportion. With the amplifier, the gate is also pulled **down** by $A_1\Delta$, so $V_{GS}$ shrinks by $(1 + A_1)\Delta$: M2 fights back $(1 + A_1)$ times harder, and the output looks $(1 + A_1)$ times stiffer. The algebra on your page gives

$R_{out} = R_S + r_{O2} + (1 + A_1)g_{m2}R_Sr_{O2}$

— the plain cascode result with its big term multiplied by $(1 + A_1)$. With $g_mr_O = 50$ and $A_1 = 50$, that is 51 times more $R_{out}$, and no extra device in the output column.

## Questions that use this lecture

- [[Tutorial 3 Q2 – two-stage op amp, CM level at X and Y]] · Tutorial 3 Q2 (Razavi Problem 9.6)
- [[Tutorial 3 Q3 – two-stage with a telescopic first stage]] · Tutorial 3 Q3 (Razavi Problem 9.8)
- [[Tutorial 4 Q1 – regulated cascode with an NMOS auxiliary]] · Tutorial 4 Q1 (adapted Razavi 9.10)
- [[Tutorial 4 Q2 – gain boosting with a PMOS auxiliary]] · Tutorial 4 Q2
- [[Tutorial 4 Q3 – gain boosting with a folded-cascode auxiliary]] · Tutorial 4 Q3
- [[Lab 9 – turn the two-stage buffer specs into numbers]] · Lab 9 (hand calculations)
- [[2025 mid-sem Q1 – gain-boosted cascode with a CS auxiliary]] · Mid-sem 2025-26 Q1 (13 marks)
- [[2025 mid-sem Q2 – design a Miller-compensated two-stage op amp]] · Mid-sem 2025-26 Q2 (14 marks)
- [[2024 mid-sem Q2 – analyse a Miller two-stage op amp]] · Mid-sem 2024-25 Q2 (15 marks)
- [[2024 mid-sem Q4 – Rout of a gain-boosted cascode with a folded auxiliary]] · Mid-sem 2024-25 Q4 (7 marks)

## Animated lessons

- [[Analog Lab Lec 7-12 (animated).html]]
- [[Analog Lab Revision Lec 1-10 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – L5]] · [[Flashcards – L6]]

