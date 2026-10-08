---
tags: ["lecture", "lec/04"]
aliases: ["Buffer window (shaded); designing a telescopic op amp (Razavi Ex 9.7)"]
date: "10 Aug"
---
# Lec 04 · Buffer window (shaded); designing a telescopic op amp (Razavi Ex 9.7)

**Date:** 10 Aug · **Handout:** L2–L3 · **Topics:** [[L3 Design procedure]]

> [!abstract] In one paragraph
> The window drawn as a shaded band, then the full design recipe for a telescopic op amp: power → currents → swing budget → overdrives → W/L → gain → lengthen M5–M8.

**Before:** [[Lec 03]] · **Next:** [[Lec 05]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec04.webp]]

Original PDF: [[Notes – lecture-04-10082026.pdf]]

## The page, item by item

### The buffer window as a picture

Draw $V_{b1}$ at the top. The output must stay below $V_{b1} - (V_{GS4} - V_{th2})$ and above $V_{b1} - V_{th4}$. The shaded band between them is all the output gets: about $V_{th} - V_{ov}$ wide.

$$V_{b1} - V_{th4} \le V_{out} \le V_{b1} - (V_{GS4} - V_{th2})$$

### Design spec (Ex 9.7)

VDD = 3 V, power 10 mW, open-loop gain 2000, differential swing 3 V peak-to-peak, µnCox = 60 µA/V², µpCox = 30 µA/V², λn = 0.1, λp = 0.2 V⁻¹ at L = 0.5 µm, γ = 0, |Vth| = 0.7 V. Design order on your page: **① ID ② Vov ③ W/L ④ gm ⑤ rO**.

### ① Currents from the power budget

Total current = power ÷ supply. A little goes to the bias branch (Mb1–Mb3, about 0.33 mA); the rest is the tail: 1.5 mA per side.

- $P_D = V_{DD}\,I_{total} \Rightarrow I_{total} = \dfrac{10\,\text{mW}}{3\,\text{V}} = 3.33\,\text{mA}$
- $I_{total} = I_{b1} + I_{b3} + I_{D7} + I_{D8} = 0.33\,\text{mA} + 3\,\text{mA}$
- $I_{D7} = I_{D8} = 1.5\,\text{mA}$

### ② Overdrives from the swing budget

Each side must swing 1.5 V. What is left of VDD is shared among the five stacked overdrives. Give the tail the most (0.5 V), the PMOS 0.3 V each, the NMOS 0.2 V each.

- $3 = 2\left[3 - \{|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ov9}\}\right]$
- $|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ov9} = 1.5\,\text{V}$
- $V_{ov9} = 0.5,\; |V_{ov8}| = |V_{ov6}| = 0.3,\; V_{ov4} = V_{ov2} = 0.2\,\text{V}$

### ③ W/L from the square law

Rearrange $I_D = \frac12 \mu C_{ox}\frac{W}{L}V_{ov}^2$ for W/L, device by device.

- $1.5\,\text{mA} = \tfrac12 (60\,\mu)\tfrac{W}{L}(0.2)^2 \Rightarrow \left(\tfrac{W}{L}\right)_{1-4} = 1250$
- ≈ 555/0.5 (µm/µm): $1.5\,\text{mA} = \tfrac12 (30\,\mu)\tfrac{W}{L}(0.3)^2 \Rightarrow \left(\tfrac{W}{L}\right)_{5-8} = 1111$
- 3 mA at 0.5 V: $\left(\tfrac{W}{L}\right)_{9} = 400$

$$\dfrac{W}{L} = \dfrac{2I_D}{\mu C_{ox}V_{ov}^2}$$

### ④⑤ Gain check: gm, rO, Rup, Rdown

$g_m = 2I_D/V_{ov}$ and $r_O = 1/(\lambda I_D)$. Rup is the PMOS cascode, Rdown the NMOS cascode. The gain comes out near 1429 (your page: 1428; Razavi prints 1416) — short of 2000, so it **needs to be improved**.

- $g_{m6} = \dfrac{2(1.5\,\text{m})}{0.3} = 10\,\text{mS},\quad r_{O6} = r_{O8} = \dfrac{1}{0.2 \times 1.5\,\text{m}} = 3.33\,\text{k}\Omega$
- $g_{m4} = \dfrac{2(1.5\,\text{m})}{0.2} = 15\,\text{mS},\quad r_{O4} = r_{O2} = \dfrac{1}{0.1 \times 1.5\,\text{m}} = 6.67\,\text{k}\Omega$
- $R_{up} = g_{m6}r_{O6}r_{O8} \approx 111\,\text{k}\Omega,\quad R_{down} = g_{m4}r_{O4}r_{O2} \approx 666\,\text{k}\Omega$
- $A_v = g_{m1,2}(R_{up}\parallel R_{down}) = 15\,\text{mS}\,(111\,\text{k}\parallel 666\,\text{k}) \approx 1429$

$$A_v = g_{m1,2}\,(R_{up}\parallel R_{down})$$

### Fix the gain without changing the overdrives: lengthen M5–M8

Intrinsic gain grows with the device area per unit current. Doubling **both** W and L keeps W/L (so Vov, gm and the swing stay put) but halves λ, doubling rO. Only the weak side (Rup, the PMOS) needs it.

