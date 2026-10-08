---
tags: ["lecture", "lec/14"]
aliases: ["Slewing in the telescopic and folded cascode; the concept of stability; Barkhausen"]
date: "9 Sep"
---
# Lec 14 · Slewing in the telescopic and folded cascode; the concept of stability; Barkhausen

**Date:** 9 Sep · **Handout:** L9, L11 · **Topics:** [[L9 Input range and slew rate]] · [[L11 Stability I]]

> [!abstract] In one paragraph
> Each output of a fully differential telescopic slews at ISS/2CL (the difference at ISS/CL); the folded cascode slews from IP; loop gain βA(s) and the Barkhausen condition.

**Before:** [[Lec 13]] · **Next:** [[Lec 15]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec14.webp]]

Original PDF: [[Notes – lecture-14-09092026.pdf]]

## The page, item by item

### Telescopic slewing (fully differential)

M2 off: one output loses $I_{SS}/2$, the other gains $I_{SS}/2$ (from the top sources). Each output slews at $I_{SS}/2C_L$; the difference at $I_{SS}/C_L$.

$$\dfrac{dV_{out1}}{dt} = -\dfrac{I_{SS}}{2C_L},\quad \dfrac{dV_{out}}{dt}\Big|_{max} = \dfrac{dV_{out1}}{dt} - \dfrac{dV_{out2}}{dt} = -\dfrac{I_{SS}}{C_L}$$

### Folded-cascode slewing

With the input pair fully steered, the folding branch on one side carries $I_P - I_{SS}$ and the other $I_P$; the output slews from the difference (set by $I_P$ and $I_{SS}$).

> [!question] Asked in exams
> Tutorial 6 Q3: slewing of a folded cascode.

### Concept of stability: the feedback loop

Closed-loop gain $X_o/X_s = A(s)/(1 + \beta(s)A(s))$. The **loop gain** is $\beta(s)A(s)$; with a resistive β it is frequency independent, so $\beta A(s)$.

$$\dfrac{X_o}{X_s}(s) = \dfrac{A(s)}{1+\beta(s)A(s)}$$

$$A(s) = \dfrac{A_M}{\left(1+\frac{s}{\omega_{p1}}\right)\left(1+\frac{s}{\omega_{p2}}\right)}$$

### Barkhausen criteria

If at some frequency $\omega_1$ the loop gain is exactly 1 with −180° of phase, the denominator $1 + \beta A$ becomes 0 and the closed-loop gain is infinite: the circuit oscillates.

$$|\beta A(j\omega_1)| = 1,\quad \angle\beta A(j\omega_1) = -180^\circ \Rightarrow A_f(j\omega_1) = \infty$$

### Complex numbers you need

Magnitude and angle of $a + jb$; for each pole factor $(1 + j\omega/\omega_p)$ the angle is $\tan^{-1}(\omega/\omega_p)$.

$$a + jb = Me^{j\theta} = M(\cos\theta + j\sin\theta)$$

$$M = \sqrt{a^2+b^2},\quad \theta = \tan^{-1}\dfrac{b}{a}$$

## Explained step by step

Slewing in the telescopic: when M2 turns off, M1 carries the whole $I_{SS}$. Each output’s capacitor then sees an imbalance of $I_{SS}/2$ (its top source still gives $I_{SS}/2$): one output falls at $I_{SS}/(2C_L)$ while the other rises at the same rate. Their **difference** moves twice as fast:

$\dfrac{dV_{out,d}}{dt} = \dfrac{I_{SS}}{C_L}$.

Slewing in the folded cascode: each folding branch carries $I_P - I_{D,input}$. In a big step one input device takes all of $I_{SS}$, so one branch must carry $I_P - I_{SS}$. If $I_P < I_{SS}$ that branch would need negative current — it simply **turns off**, and the available slewing current drops. Design rule: $I_P \ge I_{SS}$.

Now stability. The closed-loop gain is $A/(1 + \beta A)$, and everything depends on the **loop gain** $\beta A(s)$ — the gain a signal sees going once round the loop. As frequency rises, $A$ shrinks and its **phase** (delay) grows. Stability is about what happens to $\beta A$ at high frequency.

Follow a signal once round the loop. Normally the − input subtracts what comes back (negative feedback). But if, at some frequency, $\beta A$ has turned the signal by **−180°**, that is a sign flip: what comes back now **adds**. If its size is also exactly 1, the signal sustains itself with no input at all — the circuit **oscillates**.

![[s-lec14-bark.svg]]

Those are the **Barkhausen criteria**: $|\beta A| = 1$ and $\angle\beta A = -180°$ at the same frequency. In the formula, $1 + \beta A = 0$, so $A/(1+\beta A)$ blows up.

The arithmetic you need: a complex number $a + jb$ has magnitude $M = \sqrt{a^2 + b^2}$ and angle $\theta = \tan^{-1}(b/a)$. A pole factor $1/(1 + j\omega/\omega_p)$ therefore has magnitude $1/\sqrt{1 + (\omega/\omega_p)^2}$ and phase $-\tan^{-1}(\omega/\omega_p)$. Phase margin questions are just adding these angles (calculator in degree mode).

## Questions that use this lecture

- [[Tutorial 6 Q1 – linear settling versus slewing]] · Tutorial 6 Q1
- [[Tutorial 6 Q2 – a 5-T OTA slews, then settles]] · Tutorial 6 Q2
- [[Tutorial 6 Q3 – folded-cascode slew rate]] · Tutorial 6 Q3
- [[PS2 P1 – slew rate of a fully differential telescopic op amp]] · Problem Set 2 P1 (L9, Lec 14)
- [[Lab 9 – turn the two-stage buffer specs into numbers]] · Lab 9 (hand calculations)
- [[Past tutorial – how far feedback moves a single pole]] · Past tutorial 2024-25 T2 Ex 1
- [[Past tutorial – two poles closing in — coincident poles and maximally flat]] · Past tutorial 2024-25 T2 Ex 2

## Animated lessons

- [[Analog Lab Lec 11-14 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – L9]] · [[Flashcards – L11]]

