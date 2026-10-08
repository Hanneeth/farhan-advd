---
tags: ["question", "source/problem-set", "unit/L12"]
aliases: ["Problem Set 2 P2 (L11–L12)"]
---
# PS2 P2: phase margin at gain 1 and at gain 5

**Source:** Problem Set 2 P2 (L11–L12)

**Topics:** [[L12 Stability II]] · **Lectures:** [[Lec 15]] · [[Lec 16]]

## Question

An op amp has A0 = 2000 and poles at 50 kHz and 50 MHz. Find ωgx and the phase margin (a) as a unity-gain buffer and (b) with β = 0.2. (c) How much does the buffer peak at ωgx?

| Given | Value |
|---|---|
| $A_0$ | 2000 |
| $f_{p1}$ | 50 kHz |
| $f_{p2}$ | 50 MHz |

**Find:** (a) ωgx · (a) PM · (b) PM · (c) Peak of the buffer

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. βA0·fp1 = 100 MHz: that is above fp2!
> 2. Solve the quadratic in f².
> 3. Lower β = more stable.
> 4. fgx ≈ 62.5 MHz for the buffer.

> [!info]- Concept and formulas
> Find ωgx from |βA| = 1, then PM; with β < 1 the curve drops and ωgx moves left (more PM).
> $$PM = 180^\circ - \tan^{-1}\tfrac{f_{gx}}{f_{p1}} - \tan^{-1}\tfrac{f_{gx}}{f_{p2}}$$

> [!success]- Answers
> - (a) ωgx: **62.48 MHz**
> - (a) PM: **38.71 °**
> - (b) PM: **69.62 °**
> - (c) Peak of the buffer: **1.509**

> [!example]- Full solution
> 1. (a) βA0 = 2000; solve (1 + f²/fp1²)(1 + f²/fp2²) = 2000²
>    $$f_{gx} = 62.5\,\mathrm{MHz}$$
> 2. PM = 180° − atan(fgx/fp1) − atan(fgx/fp2)
>    $$PM = 38.7^\circ$$
> 3. (b) β = 0.2: the gain curve drops by 14 dB, ωgx moves left, the phase there is kinder
>    $$f_{gx} = 18.7\,\mathrm{MHz},\; PM = 69.6^\circ$$
> 4. (c) 1/(2 sin(PM/2)) for the buffer
>    $$1.51$$

