---
tags: ["question", "source/tutorial", "unit/L13"]
aliases: ["Past tutorial 2024-25 T2 Ex 5–6"]
---
# Past tutorial: dominant-pole compensation for closed-loop gains down to 20 dB

**Source:** Past tutorial 2024-25 T2 Ex 5–6

**Topics:** [[L13 Compensation I]] · **Lectures:** [[Lec 17]]

## Question

A multipole amplifier: first pole 1 MHz, DC gain 100 dB, second pole 10 MHz. (Ex 5) Where must a new dominant pole go so it is stable for closed-loop gains as low as 20 dB? (Ex 6) Instead, lower the first pole (second pole unchanged): to what frequency, and by what factor must that node’s capacitance grow?

| Given | Value |
|---|---|
| $A_0$ | 100000 |
| $f_{p1}$ | 1 MHz |
| $f_{p2}$ | 10 MHz |

**Find:** Ex 5: new dominant pole · Ex 6: lowered first pole · Ex 6: capacitance factor

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. 20 dB closed loop → β = 0.1.
> 2. βA0 = 10⁴ = four decades.
> 3. Unity loop gain at the next pole.
> 4. f ∝ 1/C.

> [!info]- Concept and formulas
> Gain 20 dB → β = 0.1 → βA0 = 10⁴. Make the loop gain fall at −20 dB/dec from the new pole to 0 dB exactly where the next pole sits (≈45° PM, Sedra’s rule used in this tutorial).
> $$f_D = \dfrac{f_{p1}}{\beta A_0}$$
> $$f_{p1}' = \dfrac{f_{p2}}{\beta A_0},\quad \dfrac{C_{new}}{C_{old}} = \dfrac{f_{p1}}{f_{p1}'}$$

> [!success]- Answers
> - Ex 5: new dominant pole: **100 Hz**
> - Ex 6: lowered first pole: **1 kHz**
> - Ex 6: capacitance factor: **1000**

> [!example]- Full solution
> 1. Ex 5: from βA0 = 10⁴ down to 1 at 1 MHz takes four decades
>    $$f_D = \frac{1\,\mathrm{MHz}}{10^4} = 100\,\mathrm{Hz}$$
> 2. Ex 6: now the crossover is the second pole, 10 MHz
>    $$f_{p1}' = \frac{10\,\mathrm{MHz}}{10^4} = 1\,\mathrm{kHz}$$
> 3. The pole is 1/(RC): C grows by the same factor
>    $$1000\times$$

