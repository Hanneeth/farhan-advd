---
tags: ["question", "source/tutorial", "unit/L4"]
aliases: ["Tutorial 2 Q3 (Razavi Problem 9.3)"]
---
# Tutorial 2 Q3: design a folded cascode for 2.4 V swing and 6 mW

**Source:** Tutorial 2 Q3 (Razavi Problem 9.3)

**Topics:** [[L4 Folded cascode]] · **Lectures:** [[Lec 05]]

> [!quote] Tutorial 2, Question 3 (as printed)
> ![[t2q3.webp]]

## Question

Set A (Razavi 0.5 µm): µnCox = 134.28 µA/V², µpCox = 38.36 µA/V², λn = 0.1 V⁻¹, λp = 0.2 V⁻¹ (L = 0.5 µm), Vthn = 0.7 V, |Vthp| = 0.8 V, VDD = 3 V, γ = 0. Design the PMOS-input folded cascode (Fig. 9.15) for a maximum differential swing of 2.4 V and a total power of 6 mW, all L = 0.5 µm. Find the currents, the overdrives, the gain, and whether the input CM can go down to 0 V.

| Given | Value |
|---|---|
| $\mu_n C_{ox}$ | 0.0001343 A/V² |
| $\mu_p C_{ox}$ | 0.00003836 A/V² |
| $V_{thn}$ | 700 mV |
| $|V_{thp}|$ | 800 mV |
| $V_{DD}$ | 3 V |
| $P$ | 0.006 |
| $V_{pp,diff}$ | 2.4 V |

**Find:** Tail current · Overdrive of each swing-critical device · Gain (Gm = gm1) · Lowest input CM

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Start with power, even if nobody asked: it fixes the currents.
> 2. Swing fixes the overdrives: VDD − swing/2 shared by four devices.
> 3. Gain = gm1·(Rup ‖ Rdown).
> 4. ISS = 1 mA, I = 0.5 mA.

> [!info]- Concept and formulas
> Folded-cascode design: power → total current (half to the pair, half to the cascode branches); swing → four overdrives share VDD − swing; square law → W/L; gain = gm1(Rup ‖ Rdown). The PMOS input lets the CM go below 0 V.
> $$I_{tot} = P/V_{DD}$$
> $$2|V_{ov,p}| + 2V_{ov,n} = V_{DD} - V_{swing,side}$$
> $$V_{in,CM,min} = V_{ov5} - |V_{thp}|$$

> [!success]- Answers
> - Tail current: **1 mA**
> - Overdrive of each swing-critical device: **450 mV**
> - Gain (Gm = gm1): **246.9 V/V**
> - Lowest input CM: **-350 mV**

> [!example]- Full solution
> 1. Power budget: 6 mW / 3 V = 2 mA total; split half to the input pair, half to the two cascode branches
>    $$I_{SS} = 1\,\mathrm{mA},\; I = 0.5\,\mathrm{mA}$$
> 2. Swing budget: each output swings 1.2 V; four overdrives share the rest
>    $$V_{ov} = \frac{3 - 1.2}{4} = 0.45\,\mathrm{V}$$
> 3. Gain: gm1 (Rup ‖ Rdown), Rup = gm7 rO7 rO9, Rdown = gm3 rO3 (rO1 ‖ rO5)
>    $$A_v \approx 247\;(227\text{ with the exact current divider})$$
> 4. Input CM floor: M1’s fence against X = Vov5
>    $$V_{in,CM,min} = V_{ov5} - |V_{thp}| = 0.45 - 0.8 = -0.35\,\mathrm{V} < 0\;\checkmark$$

> [!abstract]- Calculator keys (fx-991CW)
> - **W/L from the square law, in one line:** `2 × I ÷ ( µCox × Vov² )   e.g.  2 × 0.1[m] ÷ ( 400[µ] × 0.15² )`

