---
tags: ["question", "source/quiz", "unit/U11", "unit/L2"]
aliases: ["Quiz 1 Part A"]
---
# Quiz 1 Part A: five-transistor OTA

**Source:** Quiz 1 Part A

**Topics:** [[U11 Five-transistor OTA]] · [[L2 One-stage op amps]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

Same circuit as your exam. I1 = 160 µA, (W/L)5,6 = 40, Vin,CM,min = 0.7 V, Vin,CM,max = 1.55 V, CL = 3 pF. Set B: µnCox = 200 µA/V², µpCox = 100 µA/V², λn = 0.05 V⁻¹, λp = 0.1 V⁻¹, Vthn = 0.4 V, |Vthp| = 0.5 V, VDD = 1.8 V. Find the sizes of M1 and M3, the gain, the output swing, the bandwidth and the buffer bandwidth.

| Given | Value |
|---|---|
| $I_1$ | 160 µA |
| $(W/L)_{5,6}$ | 40 |
| $V_{in,CM,min}$ | 700 mV |
| $V_{in,CM,max}$ | 1.55 V |
| $C_L$ | 3 pF |

**Find:** Size of M1, M2 · Size of M3, M4 · Gain · Output swing · Bandwidth · Buffer bandwidth

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Exactly the exam method.
> 2. Floor → Vov1; ceiling → |Vov3|.
> 3. Av = gm1(rO2 ‖ rO4).
> 4. Vov5 = 200 mV.

> [!info]- Concept and formulas
> Five-transistor OTA: the mirror recovers the other half, so Gm = gm1 and Rout = rO2 ‖ rO4. The CM range is two fences (tail + VGS1 at the bottom, M1 against the diode M3 at the top); the swing is two overdrives at each rail; one pole at the output; as a buffer Rout → 1/gm.
> $$V_{in,CM,min} = V_{ov5} + V_{GS1},\quad V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{thn}$$
> $$A_v = g_{m1}(r_{O2}\parallel r_{O4})$$
> $$\text{swing} = (V_{DD} - |V_{ov4}|) - (V_{ov5} + V_{ov2})$$
> $$f_{-3dB} = \dfrac{1}{2\pi(r_{O2}\parallel r_{O4})C_L},\quad f_{buffer} = \dfrac{g_{m2}}{2\pi C_L}$$

> [!success]- Answers
> - Size of M1, M2: **80**
> - Size of M3, M4: **71.11**
> - Gain: **133.3 V/V**
> - Output swing: **1.35 V**
> - Bandwidth: **636.6 kHz**
> - Buffer bandwidth: **84.88 MHz**

> [!example]- Full solution
> 1. Tail overdrive, then the floor gives Vov1
>    $$V_{ov5} = 0.2\,\mathrm{V},\;V_{ov1} = 0.1\,\mathrm{V},\;\left(\tfrac{W}{L}\right)_1 = 80$$
> 2. The ceiling gives |Vov3|
>    $$|V_{ov3}| = 0.15\,\mathrm{V},\;\left(\tfrac{W}{L}\right)_3 = 71.11$$
> 3. Gain
>    $$A_v = g_{m1}(r_{O2}\parallel r_{O4}) = 133$$
> 4. Swing: (VDD − |Vov4|) − (Vov5 + Vov2)
>    $$1.35\,\mathrm{V}$$
> 5. Bandwidth
>    $$f_{-3dB} = \frac{1}{2\pi R_{out} C_L} = 637\,\mathrm{kHz}$$
> 6. Buffer
>    $$f_{buffer} \approx \frac{g_m}{2\pi C_L} = 84.9\,\mathrm{MHz}$$

> [!note]- Official Quiz 1 key (all parts)
> ![[k-quiz1.webp]]

> [!abstract]- Calculator keys (fx-991CW)
> - **Type µ, m, k, M directly:** `[CATALOG] ▸ Engineer Symbol ▸ µ  (turn on: [SETTINGS] ▸ Calc Settings ▸ Engineer Symbol ▸ On)`
> - **W/L from the square law, in one line:** `2 × I ÷ ( µCox × Vov² )   e.g.  2 × 0.1[m] ÷ ( 400[µ] × 0.15² )`

