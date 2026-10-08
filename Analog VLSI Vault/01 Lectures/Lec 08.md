---
tags: ["lecture", "lec/08"]
aliases: ["Gain boosting: Gm, Rout, the (gm·rO)³ gain, and three ways to build the auxiliary amplifier"]
date: "19 Aug"
---
# Lec 08 · Gain boosting: Gm, Rout, the (gm·rO)³ gain, and three ways to build the auxiliary amplifier

**Date:** 19 Aug · **Handout:** L6 · **Topics:** [[L6 Gain boosting]]

> [!abstract] In one paragraph
> Redo of the Gm derivation, the resistance looking into the boosted device’s source, Gm ≈ gm1 by current division, Rout ≈ (1 + A1)gm2rO1rO2, Av ≈ (gm·rO)³, and the CS, PMOS and folded auxiliary amplifiers with their headroom costs.

**Before:** [[Lec 07]] · **Next:** [[Lec 09]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec08.webp]]

Original PDF: [[Notes – lecture-08-19082026.pdf]]

## The page, item by item

### Gm with an amplifier driving the gate and sensing the source

Same circuit as Lec 7 with the amplifier’s − input on the source. The gate gets $(V_{in} - I_{out}R_S)A_1$ and the source sits at $I_{out}R_S$:

- $\big[(V_{in} - I_{out}R_S)A_1 - I_{out}R_S\big]g_m = I_o,\quad I_{out} = I_o\dfrac{r_O}{r_O + R_S}$
- $I_{out}\left[1 + (A_1R_S + R_S)\dfrac{g_mr_O}{r_O + R_S}\right] = V_{in}A_1\dfrac{g_mr_O}{r_O+R_S}$
- $\dfrac{I_{out}}{V_{in}} = \dfrac{A_1g_mr_O}{R_S + r_O + (1+A_1)R_Sg_mr_O} \approx \dfrac{A_1g_m}{R_S + (1+A_1)g_mr_OR_S}$

### Rout of the boosted device (repeat of Lec 7)

With the test source $V_X$ at the drain, the source moves by $I_XR_S$ and the gate by $-A_1I_XR_S$:

$$R_{out} = R_S + r_O + (1 + A_1)\,g_m R_S r_O$$

### Looking into the source of a boosted device

Plain device with $R_D$ on its drain: looking into the source you see $\frac{R_D + r_O}{1 + g_mr_O}$. With the amplifier boosting it, the "fight back" is $(1 + A_1)$ times stronger, so the resistance is $(1 + A_1)$ times smaller.

$$R_{in,source} = \dfrac{R_D + r_O}{1 + g_mr_O}\ \text{(plain)}$$

$$R_{in,source} = \dfrac{R_D + r_O}{1 + (1 + A_1)g_mr_O}\ \text{(boosted)}$$

### Boosted cascode: Gm ≈ gm1 by current division

Input device M1 under boosted cascode M2. With $R_D \to 0$ the source of M2 looks like $\frac{r_{O2}}{(1 + A_1)g_{m2}r_{O2}} \approx \frac{1}{(1+A_1)g_{m2}}$, tiny compared with $r_{O1}$, so all of M1’s current goes up. (The small box on your page is the current divider: $I_{R2} = I\frac{R_1}{R_1 + R_2}$.)

- $R_{in,M2} = \dfrac{r_{O2} + R_D}{1 + (1+A_1)g_{m2}r_{O2}} \approx \dfrac{1}{(1+A_1)g_{m2}}$
- $I_{out} = g_{m1}V_{in}\times\dfrac{r_{O1}}{r_{O1} + \frac{1}{(1+A_1)g_{m2}}} \approx g_{m1}V_{in}\dfrac{r_{O1}}{r_{O1}}$
- $G_m = \dfrac{I_{out}}{V_{in}} \approx g_{m1}$

$$I_{R_2} = I\,\dfrac{R_1}{R_1+R_2}$$

### Rout and the gain of the boosted cascode

Put $R_S = r_{O1}$ in the Rout formula. If every $g_m$ and $r_O$ is equal and the auxiliary is one CS stage ($A_1 = g_{m3}r_{O3}$), the gain is about $(g_mr_O)^3$.

- $R_{out} = r_{O1} + r_{O2} + (1+A_1)g_{m2}r_{O1}r_{O2} \approx (1+A_1)g_{m2}r_{O1}r_{O2}$
- $A_v = G_mR_{out} \approx g_{m1}(1 + A_1)g_{m2}r_{O1}r_{O2}$
- $A_1 = g_{m3}r_{O3} \Rightarrow A_v \approx (g_mr_O)^3$

