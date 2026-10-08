---
tags: ["question", "source/worked-example", "unit/L12"]
aliases: ["Lecture notes Lec 16"]
---
# Lec 16: how much the closed loop peaks at PM = 5°, 45°, 60°

**Source:** Lecture notes Lec 16

**Topics:** [[L12 Stability II]] · **Lectures:** [[Lec 15]] · [[Lec 16]]

## Question

Your Lec 16 notes compute |Af(ωgx)| for three phase margins. Using |βA(ωgx)| = 1, find |Af(ωgx)| as a multiple of 1/β for PM = 5°, 45° and 60°.

| Given | Value |
|---|---|
| $|\beta A(\omega_{gx})|$ | 1 |

**Find:** Peak at PM 5° · Peak at PM 45° · Peak at PM 60°

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Put |βA| = 1 at ωgx.
> 2. Write βA as cos θ + j sin θ with θ = PM − 180°.
> 3. |Af|β = 1/|1 + βA|.
> 4. 5° → about 11.5.

> [!info]- Concept and formulas
> At ωgx the closed loop is (1/β)/(2 sin(PM/2)).
> $$K = \dfrac{1}{2\sin(PM/2)}$$

> [!success]- Answers
> - Peak at PM 5°: **11.46**
> - Peak at PM 45°: **1.307**
> - Peak at PM 60°: **1**

> [!example]- Full solution
> 1. At ωgx, βA = 1·e^{−j(180° − PM)}; PM = 5° → ∠βA = −175°
>    $$|A_f| = \frac{1}{\beta}\left|\frac{e^{-j175^\circ}}{1 + e^{-j175^\circ}}\right| = \frac{1}{\beta}\cdot\frac{1}{|0.0038 - j0.0872|} = \frac{11.5}{\beta}$$
> 2. PM = 45° → ∠βA = −135°
>    $$\frac{1}{|0.293 - j0.707|} = 1.31$$
> 3. PM = 60° → ∠βA = −120°: exactly no peak
>    $$\frac{1}{|0.5 - j0.866|} = 1$$
> 4. Shortcut for all three: 1/(2 sin(PM/2))

