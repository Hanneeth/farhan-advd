---
tags: ["question", "source/tutorial", "unit/L11"]
aliases: ["Past tutorial 2024-25 T2 Ex 2"]
---
# Past tutorial: two poles closing in — coincident poles and maximally flat

**Source:** Past tutorial 2024-25 T2 Ex 2

**Topics:** [[L11 Stability I]] · **Lectures:** [[Lec 14]] · [[Lec 15]]

## Question

Low-frequency gain 100, poles at 10⁴ and 10⁶ rad/s, feedback factor β. For what β do the closed-loop poles coincide? What is Q then? For what β is the response maximally flat, and what is the closed-loop gain?

| Given | Value |
|---|---|
| $A_0$ | 100 |
| $\omega_{p1}$ | 10000 rad/s |
| $\omega_{p2}$ | 1000000 rad/s |

**Find:** β for coincident poles · β for a maximally flat response · Closed-loop gain (flat case)

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Write the closed-loop denominator.
> 2. Compare with s² + (ω0/Q)s + ω0².
> 3. Coincident: Q = 0.5; flat: Q = 0.707.
> 4. Then A0/(1 + βA0).

> [!info]- Concept and formulas
> Closed loop: s² + (ωp1 + ωp2)s + (1 + βA0)ωp1ωp2 = 0. Its Q = √((1 + βA0)ωp1ωp2)/(ωp1 + ωp2). Poles coincide at Q = 0.5; maximally flat at Q = 1/√2.
> $$Q = \dfrac{\sqrt{(1+\beta A_0)\omega_{p1}\omega_{p2}}}{\omega_{p1}+\omega_{p2}}$$
> $$Q = 0.5:\ 1+\beta A_0 = \dfrac{(\omega_{p1}+\omega_{p2})^2}{4\omega_{p1}\omega_{p2}},\quad Q = \tfrac{1}{\sqrt2}:\ 1+\beta A_0 = \dfrac{(\omega_{p1}+\omega_{p2})^2}{2\omega_{p1}\omega_{p2}}$$

> [!success]- Answers
> - β for coincident poles: **0.245**
> - β for a maximally flat response: **0.5**
> - Closed-loop gain (flat case): **1.961 V/V**

> [!example]- Full solution
> 1. Coincident poles: discriminant zero (Q = 0.5)
>    $$\beta = \frac{(1.01\times10^6)^2/(4\times10^{10}) - 1}{100} = 0.245$$
> 2. Maximally flat: Q = 1/√2
>    $$\beta = 0.5$$
> 3. Closed-loop gain A0/(1 + βA0)
>    $$A_f = 1.96$$

