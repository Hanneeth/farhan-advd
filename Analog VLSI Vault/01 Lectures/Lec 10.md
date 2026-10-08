---
tags: ["lecture", "lec/10"]
aliases: ["CMFB: CM and DM parts, the general structure, resistive and source-follower sensing"]
date: "24 Aug"
---
# Lec 10 · CMFB: CM and DM parts, the general structure, resistive and source-follower sensing

**Date:** 24 Aug · **Handout:** L7 · **Topics:** [[L7 CMFB concept and sensing]]

> [!abstract] In one paragraph
> Splitting inputs into CM and DM parts, the current mismatch picture, the sense → compare → correct loop, and the two simplest sensing circuits.

**Before:** [[Lec 09]] · **Next:** [[Lec 11]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec10.webp]]

Original PDF: [[Notes – lecture-10-24082026.pdf]]

## The page, item by item

### Inputs as CM + DM

Any pair of inputs is a common part plus a difference part: $V_{in1} = \frac{V_{in1}+V_{in2}}{2} + \frac{V_{in1}-V_{in2}}{2}$, $V_{in2} = \frac{V_{in1}+V_{in2}}{2} + \frac{V_{in2}-V_{in1}}{2}$. The DM part swings the outputs in opposite directions (the two sine waves); the CM part moves both together.

$$V_{CM} = \dfrac{V_{in1}+V_{in2}}{2},\quad v_d = V_{in1} - V_{in2}$$

### The mismatch current

At an output node $I_P = I_N + I_X$, so $I_X = I_P - I_N$ must flow somewhere — into the output resistances $R_P$, $R_N$. That is what drives the output CM to a rail.

$$I_X = I_P - I_N$$

### General structure of CMFB

A **common-mode sensing circuit** produces $V_{out,CM}$; a **CMFB amplifier** compares it with $V_{REF}$; its output adjusts a current source (here the tail $I_{SS}$).

### Resistive sensing (R1 = R2 between the outputs)

By superposition the midpoint is the average of the outputs. The catch: $R_1$ appears in parallel with the output resistance, so the gain drops.

- $V_{out}\big|_{V_{out1}} = V_{out1}\dfrac{R_2}{R_1+R_2},\quad V_{out}\big|_{V_{out2}} = V_{out2}\dfrac{R_1}{R_1+R_2}$
- R1 = R2: $V_{out,CM} = V_{out1}\dfrac{R_2}{R_1+R_2} + V_{out2}\dfrac{R_1}{R_1+R_2} = \dfrac{V_{out1}+V_{out2}}{2}$

$$A_v = g_{m1}(r_{O1}\parallel r_{O3})\ \text{(without)},\quad A_v = g_{m1}(r_{O1}\parallel r_{O3}\parallel R_1)\ \text{(with)}$$

> [!question] Asked in exams
> Tutorial 5 Q3 (R = 10 MΩ sensing): Ad and ACM with and without CMFB.

### Source-follower sensing (M5, M6 with I1, I2, then R1, R2)

Buffer each output with a follower first so the resistors do not load it. The sensed value is level-shifted down by one $V_{GS}$ (your example: 0.9 V outputs, 0.5 V at the follower sources). Each follower output carries the DC CM level plus the AC signal.

$$V_{sense} = \dfrac{V_{out1}+V_{out2}}{2} - V_{GS5,6}$$

## Explained step by step

Any two signals can be split into a part they **share** and a part where they **differ**. The common mode is the average, $V_{CM} = (V_{in1} + V_{in2})/2$; the differential mode is the difference, $v_d = V_{in1} - V_{in2}$. So $V_{in1} = V_{CM} + v_d/2$ and $V_{in2} = V_{CM} - v_d/2$.

![[s-lec02-cmdm.svg]]

The DM part moves the two outputs in **opposite** directions (that is the signal we amplify). The CM part moves them **together** — and at the output, nothing in the amplifier itself controls that common level. CMFB looks after it.

At an output node, the top source pushes $I_P$ in and the bottom source pulls $I_N$ out. If they differ, the difference $I_X = I_P - I_N$ must flow somewhere — and the only place is the output resistance $R_P\parallel R_N$, hundreds of kΩ or more. Even 1 µA × 500 kΩ = 0.5 V of CM error; a little more and the output sits at a rail.

Razavi’s general structure has three blocks: a **CM sensing circuit** that produces $V_{out,CM}$, a **CMFB amplifier** that compares it with $V_{REF}$, and a **correction** applied to one current source (here the tail). It is ordinary negative feedback: if the output CM is too high, the loop increases the pull-down current until $V_{out,CM} = V_{REF}$.

The simplest sensor: two **equal resistors** between the outputs. By superposition, their midpoint is exactly the average, $(V_{out1} + V_{out2})/2$.

![[s-lec10-sense.svg]]

The cost: those resistors hang directly on the outputs, so the output resistance becomes $r_{O1}\parallel r_{O3}\parallel R_1$ and the gain drops to $A_v = g_{m1}(r_{O1}\parallel r_{O3}\parallel R_1)$ — unless $R$ is huge.

The fix: buffer each output with a **source follower** (M5, M6) before the resistors. A follower’s gate draws no current, so the resistors no longer load the outputs. A follower’s source sits one **link** below its gate, so the sensed level is one $V_{GS}$ lower than the true average: $V_{sense} = (V_{out1} + V_{out2})/2 - V_{GS}$. The cost is swing: each output is now a follower’s gate, which needs the follower’s link plus its current source’s check below it, so the outputs cannot fall below about $V_{GS} + V_{ov}$.

## Questions that use this lecture

- [[Tutorial 5 Q1 – size the triode CMFB devices]] · Tutorial 5 Q1 (Razavi 9.11 extended)
- [[Tutorial 5 Q2 – which pair for the CMFB amplifier, and the loop gain]] · Tutorial 5 Q2 (Razavi Problem 9.12)
- [[Tutorial 5 Q3 – CM gain and CMRR with and without CMFB]] · Tutorial 5 Q3
- [[Quiz 2 Part A – triode-sensing CMFB on a telescopic]] · Quiz 2 Part A
- [[Quiz 2 Part B – triode-sensing CMFB on a telescopic]] · Quiz 2 Part B
- [[Quiz 2 Part C – triode-sensing CMFB on a telescopic]] · Quiz 2 Part C
- [[2025 mid-sem Q4 – size the triode CMFB devices (= Tutorial 5 Q1)]] · Mid-sem 2025-26 Q4 (12 marks)
- [[2024 mid-sem Q1 – CMFB with R = 10 MΩ sensing (= Tutorial 5 Q3)]] · Mid-sem 2024-25 Q1 (20 marks)
- [[2024 Quiz 2 Q2 – resistive-sensing CMFB VREF, Vin,CM and the CM gain for ±1%]] · Quiz 2 2024-25 Q2 (9 marks)

## Animated lessons

- [[Analog Lab Lec 7-12 (animated).html]]
- [[Analog Lab Revision Lec 1-10 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – L7]]

