---
tags: ["question", "source/Razavi", "unit/L12"]
aliases: ["Razavi Problem 10.2"]
---
# Razavi 10.2: two equal poles, 60° margin, gain 1 and gain 4

**Source:** Razavi Problem 10.2

**Topics:** [[L12 Stability II]] · **Lectures:** [[Lec 15]] · [[Lec 16]]

## Question

An amplifier has two poles at the same frequency ωp. What is the largest DC gain A0 for a 60° phase margin when the closed-loop gain is (a) 1 and (b) 4?

| Given | Value |
|---|---|
| $f_{p1} = f_{p2}$ | 1 MHz |

**Find:** (a) Closed-loop gain 1 · (b) Closed-loop gain 4

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Equal poles share the phase equally.
> 2. Each gives 60° at ωgx: ωgx = ωp·tan 60°.
> 3. |βA| = βA0/(1 + (ωgx/ωp)²) = βA0/4.
> 4. βA0 = 4.

> [!info]- Concept and formulas
> Two equal poles: each gives 60° at ωgx for PM 60°, i.e. ωgx = √3·ωp, where |βA| = βA0/4 = 1.
> $$|\beta A(\omega_{gx})| = \dfrac{\beta A_0}{1 + (\omega_{gx}/\omega_p)^2}$$

> [!success]- Answers
> - (a) Closed-loop gain 1: **4 V/V**
> - (b) Closed-loop gain 4: **16 V/V**

> [!example]- Full solution
> 1. Each pole must give 60° at ωgx (together 120°)
>    $$2\tan^{-1}\frac{\omega_{gx}}{\omega_p} = 120^\circ \Rightarrow \omega_{gx} = \sqrt{3}\,\omega_p$$
> 2. There |βA| = βA0/(1 + 3) = 1
>    $$\beta A_0 = 4$$
> 3. (a) β = 1
>    $$A_0 = 4$$
> 4. (b) β = 1/4: weaker feedback allows four times the gain
>    $$A_0 = 16$$

