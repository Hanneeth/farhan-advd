---
tags: ["topic", "unit/L3", "group/handout"]
aliases: ["Design procedure"]
---
# L3 · Design procedure

*Power → swing → Vov → W/L → gain*

**Reference:** Handout L3 · 1st ed §9.2.2–9.2.3 · 2nd ed §9.2.2–9.2.3 · **Lectures:** [[Lec 04]]

**Needs first:** [[L2 One-stage op amps]]

## Design procedure: power → swing → Vov → W/L → gain

**Why:** Ex 9.7 is the template for every design question, including Problem Set 1 P6 and Tutorial 2 Q3.

> [!question] Predict first: The first number to fix in an op-amp design, even when nobody asks for it, is…
> a) W/L of the input pair
> b) The power budget (it sets the currents)
> c) The gain

> [!success]- Answer
> **The power budget (it sets the currents)**. Power ÷ VDD gives the total current. Every overdrive and every W/L follows from the currents.

A recipe you can run on any spec sheet:

1. **Power → current**: $I_{SS} \approx P/V_{DD}$ (Ex 9.7 keeps a little for bias: 10 mW → 3 mA).
2. **Swing → headroom**: each output swings half the differential swing; the rest of VDD is shared by the stacked overdrives and VISS.
3. **Choose overdrives**: largest for the tail, then PMOS, then NMOS (the input pair gets the smallest for high gm).
4. **Sizes**: every $W/L = 2I_D/(\mu C_{ox}V_{ov}^2)$.
5. **Check the gain**. If short, **lengthen** the devices off the signal path: $g_m r_O \propto \sqrt{WL/I_D}$, so doubling W and L keeps Vov but doubles rO.
6. **Bias voltages** at the saturation edges (Vin,CM, Vb1, Vb2).

**The rule**

$$I_{SS} = \dfrac{P}{V_{DD}}$$

$$\dfrac{W}{L} = \dfrac{2I_D}{\mu C_{ox}V_{ov}^2}$$

$$g_m r_O \propto \sqrt{\dfrac{WL}{I_D}}$$

> [!note]
> Start with power, even if nobody asked. Gain lives in √(WL/ID).

> [!important] Lock it in
> Power → current → swing budget → overdrives → W/L → gain check → lengthen off-path devices → bias at the edges.
> **Hook:** “Start with power, even if nobody asked.”

## Linear scaling and bias tracking

**Why:** Ex 9.8 and Problem Set 1 P9: a bigger load at the same speed means scaling every width and current, and knowing what does not change.

> [!question] Predict first: You multiply every width and every current by 4. The DC gain…
> a) ×4
> b) ×2
> c) does not change

> [!success]- Answer
> **does not change**. Vov is unchanged, gm ×4 and rO ÷4: gm·rO stays the same. What you buy is the ability to drive 4× the capacitance at the same ωu.

**Linear scaling**: multiply every width and every bias current by α. The current density stays the same, so every $V_{ov}$ stays the same, and so do the swing and the bias voltages. $g_m$ grows by α and $r_O$ shrinks by α, so the gain $g_m r_O$ is **unchanged**. Power grows by α.

What you gain: $\omega_u = g_m/C_L$ stays the same with α times the load capacitance.

**Bias tracking (Fig 9.12):** make Vb1 with a device that copies $V_{ov1} + V_{GS3}$, so the cascode bias follows process and temperature instead of being a fixed number.

**The rule**

$$W,\,I \times\alpha \Rightarrow g_m\times\alpha,\; r_O\div\alpha,\; V_{ov},\,A_v\ \text{unchanged}$$

$$\alpha = \dfrac{C_{L,new}}{C_{L,old}}\ (\text{same }\omega_u)$$

$$V_{GS,b1} = V_{ov1,2} + V_{GS3,4}$$

> [!note]
> Linear scaling only buys speed and silence.

> [!important] Lock it in
> Scale W and I by α: Vov, gain, swing unchanged; gm ×α, rO ÷α, power ×α; drives α·CL at the same ωu.
> **Hook:** “Linear scaling only buys speed and silence.”

## Questions you can solve after this topic

- [[Ex 9.7 – design a telescopic op amp from specs]] · Razavi Example 9.7
- [[Ex 9.8 – linear scaling to drive a bigger load]] · Razavi Example 9.8 / Problem Set 1 P9
- [[2023 mid-sem Q3 – design a high-swing PMOS-input telescopic]] · Mid-sem 2023-24 Q3 (14 marks)

## Questions that also use it

- [[Tutorial 3 Q3 – two-stage with a telescopic first stage]]
- [[PS1 P10 – capstone, design for settling and swing]]

## Flashcards

[[Flashcards – L3]]

## Symbols

[[overdrive (Vov)]]
