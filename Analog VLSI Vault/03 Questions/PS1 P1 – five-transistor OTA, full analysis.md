---
tags: ["question", "source/problem-set", "unit/L2", "unit/U11"]
aliases: ["Problem Set 1 P1 (tutoring chat)"]
---
# PS1 P1: five-transistor OTA, full analysis

**Source:** Problem Set 1 P1 (tutoring chat)

**Topics:** [[L2 One-stage op amps]] · [[U11 Five-transistor OTA]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

Set B: µnCox = 200 µA/V², µpCox = 100 µA/V², λn = 0.05 V⁻¹, λp = 0.1 V⁻¹, Vthn = 0.4 V, |Vthp| = 0.5 V, VDD = 1.8 V. Five-transistor OTA: ISS = 200 µA, (W/L)1,2 = 40, (W/L)3,4 = 25, (W/L)5 = 20, CL = 2 pF. (a) Gain. (b) Input CM range. (c) Output swing. (d) −3 dB bandwidth. (e) Bandwidth with the output shorted to Vin2.

| Given | Value |
|---|---|
| $I_{SS}$ | 200 µA |
| $(W/L)_{1,2}$ | 40 |
| $(W/L)_{3,4}$ | 25 |
| $(W/L)_5$ | 20 |
| $C_L$ | 2 pF |

**Find:** (a) Gain · (b) CM floor · (b) CM ceiling · (c) Output floor · (c) Output ceiling · (d) Bandwidth · (e) Buffer bandwidth

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Same five lines as your exam, forwards this time.
> 2. Gain gm1(rO2 ‖ rO4); fences for the ranges; 1/(2πRC) for bandwidth.
> 3. Buffer bandwidth ≈ gm/(2πCL).
> 4. Vov1 = 0.158 V.

> [!info]- Concept and formulas
> Five-transistor OTA: the mirror recovers the other half, so Gm = gm1 and Rout = rO2 ‖ rO4. The CM range is two fences (tail + VGS1 at the bottom, M1 against the diode M3 at the top); the swing is two overdrives at each rail; one pole at the output; as a buffer Rout → 1/gm.
> $$V_{in,CM,min} = V_{ov5} + V_{GS1},\quad V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{thn}$$
> $$A_v = g_{m1}(r_{O2}\parallel r_{O4})$$
> $$\text{swing} = (V_{DD} - |V_{ov4}|) - (V_{ov5} + V_{ov2})$$
> $$f_{-3dB} = \dfrac{1}{2\pi(r_{O2}\parallel r_{O4})C_L},\quad f_{buffer} = \dfrac{g_{m2}}{2\pi C_L}$$

> [!success]- Answers
> - (a) Gain: **84.33 V/V**
> - (b) CM floor: **874.3 mV**
> - (b) CM ceiling: **1.417 V**
> - (c) Output floor: **474.3 mV**
> - (c) Output ceiling: **1.517 V**
> - (d) Bandwidth: **1.194 MHz**
> - (e) Buffer bandwidth: **100.7 MHz**

> [!example]- Full solution
> 1. ID = 100 µA per side
>    $$V_{ov1} = 0.158\,\mathrm{V},\;|V_{ov3}| = 0.283\,\mathrm{V},\;V_{ov5} = 0.316\,\mathrm{V}$$
> 2. (a) Av = gm1 (rO2 ‖ rO4)
>    $$A_v = 1.26\,\mathrm{mS}\times 66.7\,\mathrm{k\Omega} = 84.3$$
> 3. (b) Floor Vov5 + VGS1
>    $$0.874\,\mathrm{V}$$
> 4. Ceiling VDD − |VGS3| + Vthn
>    $$1.42\,\mathrm{V}$$
> 5. (c) Output floor Vov5 + Vov2
>    $$0.474\,\mathrm{V}$$
> 6. Output ceiling VDD − |Vov4|
>    $$1.52\,\mathrm{V}$$
> 7. (d) f−3dB = 1/(2π Rout CL)
>    $$1.19\,\mathrm{MHz}$$
> 8. (e) Buffer: Rout → 1/gm, f = gm/(2π CL)
>    $$101\,\mathrm{MHz}$$

> [!abstract]- Calculator keys (fx-991CW)
> - **Vov from a current:** `√( 2 × I ÷ ( µCox × W/L ) )`
> - **Parallel resistors:** `( a⁻¹ + b⁻¹ )⁻¹   (x⁻¹ is the [x⁻¹] key)`

