---
tags: ["question", "source/mid-sem", "unit/L3"]
aliases: ["Mid-sem 2023-24 Q3 (14 marks)"]
---
# 2023 mid-sem Q3: design a high-swing PMOS-input telescopic

**Source:** Mid-sem 2023-24 Q3 (14 marks) · **Exam time:** 21 min (14 marks × 1.5 min)

**Topics:** [[L3 Design procedure]] · **Lectures:** [[Lec 04]]

> [!quote] 2023-24 mid-sem, Question 3 (as printed)
> ![[m23q3.webp]]

## Question

All PMOS about the same size, all NMOS the same size. SR = 5 V/µs into 10 pF; Vout,max = 1.28 V, Vout,min = 0.3 V, VDD = 2 V. µnCox = 100 µA/V², µpCox = 50 µA/V², Vthn = 0.3 V, Vthp = −0.4 V, λn = 0.1, λp = 0.2 V⁻¹ (L = 1 µm). Find all sizes, Vb1,min, Vb2,max, Vb3 and the gain.

| Given | Value |
|---|---|
| $SR$ | 5 V/µs |
| $C_L$ | 10 pF |
| $V_{DD}$ | 2 V |

**Find:** PMOS M1–M4 (and M9) · NMOS M5–M8 · Vb1,min · Vb2,max · Vb3 · Gain

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. ISS = SR × CL.
> 2. The high-swing NMOS mirror leaves only two overdrives at the bottom.
> 3. M9 carries 2ID: same W/L means √2 times the overdrive.
> 4. Each bias voltage puts one device exactly at its edge.

> [!info]- Concept and formulas
> Slew rate fixes ISS. The swing limits fix the overdrives: the floor is two NMOS overdrives (high-swing mirror), the ceiling is VDD minus three PMOS overdrives (M9 carries twice the current, so its overdrive is √2 larger). Square law gives W/L; bias voltages put each device at its edge.
> $$I_{SS} = SR\cdot C_L,\quad V_{out,min} = V_{ov8} + V_{ov6}$$
> $$V_{DD} - V_{out,max} = |V_{ov9}| + |V_{ov2}| + |V_{ov4}| = (\sqrt2 + 2)|V_{ov}|$$
> $$V_{b1,min} = V_{ov7} + V_{GS5},\; V_{b2,max} = V_{DD} - |V_{ov9}| - |V_{ov2}| - |V_{GS4}|,\; V_{b3} = V_{DD} - |V_{GS9}|$$
> $$A_v = g_{m2}\left[g_{m4}r_{O4}r_{O2}\parallel g_{m6}r_{O6}r_{O8}\right]$$

> [!success]- Answers
> - PMOS M1–M4 (and M9): **22.49**
> - NMOS M5–M8: **22.22**
> - Vb1,min: **600 mV**
> - Vb2,max: **880 mV**
> - Vb3: **1.302 V**
> - Gain: **1909 V/V**

> [!example]- Full solution
> 1. Slew rate: ISS = SR·CL = 50 µA, 25 µA per side
>    $$I_D = 25\,\mathrm{\mu A}$$
> 2. Floor 0.3 V = two NMOS overdrives
>    $$V_{ov,N} = 0.15,\; (W/L)_{5-8} = \frac{2(25\mu)}{100\mu(0.15)^2} = 22.22$$
> 3. Ceiling: 2 − 1.28 = 0.72 V shared by M9 (√2·|Vov|) and M2, M4
>    $$|V_{ov}| = \frac{0.72}{2+\sqrt2} = 0.211,\; (W/L)_{1-4,9} = 22.49$$
> 4. Vb1,min: M7 at its edge under cascode M5
>    $$V_{b1,min} = 0.15 + 0.3 + 0.15 = 0.6\,\mathrm{V}$$
> 5. Vb2,max: M2 at its edge (its drain is M4’s source)
>    $$V_{b2,max} = 2 - 0.298 - 0.211 - 0.611 = 0.88\,\mathrm{V}$$
> 6. Vb3 biases the tail M9 (50 µA)
>    $$V_{b3} = 2 - (0.4 + 0.298) = 1.3\,\mathrm{V}$$
> 7. Gain: gm2 (Rup ‖ Rdown)
>    $$A_v = 0.237\,\mathrm{mS}\,(g_{m4}r_{OP}^2 \parallel g_{m6}r_{ON}^2) = 1909$$

> [!note]- Official answers, Q3
> ![[k-m23q3.webp]]

> [!abstract]- Calculator keys (fx-991CW)
> - **PMOS overdrive and size:** `0.72 ÷ (2 + √2) → STO A;  2 × 25[µ] ÷ (50[µ] × A²)`

