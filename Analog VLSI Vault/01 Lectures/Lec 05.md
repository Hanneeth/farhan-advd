---
tags: ["lecture", "lec/05"]
aliases: ["Closing the loop through capacitors (Ex 9.6); the folding transformation; folded cascode"]
date: "12 Aug"
---
# Lec 05 · Closing the loop through capacitors (Ex 9.6); the folding transformation; folded cascode

**Date:** 12 Aug · **Handout:** L2, L4 · **Topics:** [[L4 Folded cascode]]

> [!abstract] In one paragraph
> A fully differential op amp closed with C1–R1–R2 / C2–R3–R4, the step-by-step folding of a cascode, and the PMOS-input folded cascode with Rup, Rdown and Gm.

**Before:** [[Lec 04]] · **Next:** [[Lec 06]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec05.webp]]

Original PDF: [[Notes – lecture-05-12082026.pdf]]

## The page, item by item

### Fully differential op amp closed through C1–R1, R2 and C2–R3, R4 (Ex 9.6)

The input capacitors block DC, so the resistors tie the input CM to the output CM: **the input gates sit at the same DC level as the outputs**. In the telescopic version (M1, M3 with R1, R2 on one side) that sets where the outputs can sit and how far they swing.

$$V_{CM} = V_b - (V_{GS3,4} - V_{th1,2})$$

### The folding transformation

A cascode (M1 under M2) can be **folded**: keep M2 as the cascode but feed its source from the drain of an opposite-type input device M1, and add a current source $I_2$ to carry both currents. Signal current from M1 still flows through M2 to the output. The PMOS version works the same way upside down.

### Folding a differential pair (ISS1, ISS2)

Folding the telescopic: the cascodes M3, M4 now sit on top current sources $I_{SS1}$ and the bottom sources $I_{SS2}$ carry the folded input current too.

$$I_{SS2} = I_{SS1} + \dfrac{I_{SS}}{2}$$

### PMOS-input folded cascode (M1–M11) and its output resistance

Looking **up** into the PMOS cascode (M5 on M7): $g_{m5}r_{O5}r_{O7}$. Looking **down** into the NMOS cascode (M3) whose source node also carries the input device’s $r_{O1}$ and the bottom source $r_{O9}$ in parallel.

$$R_{up} = g_{m5}r_{O5}r_{O7}$$

$$R_{down} = g_{m3}r_{O3}(r_{O1}\parallel r_{O9})$$

### Gm of the folded cascode by current divider

M1’s small-signal current $g_{m1}v_{in}$ reaches the folding node and splits: into M3’s source ($\frac{1}{g_{m3}}\parallel r_{O3}$, small) or down into $r_{O9}\parallel r_{O1}$ (large). Almost all of it goes up through M3, so $G_m \approx g_{m1}$.

- $I_{out} = g_{m1}v_{in}\times\dfrac{r_{O9}\parallel r_{O1}}{\left(\frac{1}{g_{m3}}\parallel r_{O3}\right) + (r_{O9}\parallel r_{O1})}$
- $I_{out} \approx g_{m1}v_{in}\times\dfrac{r_{O1}\parallel r_{O9}}{r_{O1}\parallel r_{O9}}$
- $G_m = \dfrac{I_{out}}{v_{in}} \approx g_{m1}$

$$A_v = G_m(R_{up}\parallel R_{down}) \approx g_{m1}(R_{up}\parallel R_{down})$$

> [!question] Asked in exams
> Tutorial 2 Q3, Problem Set 1 P6–P7, Tutorial 6 Q3.

## Explained step by step

A fully differential op amp is used **closed-loop through capacitors** ($C_1R_1R_2$ on one side, $C_2R_3R_4$ on the other). Follow the DC path into M1’s gate: $C_1$ blocks DC from the input, and a gate draws no current, so **no DC current flows through $R_2$** — and a resistor with no current drops no voltage. M1’s gate therefore sits at exactly $V_{out1}$’s DC level:

**input CM = output CM** — you no longer get to choose the input level.

Two CMs live in this circuit, and the figure marks both. CM always means **the average of a pair**: the **output CM** is the average of the two outputs, $(V_{out1} + V_{out2})/2$ — the flat middle line the outputs seesaw around — and the **input CM** is the average of the two gates of M1 and M2.

![[s-lec05-ex96.svg]]