$$R_{out} \approx (1+A_1)\,g_{m2}r_{O1}r_{O2}$$

$$A_v \approx g_{m1}(1 + A_1)g_{m2}r_{O1}r_{O2} \approx (g_mr_O)^3$$

> [!question] Asked in exams
> Tutorial 4 Q1(b), Q2(e): overall gain of a boosted cascode.

### Implementation 1: a CS auxiliary (M3 with current source I2)

The simplest $A_1$: an NMOS M3 whose gate is M2’s source and whose drain (loaded by $I_2$) drives M2’s gate. Gain $A_1 = g_{m3}r_{O3}$. **Disadvantage:** M2’s source now sits at $V_{GS3}$, not at $V_{ov1}$, so the output cannot go as low.

$$A_v = g_{m1}(1 + g_{m3}r_{O3})g_{m2}r_{O2}r_{O1}$$

$$V_{out,min} = V_{GS3} + V_{ov2}$$

> [!question] Asked in exams
> Tutorial 4 Q1(a), (c): gate bias of M2 and M3, output swing with this headroom cost.

### Implementation 2: a PMOS auxiliary (M3 PMOS from VDD, I2 below)

Use a PMOS CS stage instead: gate at P (M2’s source), drain at G (M2’s gate). For M3 to stay saturated its drain G cannot be more than $|V_{th3}|$ above its gate P — which means M2 itself must run with $V_{GS2} \le |V_{th3}|$. That is hard (M2 barely on, as the cross-section sketch shows).

- $V_{DS3} \le V_{GS3} - V_{th3}\ \text{(PMOS, magnitudes)} \Rightarrow V_G \le V_P + |V_{th3}|$
- $V_P + V_{GS2} \le V_P + |V_{th3}|$
- $V_{GS2} \le |V_{th3}|$

$$V_{GS2} \le |V_{th3}|$$

### Implementation 3: a folded-cascode auxiliary (PMOS M3 folded into NMOS M4, I3 and I2)

Fold the PMOS auxiliary into an NMOS cascode M4 (gate $V_b$) with current sources $I_3$, $I_2$. The auxiliary becomes a cascode stage, so its gain is $g_{m3}$ times a cascode resistance — and the headroom problem of implementation 1 is gone.

$$A_v = G_m R_{out} = g_{m1}(1+A_1)g_{m2}r_{O1}r_{O2}$$

$$A_1 = g_{m3}\,g_{m4}r_{O4}r_{O3}$$

## Explained step by step

Lec 7’s first attempt, redone properly: now the amplifier’s inputs are $V_{in}$ and the **source** voltage, so it drives the gate with $(V_{in} - I_{out}R_S)A_1$ while the source sits at $I_{out}R_S$. Solving gives

$\dfrac{I_{out}}{V_{in}} \approx \dfrac{A_1g_m}{R_S + (1+A_1)g_mr_OR_S} \approx \dfrac{A_1}{(1 + A_1)R_S} \approx \dfrac{1}{R_S}$.

The $A_1$ cancels top and bottom. This is negative feedback around the transistor, and the transconductance simply becomes $1/R_S$ — set by the resistor, not by the amplifier. So the auxiliary amplifier is useless for $G_m$; its real job is $R_{out}$. From here on, think of boosting purely as a way to multiply $R_{out}$.

The boosted output resistance, the formula to keep:

$R_{out} = R_S + r_O + (1 + A_1)g_mR_Sr_O \approx (1 + A_1)g_mr_OR_S$.

In a boosted **cascode** the resistance under M2’s source is the input device’s $r_{O1}$, so $R_S = r_{O1}$ and $R_{out} \approx (1 + A_1)g_{m2}r_{O2}r_{O1}$. Compare the plain cascode, $g_{m2}r_{O2}r_{O1}$: boosting just multiplies it by $(1 + A_1)$.

The same “fight back” seen from **below**. $R_D$ is whatever loads the device’s drain. Looking into the **source** of a plain device you see $\dfrac{R_D + r_O}{1 + g_mr_O}$ — about $1/g_m$, small. A boosted device fights $(1 + A_1)$ times harder, so its source is $(1 + A_1)$ times **stiffer**:

$R_{in,source} = \dfrac{R_D + r_O}{1 + (1 + A_1)g_mr_O}$.

![[s-lec08-source.svg]]

The rule “up multiplies, down divides” still holds — now by $(1 + A_1)g_mr_O$.

