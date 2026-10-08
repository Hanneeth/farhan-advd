---
tags: ["question", "source/tutorial", "unit/L6"]
aliases: ["Tutorial 4 Q2"]
---
# Tutorial 4 Q2: gain boosting with a PMOS auxiliary

**Source:** Tutorial 4 Q2

**Topics:** [[L6 Gain boosting]] · **Lectures:** [[Lec 06]] · [[Lec 07]] · [[Lec 08]] · [[Lec 09]]

> [!quote] Tutorial 4, Question 2 (as printed)
> ![[t4q2.webp]]

## Question

VDD = 1.8 V, µnCox = 150 µA/V², µpCox = 100 µA/V², (W/L)n = 150, (W/L)p = 100, Vthn = 0.7 V, |Vthp| = 0.85 V, ID1 = 0.1 mA. (a) Vbp. (b) With VP = Vov1 and Vout,min = 2Vov1, is M3 saturated? (c) With Vov4 = 0.1 V, the required VS. (d) With the auxiliary removed and M5 ideal (0.1 mA), λn for a gain of about 2550. (e) With λp = 1.3λn, the gain of the full circuit.

| Given | Value |
|---|---|
| $V_{DD}$ | 1.8 V |
| $I_{D1}$ | 100 µA |
| $(W/L)_n$ | 150 |
| $(W/L)_p$ | 100 |

**Find:** (a) Vbp · (b) M3 region · (c) VS · (d) λn (gain ≈ (gm·rO)²)

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Walk the node voltages first, then the fences.
> 2. M3 is a PMOS: saturated while VD ≤ VG + |Vth|.
> 3. Plain cascode gain ≈ (gm·rO)².
> 4. gm = 2.12 mA/V.

> [!info]- Concept and formulas
> PMOS auxiliary amplifier (Lec 8 implementation 2): its saturation needs VGS2 ≤ |Vth3|. A plain cascode with an ideal load gives ≈ (gm·rO)²; boosted, the load rO decides.
> $$V_{D3} \le V_P + |V_{thp}|$$
> $$|A_v| \approx (g_mr_O)^2 \;(\text{plain cascode})$$

> [!success]- Answers
> - (a) Vbp: **808.6 mV**
> - (b) M3 region: **0**
> - (c) VS: **1.094 V**
> - (d) λn (gain ≈ (gm·rO)²): **0.4201**

> [!example]- Full solution
> 1. (a) M5 carries 0.1 mA: Vbp = VDD − |VGS5|
>    $$V_{bp} = 1.8 - \left(0.85 + \sqrt{\tfrac{2(0.1\mathrm{m})}{100\mu\times 100}}\right) = 0.8086\,\mathrm{V}$$
> 2. (b) M3’s drain is M2’s gate: VP + VGS2. PMOS fence: VD3 ≤ VG3 + |Vthp| = VP + 0.85
>    $$V_{D3} = 0.8886\,\mathrm{V} \le 0.9443\,\mathrm{V}\;\checkmark\;(\text{i.e. } V_{GS2} \le |V_{th3}|)$$
> 3. (c) M4 at Vov = 0.1 V sets the current; M3 carries it
>    $$I = \tfrac12(150\mu)(150)(0.1)^2 = 113\,\mathrm{\mu A},\; V_S = V_P + |V_{GS3}| = 1.094\,\mathrm{V}$$
> 4. (d) Plain cascode, ideal load: |Av| ≈ (gm·rO)² = 2550
>    $$g_m r_O = \sqrt{2550} = 50.5,\; \lambda_n = \frac{g_m}{50.5\,I_D} = 0.42\,\mathrm{V^{-1}}\;(\text{exact form: } 0.428)$$
> 5. (e) Boosted Rout is huge, but M5’s rO (λp = 1.3λn) loads the output: the load trap
>    $$|A_v| = g_m(R_{boost}\parallel r_{O5}) \approx 38.8\;(37841\text{ with an ideal load})$$

