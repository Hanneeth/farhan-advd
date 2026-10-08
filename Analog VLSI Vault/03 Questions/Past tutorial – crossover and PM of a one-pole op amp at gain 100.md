---
tags: ["question", "source/tutorial", "unit/L12"]
aliases: ["Past tutorial 2024-25 T2 Ex 3"]
---
# Past tutorial: crossover and PM of a one-pole op amp at gain 100

**Source:** Past tutorial 2024-25 T2 Ex 3

**Topics:** [[L12 Stability II]] · **Lectures:** [[Lec 15]] · [[Lec 16]]

## Question

A0 = 10⁵, fp = 10 Hz, otherwise ideal, non-inverting with closed-loop gain 100. Find the frequency where |Aβ| = 1, and the phase margin.

| Given | Value |
|---|---|
| $A_0$ | 100000 |
| $f_p$ | 10 Hz |

**Find:** Frequency where |Aβ| = 1 · Phase margin

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. β = 1/(closed-loop gain).
> 2. |βA| = βA0/√(1 + (f/fp)²).
> 3. One pole: phase ≥ −90°.
> 4. So PM ≈ 90°.

> [!info]- Concept and formulas
> β = 1/100, so βA0 = 1000: the loop gain crosses 1 three decades above the pole. One pole can never take more than 90°.
> $$f_1 = f_p\sqrt{(\beta A_0)^2 - 1} \approx \beta A_0 f_p$$
> $$PM = 180^\circ - \tan^{-1}(f_1/f_p)$$

> [!success]- Answers
> - Frequency where |Aβ| = 1: **10 kHz**
> - Phase margin: **90.06 °**

> [!example]- Full solution
> 1. βA0 = 1000
>    $$f_1 = 10\,\mathrm{kHz}$$
> 2. PM
>    $$PM = 180^\circ - \tan^{-1}(1000) = 90.06^\circ$$

