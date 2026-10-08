---
tags: ["question", "source/problem-set", "unit/L14"]
aliases: ["Problem Set 2 P4 (L13–L14, Lec 17)"]
---
# PS2 P4: add a second stage to your exam OTA and compensate it

**Source:** Problem Set 2 P4 (L13–L14, Lec 17)

**Topics:** [[L14 Compensation II]] · **Lectures:** [[Lec 17]]

## Question

Your exam OTA (Gm1 = 0.8 mS, R1 = 111 kΩ, C1 = 0.1 pF, ISS = 120 µA) drives a PMOS CS stage M6 (Gm2 = 4 mS, R2 = 20 kΩ) biased by I7 = 500 µA, loaded by CL = 4 pF. With Rz = 1/Gm2: (a) CC for PM = 60° (β = 1, ωp2 ≈ Gm2/CL); (b) the GBW; (c) the dominant pole P1′ ≈ 1/(R1A2CC); (d) Rz; (e) the slew rate.

| Given | Value |
|---|---|
| $G_{m1}$ | 800 µS |
| $R_1$ | 111 kΩ |
| $G_{m2}$ | 4 mS |
| $R_2$ | 20 kΩ |
| $C_L$ | 4 pF |
| $I_{SS}$ | 120 µA |
| $I_7$ | 500 µA |

**Find:** (a) CC · (b) GBW · (c) Dominant pole · (d) Rz · (e) Slew rate

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. GBW = Gm1/CC and ωp2 = Gm2/CL.
> 2. 60° → ωp2 = 1.73·ωu.
> 3. CC = Gm1·CL·tan 60°/Gm2; P1′ = 1/(2πR1A2CC).
> 4. CC ≈ 1.39 pF.

> [!info]- Concept and formulas
> Miller two-stage: ωu = Gm1/CC, ωp2 = Gm2/CL; PM 60° → ωp2 = ωu·tan 60°. Rz = 1/Gm2 kills the RHP zero. SR is the smaller of ISS/CC and the output-stage limit.
> $$C_C = \dfrac{G_{m1}}{G_{m2}}C_L\tan 60^\circ$$
> $$R_z = 1/G_{m2}$$

> [!success]- Answers
> - (a) CC: **1.386 pF**
> - (b) GBW: **91.89 MHz**
> - (c) Dominant pole: **12.93 kHz**
> - (d) Rz: **250 Ω**
> - (e) Slew rate: **86.6 V/µs**

> [!example]- Full solution
> 1. (a) ωp2 = ωu·tan 60°: Gm2/CL = (Gm1/CC)·1.732
>    $$C_C = \frac{0.8\,\mathrm{mS}\times 4\,\mathrm{pF}\times 1.732}{4\,\mathrm{mS}} = 1.39\,\mathrm{pF}$$
> 2. (b) GBW = Gm1/(2πCC)
>    $$f_u = 91.9\,\mathrm{MHz}$$
> 3. (c) A2 = Gm2R2 = 80; node 1 sees CC(1 + A2)
>    $$P_1' = \frac{1}{2\pi R_1 A_2 C_C} = 12.9\,\mathrm{kHz}$$
> 4. (d) Rz = 1/Gm2 moves the RHP zero to infinity
>    $$R_z = 250\,\mathrm{\Omega}$$
> 5. (e) ISS/CC vs (I7 − ISS)/CL: the smaller wins
>    $$\min(86.6\,\mathrm{V/\mu s},\; 95\,\mathrm{V/\mu s}) = 86.6\,\mathrm{V/\mu s}$$

