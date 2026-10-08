---
tags: ["question", "source/quiz", "unit/U12"]
aliases: ["Quiz 1 2024-25 Q2 (6 marks)"]
---
# 2024 Quiz 1 Q2: the same OTA sized for 10 V/µs into 2 pF

**Source:** Quiz 1 2024-25 Q2 (6 marks) · **Exam time:** 12 min (6 marks × 2 min)

**Topics:** [[U12 Poles and bandwidth]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

> [!quote] 2024-25 Quiz 1, Question 2 (as printed)
> ![[q24aq2.webp]]

## Question

Same OTA and sizes. For CL = 2 pF the slew rate is 10 V/µs. Find I1, the bandwidth (Hz), the GBW (Hz) and the power.

| Given | Value |
|---|---|
| $C_L$ | 2 pF |
| $SR$ | 10 V/µs |

**Find:** I1 · Bandwidth · GBW · Power

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Slew rate: the whole tail current charges CL.
> 2. ISS = 2·I1 here.
> 3. rO = 1/(λID) with the L-scaled λ.
> 4. GBW does not depend on rO.

> [!info]- Concept and formulas
> SR = ISS/CL gives the tail current, the mirror gives I1. One pole at the output: 1/(2πRoutCL); GBW = gm/(2πCL).
> $$I_{SS} = SR\cdot C_L$$
> $$f_{-3dB} = \dfrac{1}{2\pi(r_{O2}\parallel r_{O4})C_L},\quad GBW = \dfrac{g_{m1}}{2\pi C_L}$$

> [!success]- Answers
> - I1: **10 µA**
> - Bandwidth: **159.2 kHz**
> - GBW: **13.78 MHz**
> - Power: **54 µW**

> [!example]- Full solution
> 1. ISS = 10 V/µs × 2 pF = 20 µA; I1 = ISS × 7.5/15
>    $$I_1 = 10\,\mathrm{\mu A}$$
> 2. Rout = rO2 ‖ rO4 at 10 µA
>    $$f_{-3dB} = \frac{1}{2\pi(500\,\mathrm{k\Omega})(2\,\mathrm{pF})} = 159\,\mathrm{kHz}$$
> 3. GBW = gm1/(2πCL)
>    $$g_{m1} = 0.173\,\mathrm{mS},\; GBW = 13.8\,\mathrm{MHz}$$
> 4. Power
>    $$1.8 \times 30\,\mu A = 54\,\mathrm{\mu W}$$

> [!abstract]- Calculator keys (fx-991CW)
> - **Bandwidth:** `1 ÷ ( 2π × 500[k] × 2[p] )`

