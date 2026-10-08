---
tags: ["question", "source/problem-set", "unit/L10"]
aliases: ["Problem Set 2 P6 (L10)"]
---
# PS2 P6: noise of a folded cascode

**Source:** Problem Set 2 P6 (L10)

**Topics:** [[L10 PSRR and noise]] · **Lectures:** 

## Question

A folded-cascode op amp has input gm1,2 = 2 mS, top current sources gm7,8 = 1 mS and bottom current sources gm9,10 = 1.5 mS. γ = 2/3, T = 300 K. (a) Input-referred thermal noise density. (b) What fraction of the noise power comes from the current sources?

| Given | Value |
|---|---|
| $g_{m1}$ | 2 mS |
| $g_{m7}$ | 1 mS |
| $g_{m9}$ | 1.5 mS |

**Find:** (a) Input noise · (b) Share from current sources (0–1)

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Which gates, when wiggled, move the output?
> 2. Current sources count as gm/gm1².
> 3. 8kTγ(1/gm1 + gm7/gm1² + gm9/gm1²).
> 4. Terms: 500, 250, 375 (in 1/S).

> [!success]- Answers
> - (a) Input noise: **4.985 nV/√Hz**
> - (b) Share from current sources (0–1): **0.5556**

> [!example]- Full solution
> 1. Wiggle each gate: M1–2, M7–8 and M9–10 all move the output; the cascodes do not
>    $$\overline{V_n^2} = 8kT\gamma\left(\frac{1}{g_{m1}} + \frac{g_{m7}}{g_{m1}^2} + \frac{g_{m9}}{g_{m1}^2}\right) = 2.21\times 10^{-20}(500 + 250 + 375)$$
> 2. (a) Square root
>    $$\overline{V_n} = 4.99\,\mathrm{nV/\sqrt{Hz}}$$
> 3. (b) (250 + 375)/1125: more than half from the current sources: folding costs noise
>    $$0.556$$

