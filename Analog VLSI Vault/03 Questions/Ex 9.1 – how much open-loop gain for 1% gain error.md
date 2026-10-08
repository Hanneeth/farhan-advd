---
tags: ["question", "source/Razavi", "unit/L1"]
aliases: ["Razavi Example 9.1"]
---
# Ex 9.1: how much open-loop gain for 1% gain error?

**Source:** Razavi Example 9.1

**Topics:** [[L1 Performance parameters]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

A non-inverting amplifier must have a closed-loop gain of 10 with a gain error below 1%. What is the minimum open-loop gain A?

| Given | Value |
|---|---|
| $A_{closed}$ | 10 |
| $\varepsilon$ | 0.01 |

**Find:** Minimum open-loop gain

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Gain error is one over loop gain.
> 2. ε = 1/(1 + βA) ≈ 1/(βA).
> 3. A ≥ Aclosed/ε.
> 4. β = 1/10.

> [!info]- Concept and formulas
> Gain error ε = 1/(1 + βA) ≈ 1/(βA). For ideal gain 1/β and error ε, A ≥ Aclosed/ε.
> $$\varepsilon \approx \dfrac{1}{\beta A},\quad A_{min} = \dfrac{A_{closed}}{\varepsilon}$$

> [!success]- Answers
> - Minimum open-loop gain: **1000**

> [!example]- Full solution
> 1. β = 1/Aclosed = 0.1
>    $$\beta = 0.1$$
> 2. Gain error ε = 1/(1 + βA) ≈ 1/(βA) ≤ 0.01
>    $$A \ge \frac{A_{closed}}{\varepsilon} = \frac{10}{0.01} = 1000\;(\text{exact: } 990)$$

