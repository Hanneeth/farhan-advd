---
tags: ["topic", "unit/U6", "group/foundations"]
aliases: ["Impedance rules, sources, diodes, mirrors"]
---
# U6 · Impedance rules, sources, diodes, mirrors

*Gate ∞, drain rO, source 1/gm*

**Reference:** Razavi §3.3, Ch 5 · **Lectures:** [[Lec 01]] · [[Lec 02]]

**Needs first:** [[U5 First amplifier common source]]

## Three impedance rules: gate ∞, drain big, source small

**Why:** Every gain in your tutorials is Gm × Rout, and Rout is always built from these three rules. Exam Q1(b) needs Rout = rO2 ‖ rO4.

> [!question] Predict first: You put RS = 10 kΩ under an NMOS source (gm·rO = 50). Looking into the drain, roughly what do you see?
> a) About rO + 10 kΩ
> b) About rO + 50 × 10 kΩ
> c) About 1/gm

> [!success]- Answer
> **About rO + 50 × 10 kΩ**. Up multiplies: RS is boosted by (1 + gm·rO). The transistor fights any change in its current, so the drain looks far stiffer.

Look into one terminal and ask: if I wiggle this node, how much current flows?

**Gate:** none at all, it is a capacitor plate. $R = \infty$.
**Drain:** the device holds its current almost constant, so you see a big $r_O$. Put $R_S$ under the source and it fights harder: $R = r_O + (1+g_m r_O)R_S \approx g_m r_O R_S$.
**Source:** a small wiggle changes $V_{GS}$ directly, so the device answers with lots of current: $R \approx 1/g_m$ (plus $R_D/(g_m r_O)$ if the drain is loaded).

Memory hook: **up multiplies, down divides — by $g_m r_O$.**

> [!tip] Picture it
> The gate is a sealed door. The drain is a stubborn tap that refuses to change its flow. The source is a wide-open drain in the floor.

**The rule**

$$R_{\text{gate}} = \infty$$

$$R_{\text{drain}} = r_O + (1 + g_m r_O)R_S \approx g_m r_O R_S$$

$$R_{\text{source}} = \dfrac{R_D + r_O}{1 + g_m r_O} \approx \dfrac{1}{g_m} + \dfrac{R_D}{g_m r_O}$$

> [!note]
> With RS = 0 the drain rule gives plain rO; with RD = 0 the source rule gives 1/gm ‖ rO.

> [!important] Lock it in
> Gate ∞. Drain rO, and RS below it is multiplied by gm·rO. Source ≈ 1/gm, and RD above it is divided by gm·rO.
> **Hook:** “Gate infinite, drain big, source small. Up multiplies, down divides — by gm·rO.”

## Diodes and current mirrors

**Why:** Every tail current in your tutorials and the exam is set by a mirror: Tutorial 1 Q1 asks for (W/L)3, (W/L)4 and R of one.

> [!question] Predict first: M2 is twice as wide as M1 and has the same VGS. IREF = 20 µA. What is Iout?
> a) 10 µA
> b) 20 µA
> c) 40 µA

> [!success]- Answer
> **40 µA**. Same VGS, same overdrive; the square law then makes current proportional to W/L. Twice the width, twice the current.

Tie a transistor’s gate to its drain: a **diode connection**. Its drain can never fall below its gate, so it is **always saturated**, and it settles at whatever $V_{GS}$ carries the current you push in. From outside it looks like a resistor of about $1/g_m$.

Now share that gate with a second transistor. Same $V_{GS}$ means same $V_{ov}$, so by the square law its current is the **same per unit of W/L**: a **current mirror**. The copy works only while M2 stays saturated: its drain must stay above $V_{ov}$.

The price: a diode costs a **full** $V_{GS} = V_{th} + V_{ov}$ of headroom.

**The rule**

$$I_{out} = I_{REF}\,\dfrac{(W/L)_2}{(W/L)_1}$$

$$V_{GS} = V_{th} + \sqrt{\dfrac{2 I_{REF}}{\mu_n C_{ox}(W/L)_1}}$$

$$V_{out} \ge V_{ov}\quad\text{(M2 saturated)}$$

> [!note]
> Resistance into a diode = 1/gm ‖ rO ≈ 1/gm.

> [!important] Lock it in
> Diode: gate tied to drain, always saturated, looks like 1/gm, costs a full VGS. Mirror: same VGS, current scales with W/L while the copy stays above Vov.
> **Hook:** “Same VGS, same current per W/L.”

## Questions that also use it

- [[Tutorial 1 Q1 – design a pair with a mirror tail]]
- [[Lab 5 – simple versus low-compliance cascode mirror]]

## Flashcards

[[Flashcards – U6]]

## Symbols

[[output resistance (rO)]] · [[source resistor (RS)]] · [[gate-source voltage (VGS)]] · [[overdrive (Vov)]]
