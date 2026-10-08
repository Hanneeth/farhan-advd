---
tags: ["topic", "unit/L12", "group/handout"]
aliases: ["Stability II"]
---
# L12 · Stability II

*Phase and gain margin*

**Reference:** Handout L12 · 1st ed §10.3 · 2nd ed §10.3 · **Lectures:** [[Lec 15]] · [[Lec 16]]

**Needs first:** [[L11 Stability I]]

## Phase margin and gain margin: how far from the cliff

**Why:** Lec 15 defines PM = 180° + ∠βA at ωgx; Razavi 10.1–10.3 ask for PM or the largest A0 for a given PM.

> [!question] Predict first: At ωgx the loop phase is −135°. The phase margin is…
> a) 135°
> b) 45°
> c) −45°

> [!success]- Answer
> **45°**. PM = 180° + ∠βA(ωgx) = 180° − 135° = 45°: how many degrees are left before the −180° cliff.

Two distances from Barkhausen’s cliff:

**Phase margin** $PM$ = 180° + ∠βA at $\omega_{gx}$: how much more lag would make it oscillate.
**Gain margin** $GM$ = how far below 0 dB |βA| is at $\omega_{px}$.

To compute PM (Lec 15): first find ωgx where $|\beta A| = 1$, then add up the pole angles there: $PM = 180^\circ - \sum\tan^{-1}(\omega_{gx}/\omega_{pi})$.

Backwards (Razavi 10.1): pick the phase you need at ωgx, solve for that frequency, then choose $A_0$ so $|\beta A| = 1$ there. Useful fact: if ωgx lands exactly on the second pole, PM = 45° (Razavi Ex 10.4).

**The rule**

$$PM = 180^\circ + \angle\beta A(j\omega_{gx})$$

$$GM = -20\log_{10}|\beta A(j\omega_{px})|$$

$$\text{two poles: } PM = 180^\circ - \tan^{-1}\tfrac{\omega_{gx}}{\omega_{p1}} - \tan^{-1}\tfrac{\omega_{gx}}{\omega_{p2}}$$

> [!important] Lock it in
> PM = 180° + ∠βA at ωgx; GM = −20log|βA| at ωpx. Find ωgx first, then add the pole angles. ωgx on the second pole → 45°.
> **Hook:** “Degrees left before the cliff.”

## What phase margin looks like: peaking and ringing

**Why:** Lec 16 works out |Af(ωgx)| for PM = 5°, 45°, 60°: 11.5/β, 1.3/β, 1/β. Razavi 10.4 asks the reverse.

> [!question] Predict first: At PM = 60°, how much does the closed-loop gain peak at ωgx?
> a) not at all: exactly 1/β
> b) 30% (1.3/β)
> c) 11.5/β

> [!success]- Answer
> **not at all: exactly 1/β**. At ωgx, βA = 1∠−120°, so 1 + βA = 0.5 − j0.866, whose size is exactly 1. |Af| = (1/β)·1/1.

At $\omega_{gx}$ the loop gain is $1\angle(PM - 180^\circ)$, so the closed loop there is
$|A_f(\omega_{gx})| = \dfrac{1}{\beta}\cdot\dfrac{1}{|1 + \beta A|} = \dfrac{1}{\beta}\cdot\dfrac{1}{2\sin(PM/2)}$.

Lec 16’s three cases: PM 5° → 11.5/β (nearly an oscillator, rings for a long time); 45° → 1.3/β (30% peak, visible ringing); 60° → exactly 1/β (no peak, small overshoot, fastest clean settling). More than 60° is stable but sluggish.

That is why the target is about **60°**. Remember it is a small-signal idea: big steps also slew.

> [!tip] Picture it
> A car’s suspension: too little damping (small PM) and it bounces; too much (90°) and it is stiff and slow; about 60° is the comfortable ride.

**The rule**

$$|A_f(\omega_{gx})| = \dfrac{1}{\beta}\cdot\dfrac{1}{2\sin(PM/2)}$$

$$5^\circ \to 11.5,\quad 45^\circ \to 1.3,\quad 60^\circ \to 1.0\;(\times 1/\beta)$$

> [!note]
> Allen’s rule of thumb: fewer than about three rings in the step means PM ≥ 45°. PM is a small-signal guide; a big step also slews (Razavi).

> [!important] Lock it in
> |Af(ωgx)| = (1/β)/(2 sin(PM/2)): 5° → 11.5, 45° → 1.3, 60° → 1.0. Aim for ≈ 60°: no peaking, fast settling.
> **Hook:** “60° rides smoothly.”

## Questions you can solve after this topic

- [[Razavi 10.1 – the largest A0 for 60° phase margin]] · Razavi Problem 10.1
- [[Razavi 10.2 – two equal poles, 60° margin, gain 1 and gain 4]] · Razavi Problem 10.2
- [[Razavi 10.3 – A0 = 1000 with two close poles]] · Razavi Problem 10.3
- [[Razavi 10.4 – 50% peaking → what phase margin]] · Razavi Problem 10.4
- [[Lec 16 – how much the closed loop peaks at PM = 5°, 45°, 60°]] · Lecture notes Lec 16
- [[PS2 P2 – phase margin at gain 1 and at gain 5]] · Problem Set 2 P2 (L11–L12)
- [[2025 mid-sem Q5 – phase margin of two close poles, and PM from 50% peaking]] · Mid-sem 2025-26 Q5 (9 marks)
- [[Past tutorial – crossover and PM of a one-pole op amp at gain 100]] · Past tutorial 2024-25 T2 Ex 3
- [[Past tutorial – closed-loop gain at ω1 for PM 30°, 60°, 90°]] · Past tutorial 2024-25 T2 Ex 4

## Questions that also use it

- [[2023 mid-sem Q5 – peaking factor K at PM 50°; Cc vs CL for 45°]]

## Flashcards

[[Flashcards – L12]]

## Symbols

[[phase margin (PM)]] · [[gain crossover (omegagx)]] · [[gain margin (GM)]] · [[phase crossover (omegapx)]]
