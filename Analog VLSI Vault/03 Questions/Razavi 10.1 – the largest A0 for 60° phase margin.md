---
tags: ["question", "source/Razavi", "unit/L12"]
aliases: ["Razavi Problem 10.1"]
---
# Razavi 10.1: the largest A0 for 60° phase margin

**Source:** Razavi Problem 10.1

**Topics:** [[L12 Stability II]] · **Lectures:** [[Lec 15]] · [[Lec 16]]

## Question

An amplifier with DC gain A0 has two poles, at 10 MHz and 500 MHz, and is used in unity-gain feedback. What A0 gives a phase margin of exactly 60°?

| Given | Value |
|---|---|
| $f_{p1}$ | 10 MHz |
| $f_{p2}$ | 500 MHz |
| $\beta$ | 1 |

**Find:** Gain crossover · DC gain for PM = 60°

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Work back from the phase.
> 2. −120° of loop phase at ωgx.
> 3. atan(f/10M) + atan(f/500M) = 120°, then A0 = √(1+(f/fp1)²)·√(1+(f/fp2)²).
> 4. The first pole is ≈ 88° there.

> [!info]- Concept and formulas
> PM = 60° → the second pole may take only 30° at ωgx; then set |βA| = 1 there.
> $$PM = 180^\circ - \sum\tan^{-1}(\omega_{gx}/\omega_{pi})$$

> [!success]- Answers
> - Gain crossover: **310.5 MHz**
> - DC gain for PM = 60°: **36.58 V/V**

> [!example]- Full solution
> 1. PM = 60° means the loop phase at ωgx is −120°
>    $$\tan^{-1}\frac{f_{gx}}{10\,\mathrm{MHz}} + \tan^{-1}\frac{f_{gx}}{500\,\mathrm{MHz}} = 120^\circ$$
> 2. The first pole gives almost 90°, so the second must give about 30°: fgx a bit above 500·tan 30° = 289 MHz. Exactly:
>    $$f_{gx} = 311\,\mathrm{MHz}$$
> 3. Make |βA| = 1 there
>    $$A_0 = \sqrt{1 + (31.1)^2}\,\sqrt{1 + (0.621)^2} = 36.6$$
> 4. Only about 36: two poles 50× apart leave very little room for gain at 60°

> [!abstract]- Calculator keys (fx-991CW)
> - **Degree mode:** `[SETTINGS] ▸ Calc Settings ▸ Angle Unit ▸ Degree`

