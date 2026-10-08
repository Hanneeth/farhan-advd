---
tags: ["question", "source/Razavi", "unit/L14"]
aliases: ["Razavi Example 10.6"]
---
# Razavi Ex 10.6: first estimate of CC for 45°

**Source:** Razavi Example 10.6

**Topics:** [[L14 Compensation II]] · **Lectures:** [[Lec 17]]

## Question

A Miller-compensated two-stage op amp has first-stage gm1 = 1 mS, second-stage gm9 = 5 mS and CL = 2 pF. Estimate CC for a 45° phase margin in unity-gain feedback: (a) ignoring the second pole’s effect on the magnitude, (b) including it.

| Given | Value |
|---|---|
| $g_{m1}$ | 1 mS |
| $g_{m9}$ | 5 mS |
| $C_L$ | 2 pF |

**Find:** (a) CC = (gm1/gm9)·CL · (b) including ωp2 in |βA|

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. GBW = gm1/CC, second pole ≈ gm9/CL.
> 2. 45°: put the gain crossover on the second pole.
> 3. gm1/CC = gm9/CL.
> 4. CC = 0.4 pF.

> [!success]- Answers
> - (a) CC = (gm1/gm9)·CL: **400 fF**
> - (b) including ωp2 in |βA|: **282.8 fF**

> [!example]- Full solution
> 1. After compensation: p1 ≈ 1/(gm9RLCCRS), p2 ≈ gm9/CL. For 45° the loop gain must reach 1 right at p2
> 2. Loop gain above p1 falls as gm1/(ωCC); set it to 1 at ω = gm9/CL
>    $$C_C = \frac{g_{m1}}{g_{m9}}C_L = 0.4\,\mathrm{pF}$$
> 3. At p2 the second pole already cuts |βA| by √2
>    $$C_C = \frac{g_{m1}}{\sqrt{2}\,g_{m9}}C_L = 0.283\,\mathrm{pF}$$
> 4. A starting point: real designs use a larger CC (60°) and a smaller one if β < 1

