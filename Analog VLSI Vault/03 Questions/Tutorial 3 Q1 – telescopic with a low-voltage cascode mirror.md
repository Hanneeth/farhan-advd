---
tags: ["question", "source/tutorial", "unit/L2"]
aliases: ["Tutorial 3 Q1 (Razavi Problem 9.4)"]
---
# Tutorial 3 Q1: telescopic with a low-voltage cascode mirror

**Source:** Tutorial 3 Q1 (Razavi Problem 9.4)

**Topics:** [[L2 One-stage op amps]] · **Lectures:** [[Lec 02]]

> [!quote] Tutorial 3, Question 1 (as printed)
> ![[t3q1.webp]]

## Question

Set A (Razavi 0.5 µm): µnCox = 134.28 µA/V², µpCox = 38.36 µA/V², λn = 0.1 V⁻¹, λp = 0.2 V⁻¹ (L = 0.5 µm), Vthn = 0.7 V, |Vthp| = 0.8 V, VDD = 3 V, γ = 0. In Fig. 9.21(b): (W/L)1–8 = 100/0.5, ISS = 1 mA, Vb1 = 1.7 V, γ = 0. (a) Maximum input CM. (b) VX. (c) Output range if M2’s gate is tied to the output. (d) Allowed range of Vb2.

| Given | Value |
|---|---|
| $\mu_n C_{ox}$ | 0.0001343 A/V² |
| $\mu_p C_{ox}$ | 0.00003836 A/V² |
| $V_{thn}$ | 700 mV |
| $|V_{thp}|$ | 800 mV |
| $V_{DD}$ | 3 V |
| $(W/L)_{1-8}$ | 200 |
| $I_{SS}$ | 1 mA |
| $V_{b1}$ | 1.7 V |

**Find:** (a) Maximum input CM · (b) VX · (c) Lowest output (buffer) · (c) Highest output (buffer) · (d) Lowest Vb2 · (d) Highest Vb2

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Walk the node voltages first: X, the NMOS cascode source, the tail.
> 2. Every limit is a fence: NMOS VD ≥ VG − Vth, PMOS VD ≤ VG + |Vth|.
> 3. Window = [Vb1 − Vth, Vb1 − VGS4 + Vth].
> 4. VGS,n = 0.893 V, |VGS,p| = 1.161 V.

> [!info]- Concept and formulas
> Telescopic with a low-voltage cascode mirror: X sits one |VGS7| below VDD; the buffer window is set by M4 and M2’s fences; Vb2 is bounded by M5 and M7 both staying saturated.
> $$V_{in,CM,max} = V_{b1} - V_{GS3} + V_{th}$$
> $$V_X = V_{DD} - |V_{GS7}|$$
> $$V_{b1} - V_{th4} \le V_{out} \le V_{b1} - V_{GS4} + V_{th2}$$

> [!success]- Answers
> - (a) Maximum input CM: **1.507 V**
> - (b) VX: **1.839 V**
> - (c) Lowest output (buffer): **1 V**
> - (c) Highest output (buffer): **1.507 V**
> - (d) Lowest Vb2: **1.039 V**
> - (d) Highest Vb2: **1.478 V**

> [!example]- Full solution
> 1. (a) M1’s drain sits at Vb1 − VGS3; its gate may rise to that plus Vth
>    $$V_{in,CM,max} = V_{b1} - V_{GS3} + V_{th} = 1.7 - 0.893 + 0.7 = 1.507\,\mathrm{V}$$
> 2. (b) M7’s gate is on X and its source on VDD: X sits one |VGS7| below VDD
>    $$V_X = 3 - 1.161 = 1.839\,\mathrm{V}$$
> 3. (c) Buffer window: M4 fence below, M2 fence above
>    $$V_{b1} - V_{th} = 1\,\mathrm{V} \le V_{out} \le V_{b1} - V_{GS4} + V_{th} = 1.507\,\mathrm{V}$$
> 4. Top of the window (width Vth − Vov4)
>    $$V_{out,max} = 1.507\,\mathrm{V}$$
> 5. (d) M5 saturated: VX ≤ Vb2 + |Vthp|
>    $$V_{b2} \ge V_X - 0.8 = 1.039\,\mathrm{V}$$
> 6. M7 saturated: its drain (M5’s source, Vb2 + |VGS5|) ≤ VX + |Vthp|
>    $$V_{b2} \le V_X + 0.8 - |V_{GS5}| = 1.478\,\mathrm{V}$$

