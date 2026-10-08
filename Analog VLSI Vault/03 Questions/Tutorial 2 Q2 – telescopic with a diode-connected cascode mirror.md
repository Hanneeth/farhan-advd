---
tags: ["question", "source/tutorial", "unit/L2"]
aliases: ["Tutorial 2 Q2 (Razavi Problem 9.2)"]
---
# Tutorial 2 Q2: telescopic with a diode-connected cascode mirror

**Source:** Tutorial 2 Q2 (Razavi Problem 9.2)

**Topics:** [[L2 One-stage op amps]] · **Lectures:** [[Lec 02]]

> [!quote] Tutorial 2, Question 2 (as printed)
> ![[t2q2.webp]]

## Question

Set A (Razavi 0.5 µm): µnCox = 134.28 µA/V², µpCox = 38.36 µA/V², λn = 0.1 V⁻¹, λp = 0.2 V⁻¹ (L = 0.5 µm), Vthn = 0.7 V, |Vthp| = 0.8 V, VDD = 3 V, γ = 0. The single-ended telescopic (Fig. 9.9 style): (W/L)1–4 = 100/0.5, ISS = 1 mA, Vb = 1.4 V; M5–M8 identical, L = 0.5 µm. (a) Minimum PMOS width for M3 to stay saturated. (b) Maximum output swing. (c) Open-loop gain.

| Given | Value |
|---|---|
| $\mu_n C_{ox}$ | 0.0001343 A/V² |
| $\mu_p C_{ox}$ | 0.00003836 A/V² |
| $V_{thn}$ | 700 mV |
| $|V_{thp}|$ | 800 mV |
| $V_{DD}$ | 3 V |
| $(W/L)_{1-4}$ | 200 |
| $I_{SS}$ | 1 mA |
| $V_b$ | 1.4 V |

**Find:** (a) Minimum PMOS width (µm) · (b) Lowest output · (b) Highest output (M2 gate on the output) · (c) Open-loop gain

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Where does M3’s drain sit? Count the diode drops from VDD.
> 2. M3 saturated needs VD3 ≥ Vb − Vthn.
> 3. VD3 = VDD − 2|VGS,p|; then size for |Vov,p|.
> 4. |VGS,p| ≤ 1.15 V.

> [!info]- Concept and formulas
> Telescopic with a diode-stacked cascode mirror. (a) M3 saturated needs the diode stack not to pull its drain too low → minimum PMOS W. (b) As a buffer (M2’s gate on Vout) the window is only Vth − Vov4 wide. (c) Gain gm1(Rup ‖ Rdown).
> $$V_{b} - V_{th4} \le V_{out} \le V_b - V_{GS4} + V_{th2}$$
> $$A_v = g_{m1}\left(g_{m3}r_{O3}r_{O1}\parallel g_{m5}r_{O5}r_{O7}\right)$$

> [!success]- Answers
> - (a) Minimum PMOS width (µm): **106.4**
> - (b) Lowest output: **700 mV**
> - (b) Highest output (M2 gate on the output): **1.207 V**
> - (c) Open-loop gain: **1301 V/V**

> [!example]- Full solution
> 1. Two PMOS diodes stack from VDD: M3’s drain sits at VDD − 2|VGS,p|. Fence: VD3 ≥ Vb − Vthn
>    $$3 - 2|V_{GS,p}| \ge 1.4 - 0.7 \Rightarrow |V_{GS,p}| \le 1.15\,\mathrm{V},\;|V_{ov,p}| \le 0.35\,\mathrm{V}$$
> 2. Smallest W/L that carries 0.5 mA at that overdrive
>    $$\tfrac{W}{L} = \frac{2(0.5\mathrm{m})}{38.36\mu\,(0.35)^2} = 212.8 \Rightarrow W = 106.4\,\mu\mathrm{m}$$
> 3. Floor: M4 fence, Vout ≥ Vb − Vth4
>    $$V_{out,min} = 1.4 - 0.7 = 0.7\,\mathrm{V}$$
> 4. Ceiling from the stacks is VDD − |Vthp| − 2|Vov,p| = 1.50 V, but M2’s gate is on Vout: M2 leaves saturation above Vb − VGS4 + Vth2
>    $$V_{out,max} = 1.21\,\mathrm{V}$$
> 5. Gain: gm1 (Rdown ‖ Rup), both ≈ gm·rO²
>    $$A_v \approx 1301$$

> [!abstract]- Calculator keys (fx-991CW)
> - **Vov from a current:** `√( 2 × I ÷ ( µCox × W/L ) )`
> - **Parallel resistors:** `( a⁻¹ + b⁻¹ )⁻¹   (x⁻¹ is the [x⁻¹] key)`

