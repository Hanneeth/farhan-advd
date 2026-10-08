---
tags: ["question", "source/tutorial", "unit/L8", "unit/L7"]
aliases: ["Tutorial 5 Q3"]
---
# Tutorial 5 Q3: CM gain and CMRR with and without CMFB

**Source:** Tutorial 5 Q3

**Topics:** [[L8 CMFB techniques]] · [[L7 CMFB concept and sensing]] · **Lectures:** [[Lec 09]] · [[Lec 10]] · [[Lec 11]] · [[Lec 12]]

> [!quote] Tutorial 5, Question 3 (as printed)
> ![[t5q3.webp]]

## Question

I1 = 50 µA, I2 = 200 µA, W/L = 50 µm/1 µm for every device, R = 10 MΩ. VDD = 1.8 V, µnCox = 100 µA/V², µpCox = 50 µA/V², λp = 0.2 V⁻¹, λn = 0.1 V⁻¹, Vthn = 0.4 V, |Vthp| = 0.5 V. Without CMFB: Ad, ACM, the optimum VO,CM and CMRR. With CMFB: the CM gain needed for ±1% on VO,CM, the CM loop gain, the CM gain achieved and the CMRR.

| Given | Value |
|---|---|
| $I_1$ | 50 µA |
| $I_2$ | 200 µA |
| $W/L$ | 50 |
| $R$ | 10 MΩ |

**Find:** Differential gain · CM gain, no CMFB · Optimum VO,CM (middle of the swing) · CMRR, no CMFB · CM gain allowed by ±1% · CM loop gain · CM gain with CMFB · CMRR with CMFB

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Find every current from the mirrors first.
> 2. In DM the R midpoint is AC ground; in CM no current flows in the R’s.
> 3. CM half circuit: the tail counts as 2rO5.
> 4. gm1 = 0.7071 mS, rO3 = 100 kΩ.

> [!info]- Concept and formulas
> Without CMFB: Ad = gm(rO1 ‖ rO3 ‖ R), ACM ≈ rO3/(2rO5). Optimum VO,CM = middle of the output range. “±1%” (course rule): the output CM may move 2·1%·VO,CM over the whole input CM range. With CMFB the CM gain divides by (1 + loop gain).
> $$A_d = g_{m1}(r_{O1}\parallel r_{O3}\parallel R),\quad A_{CM} = \dfrac{r_{O3}}{1/g_{m1} + 2r_{O5}}$$
> $$A_{CM,req} = \dfrac{2(0.01)V_{O,CM}}{V_{in,CM,max} - V_{in,CM,min}}$$
> $$A_{CM,fb} = \dfrac{A_{CM}}{1 + T}$$

> [!success]- Answers
> - Differential gain: **46.83 V/V**
> - CM gain, no CMFB: **0.4965 V/V**
> - Optimum VO,CM (middle of the swing): **970.7 mV**
> - CMRR, no CMFB: **94.32**
> - CM gain allowed by ±1%: **0.03085 V/V**
> - CM loop gain: **17.1**
> - CM gain with CMFB: **0.02743 V/V**
> - CMRR with CMFB: **1707**

> [!example]- Full solution
> 1. Currents: M3, M4 copy I1 (50 µA each), so M5 carries 100 µA; M11 copies I2, 100 µA in each of M7, M8
>    $$g_{m1} = 0.707\,\mathrm{mS},\; r_{O1} = 200\,\mathrm{k\Omega},\; r_{O3} = 100\,\mathrm{k\Omega},\; r_{O5} = 100\,\mathrm{k\Omega}$$
> 2. Differential: the R midpoint is AC ground, so each output sees rO1 ‖ rO3 ‖ R
>    $$A_d = g_{m1}(r_{O1}\parallel r_{O3}\parallel R) = 46.83$$
> 3. Common mode: no current in the R’s; CM half circuit with 2rO5 in the source
>    $$|A_{CM}| = \frac{r_{O3}}{1/g_{m1} + 2r_{O5}} = 0.4965$$
> 4. Output range: Vov5 + Vov1 up to VDD − |Vov3|; the optimum CM is its middle
>    $$V_{O,CM} = \frac{0.3414 + 1.6}{2} = 0.9707\,\mathrm{V}$$
> 5. CMRR = Ad/|ACM|
>    $$94.32\;(39.5\,\mathrm{dB})$$
> 6. ±1%: the output CM may move 2·1%·VO,CM while the input CM sweeps its whole range (Vov5 + VGS1 up to VO,CM + Vth1)
>    $$|A_{CM}|_{req} = \frac{2(0.01)(0.971)}{1.37 - 0.741} = 0.0309$$
> 7. Loop: ΔVO,CM → M8 (gm7/2 of pair current) → diode M9 (1/gm9 ‖ rO9 ‖ rO7) → M5 (gm5) → half per side into rO3 ‖ Rdown,CM
>    $$T = \frac{g_{m7}}{2}\,(971\,\mathrm{\Omega})\,g_{m5}\,\frac{1}{2}(r_{O3}\parallel R_{dn}) = 17.1$$
> 8. Feedback divides the CM gain by (1 + T); Ad is unchanged
>    $$|A_{CM}|_{fb} = \frac{0.4965}{1 + 17.1} = 0.02743$$
> 9. CMRR with CMFB (the circuit does not reach the 0.010 target)
>    $$\frac{46.83}{0.02743} = 1707\;(64.6\,\mathrm{dB})$$

> [!abstract]- Calculator keys (fx-991CW)
> - **Parallel resistors:** `( a⁻¹ + b⁻¹ )⁻¹   (x⁻¹ is the [x⁻¹] key)`

