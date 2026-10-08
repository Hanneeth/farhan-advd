---
tags: ["lecture", "lec/16"]
aliases: ["Phase margin and closed-loop peaking; step responses for PM 45°, 60°, 90°"]
date: "16 Sep"
---
# Lec 16 · Phase margin and closed-loop peaking; step responses for PM 45°, 60°, 90°

**Date:** 16 Sep · **Handout:** L12 · **Topics:** [[L12 Stability II]]

> [!abstract] In one paragraph
> A two-pole amplifier with β = 1, what a small PM does to the closed-loop gain at ωGX (5° → 11.5/β, 45° → 1.3/β, 60° → 1/β), and the step responses.

**Before:** [[Lec 15]] · **Next:** [[Lec 17]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec16.webp]]

Original PDF: [[Notes – lecture-16-16092026.pdf]]

## The page, item by item

### Two-pole amplifier, β = 1

−20 dB/decade after $\omega_{p1}$, −40 dB/decade after $\omega_{p2}$; the phase heads to −180°.

$$PM = 180^\circ - |\angle\beta A(j\omega_{GX})|$$

### Closed-loop gain at ωGX

At $\omega_{GX}$, $|\beta A| = 1$, so $|A| = 1/\beta$ and the closed-loop gain is $\frac{1}{\beta}\cdot\frac{1}{|1 + e^{-j(180^\circ - PM)}|}$. PM = 5° gives $11.5/\beta$ (your page: 11.5/β, via $|0.0038 - j0.087|$); 45° gives $1.3/\beta$; 60° gives exactly $1/\beta$ (no peaking).

- $A_f(j\omega) = \dfrac{|A(j\omega)|e^{-j\angle A}}{1 + |\beta A(j\omega)|e^{-j\angle\beta A}}$
- PM = 5°: $|A_f(j\omega_{GX})| = \dfrac{\frac{1}{\beta}}{|1 + e^{-j175^\circ}|} = \dfrac{1}{\beta}\cdot\dfrac{1}{|1 + \cos175^\circ - j\sin175^\circ|}$

$$PM = 5^\circ: 11.5/\beta,\quad 45^\circ: 1.3/\beta,\quad 60^\circ: 1/\beta$$

> [!question] Asked in exams
> Razavi Problem 10.4 style: PM from a measured peak, or the peak from a PM.

### Step responses

Small PM → a peak in the frequency response and **ringing** in the step response. PM = 60°: a fast response with a tiny overshoot (the usual target). PM = 90°: no overshoot but slower.

### Reading the loop gain off the plot

$20\log|A| - 20\log\frac{1}{\beta} = 20\log|\beta A|$: draw the horizontal line at $1/\beta$ on the open-loop plot; where they meet is $\omega_{GX}$.

$$20\log|A(j\omega)| - 20\log\tfrac{1}{\beta} = 20\log|\beta A(j\omega)|$$

## Explained step by step

A two-pole amplifier with β = 1: the gain falls at −20 dB/dec after the first pole and −40 dB/dec after the second, while the phase heads to −180°.

Reading PM on the plots: find where the gain curve crosses 0 dB (that is $\omega_{GX}$), drop down to the phase curve, read the phase there, and measure how far it is from −180°: $PM = 180° - |\angle\beta A(\omega_{GX})|$.

Why a small PM means a big **peak**. At $\omega_{GX}$, $|\beta A| = 1$, so $|A| = 1/\beta$, and the closed-loop gain is $\dfrac{1/\beta}{|1 + \beta A|}$. Picture $1 + \beta A$ as two arrows of length 1: one is “1”, the other is βA pointing at $-(180° - PM)$. With small PM they point almost opposite and nearly **cancel**, so $|1 + \beta A|$ is tiny and the gain shoots up.

![[s-lec16-pm.svg]]

The exact size: $|1 + \beta A| = 2\sin(PM/2)$, so $|A_{closed}(\omega_{GX})| = \dfrac{1}{\beta}\cdot\dfrac{1}{2\sin(PM/2)}$. For PM = 5°: $1/(2\sin 2.5°) = 11.5$ — a peak of $11.5/\beta$.

With more margin the arrows open up. PM = 45°: $1/(2\sin 22.5°) = 1.3$ — still a 30 % peak. PM = 60°: $1/(2\sin 30°) = 1$ exactly — the gain at crossover equals the ideal $1/\beta$, **no peak**. Memorise 45 → 1.3, 60 → 1.0.

Peaking in frequency is **ringing** in time. A small PM rings for a long time; PM ≈ 60° is the sweet spot — fast, with only a small overshoot; PM = 90° has no overshoot but is slow.

![[s-lec16-steps.svg]]

A shortcut for reading the loop gain off an open-loop plot: in dB, $20\log|\beta A| = 20\log|A| - 20\log(1/\beta)$. So draw a horizontal line at $20\log(1/\beta)$ on the $|A|$ plot: where the $|A|$ curve meets that line is exactly $\omega_{GX}$ of the loop.

## Questions that use this lecture

- [[Razavi 10.1 – the largest A0 for 60° phase margin]] · Razavi Problem 10.1
- [[Razavi 10.2 – two equal poles, 60° margin, gain 1 and gain 4]] · Razavi Problem 10.2
- [[Razavi 10.3 – A0 = 1000 with two close poles]] · Razavi Problem 10.3
- [[Razavi 10.4 – 50% peaking → what phase margin]] · Razavi Problem 10.4
- [[Lec 16 – how much the closed loop peaks at PM = 5°, 45°, 60°]] · Lecture notes Lec 16
- [[PS2 P2 – phase margin at gain 1 and at gain 5]] · Problem Set 2 P2 (L11–L12)
- [[2025 mid-sem Q5 – phase margin of two close poles, and PM from 50% peaking]] · Mid-sem 2025-26 Q5 (9 marks)
- [[2023 mid-sem Q5 – peaking factor K at PM 50°; Cc vs CL for 45°]] · Mid-sem 2023-24 Q5 (5 marks)
- [[Past tutorial – crossover and PM of a one-pole op amp at gain 100]] · Past tutorial 2024-25 T2 Ex 3
- [[Past tutorial – closed-loop gain at ω1 for PM 30°, 60°, 90°]] · Past tutorial 2024-25 T2 Ex 4

## Animated lessons

- [[Analog Lab Lec 15-17 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – L12]]

