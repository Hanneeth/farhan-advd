---
tags: ["question", "source/tutorial", "unit/U10", "unit/U7"]
aliases: ["Tutorial 1 Q2"]
---
# Tutorial 1 Q2: pair with diode-connected PMOS loads

**Source:** Tutorial 1 Q2

**Topics:** [[U10 Differential pair]] · [[U7 CS with every load + degeneration]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

> [!quote] Tutorial 1, Question 2 (as printed)
> ![[t1q2.webp]]

## Question

The drain resistors of an NMOS pair are replaced by diode-connected PMOS Q3, Q4. (a) Use the half circuit to write Ad with gm and rO. (b) Neglecting rO, write Ad with µn, µp and the W/L’s. (c) µn = 4µp and equal L: find W1,2/W3,4 for Ad = 10.

| Given | Value |
|---|---|
| $A_d$ | 10 V/V |
| $\mu_n/\mu_p$ | 4 |

**Find:** Width ratio

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Diode loads look like 1/gm.
> 2. Ad = gm1/gm3 when rO is neglected.
> 3. gm = √(2µCox(W/L)ID); the same ID flows in Q1 and Q3.
> 4. Ad² = (µn/µp)·(W1/W3).

> [!info]- Concept and formulas
> A diode load looks like 1/gm3. Without rO the gain is a ratio of transconductances, and the bias current cancels.
> $$A_d = g_{m1}\left(r_{O1}\parallel r_{O3}\parallel \tfrac{1}{g_{m3}}\right) \approx \dfrac{g_{m1}}{g_{m3}} = \sqrt{\dfrac{\mu_n(W/L)_1}{\mu_p(W/L)_3}}$$

> [!success]- Answers
> - Width ratio: **25**

> [!example]- Full solution
> 1. Half circuit: Q1 is a CS stage, its load Q3 is a diode
> 2. (a) Diode load = 1/gm3 ‖ rO3; everything at the drain in parallel
>    $$A_d = g_{m1}\left(\tfrac{1}{g_{m3}} \parallel r_{O1} \parallel r_{O3}\right)$$
> 3. (b) Without rO: a ratio of two gm’s, and the current cancels
>    $$A_d = \frac{g_{m1}}{g_{m3}} = \sqrt{\frac{\mu_n (W/L)_{1,2}}{\mu_p (W/L)_{3,4}}}$$
> 4. (c) Square both sides, equal L
>    $$\frac{W_{1,2}}{W_{3,4}} = \frac{A_d^2}{\mu_n/\mu_p} = \frac{10^2}{4} = 25$$

> [!note]- Class solution (handwritten), Tutorial 1 Q2
> ![[k-t1q2.webp]]