Why boosting costs no $G_m$: M1’s signal current $g_{m1}v_{in}$ reaches M2’s source and has two exits — **up** into that source, now only about $\dfrac{1}{(1 + A_1)g_{m2}}$, or **down** into $r_{O1}$. With $1/g_{m2} = 1$ kΩ and $A_1 = 50$, “up” is about 20 Ω against tens of kΩ “down”. By the current divider (the little box on your page, $I_{R_2} = I\cdot\dfrac{R_1}{R_1 + R_2}$), almost all of it goes up. So $G_m \approx g_{m1}$, exactly as without boosting.

Put the pieces together: $R_{out} \approx (1 + A_1)g_{m2}r_{O2}r_{O1}$ and $A_v = G_mR_{out} = g_{m1}(1 + A_1)g_{m2}r_{O2}r_{O1}$.

With a one-transistor (CS) booster, $A_1 = g_{m3}r_{O3}$. If all $g_m$ and $r_O$ are equal, the gain is about $g_mr_O\cdot g_mr_O\cdot g_mr_O = (g_mr_O)^3$ — a whole extra factor of intrinsic gain with **no extra device in the output stack**.

![[s-lec08-compare.svg]]

So: cascode = $(g_mr_O)^2$, boosted cascode = $(g_mr_O)^3$.

The simplest booster: a CS device **M3** with a current source $I_2$. M3’s gate sits on M2’s source (node X), its drain drives M2’s gate. Its gain is $A_1 = g_{m3}r_{O3}$, so $A_v = g_{m1}(1 + g_{m3}r_{O3})g_{m2}r_{O2}r_{O1}$.

![[s-lec08-impl.svg]]

**The cost, read from the towers.** X is now M3’s gate, and M3’s source is ground, so a **link** fixes X: $X = V_{GS3}$ (0.7 V). In a plain cascode X only needed M1’s check, $V_{ov1}$ (0.2 V). Then M2’s check puts the output at least $V_{ov2}$ above X: $V_{out,min} = V_{GS3} + V_{ov2}$ = 0.9 V instead of 0.4 V. The CS booster costs one $V_{th}$ of swing — the **disadvantage** marked on your page.

**The DC level at M2’s gate** (Tutorial 4 Q1(a) asks it) is two links up from ground: $V_{G2} = V_{GS3} + V_{GS2}$.

Try a **PMOS** booster to avoid that headroom loss: M3 is now a PMOS CS stage, gate on X, drain driving M2’s gate (G), current source $I_2$ below.

Apply the PMOS fence to M3 — its drain may be at most $|V_{th3}|$ above its gate: $G \le X + |V_{th3}|$. But M2’s gate sits one link above its source: $G = X + V_{GS2}$. Together, $V_{GS2} \le |V_{th3}|$: M2 would need a gate-source voltage below about one threshold, i.e. barely on (the sketch on your page). It does not work well.

Fix the PMOS booster with the Lec 5–6 trick: **fold** it. The PMOS input M3 feeds an NMOS cascode M4 (gate $V_b$) from the side, with current sources $I_2$, $I_3$.

Two things improve. **Headroom:** the booster’s input is a PMOS gate on X, and a folded PMOS input happily sits near ground (Lec 6: its CM range even goes below ground), so X can stay just $V_{ov1}$ up — no $V_{GS}$ lost. **Gain:** the booster is now itself a cascode stage, so $A_1 = g_{m3}g_{m4}r_{O4}r_{O3}$, $(g_mr_O)^2$-sized — a bigger boost.

$A_v = g_{m1}(1 + A_1)g_{m2}r_{O2}r_{O1}$ with that $A_1$.

## Questions that use this lecture

- [[Tutorial 4 Q1 – regulated cascode with an NMOS auxiliary]] · Tutorial 4 Q1 (adapted Razavi 9.10)
- [[Tutorial 4 Q2 – gain boosting with a PMOS auxiliary]] · Tutorial 4 Q2
- [[Tutorial 4 Q3 – gain boosting with a folded-cascode auxiliary]] · Tutorial 4 Q3
- [[2025 mid-sem Q1 – gain-boosted cascode with a CS auxiliary]] · Mid-sem 2025-26 Q1 (13 marks)
- [[2024 mid-sem Q4 – Rout of a gain-boosted cascode with a folded auxiliary]] · Mid-sem 2024-25 Q4 (7 marks)

## Animated lessons

- [[Analog Lab Lec 7-12 (animated).html]]
- [[Analog Lab Revision Lec 1-10 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – L6]]

