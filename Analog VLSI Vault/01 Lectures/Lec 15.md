---
tags: ["lecture", "lec/15"]
aliases: ["Bode plots of the loop gain; gain and phase margin; one- and two-pole systems"]
date: "11 Sep"
---
# Lec 15 · Bode plots of the loop gain; gain and phase margin; one- and two-pole systems

**Date:** 11 Sep · **Handout:** L11–L12 · **Topics:** [[L11 Stability I]] · [[L12 Stability II]]

> [!abstract] In one paragraph
> Magnitude and phase asymptotes, lowering β lowers the loop-gain curve, ωGX and ωPX, PM = 180° + ∠βA(ωGX), single-pole systems always stable (PM 90°), two-pole systems.

**Before:** [[Lec 14]] · **Next:** [[Lec 16]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec15.webp]]

Original PDF: [[Notes – lecture-15-11092026.pdf]]

## The page, item by item

### Bode asymptotes

Each pole bends the magnitude down by −20 dB/decade from $\omega_p$ and takes the phase from 0 to −90° between $0.1\omega_p$ and $10\omega_p$ (−45° at the pole).

$$|A| = \dfrac{A_0}{\sqrt{1+(\omega/\omega_{p1})^2}\sqrt{1+(\omega/\omega_{p2})^2}},\quad \angle = -\tan^{-1}\dfrac{\omega}{\omega_{p1}} - \tan^{-1}\dfrac{\omega}{\omega_{p2}}$$

### β moves the loop-gain curve

Loop gain = β × A: a smaller β (bigger closed-loop gain) shifts the whole magnitude curve **down**, so it crosses 0 dB earlier, where the phase is less negative. **β = 1 (buffer) is the hardest case.**

### Gain and phase crossover, margins

$\omega_{GX}$: where $|\beta A| = 1$. $\omega_{PX}$: where $\angle\beta A = -180^\circ$. Stable when $\omega_{GX} < \omega_{PX}$.

$$PM = 180^\circ + \angle\beta A(j\omega)\big|_{\omega=\omega_{GX}}$$

$$GM = -20\log|\beta A(j\omega_{PX})|$$

### Single-pole system: always stable

One pole gives at most −90°, so PM = 180° − 90° = 90°. Closed loop, the pole moves up to $\omega_{p1}(1 + \beta A_0)$ and the gain drops by the same factor.

$$PM = 180^\circ - 90^\circ = 90^\circ$$

$$A_f = \dfrac{A_0}{(1+\beta A_0)\left(1+\frac{s}{\omega_{p1}(1+\beta A_0)}\right)}$$

### Two-pole system

Phase heads to −180°; the closer the second pole is to the crossover, the smaller the PM. Unity-gain frequency $\omega_u$ = GBW for the first pole.

## Explained step by step

The Bode plot of each pole: the gain is flat until $\omega_p$, is 3 dB down at $\omega_p$, then falls 20 dB per decade. The phase starts moving a decade **early**: about −6° at $0.1\omega_p$, **−45° at $\omega_p$**, about −84° at $10\omega_p$, heading to −90°.

![[s-lec15-bode.svg]]

So every pole can cost up to 90° of phase — two poles can approach −180°.

The loop gain is $\beta A$, so in dB the β-curve is the $A$-curve shifted **down** by $20\log(1/\beta)$. A smaller β (bigger closed-loop gain) lowers the whole curve: it crosses 0 dB **earlier**, where less phase has been used — safer. β = 1 (a unity-gain buffer) gives the highest curve, so the **buffer is the hardest case to stabilise**.

Two crossover frequencies: the **gain crossover** $\omega_{GX}$, where $|\beta A| = 1$ (0 dB), and the **phase crossover** $\omega_{PX}$, where the phase reaches −180°. For a stable loop $\omega_{GX}$ comes first.

The **phase margin** measures the distance from oscillation at the gain crossover: $PM = 180° + \angle\beta A(\omega_{GX})$. Recipe: find $\omega_{GX}$ first, then add up the pole angles there.

One pole can give at most −90°, so the phase never reaches −180°: a one-pole loop is **always stable**, with PM = 90°. Closing the loop simply moves the pole up by the loop gain: $\omega_p' = \omega_{p1}(1 + \beta A_0)$ — the Lec 3 and Lec 13 result again.

Two poles: the phase heads towards −180°. How much margin you get depends on where the **second pole** sits relative to the crossover: the closer it is to $\omega_{GX}$, the more phase it has already eaten, and the smaller the PM. Pushing the second pole well above crossover (about 1.7× for PM ≈ 60°) keeps the loop comfortable.

## Questions that use this lecture

- [[Razavi 10.1 – the largest A0 for 60° phase margin]] · Razavi Problem 10.1
- [[Razavi 10.2 – two equal poles, 60° margin, gain 1 and gain 4]] · Razavi Problem 10.2
- [[Razavi 10.3 – A0 = 1000 with two close poles]] · Razavi Problem 10.3
- [[Razavi 10.4 – 50% peaking → what phase margin]] · Razavi Problem 10.4
- [[Lec 16 – how much the closed loop peaks at PM = 5°, 45°, 60°]] · Lecture notes Lec 16
- [[PS2 P2 – phase margin at gain 1 and at gain 5]] · Problem Set 2 P2 (L11–L12)
- [[2025 mid-sem Q5 – phase margin of two close poles, and PM from 50% peaking]] · Mid-sem 2025-26 Q5 (9 marks)
- [[2023 mid-sem Q5 – peaking factor K at PM 50°; Cc vs CL for 45°]] · Mid-sem 2023-24 Q5 (5 marks)
- [[Past tutorial – how far feedback moves a single pole]] · Past tutorial 2024-25 T2 Ex 1
- [[Past tutorial – two poles closing in — coincident poles and maximally flat]] · Past tutorial 2024-25 T2 Ex 2
- [[Past tutorial – crossover and PM of a one-pole op amp at gain 100]] · Past tutorial 2024-25 T2 Ex 3
- [[Past tutorial – closed-loop gain at ω1 for PM 30°, 60°, 90°]] · Past tutorial 2024-25 T2 Ex 4

## Animated lessons

- [[Analog Lab Lec 15-17 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – L11]] · [[Flashcards – L12]]

