---
tags: ["topic", "unit/L6", "group/handout"]
aliases: ["Gain boosting"]
---
# L6 · Gain boosting

*Rout × (1 + A1)*

**Reference:** Handout L6 · 1st ed §9.4 · 2nd ed §9.4 · **Lectures:** [[Lec 06]] · [[Lec 07]] · [[Lec 08]] · [[Lec 09]]

**Needs first:** [[L5 Two-stage op amp]]

## Gain boosting: make the cascode fight back harder

**Why:** Tutorial 4 is all gain boosting: bias the auxiliary amplifier, then find how much it multiplies Rout.

> [!question] Predict first: An auxiliary amplifier of gain A1 = 100 holds the cascode’s source still. Rout grows by about…
> a) 2×
> b) 100×
> c) 10000×

> [!success]- Answer
> **100×**. The cascode’s gm·rO·rO term is multiplied by (1 + A1) ≈ 101.

In a cascode, M2 fights changes in its current because its source X is loaded by rO1. With **gain boosting** an auxiliary amplifier watches X and drives M2’s gate the opposite way: if X rises, M2’s gate falls by A1 times as much. M2 fights back (1 + A1) times harder:

$R_{out} = r_{O1} + r_{O2} + (1 + A_1)\,g_{m2}r_{O2}r_{O1}$.

With a single-transistor auxiliary (a CS stage, $A_1 = g_{m3}r_{O3}$) the whole amplifier’s gain reaches about $(g_m r_O)^3$. The cost: headroom ($V_{out,min} = V_{GS3} + V_{ov2}$) and a doublet in the frequency response. And the load must be boosted too — the load trap again.

**The rule**

$$R_{out} = r_{O1} + r_{O2} + (1 + A_1)\,g_{m2}r_{O2}r_{O1}$$

$$A_1 = g_{m3}r_{O3}\ (\text{CS auxiliary})$$

$$V_{out,min} = V_{GS3} + V_{ov2}$$

> [!important] Lock it in
> Gain boosting multiplies the cascode Rout by (1 + A1). Costs headroom (VGS3 + Vov2) and needs a boosted load too.
> **Hook:** “Hold the source still and the cascode fights (1 + A1) times harder.”

## Questions you can solve after this topic

- [[Tutorial 4 Q1 – regulated cascode with an NMOS auxiliary]] · Tutorial 4 Q1 (adapted Razavi 9.10)
- [[Tutorial 4 Q2 – gain boosting with a PMOS auxiliary]] · Tutorial 4 Q2
- [[Tutorial 4 Q3 – gain boosting with a folded-cascode auxiliary]] · Tutorial 4 Q3
- [[2025 mid-sem Q1 – gain-boosted cascode with a CS auxiliary]] · Mid-sem 2025-26 Q1 (13 marks)
- [[2024 mid-sem Q4 – Rout of a gain-boosted cascode with a folded auxiliary]] · Mid-sem 2024-25 Q4 (7 marks)

## Flashcards

[[Flashcards – L6]]

