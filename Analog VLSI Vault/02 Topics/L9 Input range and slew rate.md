---
tags: ["topic", "unit/L9", "group/handout"]
aliases: ["Input range and slew rate"]
---
# L9 · Input range and slew rate

*SR = ISS/CL*

**Reference:** Handout L9 · 1st ed §9.8–9.9 · 2nd ed §9.8–9.10 · **Lectures:** [[Lec 13]] · [[Lec 14]]

**Needs first:** [[L8 CMFB techniques]]

## Slew rate: a fixed tap before the exponential

**Why:** Tutorial 6 Q1–Q3: when does an op amp slew, how long, and what limits the slew rate of a folded cascode?

> [!question] Predict first: A 5-T OTA with ISS = 200 µA drives 5 pF. Its slew rate is…
> a) 20 V/µs
> b) 40 V/µs
> c) 80 V/µs

> [!success]- Answer
> **40 V/µs**. SR = ISS/CL = 200 µA / 5 pF = 40 V/µs: when the pair is fully steered the whole tail current goes into (or out of) CL.

For a small step the output follows $1 - e^{-t/\tau}$ with initial slope $V_{final}/\tau$. But the output can only move as fast as the available current can charge $C_L$: the **slew rate** $SR$. If the linear response would need a steeper start, the op amp **slews**: a straight ramp at SR (the input pair is fully steered, $|v_d| > \sqrt{2}V_{ov}$), then the exponential finishes the job once the remaining error is $SR\cdot\tau$.

Critical step: slewing starts when $V_0 A_{CL}/\tau > SR$.
Folded cascode: if the folding current $I_P < I_{SS}$, a branch turns off and SR drops to $I_P/C_L$; with $I_P \ge I_{SS}$ it is $I_{SS}/C_L$ both ways.

> [!tip] Picture it
> A fixed tap filling a bucket: however far the level is from the mark, it cannot rise faster than the tap allows.

**The rule**

$$SR = \dfrac{I_{SS}}{C_L}$$

$$t_{slew} = \dfrac{V_{final} - SR\,\tau}{SR}$$

$$V_{0,crit} = \dfrac{SR\,\tau}{A_{CL}}$$

> [!important] Lock it in
> SR = ISS/CL (folded: needs IP ≥ ISS). Big steps ramp at SR until the error is SR·τ, then settle exponentially.
> **Hook:** “A fixed tap fills the bucket; then eat the cake.”

## Questions you can solve after this topic

- [[Tutorial 6 Q1 – linear settling versus slewing]] · Tutorial 6 Q1
- [[Tutorial 6 Q2 – a 5-T OTA slews, then settles]] · Tutorial 6 Q2
- [[Tutorial 6 Q3 – folded-cascode slew rate]] · Tutorial 6 Q3
- [[PS2 P1 – slew rate of a fully differential telescopic op amp]] · Problem Set 2 P1 (L9, Lec 14)
- [[Lab 9 – turn the two-stage buffer specs into numbers]] · Lab 9 (hand calculations)

## Flashcards

[[Flashcards – L9]]

## Symbols

[[slew rate (SR)]]
