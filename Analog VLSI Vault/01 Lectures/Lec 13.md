---
tags: ["lecture", "lec/13"]
aliases: ["RC step response, the closed-loop time constant, small- vs large-signal step, slew rate"]
date: "7 Sep"
---
# Lec 13 · RC step response, the closed-loop time constant, small- vs large-signal step, slew rate

**Date:** 7 Sep · **Handout:** L1, L9 · **Topics:** [[L9 Input range and slew rate]]

> [!abstract] In one paragraph
> Step response of an RC by Laplace, the feedback amplifier with Rout and CL, the 5-T OTA with a small step (linear) and a large step (all of ISS into CL).

**Before:** [[Lec 12]] · **Next:** [[Lec 14]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec13.webp]]

Original PDF: [[Notes – lecture-13-07092026.pdf]]

## The page, item by item

### RC low-pass step response

Partial fractions on $\frac{V_0}{s(1+s\tau)}$ give the familiar exponential. The slope is largest at $t = 0$: $V_0/\tau$.

- $\dfrac{V_{out}}{V_{in}}(s) = \dfrac{1}{1+sRC} = \dfrac{1}{1+s\tau},\quad V_{in}(s) = \dfrac{V_0}{s}$
- $V_{out}(s) = V_0\left(\dfrac{1}{s} - \dfrac{\tau}{1+s\tau}\right)$
- $V_{out}(t) = V_0\left(1 - e^{-t/\tau}\right)u(t),\quad \dfrac{dV_{out}}{dt} = \dfrac{V_0}{\tau}e^{-t/\tau}$

### Feedback amplifier with Rout and CL (R1, R2 divider)

KCL at the output with $R_1 + R_2 \gg R_{out}$ gives a one-pole closed loop. Its gain is the usual $A/(1+\beta A)$ and its time constant is the open-loop $R_{out}C_L$ divided by $(1 + \beta A)$.

- $\dfrac{\left(V_{in} - V_{out}\frac{R_2}{R_1+R_2}\right)A - V_{out}}{R_{out}} = \dfrac{V_{out}}{R_1+R_2} + V_{out}sC_L$
- $\dfrac{V_{out}}{V_{in}} = \dfrac{A}{\left(1 + \frac{AR_2}{R_1+R_2}\right)\left[1 + \dfrac{sC_LR_{out}}{1 + \frac{AR_2}{R_1+R_2}}\right]}$

$$V_{out}(t) = V_0\dfrac{A}{1 + A\frac{R_2}{R_1+R_2}}\left[1 - e^{-t/\tau}\right]$$

$$\tau = \dfrac{C_LR_{out}}{1 + A\frac{R_2}{R_1+R_2}}$$

> [!question] Asked in exams
> Tutorial 6 Q1–Q2: closed-loop gain, τ, Vout after 1 ns, initial slope.

### 5-T OTA, small step: linear

A small step ΔV splits as $\pm g_m\Delta V/2$ in the two sides; the mirror adds them, so $g_m\Delta V$ charges $C_L$. Currents stay near $I_{SS}/2 \pm \Delta i_d$.

$$V_{out}(s) = g_m\Delta V\dfrac{1}{sC_L}\ \text{(initially)},\quad A = g_{m1,2}(r_{O2}\parallel r_{O4})$$

### 5-T OTA, large step: slewing

A big step turns M2 off: all of $I_{SS}$ goes through M1, the mirror copies it, and $I_{SS}$ charges $C_L$ at a fixed rate. Your number: 5 V/µs.

- $i = C\dfrac{dv}{dt} \Rightarrow \dfrac{dv}{dt} = \dfrac{i}{C}$
- $\dfrac{dV_{out}}{dt}\Big|_{max} = \dfrac{I_{SS}}{C_L} = SR$

$$SR = \dfrac{I_{SS}}{C_L}$$

> [!question] Asked in exams
> Tutorial 6 (all three), mid-sem style "SR with CL = …".

## Explained step by step

Start with the simplest circuit with one pole: a resistor charging a capacitor. Its **time constant** is $\tau = RC$ — roughly how long the capacitor takes to fill. Apply a step $V_0$: the output rises as $V_{out}(t) = V_0(1 - e^{-t/\tau})$, reaching 63 % after one τ and 99 % after 4.6τ.

![[s-lec13-rc.svg]]

The slope is steepest at the start, $V_0/\tau$, because the gap between input and output (which drives the current) is largest then.

Now a feedback amplifier with output resistance $R_{out}$ driving $C_L$. Write KCL at the output and you find one pole — but **sped up** by the loop gain:

$\tau = \dfrac{C_LR_{out}}{1 + A\dfrac{R_2}{R_1+R_2}}$.

This is Lec 3 again: feedback divides the output resistance by $(1 + \beta A)$, the capacitor is unchanged, so the time constant shrinks by the same factor.

The closed-loop step response: the final value is the closed-loop gain times the step, and the speed is the stiffened τ:

$V_{out}(t) = V_0\dfrac{A}{1+\beta A}(1 - e^{-t/\tau})$.

Apply a **small** step $\Delta V$ to the OTA. The pair stays linear: the input devices split their currents by $\pm g_m\Delta V/2$, and the mirror adds the halves, so $g_m\Delta V$ charges $C_L$. Both input devices stay on, and the output follows the exponential.

Apply a **large** step and the pair cannot stay linear: the input on one side is so much higher that M2 turns **off** and the **whole tail current** $I_{SS}$ goes into (or out of) $C_L$. A constant current into a capacitor gives a straight ramp, $i = C\,dv/dt$, so the output rises at a fixed rate — the **slew rate**:

$SR = \dfrac{I_{SS}}{C_L}$.

![[s-lec13-slew.svg]]

Once the output is close enough, the pair becomes linear again and the response finishes with the normal exponential. To check whether a step slews, compare the linear starting slope ($V_{step}A_{cl}/\tau$) with SR.

## Questions that use this lecture

- [[Tutorial 6 Q1 – linear settling versus slewing]] · Tutorial 6 Q1
- [[Tutorial 6 Q2 – a 5-T OTA slews, then settles]] · Tutorial 6 Q2
- [[Tutorial 6 Q3 – folded-cascode slew rate]] · Tutorial 6 Q3
- [[PS2 P1 – slew rate of a fully differential telescopic op amp]] · Problem Set 2 P1 (L9, Lec 14)
- [[Lab 9 – turn the two-stage buffer specs into numbers]] · Lab 9 (hand calculations)

## Animated lessons

- [[Analog Lab Lec 11-14 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – L9]]

