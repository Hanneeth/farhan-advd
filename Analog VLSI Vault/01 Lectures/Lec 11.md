---
tags: ["lecture", "lec/11"]
aliases: ["CMFB: deep-triode sensing, differential-pair sensing, the feedback loop"]
date: "31 Aug"
---
# Lec 11 · CMFB: deep-triode sensing, differential-pair sensing, the feedback loop

**Date:** 31 Aug · **Handout:** L7–L8 · **Topics:** [[L7 CMFB concept and sensing]] · [[L8 CMFB techniques]]

> [!abstract] In one paragraph
> Two triode devices (M10, M11) whose total resistance depends on Vout1 + Vout2, the deep-triode Ron, a nonlinear diff-pair sensor, and the CMFB loop.

**Before:** [[Lec 10]] · **Next:** [[Lec 12]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec11.webp]]

Original PDF: [[Notes – lecture-11-31082026.pdf]]

## The page, item by item

### Deep-triode resistance

In triode with small $V_{DS}$ the $V_{DS}^2$ term drops out and the device is a resistor controlled by its gate.

- $I_D = \tfrac12\mu_nC_{ox}\tfrac{W}{L}\left[2(V_{GS}-V_{th})V_{DS} - V_{DS}^2\right]$
- deep triode: $I_D \approx \mu_nC_{ox}\tfrac{W}{L}(V_{GS}-V_{th})V_{DS}$
- $R_{on} = \dfrac{V_{DS}}{I_D} = \dfrac{1}{\mu_nC_{ox}\frac{W}{L}(V_{GS}-V_{th})}$

### Triode sensing: M10 and M11 gated by the two outputs

Their resistances are in parallel, and the sum depends only on $V_{out1} + V_{out2}$ — exactly the CM.

$$R_{tot,P} = R_{on10}\parallel R_{on11} = \dfrac{1}{\mu_nC_{ox}(W/L)_{10,11}(V_{out1}+V_{out2}-2V_{th})}$$

> [!question] Asked in exams
> Quiz 2 (all parts) and Tutorial 5 Q1.

### Saturation vs triode in one line

In saturation the device is a voltage-controlled current source (VCCS), $I_D = \frac12\mu C_{ox}\frac{W}{L}(V_{GS}-V_{th})^2$; in deep triode it is a voltage-controlled resistor.

### Differential-pair sensing (M1–M4 with VREF, M5 as the controlled source)

Two pairs compare each output with $V_{REF}$. Each half-current goes as a square of the difference, so the sensed current is **nonlinear** in the outputs: it works for small swings only.

$$I_D \propto (V_{REF} - V_{out1})^2 + (V_{REF} - V_{out2})^2$$

### Feedback mechanism and comparison

The CMFB loop is a feedback loop like any other: its error is $\approx 1/(\beta A)$ of the loop. Your two circuits: an error amp driving the tail M11 of the input pair, and triode devices M11, M12 at the bottom of a telescopic.

$$\dfrac{A}{1+\beta A},\quad \varepsilon \approx \dfrac{1}{\beta A}$$

## Explained step by step

A smarter sensor: put two transistors **M10, M11** in the tail of the cascode, with their gates driven by the two outputs. If the output CM rises, both gates rise, the devices conduct more, the tail current grows and pulls the outputs back down — feedback built right into the tail.

Why these devices behave like resistors: they run in **deep triode** — a very small $V_{DS}$. The triode current is $I_D = \mu_nC_{ox}\dfrac{W}{L}[(V_{GS} - V_{th})V_{DS} - V_{DS}^2/2]$; with tiny $V_{DS}$ the $V_{DS}^2$ term is negligible, so $I_D$ is proportional to $V_{DS}$ — a straight line through the origin, i.e. a **resistor**:

$R_{on} = \dfrac{1}{\mu_nC_{ox}\dfrac{W}{L}(V_{GS} - V_{th})}$.

![[s-lec11-triode.svg]]

The gate voltage sets the resistance: a gate-controlled resistor.

M10 and M11 sit **in parallel**, so their conductances add: $\dfrac{1}{R_{tot}} = \mu_nC_{ox}\dfrac WL[(V_{out1} - V_{th}) + (V_{out2} - V_{th})] = \mu_nC_{ox}\dfrac WL(V_{out1} + V_{out2} - 2V_{th})$.

Only the **sum** $V_{out1} + V_{out2}$ appears — that is twice the output CM. A differential signal raises one output and lowers the other by the same amount, so the sum (and $R_{tot}$) does not change. The sensor sees the CM and ignores the signal: exactly what we want.

Keep the two regions straight: a **saturated** MOSFET is a voltage-controlled **current source** (current set by $V_{GS}$, almost independent of $V_{DS}$); a **deep-triode** MOSFET is a voltage-controlled **resistor**. In this circuit M10, M11 are in deep triode; everything else is saturated.

Another sensor: a differential pair compares each output with $V_{REF}$. It works, but the pair’s currents go as **squares** of $(V_{REF} - V_{out})$, so for large swings the square terms do not cancel and the sensed “CM” is wrong. Fine only for small output swings.

Seen as a whole, CMFB is an ordinary negative-feedback loop — either an error amplifier driving the tail, or triode devices at the bottom. So its accuracy follows Lec 1: the CM error is about one over the loop gain, $\varepsilon \approx 1/(\beta A)$.

## Questions that use this lecture

- [[Tutorial 5 Q1 – size the triode CMFB devices]] · Tutorial 5 Q1 (Razavi 9.11 extended)
- [[Tutorial 5 Q2 – which pair for the CMFB amplifier, and the loop gain]] · Tutorial 5 Q2 (Razavi Problem 9.12)
- [[Tutorial 5 Q3 – CM gain and CMRR with and without CMFB]] · Tutorial 5 Q3
- [[Quiz 2 Part A – triode-sensing CMFB on a telescopic]] · Quiz 2 Part A
- [[Quiz 2 Part B – triode-sensing CMFB on a telescopic]] · Quiz 2 Part B
- [[Quiz 2 Part C – triode-sensing CMFB on a telescopic]] · Quiz 2 Part C
- [[PS2 P5 – the replica CMFB of Lec 12]] · Problem Set 2 P5 (L8, Lec 12)
- [[2025 mid-sem Q4 – size the triode CMFB devices (= Tutorial 5 Q1)]] · Mid-sem 2025-26 Q4 (12 marks)
- [[2024 mid-sem Q1 – CMFB with R = 10 MΩ sensing (= Tutorial 5 Q3)]] · Mid-sem 2024-25 Q1 (20 marks)
- [[2024 Quiz 2 Q2 – resistive-sensing CMFB VREF, Vin,CM and the CM gain for ±1%]] · Quiz 2 2024-25 Q2 (9 marks)

## Animated lessons

- [[Analog Lab Lec 7-12 (animated).html]]
- [[Analog Lab Lec 11-14 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – L7]] · [[Flashcards – L8]]

