---
tags: ["topic", "unit/L5", "group/handout"]
aliases: ["Two-stage op amp"]
---
# L5 · Two-stage op amp

*High gain, then high swing*

**Reference:** Handout L5 · 1st ed §9.3 · 2nd ed §9.3 · **Lectures:** [[Lec 07]]

**Needs first:** [[L4 Folded cascode]]

## Two-stage op amp: one stage for gain, one for swing

**Why:** Tutorial 3 Q2 and Q3 are two-stage op amps: find the CM level at X, Y, the gain A1·A2 and the swing.

> [!question] Predict first: The first stage has gain 35 and the second stage gain 13. The total gain is about…
> a) 48
> b) 455
> c) 35

> [!success]- Answer
> **455**. Stages in cascade multiply: 35 × 13 ≈ 455 (Tutorial 3 Q2 gives 451).

A cascode gives gain but eats swing. A **two-stage** op amp splits the jobs: the **first stage** (a differential pair, maybe cascoded) makes the gain; the **second stage** (a common-source device with a current-source load) makes the swing, because its output has only one transistor at each rail.

The gains multiply: $A = A_1 A_2$. The first stage’s output CM level (X, Y) is not free: it is the gate of the second stage, so it must sit where M5 carries its current: $V_X = V_{DD} - |V_{GS5}|$. That also caps the input CM at $V_X + V_{th}$.

The price: two high-resistance nodes, two poles — compensation (L13–L14).

**The rule**

$$A_v = A_1 A_2,\quad A_1 = g_{m1}(r_{O1}\parallel r_{O3}),\; A_2 = g_{m5}(r_{O5}\parallel r_{O7})$$

$$V_{X} = V_{DD} - |V_{GS5}|$$

$$V_{pp,diff} = 2(V_{DD} - |V_{ov5}| - V_{ov7})$$

> [!important] Lock it in
> Two stages: gain from the first, swing from the second. A = A1·A2; X sits one |VGS5| below VDD; swing 2(VDD − |Vov5| − Vov7).
> **Hook:** “High gain, then high swing.”

## Questions you can solve after this topic

- [[Tutorial 3 Q2 – two-stage op amp, CM level at X and Y]] · Tutorial 3 Q2 (Razavi Problem 9.6)
- [[Tutorial 3 Q3 – two-stage with a telescopic first stage]] · Tutorial 3 Q3 (Razavi Problem 9.8)

## Questions that also use it

- [[Lab 9 – turn the two-stage buffer specs into numbers]]
- [[2025 mid-sem Q2 – design a Miller-compensated two-stage op amp]]
- [[2024 mid-sem Q2 – analyse a Miller two-stage op amp]]

## Flashcards

[[Flashcards – L5]]

