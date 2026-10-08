---
tags: ["question", "source/mid-sem", "unit/L2"]
aliases: ["Mid-sem 2024-25 Q3 (10 marks)"]
---
# 2024 mid-sem Q3: PMOS-input telescopic with a cascode mirror, and as a buffer

**Source:** Mid-sem 2024-25 Q3 (10 marks) · **Exam time:** 15 min (10 marks × 1.5 min)

**Topics:** [[L2 One-stage op amps]] · **Lectures:** [[Lec 02]]

> [!quote] 2024-25 mid-sem, Question 3 (as printed)
> ![[m24q3.webp]]

## Question

ISS = 50 µA, Vov1–4 = 0.2 V, Vov5–8 = 0.1 V, the tail needs 0.15 V, Vb = 0.7 V. Find the gain, Vout,max (for this Vb) and Vout,min. If Vout is shorted to Vin2, find Vout,max and Vout,min. VDD = 1.8 V, λp = 0.2 V⁻¹, λn = 0.1 V⁻¹, Vthn = 0.4 V, |Vthp| = 0.5 V.

| Given | Value |
|---|---|
| $I_{SS}$ | 50 µA |
| $V_b$ | 700 mV |

**Find:** Gain · Vout,max · Vout,min · Buffer: Vout,min · Buffer: Vout,max

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Write each fence: NMOS VD ≥ VG − Vth, PMOS VD ≤ VG + |Vth|.
> 2. M6’s gate is two VGS above ground (the diode stack).
> 3. For the buffer, M2’s gate moves with the output.
> 4. M2’s drain = Vb + |VGS4| = 0.7 + 0.7.

> [!info]- Concept and formulas
> Gain = gm2 (Rup ‖ Rdown) with both cascodes ≈ gm·rO². The output ceiling is M4’s PMOS fence (Vb + |Vthp|); the floor is the NMOS cascode mirror, whose diode stack costs one extra Vthn. As a buffer, M2’s gate is the output, so M2’s fence adds a new floor.
> $$A_v = g_{m2}\left[g_{m4}r_{O4}r_{O2} \parallel g_{m6}r_{O6}r_{O8}\right]$$
> $$V_{out,max} = V_b + |V_{thp}|,\quad V_{out,min} = V_{ov8} + V_{ov6} + V_{thn}$$
> $$\text{buffer: } V_{D2} = V_b + |V_{GS4}| \le V_{out} + |V_{thp}| \Rightarrow V_{out} \ge V_b + |V_{GS4}| - |V_{thp}|$$

> [!success]- Answers
> - Gain: **2222 V/V**
> - Vout,max: **1.2 V**
> - Vout,min: **600 mV**
> - Buffer: Vout,min: **900 mV**
> - Buffer: Vout,max: **1.2 V**

> [!example]- Full solution
> 1. Roles: M2 input (CS), M4 PMOS cascode, M6 NMOS cascode, M8 current source
>    $$g_{m2} = \frac{2(25\mu)}{0.2} = 0.25\,\mathrm{mS},\; g_{m6} = 0.5\,\mathrm{mS},\; r_{OP} = 200\,\mathrm{k\Omega},\; r_{ON} = 400\,\mathrm{k\Omega}$$
> 2. Up multiplies by gm·rO on both sides
>    $$A_v = 0.25\,\mathrm{mS}\,(10\,\mathrm{M\Omega}\parallel 80\,\mathrm{M\Omega}) = 2222$$
> 3. Ceiling: M4 (gate Vb) saturated while VD ≤ VG + |Vthp|
>    $$V_{out,max} = 0.7 + 0.5 = 1.2\,\mathrm{V}$$
> 4. Floor: M6’s gate sits at VGS7 + VGS5 (diode stack); M6 saturated needs Vout ≥ VG6 − Vth
>    $$V_{out,min} = 0.1 + 0.1 + 0.4 = 0.6\,\mathrm{V}$$
> 5. Buffer: M2’s gate is Vout and its drain is M4’s source, Vb + |VGS4| = 1.4 V
>    $$1.4 \le V_{out} + 0.5 \Rightarrow V_{out,min} = 0.9\,\mathrm{V}$$
> 6. The ceiling is still M4’s fence
>    $$V_{out,max} = 1.2\,\mathrm{V}$$

> [!note]- Official key, Q3
> ![[k-m24q3.webp]]

> [!abstract]- Calculator keys (fx-991CW)
> - **Gain:** `0.25[m] × ( 10[M]⁻¹ + 80[M]⁻¹ )⁻¹`

