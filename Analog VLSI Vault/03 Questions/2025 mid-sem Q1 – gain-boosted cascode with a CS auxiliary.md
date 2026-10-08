---
tags: ["question", "source/mid-sem", "unit/L6"]
aliases: ["Mid-sem 2025-26 Q1 (13 marks)"]
---
# 2025 mid-sem Q1: gain-boosted cascode with a CS auxiliary

**Source:** Mid-sem 2025-26 Q1 (13 marks) · **Exam time:** 20 min (13 marks × 1.5 min)

**Topics:** [[L6 Gain boosting]] · **Lectures:** [[Lec 06]] · [[Lec 07]] · [[Lec 08]] · [[Lec 09]]

> [!quote] 2025-26 mid-sem, Question 1 (as printed)
> ![[m25q1.webp]]

## Question

I1 = 100 µA, I2 = 0.5 mA, (W/L)1,2,3 = 100/0.5; I1, I2 are PMOS with (W/L)p = 50/0.5. (a) DC voltages at X and P (gate biases of M3 and M2). (b) Maximum output swing. (c) Overall gain. VDD = 3 V, µnCox = 135 µA/V², µpCox = 40 µA/V², Vthn = 0.7 V, |Vthp| = 0.8 V, λn = 0.1 V⁻¹, λp = 0.2 V⁻¹.

| Given | Value |
|---|---|
| $I_1$ | 100 µA |
| $I_2$ | 500 µA |
| $(W/L)_{1,2,3}$ | 200 |
| $\mu_nC_{ox}$ | 0.000135 A/V² |

**Find:** (a) VX = gate of M3 · (a) VP = gate of M2 · (b) Maximum output swing · (c) Overall gain (with sign)

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Walk the node voltages from ground: M3 first, then M2.
> 2. X = VGS3 at I1; P = X + VGS2 at I2.
> 3. Swing: from VGS3 + Vov2 up to VDD − |Vov| of the PMOS source.
> 4. Rdown ≈ gm3(rO3 ‖ rO,I1)·gm2rO2rO1 is huge; the PMOS rO (10 kΩ) decides the gain.

> [!info]- Concept and formulas
> M3 is the auxiliary amplifier: it holds X still, so M2 fights (1 + A1) times harder. Bias by walking up from ground (X = VGS3, P = X + VGS2); swing is the room between the two fences; gain is −Gm·(Rup ‖ Rdown).
> $$V_X = V_{GS3},\quad V_P = V_X + V_{GS2}$$
> $$V_{out,max} = V_{DD} - |V_{ov,I_2}|,\quad V_{out,min} = V_{GS3} + V_{ov2}$$
> $$A_1 = g_{m3}(r_{O3}\parallel r_{O,I_1}),\quad R_{down} = A_1g_{m2}r_{O2}r_{O1},\quad R_{up} = r_{O,I_2}$$
> $$A_v = -g_{m1}(R_{up}\parallel R_{down})$$

> [!success]- Answers
> - (a) VX = gate of M3: **786.1 mV**
> - (a) VP = gate of M2: **1.679 V**
> - (b) Maximum output swing: **1.521 V**
> - (c) Overall gain (with sign): **-51.96 V/V**

> [!example]- Full solution
> 1. M3 carries I1 = 100 µA with its source on ground: X sits one VGS3 up
>    $$V_{ov3} = \sqrt{\tfrac{2(100\mu)}{135\mu\times 200}} = 0.0861,\; V_X = 0.7 + 0.0861 = 0.786\,\mathrm{V}$$
> 2. M2 carries I2 = 0.5 mA with its source on X: P = X + VGS2
>    $$V_{ov2} = 0.192,\; V_P = 0.786 + 0.7 + 0.192 = 1.679\,\mathrm{V}$$
> 3. Ceiling: the PMOS source I2 needs its |Vov| (0.5 mA, 50/0.5, µpCox 40µ)
>    $$|V_{ov,I_2}| = 0.5 \Rightarrow V_{out,max} = 2.5\,\mathrm{V}$$
> 4. Floor: M2’s source sits at VGS3, and M2 needs its own Vov
>    $$V_{out,min} = 0.786 + 0.192 = 0.979\,\mathrm{V},\quad \text{swing} = 1.521\,\mathrm{V}$$
> 5. Rdown: the auxiliary gain A1 = gm3(rO3 ‖ rO,I1) multiplies the cascode
>    $$A_1 = 2.32\,\mathrm{mS}\,(100\,\mathrm{k\Omega}\parallel 50\,\mathrm{k\Omega}) = 77.5,\quad R_{down} = A_1g_{m2}r_{O2}r_{O1} = 161\,\mathrm{M\Omega}$$
> 6. Rup is just the PMOS source’s rO (the load trap): it sets the gain
>    $$A_v = -5.2\,\mathrm{mS}\,(10\,\mathrm{k\Omega}\parallel 161\,\mathrm{M\Omega}) = -51.96$$

> [!note]- Official solution, Q1
> ![[k-m25q1.webp]]

> [!abstract]- Calculator keys (fx-991CW)
> - **Vov of M3 in one line:** `√( 2 × 100 [µ] ÷ ( 135 [µ] × 200 ) )`
> - **Gain: parallel of 10 kΩ and Rdown:** `−5.196[m] × ( 10[k]⁻¹ + 160.9[M]⁻¹ )⁻¹`

