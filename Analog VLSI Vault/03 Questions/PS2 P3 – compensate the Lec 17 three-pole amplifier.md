---
tags: ["question", "source/problem-set", "unit/L13"]
aliases: ["Problem Set 2 P3 (L13, Lec 17)"]
---
# PS2 P3: compensate the Lec 17 three-pole amplifier

**Source:** Problem Set 2 P3 (L13, Lec 17)

**Topics:** [[L13 Compensation I]] · **Lectures:** [[Lec 17]]

## Question

The Lec 17 amplifier: A0 = 100 dB, poles at 1 kHz, 1 MHz and 10 MHz, used for a closed-loop gain of 10 (β = 0.1). (a) The phase margin as built. (b) Keeping the 1 MHz and 10 MHz poles, where must the first pole go for PM = 45°? (c) By what factor must its capacitor grow?

| Given | Value |
|---|---|
| $A_0$ | 100000 |
| $f_{p1}$ | 1 kHz |
| $f_{p2}$ | 1 MHz |
| $f_{p3}$ | 10 MHz |
| $\beta$ | 0.1 |

**Find:** (a) PM as built · (b) New first pole · (c) Capacitor factor

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Work on the loop gain βA, not A.
> 2. Where do the 1 MHz and 10 MHz poles give 45° together?
> 3. f'p1 = ωgx/(βA0).
> 4. The new ωgx is 844 kHz, so the first pole goes to about 84 Hz.

> [!info]- Concept and formulas
> Dominant-pole compensation: keep the high poles, slide the first pole down until the loop gain hits 0 dB where the high poles leave the required PM.
> $$f_D = f_{gx}/(\beta A_0)\ (-20\text{ dB/dec})$$

> [!success]- Answers
> - (a) PM as built: **1.595 °**
> - (b) New first pole: **84.43 Hz**
> - (c) Capacitor factor: **11.84**

> [!example]- Full solution
> 1. (a) βA0 = 10⁴ (80 dB above the 1/β line): find ωgx numerically, then the phase: almost nothing left
>    $$f_{gx} = 3.01\,\mathrm{MHz},\; PM = 1.6^\circ$$
> 2. (b) The two high poles may use only 90° − 45° = 45° at the new ωgx
>    $$\tan^{-1}\frac{f}{1\,\mathrm{MHz}} + \tan^{-1}\frac{f}{10\,\mathrm{MHz}} = 45^\circ \Rightarrow f_{gx} = 844\,\mathrm{kHz}$$
> 3. −20 dB/dec from βA0 = 10⁴ down to 0 dB at ωgx
>    $$f'_{p1} = \frac{f_{gx}}{\beta A_0} = 84.4\,\mathrm{Hz}$$
> 4. (c) The pole is 1/(RC): C grows by the same factor
>    $$k = 11.8$$

