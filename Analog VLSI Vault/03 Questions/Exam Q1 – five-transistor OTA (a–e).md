---
tags: ["question", "source/mid-sem", "unit/U11", "unit/U12", "unit/L2"]
aliases: ["Mid-sem exam Q1 (= Quiz 1 Part C)"]
---
# Exam Q1: five-transistor OTA (a–e)

**Source:** Mid-sem exam Q1 (= Quiz 1 Part C)

**Topics:** [[U11 Five-transistor OTA]] · [[U12 Poles and bandwidth]] · [[L2 One-stage op amps]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

> [!quote] Mid-sem question (as printed)
> ![[exam-q1.webp]]

## Question

I1 = 120 µA into diode M6; (W/L)5 = (W/L)6 = 30; Vin,CM,min = 0.75 V, Vin,CM,max = 1.45 V. M1 = M2 and M3 = M4. µnCox = 200 µA/V², µpCox = 100 µA/V², Vthn = 0.4 V, Vthp = −0.5 V, VDD = 1.8 V, λn = 0.05 V⁻¹, λp = 0.1 V⁻¹. (a) Sizes of M1 and M3. (b) The gain. (c) The maximum output swing. (d) The −3 dB bandwidth with CL = 4 pF. (e) The bandwidth when the output is shorted to Vin2 (buffer), CL = 4 pF.

| Given | Value |
|---|---|
| $I_1$ | 120 µA |
| $(W/L)_{5,6}$ | 30 |
| $V_{in,CM,min}$ | 750 mV |
| $V_{in,CM,max}$ | 1.45 V |
| $C_L$ | 4 pF |

**Find:** (a) Size of M1, M2 · (a) Size of M3, M4 · (b) Gain · (c) Maximum output swing · (d) Bandwidth · (e) Buffer bandwidth

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Part (a) is the CM-range formulas run backwards.
> 2. Floor: Vov5 + VGS1. Ceiling: VDD − |VGS3| + Vthn. Then W/L from the square law with ID = 60 µA.
> 3. Av = gm1(rO2 ‖ rO4); swing = (VDD − |Vov4|) − (Vov5 + Vov2); f = 1/(2πRC); buffer f ≈ gm/(2πCL).
> 4. Vov5 = 200 mV.

> [!info]- Concept and formulas
> Five-transistor OTA: the mirror recovers the other half, so Gm = gm1 and Rout = rO2 ‖ rO4. The CM range is two fences (tail + VGS1 at the bottom, M1 against the diode M3 at the top); the swing is two overdrives at each rail; one pole at the output; as a buffer Rout → 1/gm. Here the CM limits are given and the sizes are the unknowns: read each fence backwards.
> $$V_{in,CM,min} = V_{ov5} + V_{GS1},\quad V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{thn}$$
> $$A_v = g_{m1}(r_{O2}\parallel r_{O4})$$
> $$\text{swing} = (V_{DD} - |V_{ov4}|) - (V_{ov5} + V_{ov2})$$
> $$f_{-3dB} = \dfrac{1}{2\pi(r_{O2}\parallel r_{O4})C_L},\quad f_{buffer} = \dfrac{g_{m2}}{2\pi C_L}$$

> [!success]- Answers
> - (a) Size of M1, M2: **26.67**
> - (a) Size of M3, M4: **19.2**
> - (b) Gain: **88.89 V/V**
> - (c) Maximum output swing: **1.2 V**
> - (d) Bandwidth: **358.1 kHz**
> - (e) Buffer bandwidth: **31.83 MHz**

> [!example]- Full solution
> 1. M5 copies I1 (same size as M6): ISS = 120 µA, ID = 60 µA per side
>    $$V_{ov5} = \sqrt{\frac{2(120\mu)}{200\mu \times 30}} = 0.2\,\mathrm{V}$$
> 2. (a) Floor 0.75 V = Vov5 + VGS1
>    $$V_{ov1} = 0.75 - 0.2 - 0.4 = 0.15\,\mathrm{V},\; \left(\tfrac{W}{L}\right)_1 = \frac{2(60\mu)}{200\mu\, V_{ov1}^2} = 26.67$$
> 3. (a) Ceiling 1.45 V = VDD − |VGS3| + Vthn
>    $$|V_{GS3}| = 1.8 - 1.45 + 0.4 = 0.75\,\mathrm{V},\; |V_{ov3}| = 0.25\,\mathrm{V},\; \left(\tfrac{W}{L}\right)_3 = 19.2$$
> 4. (b) Av = gm1 (rO2 ‖ rO4)
>    $$g_{m1} = \frac{2(60\mu)}{0.15} = 0.8\,\mathrm{mS},\; r_{O2} = 333\,\mathrm{k\Omega},\; r_{O4} = 167\,\mathrm{k\Omega},\; A_v = 88.9$$
> 5. (c) Ceiling VDD − |Vov4|, floor Vov5 + Vov2 (input CM at its minimum)
>    $$1.55\,\mathrm{V} - 0.35\,\mathrm{V} = 1.2\,\mathrm{V}$$
> 6. (d) One pole at the output node
>    $$f_{-3dB} = \frac{1}{2\pi R_{out} C_L} = \frac{1}{2\pi(111\,\mathrm{k\Omega})(4\,\mathrm{pF})} = 358\,\mathrm{kHz}$$
> 7. (e) Buffer: Rout drops to ≈ 1/gm2, the pole jumps to gm/CL
>    $$f_{buffer} \approx \frac{g_{m}}{2\pi C_L} = 31.8\,\mathrm{MHz}$$

> [!abstract]- Calculator keys (fx-991CW)
> - **Type µ, m, k, M directly:** `[CATALOG] ▸ Engineer Symbol ▸ µ  (turn on: [SETTINGS] ▸ Calc Settings ▸ Engineer Symbol ▸ On)`
> - **Vov from a current:** `√( 2 × I ÷ ( µCox × W/L ) )`
> - **W/L from the square law, in one line:** `2 × I ÷ ( µCox × Vov² )   e.g.  2 × 0.1[m] ÷ ( 400[µ] × 0.15² )`
> - **f−3dB:** `1 ÷ ( 2π × Rout × 4[p] )`

