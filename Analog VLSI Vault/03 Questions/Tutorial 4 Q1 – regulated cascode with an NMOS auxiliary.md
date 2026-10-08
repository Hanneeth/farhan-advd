---
tags: ["question", "source/tutorial", "unit/L6"]
aliases: ["Tutorial 4 Q1 (adapted Razavi 9.10)"]
---
# Tutorial 4 Q1: regulated cascode with an NMOS auxiliary

**Source:** Tutorial 4 Q1 (adapted Razavi 9.10)

**Topics:** [[L6 Gain boosting]] · **Lectures:** [[Lec 06]] · [[Lec 07]] · [[Lec 08]] · [[Lec 09]]

> [!quote] Tutorial 4, Question 1 (as printed)
> ![[t4q1.webp]]

## Question

I1 = 100 µA, I2 = 0.5 mA, (W/L)1–3 = 100/0.5, VDD = 3 V, µnCox = 172.35 µA/V², Vthn = 0.7 V, λn = 0.1 V⁻¹. M3 (gate at X = drain of M1, loaded by I1) drives M2’s gate. (a) Gate biases of M2 and M3. (b) Gain with ideal current sources. (c) With PMOS current sources ((W/L)p = 50/0.5, µpCox = 51.7 µA/V², |Vthp| = 0.8 V, λp = 0.2 V⁻¹): output swing and gain.

| Given | Value |
|---|---|
| $I_1$ | 100 µA |
| $I_2$ | 500 µA |
| $(W/L)_{1-3}$ | 200 |
| $\mu_n C_{ox}$ | 0.0001723 A/V² |
| $V_{thn}$ | 700 mV |
| $\lambda_n$ | 0.1 |

**Find:** (a) Gate of M3 (= X) · (a) Gate of M2 · (b) Gain, ideal sources · (c) Lowest output · (c) Highest output · (c) Gain with PMOS sources

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Walk up from ground: X = VGS3, then VG2 = X + VGS2.
> 2. Gain boosting multiplies the cascode’s Rout by (1 + A1).
> 3. Rout = rO1 + rO2 + (1 + A1)gm2rO2rO1; with a PMOS load, Rout ≈ rO,p.
> 4. A1 = gm3·rO3 = 263.

> [!info]- Concept and formulas
> Regulated cascode: CS auxiliary M3 holds X; Rout multiplies by (1 + A1). Bias walks up from ground; the PMOS current source (part c) is the load trap.
> $$V_X = V_{GS3},\; V_{G2} = V_X + V_{GS2}$$
> $$R_{out} = r_{O1} + r_{O2} + (1+A_1)g_{m2}r_{O2}r_{O1},\; A_1 = g_{m3}r_{O3}$$
> $$V_{out,min} = V_{GS3} + V_{ov2}$$

> [!success]- Answers
> - (a) Gate of M3 (= X): **776.2 mV**
> - (a) Gate of M2: **1.646 V**
> - (b) Gain, ideal sources: **3634000 V/V**
> - (c) Lowest output: **946.5 mV**
> - (c) Highest output: **2.56 V**
> - (c) Gain with PMOS sources: **58.71 V/V**

> [!example]- Full solution
> 1. M3 carries I1 with its source at ground, so X sits one VGS3 up
>    $$V_X = 0.7 + \sqrt{\tfrac{2(100\mu)}{172.35\mu\times 200}} = 0.7762\,\mathrm{V}$$
> 2. M2 carries I2 with its source at X
>    $$V_{G2} = V_X + 0.7 + \sqrt{\tfrac{2(0.5\mathrm{m})}{172.35\mu\times 200}} = 1.646\,\mathrm{V}$$
> 3. Auxiliary gain A1 = gm3·rO3; boosted Rout = rO1 + rO2 + (1 + A1)gm2 rO2 rO1
>    $$A_1 = 263,\; R_{out} = 619\,\mathrm{M\Omega}$$
> 4. (b) Av = gm1·Rout (ideal I2)
>    $$|A_v| = 3.63\times 10^{6}$$
> 5. (c) Floor: M2 fence, Vout ≥ VG2 − Vth
>    $$0.9465\,\mathrm{V}$$
> 6. Ceiling: the PMOS source needs its |Vov|
>    $$3 - \sqrt{\tfrac{2(0.5\mathrm{m})}{51.7\mu\times 100}} = 2.56\,\mathrm{V}$$
> 7. The load trap again: the PMOS rO (10 kΩ) is in parallel with hundreds of MΩ
>    $$|A_v| = g_{m1}(R_{boost}\parallel r_{OP}) = 58.7$$

> [!abstract]- Calculator keys (fx-991CW)
> - **Vov from a current:** `√( 2 × I ÷ ( µCox × W/L ) )`
> - **Parallel resistors:** `( a⁻¹ + b⁻¹ )⁻¹   (x⁻¹ is the [x⁻¹] key)`

