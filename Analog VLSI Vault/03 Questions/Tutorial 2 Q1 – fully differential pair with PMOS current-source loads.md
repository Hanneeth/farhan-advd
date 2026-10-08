---
tags: ["question", "source/tutorial", "unit/L2"]
aliases: ["Tutorial 2 Q1 (Razavi Problem 9.1)"]
---
# Tutorial 2 Q1: fully differential pair with PMOS current-source loads

**Source:** Tutorial 2 Q1 (Razavi Problem 9.1)

**Topics:** [[L2 One-stage op amps]] · **Lectures:** [[Lec 02]]

> [!quote] Tutorial 2, Question 1 (as printed)
> ![[t2q1.webp]]

## Question

Set A (Razavi 0.5 µm): µnCox = 134.28 µA/V², µpCox = 38.36 µA/V², λn = 0.1 V⁻¹, λp = 0.2 V⁻¹ (L = 0.5 µm), Vthn = 0.7 V, |Vthp| = 0.8 V, VDD = 3 V, γ = 0. An NMOS pair (M1, M2) with PMOS current-source loads (M3, M4), (W/L)1–4 = 50/0.5, ISS = 1 mA, input CM = 1.3 V. (a) gm and rO in triode (derivation, see the lesson). (b) Small-signal gain and maximum output swing with every device saturated. (c) If each PMOS may enter triode by 50 mV, what is the gain at the peaks of the swing?

| Given | Value |
|---|---|
| $\mu_n C_{ox}$ | 0.0001343 A/V² |
| $\mu_p C_{ox}$ | 0.00003836 A/V² |
| $V_{thn}$ | 700 mV |
| $|V_{thp}|$ | 800 mV |
| $V_{DD}$ | 3 V |
| $(W/L)_{1-4}$ | 100 |
| $I_{SS}$ | 1 mA |
| $V_{in,CM}$ | 1.3 V |

**Find:** (b) Differential gain · (b) Lowest output (each side) · (b) Highest output (each side) · (c) Gain at the swing peaks

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Use the half circuit: one input device, one PMOS load.
> 2. Gain = gm1(rO1 ‖ rO3); the swing comes from the two fences.
> 3. Vout ∈ [Vin,CM − Vthn, VDD − |Vov3|].
> 4. gm1 = 3.66 mA/V.

> [!info]- Concept and formulas
> Fully differential pair with PMOS current-source loads: gain gm1(rO1 ‖ rO3); each output swings between M1’s fence (Vin,CM − Vth) and VDD − |Vov3|. In triode a device’s rO becomes its (small) triode resistance.
> $$A_v = g_{m1}(r_{O1}\parallel r_{O3})$$
> $$V_{out} \in [V_{in,CM} - V_{thn},\; V_{DD} - |V_{ov3}|]$$

> [!success]- Answers
> - (b) Differential gain: **24.43 V/V**
> - (b) Lowest output (each side): **600 mV**
> - (b) Highest output (each side): **2.489 V**
> - (c) Gain at the swing peaks: **19.79 V/V**

> [!example]- Full solution
> 1. Each side carries 0.5 mA
>    $$V_{ov,n} = 0.273\,\mathrm{V},\;|V_{ov,p}| = 0.511\,\mathrm{V}$$
> 2. gm1 and the output node rO1 ‖ rO3
>    $$g_{m1} = 3.66\,\mathrm{mS},\; r_{O1} = 20\,\mathrm{k\Omega},\; r_{O3} = 10\,\mathrm{k\Omega}$$
> 3. Half circuit: Av = gm1 (rO1 ‖ rO3)
>    $$A_v = 24.4$$
> 4. Floor: M1 fence, VD ≥ Vin,CM − Vth
>    $$V_{out,min} = 1.3 - 0.7 = 0.6\,\mathrm{V}$$
> 5. Ceiling: M3 needs |Vov3|
>    $$V_{out,max} = 3 - 0.511 = 2.49\,\mathrm{V}$$
> 6. (c) At the peak one PMOS is 50 mV into triode: its rO becomes the triode resistance; average the two halves
>    $$A_{v,peak} \approx 19.8$$

> [!abstract]- Calculator keys (fx-991CW)
> - **Vov from a current:** `√( 2 × I ÷ ( µCox × W/L ) )`
> - **Parallel resistors:** `( a⁻¹ + b⁻¹ )⁻¹   (x⁻¹ is the [x⁻¹] key)`

