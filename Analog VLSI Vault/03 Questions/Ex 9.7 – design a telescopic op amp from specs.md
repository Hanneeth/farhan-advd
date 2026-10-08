---
tags: ["question", "source/Razavi", "unit/L3"]
aliases: ["Razavi Example 9.7"]
---
# Ex 9.7: design a telescopic op amp from specs

**Source:** Razavi Example 9.7

**Topics:** [[L3 Design procedure]] · **Lectures:** [[Lec 04]]

## Question

Design a fully differential telescopic op amp: VDD = 3 V, power 10 mW, differential swing 3 V, gain 2000. µnCox = 60 µA/V², µpCox = 30 µA/V², λn = 0.1 V⁻¹, λp = 0.2 V⁻¹ (L = 0.5 µm), Vth = 0.7 V. Following the book: ISS = 3 mA, tail Vov9 = 0.5 V, PMOS |Vov| = 0.3 V, NMOS Vov = 0.2 V. Find the sizes, the gain, and the bias voltages.

| Given | Value |
|---|---|
| $I_{SS}$ | 3 mA |
| $V_{ov,N}$ | 200 mV |
| $|V_{ov,P}|$ | 300 mV |
| $V_{ov9}$ | 500 mV |

**Find:** NMOS size · PMOS size · Tail size · Gain · NMOS cascode bias · PMOS cascode bias

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Start with power, then swing, then overdrives, then sizes.
> 2. Every W/L from 2ID/(µCox·Vov²).
> 3. Gain = gm1(Rdown ‖ Rup).
> 4. ID = 1.5 mA per side.

> [!info]- Concept and formulas
> Design recipe: power → currents; swing → overdrives; square law → W/L; check gain; if short, lengthen the weak side (doubling W and L keeps Vov, halves λ).
> $$I = P/V_{DD}$$
> $$\dfrac{W}{L} = \dfrac{2I_D}{\mu C_{ox}V_{ov}^2}$$
> $$A_v = g_{m1}(R_{up}\parallel R_{down})$$
> $$g_mr_O \propto \sqrt{WL/I_D}$$

> [!success]- Answers
> - NMOS size: **1250**
> - PMOS size: **1111**
> - Tail size: **400**
> - Gain: **1429 V/V**
> - NMOS cascode bias: **1.6 V**
> - PMOS cascode bias: **1.7 V**

> [!example]- Full solution
> 1. Power: 10 mW / 3 V = 3.33 mA. About 0.33 mA goes to the bias branches (Ib1, Ib2), leaving ISS = 3 mA: 1.5 mA each side
>    $$I_{SS} = 3\,\mathrm{mA}$$
> 2. Swing: 3 V differential = 1.5 V each side; the rest (1.5 V) goes to 2|Vov,P| + 2Vov,N + Vov9 = 0.6 + 0.4 + 0.5
>    $$|V_{ov,P}| = 0.3,\; V_{ov,N} = 0.2,\; V_{ov9} = 0.5$$
> 3. Sizes from the square law
>    $$\left(\tfrac{W}{L}\right)_{1-4} = \frac{2(1.5\mathrm{m})}{60\mu(0.2)^2} = 1250$$
> 4. PMOS
>    $$\left(\tfrac{W}{L}\right)_{5-8} = \frac{2(1.5\mathrm{m})}{30\mu(0.3)^2} = 1111$$
> 5. Tail
>    $$\left(\tfrac{W}{L}\right)_9 = \frac{2(3\mathrm{m})}{60\mu(0.5)^2} = 400$$
> 6. Gain: gm1 [gm3 rO3 rO1 ‖ gm5 rO5 rO7]; the PMOS side (λp = 0.2) is the weak one
>    $$A_v \approx 1429\;(\text{book: } 1416)$$
> 7. Gain < 2000: lengthen M5–M8 (W and L ×2, same Vov): λp halves, rO doubles
>    $$A_v \approx 4000$$
> 8. Bias for full swing: Vin,CM = VISS + VGS1 = 1.4 V; Vb1 = Vin,CM − Vth + VGS3
>    $$V_{b1} = 1.4 - 0.7 + 0.9 = 1.6\,\mathrm{V}$$
> 9. Vb2 = VDD − |Vov7| − |VGS5|
>    $$V_{b2} = 3 - 0.3 - 1.0 = 1.7\,\mathrm{V}$$

> [!abstract]- Calculator keys (fx-991CW)
> - **W/L from the square law, in one line:** `2 × I ÷ ( µCox × Vov² )   e.g.  2 × 0.1[m] ÷ ( 400[µ] × 0.15² )`
> - **Parallel resistors:** `( a⁻¹ + b⁻¹ )⁻¹   (x⁻¹ is the [x⁻¹] key)`

