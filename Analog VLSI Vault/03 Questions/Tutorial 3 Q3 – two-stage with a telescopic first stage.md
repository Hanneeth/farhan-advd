---
tags: ["question", "source/tutorial", "unit/L5", "unit/L3"]
aliases: ["Tutorial 3 Q3 (Razavi Problem 9.8)"]
---
# Tutorial 3 Q3: two-stage with a telescopic first stage

**Source:** Tutorial 3 Q3 (Razavi Problem 9.8)

**Topics:** [[L5 Two-stage op amp]] · [[L3 Design procedure]] · **Lectures:** [[Lec 04]] · [[Lec 07]]

> [!quote] Tutorial 3, Question 3 (as printed)
> ![[t3q3.webp]]

## Question

Set A (Razavi 0.5 µm): µnCox = 134.28 µA/V², µpCox = 38.36 µA/V², λn = 0.1 V⁻¹, λp = 0.2 V⁻¹ (L = 0.5 µm), Vthn = 0.7 V, |Vthp| = 0.8 V, VDD = 3 V, γ = 0. Fig. 9.24: ISS = 1 mA, ID9–12 = 0.5 mA, (W/L)9–12 = 100/0.5. (a) Required CM level at X, Y. (b) If the tail needs 400 mV, choose the smallest M1–M8 that allow a 200 mV peak-to-peak swing at X and Y. (c) Overall gain.

| Given | Value |
|---|---|
| $\mu_n C_{ox}$ | 0.0001343 A/V² |
| $\mu_p C_{ox}$ | 0.00003836 A/V² |
| $V_{thn}$ | 700 mV |
| $|V_{thp}|$ | 800 mV |
| $V_{DD}$ | 3 V |
| $I_{SS}$ | 1 mA |
| $(W/L)_{9-12}$ | 200 |
| $V_{ISS}$ | 400 mV |

**Find:** (a) CM level at X, Y · (b) NMOS size (equal overdrive split) · (b) PMOS size (equal overdrive split) · (c) Overall gain

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Same trick as Q2: the second-stage gate sets X.
> 2. Headroom stacking around X ± 0.1 V.
> 3. W/L = 2ID/(µCox·Vov²) with the largest allowed Vov.
> 4. VX = 1.839 V.

> [!info]- Concept and formulas
> Telescopic first stage + CS second stage. X is fixed by M9’s VGS; the swing at X sets the overdrives below and above it; gain = (telescopic gain) × gm9(rO9 ‖ rO11).
> $$V_X = V_{DD} - |V_{GS9}|$$
> $$A = g_{m1}\left[g_{m3}r_{O3}r_{O1}\parallel g_{m5}r_{O5}r_{O7}\right]\cdot g_{m9}(r_{O9}\parallel r_{O11})$$

> [!success]- Answers
> - (a) CM level at X, Y: **1.839 V**
> - (b) NMOS size (equal overdrive split): **16.62**
> - (b) PMOS size (equal overdrive split): **92.62**
> - (c) Overall gain: **3952 V/V**

> [!example]- Full solution
> 1. (a) X drives M9: X = VDD − |VGS9| at 0.5 mA
>    $$V_{X,Y} = 1.839\,\mathrm{V}$$
> 2. (b) Below X (−0.1 V) the tail and two NMOS share the room; above X (+0.1 V) two PMOS share the rest. Split equally
>    $$V_{ov,N} = \frac{V_X - 0.1 - 0.4}{2} = 0.669\,\mathrm{V},\; |V_{ov,P}| = \frac{3 - (V_X + 0.1)}{2} = 0.531\,\mathrm{V}$$
> 3. Smallest devices = largest overdrives
>    $$\left(\tfrac{W}{L}\right)_{1-4} = 16.6,\; \left(\tfrac{W}{L}\right)_{5-8} = 92.6$$
> 4. PMOS size
>    $$\left(\tfrac{W}{L}\right)_{5-8} = 92.6$$
> 5. (c) Telescopic first stage × CS second stage
>    $$A_v = 214 \times 18.5 = 3952$$

