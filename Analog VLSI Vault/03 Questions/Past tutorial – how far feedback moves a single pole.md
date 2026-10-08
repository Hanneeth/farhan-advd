---
tags: ["question", "source/tutorial", "unit/L11"]
aliases: ["Past tutorial 2024-25 T2 Ex 1"]
---
# Past tutorial: how far feedback moves a single pole

**Source:** Past tutorial 2024-25 T2 Ex 1

**Topics:** [[L11 Stability I]] · **Lectures:** [[Lec 14]] · [[Lec 15]]

## Question

An op amp with one pole at 100 Hz and low-frequency gain 10⁵ is used with β = 0.01. By what factor does feedback shift the pole, and to what frequency? If β gives a closed-loop gain of +1, where does the pole go?

| Given | Value |
|---|---|
| $A_0$ | 100000 |
| $f_p$ | 100 Hz |

**Find:** Pole with β = 0.01 · Pole with β = 1

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Feedback trades gain for bandwidth.
> 2. The pole moves by (1 + βA0).
> 3. β = 0.01 → 1 + 1000.
> 4. β = 1 → the pole reaches GBW.

> [!info]- Concept and formulas
> Closing the loop divides the gain and multiplies the pole by the same factor (1 + βA0): gain × bandwidth stays constant.
> $$f_p' = f_p(1 + \beta A_0),\quad A_f = \dfrac{A_0}{1+\beta A_0}$$

> [!success]- Answers
> - Pole with β = 0.01: **100.1 kHz**
> - Pole with β = 1: **10 MHz**

> [!example]- Full solution
> 1. Factor 1 + βA0 = 1001
>    $$f_p' = 100\times 1001 = 100\,\mathrm{kHz}$$
> 2. Gain +1 means β = 1: factor 100001
>    $$f_p'' = 10\,\mathrm{MHz}$$