Why that hurts the telescopic: M1 needs X ≥ gate − $V_{th1}$, and the gate is now $V_{out,CM}$. So the lowest X can be biased is $V_{out,CM} - V_{th1}$, and the output must stay $V_{ov3}$ above X. Each output can fall only **$V_{th} - V_{ov}$ ≈ 0.5 V** below its CM — and moving the CM does not help, because the gate, X and the floor all move together.

It is the Lec 3 buffer window again, caused by capacitors instead of a wire. The root cause is that the input device’s drain X sits in the **same column** as the output. That is exactly what folding fixes next.

A quick cascode refresher first, because folding keeps all of it: the bottom device is the **pump** (it turns $v_{in}$ into $g_{m1}v_{in}$), the top device is the **shield** (its gate is fixed, so its source X barely moves, M1 is protected, and $R_{out}$ is multiplied by $g_{m2}r_{O2}$).

![[s-lec05-cascode.svg]]

The cascode device only needs a **signal current** at its source. It does not care whether that current comes from below or from the side. So: flip the input device to the opposite type, feed it from a current source, and plug its drain into the cascode’s source from the side.

![[s-lec05-fold.svg]]

The current path now **turns** at node X: the source’s current splits, part goes through the input device and the rest turns into the cascode and down to the output — the signal “folds” at X, hence the name. The input device has left the output column. KCL at X decides the cascode’s current: $I_{D2} = I_1 - I_{D1}$.

Your second drawing is the mirror image (panel 4): a PMOS cascode with an NMOS input that **pulls** current out of X from the side, while $I_2$ feeds X from VDD — again $I_{D2} = I_2 - I_{D1}$. Both versions still invert, and both give the same $g_{m1}v_{in}$ at X.

![[s-lec05-compare.svg]]

Do the same to a whole differential pair. KCL at each fold node: the bottom source must carry the cascode branch’s current **plus** the input device’s $I_{SS}/2$:

$I_{SS2} = I_{SS1} + I_{SS}/2$.

Design tip that saves you from a trap: in a big step one input device can grab the whole $I_{SS}$. If the folding branch carries less than that, the cascode starves and turns off, and the slew rate drops (Lec 14). So keep the folding current ≥ $I_{SS}$.

What folding costs: **power** (the extra branch current), **a little gain** (the fold node has two $r_O$ in parallel), and an **extra pole** at the fold node. What it buys: more swing and a CM range that can reach a rail.

Looking **up** from the output you see an ordinary PMOS cascode: $R_{up} = g_{m5}r_{O5}r_{O7}$.

Looking **down** you see the NMOS cascode M3 — but under its source is the fold node, where **two** things hang: the bottom source M9 ($r_{O9}$) and the input device M1’s drain ($r_{O1}$). The cascode multiplies whatever sits under it, so $R_{down} = g_{m3}r_{O3}(r_{O1}\parallel r_{O9})$.

That is why a folded cascode has a little less gain than a telescopic built from the same devices: $R_{down}$ starts from about $r_O/2$ instead of $r_O$.

![[s-lec05-folded.svg]]

M1’s signal current $g_{m1}v_{in}$ arrives at the fold node and has two exits: **up** into M3’s source, which looks like about $1/g_{m3}$ (a few kΩ), or **down** into $r_{O1}\parallel r_{O9}$ (hundreds of kΩ). Current takes the easy path, so nearly all of it goes up.

![[s-lec05-gm.svg]]

So the folded cascode has the same $G_m \approx g_{m1}$ as a plain pair, and its gain is $g_{m1}(R_{up}\parallel R_{down})$ as always.

## Questions that use this lecture

- [[Tutorial 2 Q3 – design a folded cascode for 2.4 V swing and 6 mW]] · Tutorial 2 Q3 (Razavi Problem 9.3)
- [[PS1 P6 – design a folded cascode (2.0 V swing, 4.5 mW)]] · Problem Set 1 P6 (tutoring chat)
- [[PS1 P7 – how much of M1’s current reaches the output]] · Problem Set 1 P7 (tutoring chat)
- [[PS1 P8 – folded cascode CM ranges (input = output CM is possible)]] · Problem Set 1 P8 (tutoring chat)
- [[PS1 P10 – capstone, design for settling and swing]] · Problem Set 1 P10 (tutoring chat)
- [[Tutorial 6 Q3 – folded-cascode slew rate]] · Tutorial 6 Q3
- [[2023 Quiz 1 Q2 – NMOS-input folded cascode CM range, bias limits, swing, gain]] · Quiz 1 2023-24 Q2 (folded cascode)

## Animated lessons

- [[Analog Lab Revision Lec 1-10 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – L4]]

