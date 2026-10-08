---
tags: ["question", "source/tutorial", "unit/L12"]
aliases: ["Past tutorial 2024-25 T2 Ex 4"]
---
# Past tutorial: closed-loop gain at ω1 for PM 30°, 60°, 90°

**Source:** Past tutorial 2024-25 T2 Ex 4

**Topics:** [[L12 Stability II]] · **Lectures:** [[Lec 15]] · [[Lec 16]]

## Question

Find the closed-loop gain at ω1 (where |Aβ| = 1) relative to the low-frequency gain, for phase margins of 30°, 60° and 90°.

| Given | Value |
|---|---|
| $|A\beta(\omega_1)|$ | 1 |

**Find:** PM = 30° · PM = 60° · PM = 90°

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. At ω1, Aβ = 1∠(PM − 180°).
> 2. |1 + e^{jθ}| = 2|cos(θ/2)|.
> 3. With θ = PM − 180°, that is 2 sin(PM/2).
> 4. K = 1/(2 sin(PM/2)).

> [!info]- Concept and formulas
> Same as Lec 16: at ω1 the denominator is |1 + e^{−j(180°−PM)}| = 2 sin(PM/2).
> $$K = \dfrac{1}{2\sin(PM/2)}$$

> [!success]- Answers
> - PM = 30°: **1.932**
> - PM = 60°: **1**
> - PM = 90°: **0.7071**

> [!example]- Full solution
> 1. PM 30°: peaks
>    $$K = 1.932$$
> 2. PM 60°: exactly no peak
>    $$K = 1$$
> 3. PM 90°: the usual −3 dB point
>    $$K = 0.7071$$

