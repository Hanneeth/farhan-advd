---
tags: ["question", "source/problem-set", "unit/L2"]
aliases: ["Problem Set 1 P5 (tutoring chat)"]
---
# PS1 P5: mirror-loaded telescopic and its buffer window

**Source:** Problem Set 1 P5 (tutoring chat)

**Topics:** [[L2 One-stage op amps]] · **Lectures:** [[Lec 02]]

## Question

Set A (Razavi 0.5 µm): µnCox = 134.28 µA/V², µpCox = 38.36 µA/V², λn = 0.1 V⁻¹, λp = 0.2 V⁻¹ (L = 0.5 µm), Vthn = 0.7 V, |Vthp| = 0.8 V, VDD = 3 V, γ = 0. Single-ended telescopic with a diode cascode mirror: (W/L)1–8 = 100/0.5, ISS = 1 mA, Vb1 = 1.6 V. (a) VX. (b) Output range and swing. (c) Why is Vout,max not VDD − |Vov8| − |Vov6|? (d) With M2’s gate on Vout (buffer), the allowed output range.

| Given | Value |
|---|---|
| $\mu_n C_{ox}$ | 0.0001343 A/V² |
| $\mu_p C_{ox}$ | 0.00003836 A/V² |
| $V_{thn}$ | 700 mV |
| $|V_{thp}|$ | 800 mV |
| $V_{DD}$ | 3 V |
| $(W/L)_{1-8}$ | 200 |
| $V_{b1}$ | 1.6 V |

**Find:** (a) VX · (b) Lowest output · (b) Highest output · (d) Highest output as a buffer

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Walk the NMOS side from Vb1, the PMOS side from VDD through the diodes.
> 2. The diode connection costs a threshold.
> 3. Buffer window: [Vb1 − Vth4, Vb1 − VGS4 + Vth2].
> 4. VX = 0.707 V.

> [!success]- Answers
> - (a) VX: **707 mV**
> - (b) Lowest output: **900 mV**
> - (b) Highest output: **1.478 V**
> - (d) Highest output as a buffer: **1.407 V**

> [!example]- Full solution
> 1. (a) X = Vb1 − VGS3
>    $$V_X = 0.707\,\mathrm{V}$$
> 2. (b) Floor: M4 fence, Vout ≥ Vb1 − Vth
>    $$0.9\,\mathrm{V}$$
> 3. Ceiling: the diode stack pins M6’s gate a full |Vthp| lower (c)
>    $$V_{out,max} = V_{DD} - |V_{thp}| - |V_{ov8}| - |V_{ov6}| = 1.478\,\mathrm{V}$$
> 4. (d) Buffer: M2’s fence caps it at Vb1 − VGS4 + Vth (window Vth − Vov4)
>    $$1.407\,\mathrm{V}$$

