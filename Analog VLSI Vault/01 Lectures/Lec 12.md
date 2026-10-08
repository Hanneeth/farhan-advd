---
tags: ["lecture", "lec/12"]
aliases: ["CMFB techniques: triode-sensing equation, replica CMFB, removing the copy error"]
date: "2 Sep"
---
# Lec 12 · CMFB techniques: triode-sensing equation, replica CMFB, removing the copy error

**Date:** 2 Sep · **Handout:** L8 · **Topics:** [[L8 CMFB techniques]]

> [!abstract] In one paragraph
> Error amp on the tail or on the top sources, the output-CM equation for triode sensing, a replica branch M14–M15 that sets the CM from VREF, and M16–M18 that make the copy exact.

**Before:** [[Lec 11]] · **Next:** [[Lec 13]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec12.webp]]

Original PDF: [[Notes – lecture-12-02092026.pdf]]

## The page, item by item

### Where the CMFB amplifier acts

Two versions on your page: the error amp drives the input pair’s tail M11, or it drives the bottom current sources M3, M4 of the folded cascode. Either way it changes a current until $V_{out,CM} = V_{REF}$.

### Triode sensing equation

The cascode bias fixes P: $V_P = V_{b1} - V_{GS3}$. The tail current $2I_D$ flows through $R_{tot,P}$, so the output CM is pinned:

- $V_{b1} - V_{GS3} = 2I_D\,R_{tot,P} = \dfrac{2I_D}{\mu_nC_{ox}(W/L)_{11,12}(V_{out1}+V_{out2}-2V_{th})}$
- $V_{out1}+V_{out2} = \dfrac{2I_D}{\mu_nC_{ox}(W/L)_{11,12}}\cdot\dfrac{1}{V_{b1} - V_{GS3}} + 2V_{th}$

> [!question] Asked in exams
> Quiz 2 Part A: VP, then (W/L)11,12 so that Vout1 + Vout2 = VDD.

### Replica CMFB (M14, M15 copy M11–M13)

A replica branch with $I_1$, M14 (copy of M11) and M15 (gate at $V_{REF}$, as wide as M12 + M13 together) sets the same gate voltage. When the outputs equal $V_{REF}$ the copy is balanced.

$$I_{D11} = I_{D14} = I_1$$

$$(W/L)_{14} = (W/L)_{11}$$

$$(W/L)_{15} = (W/L)_{12} + (W/L)_{13}$$

### Removing the finite copy error (M16, M17, M18)

The copy is off because $V_{DS11} \ne V_{DS14}$. Add M17, M18 (copies of M1, M2) so M14’s drain sits where M11’s does.

$$(W/L)_{17} = (W/L)_1,\quad (W/L)_{18} = (W/L)_2$$

## Explained step by step

The CMFB amplifier can correct **any** current source in the output path: the input tail, or the bottom (or top) current sources. Wherever it acts, it adjusts that current until $V_{out,CM} = V_{REF}$.

How to use the triode-sensing equation in a question. Node P (on top of M10, M11) is pinned by the cascode bias through a **link**: $V_P = V_{b1} - V_{GS3}$. The tail current $2I_D$ flows through $R_{tot}$, so $V_P = 2I_DR_{tot}$. Put in $R_{tot}$ from Lec 11 and solve:

$V_{out1} + V_{out2} = \dfrac{2I_D}{\mu_nC_{ox}(W/L)}\cdot\dfrac{1}{V_{b1} - V_{GS3}} + 2V_{th}$.

That fixes the output CM — or, given a desired CM, the W/L of the sensing devices.

The **replica** idea: build a twin of the sensing branch. M14 copies M11, and M15 — with $V_{REF}$ on its gate — copies M12 ∥ M13 (so its width is their sum: $(W/L)_{15} = (W/L)_{12} + (W/L)_{13}$).

![[s-lec12-replica.svg]]

Both branches carry the same current, so the circuit can only be balanced when the sensing devices look exactly like the replica — i.e. when the outputs **average to $V_{REF}$**. The output CM is set by $V_{REF}$ directly, without solving the square law.

One last error: if the replica’s $V_{DS}$ differs from the real devices’, their currents differ slightly ($r_O$ effects). Adding M17, M18 — copies of M1, M2 — makes $V_{DS14} = V_{DS11}$, so the copy is exact. Sizing: $(W/L)_{17} = (W/L)_1$, $(W/L)_{18} = (W/L)_2$.

## Questions that use this lecture

- [[Tutorial 5 Q2 – which pair for the CMFB amplifier, and the loop gain]] · Tutorial 5 Q2 (Razavi Problem 9.12)
- [[Tutorial 5 Q3 – CM gain and CMRR with and without CMFB]] · Tutorial 5 Q3
- [[Quiz 2 Part A – triode-sensing CMFB on a telescopic]] · Quiz 2 Part A
- [[Quiz 2 Part B – triode-sensing CMFB on a telescopic]] · Quiz 2 Part B
- [[Quiz 2 Part C – triode-sensing CMFB on a telescopic]] · Quiz 2 Part C
- [[PS2 P5 – the replica CMFB of Lec 12]] · Problem Set 2 P5 (L8, Lec 12)
- [[2024 mid-sem Q1 – CMFB with R = 10 MΩ sensing (= Tutorial 5 Q3)]] · Mid-sem 2024-25 Q1 (20 marks)

## Animated lessons

- [[Analog Lab Lec 7-12 (animated).html]]
- [[Analog Lab Lec 11-14 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – L8]]

