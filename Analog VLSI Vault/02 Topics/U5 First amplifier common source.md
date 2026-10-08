---
tags: ["topic", "unit/U5", "group/foundations"]
aliases: ["First amplifier: common source"]
---
# U5 · First amplifier: common source

*Gain is a slope; Av = −Gm·Rout*

**Reference:** Razavi §3.3.1 · **Lectures:** [[Lec 01]] · [[Lec 02]]

**Needs first:** [[U4 Small signal]]

## Common source: gain is the slope at Q

**Why:** The CS stage is the half circuit of every differential pair and op amp you will meet. Its gain formula is the one you will use most.

> [!question] Predict first: Where on the curve is the gain biggest?
> a) In the OFF region
> b) In the steep saturated middle
> c) Deep in triode

> [!success]- Answer
> **In the steep saturated middle**. Gain is the slope. The curve is steepest in saturation, flat when off, and flattens again in triode.

Input on the **gate**, output on the **drain**, source grounded: the **common-source** stage. More input → more current → bigger drop across $R_D$ → the output **falls**. It inverts.

The small-signal gain is the **slope of the transfer curve at the bias point**. With the model: $g_m v_{in}$ is pulled out of the output node, and everything touching that node ($R_D$ and $r_O$) is **in parallel**. So $A_v = -g_m (R_D \parallel r_O)$.

This is the master method's Steps B–D: **role** (gate in, drain out = CS) → **resistance** at the output → $A_v = -G_m R_{out}$.

**The rule**

$$A_v = -G_m R_{out} = -g_m\,(R_D \parallel r_O)$$

$$|A_v| = \dfrac{2\,(I_D R_D)}{V_{ov}} = \dfrac{2\times\text{DC drop across } R_D}{V_{ov}}\quad(\lambda = 0)$$

> [!note]
> A gain of 10 at Vov = 0.2 V needs 1 V across RD, which is impossible on a 1 V supply. That’s why chips replace RD with a transistor.

> [!important] Lock it in
> CS: gate in, drain out, inverts. Av = −gm(RD ‖ rO) = −Gm·Rout. With a resistor load |Av| = 2·Vdrop/Vov.
> **Hook:** “Av = −Gm·Rout, always.”

## Questions you can solve after this topic

- [[WE1 – analyse a common-source stage]] · Worked Example 1 (tutoring conversation, Part 1)
- [[Lab 2 – design a resistor-loaded CS amplifier with V]] · Lab 2 (hand calculations)

## Flashcards

[[Flashcards – U5]]

