---
tags: ["topic", "unit/L7", "group/handout"]
aliases: ["CMFB: concept and sensing"]
---
# L7 · CMFB: concept and sensing

*Why fully differential outputs float*

**Reference:** Handout L7 · 1st ed §9.7.1–9.7.2 · 2nd ed §9.7.1–9.7.2 · **Lectures:** [[Lec 09]] · [[Lec 10]] · [[Lec 11]]

**Needs first:** [[L6 Gain boosting]]

## Common-mode feedback: why fully differential outputs float

**Why:** Tutorial 5 Q1 and Quiz 2: size the triode sensing devices so the output CM sits exactly where you want it.

> [!question] Predict first: A fully differential op amp has a PMOS current source (500 µA) on top and an NMOS pair drawing 500 µA below each output. Where does the output CM sit?
> a) Exactly mid-supply
> b) Nowhere definite: a 1% current mismatch drives it to a rail
> c) At VDD

> [!success]- Answer
> **Nowhere definite: a 1% current mismatch drives it to a rail**. Two current sources in series: any mismatch has to flow into a huge resistance, so the output voltage runs away. Something must measure the CM and correct it.

In a fully differential stage each output sits between two **current sources**: one on top, one below. Their currents never match exactly, and the difference has nowhere to go but into a huge Rout — so the output **common mode floats** toward a rail.

**Common-mode feedback (CMFB)** fixes it: **sense** $V_{out,CM} = (V_{out1} + V_{out2})/2$, **compare** it with a reference, and **adjust** one of the current sources.

Sensing options: two resistors R1 = R2 (simple, but they load the output: gain drops to $g_m(r_O\parallel r_O\parallel R)$), source followers, or **deep-triode devices** in the tail whose resistance depends on $V_{out1} + V_{out2}$.

**The rule**

$$V_{out,CM} = \tfrac{V_{out1} + V_{out2}}{2}$$

$$R_{tot} = \dfrac{1}{\mu_n C_{ox}\frac{W}{L}(V_{out1} + V_{out2} - 2V_{th})}$$

$$V_P = 2I_D\,R_{tot}$$

> [!important] Lock it in
> Fully differential outputs float (two current sources in series). CMFB senses Vout,CM, compares, and corrects a current source.
> **Hook:** “Sense, compare, correct.”

## Questions you can solve after this topic

- [[Tutorial 5 Q1 – size the triode CMFB devices]] · Tutorial 5 Q1 (Razavi 9.11 extended)
- [[2025 mid-sem Q4 – size the triode CMFB devices (= Tutorial 5 Q1)]] · Mid-sem 2025-26 Q4 (12 marks)
- [[2024 Quiz 2 Q2 – resistive-sensing CMFB VREF, Vin,CM and the CM gain for ±1%]] · Quiz 2 2024-25 Q2 (9 marks)

## Questions that also use it

- [[Tutorial 5 Q2 – which pair for the CMFB amplifier, and the loop gain]]
- [[Tutorial 5 Q3 – CM gain and CMRR with and without CMFB]]
- [[Quiz 2 Part A – triode-sensing CMFB on a telescopic]]
- [[Quiz 2 Part B – triode-sensing CMFB on a telescopic]]
- [[Quiz 2 Part C – triode-sensing CMFB on a telescopic]]
- [[2024 mid-sem Q1 – CMFB with R = 10 MΩ sensing (= Tutorial 5 Q3)]]

## Flashcards

[[Flashcards – L7]]

