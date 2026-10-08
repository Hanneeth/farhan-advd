---
tags: ["lecture", "lec/17"]
aliases: ["Frequency compensation: dominant pole, Miller effect, pole splitting, the two-stage op amp"]
date: "18 Sep"
---
# Lec 17 · Frequency compensation: dominant pole, Miller effect, pole splitting, the two-stage op amp

**Date:** 18 Sep · **Handout:** L13–L14 · **Topics:** [[L13 Compensation I]] · [[L14 Compensation II]]

> [!abstract] In one paragraph
> The 100 dB three-pole example, moving the dominant pole, Miller multiplication CC(1 + A2), P1′ ≈ 1/(R1A2CC), the two-stage op amp’s poles and its transfer function with the RHP zero.

**Before:** [[Lec 16]] · **Next:** [[Home]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec17.webp]]

Original PDF: [[Notes – lecture-17-18092026.pdf]]

## The page, item by item

### Compensation idea on the Bode plot

A 100 dB amplifier with three poles crosses the $1/\beta$ line where the phase is past −180°. Move the dominant pole down (green dashed line) until the loop gain crosses 0 dB before the second pole.

$$20\log A - 20\log\tfrac{1}{\beta} = 20\log A\beta$$

### Miller effect

A capacitor $C_C$ across a gain $-A_2$ looks like $C_C(1 + A_2)$ at the input and $C_C(1 + 1/A_2)$ at the output.

$$C_{in} = C_C(1 + A_2),\quad C_{out} = C_C\left(1 + \tfrac{1}{A_2}\right)$$

### Poles before and after compensation

Without $C_C$: one pole per node. With it, the input node’s capacitance is multiplied by $(1 + A_2)$, pushing $P_1$ way down.

$$P_1 = \dfrac{1}{R_1C_1},\quad P_2 = \dfrac{1}{R_2C_2}\ \text{(without)}$$

$$P_1' = \dfrac{1}{R_1\left[C_1 + (1+A_2)C_C\right]} \approx \dfrac{1}{R_1A_2C_C}$$

### The two-stage op amp (M1–M7) uncompensated

Node P (first-stage output) and node Q (the output) each give a pole.

$$P_1 = \dfrac{1}{(r_{O2}\parallel r_{O4})C_1},\quad P_2 = \dfrac{1}{(r_{O6}\parallel r_{O7})C_2}$$

### Transfer function with CC: the RHP zero and pole splitting

Matching the denominator to $(1 + s/\omega_{p1})(1 + s/\omega_{p2})$ (with $\omega_{p2} \gg \omega_{p1}$) gives the split poles. The numerator has a **right-half-plane zero** at $G_{m2}/C_C$ that adds phase lag.

$$\dfrac{V_{out}}{V_{in}}(s) = \dfrac{G_{m1}G_{m2}R_1R_2\left(1 - s\frac{C_C}{G_{m2}}\right)}{1 + s\left[\{C_1 + (1+G_{m2}R_2)C_C\}R_1 + R_2(C_2+C_C)\right] + s^2R_1R_2(C_1C_2 + C_2C_C + C_1C_C)}$$

$$D = \left(1+\dfrac{s}{\omega_{p1}}\right)\left(1+\dfrac{s}{\omega_{p2}}\right) = 1 + \left(\dfrac{1}{\omega_{p1}} + \dfrac{1}{\omega_{p2}}\right)s + \dfrac{s^2}{\omega_{p1}\omega_{p2}}$$

## Explained step by step

The problem: an op amp with 100 dB of gain and three poles. Its loop gain is still above 0 dB when the phase passes −180° — it would oscillate. **Compensation** fixes this by deliberately making the loop gain fall to 1 **before** the phase gets dangerous.

![[s-lec17-comp.svg]]

Dominant-pole compensation pushes the **first** pole down (the green dashed line on your page) until the loop gain reaches 0 dB at about the second pole: $f_D = f_{gx}/(\beta A_0)$. You trade bandwidth for stability.

The cheap way to get a very low pole: the **Miller effect**. Put a capacitor $C_c$ across an inverting gain $-A_2$. Its input end moves by $v$ while its output end moves by $-A_2v$ — opposite directions — so the voltage across it is $(1 + A_2)v$, and it draws $(1 + A_2)$ times more current than a capacitor to ground would.

![[s-lec17-miller.svg]]

Seen from the input it looks like $C_{in} = C_c(1 + A_2)$; seen from the output, about $C_c(1 + 1/A_2) \approx C_c$.

So a small $C_c$ makes a big effective capacitance at stage 1’s output, and the first pole drops a lot:

$P_1' \approx \dfrac{1}{R_1A_2C_c}$.

A picofarad times a gain of 100 looks like 100 pF.

The two-stage op amp before compensation: node **P** (stage-1 output, resistance $r_{O2}\parallel r_{O4}$, capacitance $C_1$) and node **Q** (the output, $r_{O6}\parallel r_{O7}$ with $C_2$) are both high-impedance, so each gives a low pole:

$P_1 = \dfrac{1}{(r_{O2}\parallel r_{O4})C_1}$, $P_2 = \dfrac{1}{(r_{O6}\parallel r_{O7})C_2}$.

Two low poles close together — hard to stabilise. $C_c$ between P and Q pushes $P_1$ down and $P_2$ up (“pole splitting”).

The full transfer function with $C_c$: matching the denominator gives the split poles, and the numerator has a factor $(1 - sC_c/G_{m2})$ — a **right-half-plane zero** at $G_{m2}/C_c$. It comes from the signal feeding **forward** through $C_c$ straight to the output. An RHP zero raises the gain like a zero but **subtracts** phase like a pole, so it eats phase margin (fix: a nulling resistor in series with $C_c$).

## Questions that use this lecture

- [[Razavi Ex 10.6 – first estimate of CC for 45°]] · Razavi Example 10.6
- [[PS2 P3 – compensate the Lec 17 three-pole amplifier]] · Problem Set 2 P3 (L13, Lec 17)
- [[PS2 P4 – add a second stage to your exam OTA and compensate it]] · Problem Set 2 P4 (L13–L14, Lec 17)
- [[2025 mid-sem Q2 – design a Miller-compensated two-stage op amp]] · Mid-sem 2025-26 Q2 (14 marks)
- [[2024 mid-sem Q2 – analyse a Miller two-stage op amp]] · Mid-sem 2024-25 Q2 (15 marks)
- [[2023 mid-sem Q5 – peaking factor K at PM 50°; Cc vs CL for 45°]] · Mid-sem 2023-24 Q5 (5 marks)
- [[2024 Quiz 2 Q1 – GBW, PM and Cc from a Miller op amp’s Bode data]] · Quiz 2 2024-25 Q1 (6 marks)
- [[Past tutorial – dominant-pole compensation for closed-loop gains down to 20 dB]] · Past tutorial 2024-25 T2 Ex 5–6

## Animated lessons

- [[Analog Lab Lec 15-17 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – L13]] · [[Flashcards – L14]]