- λ ∝ 1/L: $g_m r_O = \sqrt{2\mu C_{ox}\tfrac{W}{L}I_D}\times\dfrac{1}{\lambda I_D} \propto \sqrt{\dfrac{WL}{I_D}}$
- $L = 1\,\mu\text{m for M5–M8} \Rightarrow \lambda_p = 0.1\,\text{V}^{-1},\; r_{O6} = r_{O8} = 6.67\,\text{k}\Omega$
- $R_{up} = 10\,\text{mS}\times 6.67\,\text{k}\times 6.67\,\text{k} = 444.9\,\text{k}\Omega$
- meets the 2000 spec: $A_v = 15\,\text{mS}\,(444.9\,\text{k}\parallel 666\,\text{k}) \approx 4000$

$$g_m r_O \propto \sqrt{\dfrac{WL}{I_D}},\quad \lambda \propto \dfrac{1}{L}$$

> [!question] Asked in exams
> Problem Set 1 P3, P6 and Tutorial 2 Q3 are this exact recipe with new numbers.

## Explained step by step

The same two fences as Lec 3, now drawn as a shaded band. In the buffer, $V_{out}$ is also M2’s gate. **Floor** — M4’s fence: $V_{out} \ge V_{b1} - V_{th4}$. **Ceiling** — M2’s fence against its pinned drain $X = V_{b1} - V_{GS4}$: $V_{out} \le V_{b1} - (V_{GS4} - V_{th2})$. The output may only live in the band between them, $V_{th} - V_{ov4}$ wide.

![[s-lec03-window.svg]]

Ex 9.7’s spec: VDD 3 V, 10 mW, gain 2000, 3 V p-p differential swing, $\mu_nC_{ox}$ = 60 µ, $\mu_pC_{ox}$ = 30 µ, $\lambda_n$ = 0.1, $\lambda_p$ = 0.2.

Razavi always works in the same order, because each spec fixes one quantity: **power** fixes the currents; **swing** fixes the overdrives; then the square law has only one unknown left, **W/L**; $g_m$ and $r_O$ follow, and only then do you **check the gain**. Picking W/L first leaves you guessing.

![[s-lec04-design.svg]]

Note $\lambda_p$ is twice $\lambda_n$: the PMOS will have the smaller $r_O$ and will limit the gain — watch for it in step ④.

Power is the first budget. 10 mW from a 3 V supply allows $P/V_{DD} = 3.33$ mA **in total**. Razavi keeps a little (≈ 0.33 mA) for the bias branch $M_{b1}$–$M_{b3}$ that generates $V_{b1..3}$, and gives the rest, 3 mA, to the tail: **1.5 mA in each half**.

Swing is the second budget. 3 V p-p differential means 1.5 V p-p on each output. So in each column, $V_{DD} - 1.5 = 1.5$ V is all that the five overdrives may use together:

$|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ov9} = 1.5$ V.

How to split it: the **tail** carries the most current (3 mA), so give it the biggest overdrive (0.5 V) to keep its W/L sensible. The **NMOS** have the higher mobility, so a small 0.2 V is affordable — and a small $V_{ov}$ raises $g_m = 2I_D/V_{ov}$. The **PMOS** get 0.3 V each.

With $I_D$ and $V_{ov}$ fixed, W/L is no longer a choice — the square law forces it: $\dfrac WL = \dfrac{2I_D}{\mu C_{ox}V_{ov}^2}$.

NMOS M1–M4: $\dfrac{2(1.5\,\text{mA})}{60\,\mu\cdot0.2^2} = 1250$. PMOS M5–M8: $\dfrac{2(1.5\,\text{mA})}{30\,\mu\cdot0.3^2} = 1111$. Tail M9 (3 mA): $\dfrac{2(3\,\text{mA})}{60\,\mu\cdot0.5^2} = 400$.

Now check. $g_m = 2I_D/V_{ov}$ and $r_O = 1/(\lambda I_D)$.

NMOS: $g_m = 3\,\text{mA}/0.2 = 15$ mS, $r_O = 1/(0.1\cdot1.5\,\text{mA}) = 6.67$ k, so $R_{down} = g_mr_O^2 = 666$ k. PMOS: $g_m = 3\,\text{mA}/0.3 = 10$ mS, $r_O = 1/(0.2\cdot1.5\,\text{mA}) = 3.33$ k, so $R_{up} = 111$ k.

In parallel **the smaller resistance wins**: $111\,k\parallel666\,k = 95$ k, so the gain is $15\,\text{mS}\times95\,\text{k} \approx 1428$ — short of 2000, and entirely because of the PMOS side.

Razavi’s fix: **make the weak devices longer**. Double both W and L of M5–M8. W/L stays 1111, so the overdrive — and the whole swing budget — is untouched. But $\lambda \propto 1/L$ halves, so $r_{OP}$ doubles to 6.67 k and $R_{up} = 10\,\text{m}\cdot(6.67\,\text{k})^2 = 444$ k.

New gain: $15\,\text{m}\times(444\,k\parallel666\,k) \approx 4000$. Only the side that limits the gain needs it; lengthening the NMOS too would only add area and capacitance.

## Questions that use this lecture

- [[Tutorial 3 Q3 – two-stage with a telescopic first stage]] · Tutorial 3 Q3 (Razavi Problem 9.8)
- [[Ex 9.7 – design a telescopic op amp from specs]] · Razavi Example 9.7
- [[Ex 9.8 – linear scaling to drive a bigger load]] · Razavi Example 9.8 / Problem Set 1 P9
- [[PS1 P10 – capstone, design for settling and swing]] · Problem Set 1 P10 (tutoring chat)
- [[2023 mid-sem Q3 – design a high-swing PMOS-input telescopic]] · Mid-sem 2023-24 Q3 (14 marks)

## Animated lessons

- [[Analog Lab Revision Lec 1-10 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – L3]]

