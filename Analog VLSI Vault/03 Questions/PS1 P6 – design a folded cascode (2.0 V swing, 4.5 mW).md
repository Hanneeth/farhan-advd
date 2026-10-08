---
tags: ["question", "source/problem-set", "unit/L4"]
aliases: ["Problem Set 1 P6 (tutoring chat)"]
---
# PS1 P6: design a folded cascode (2.0 V swing, 4.5 mW)

**Source:** Problem Set 1 P6 (tutoring chat)

**Topics:** [[L4 Folded cascode]] · **Lectures:** [[Lec 05]]

## Question

Set A (Razavi 0.5 µm): µnCox = 134.28 µA/V², µpCox = 38.36 µA/V², λn = 0.1 V⁻¹, λp = 0.2 V⁻¹ (L = 0.5 µm), Vthn = 0.7 V, |Vthp| = 0.8 V, VDD = 3 V, γ = 0. Design the PMOS-input folded cascode for a maximum differential swing of 2.0 V and 4.5 mW total, all L = 0.5 µm, CL = 2 pF. (a) ISS and I. (b) The four swing-critical overdrives and W/L of M3–M10. (c) With |Vov1,2| = 0.3 V, (W/L)1,2. (d) Gain. (e) ωu.

| Given | Value |
|---|---|
| $\mu_n C_{ox}$ | 0.0001343 A/V² |
| $\mu_p C_{ox}$ | 0.00003836 A/V² |
| $V_{thn}$ | 700 mV |
| $|V_{thp}|$ | 800 mV |
| $V_{DD}$ | 3 V |
| $P$ | 0.0045 |
| $V_{pp,diff}$ | 2 V |
| $C_L$ | 2 pF |

**Find:** (a) Tail current · (b) Swing-critical overdrive · (b) NMOS cascodes · (b) NMOS sources · (b) PMOS cascodes and sources · (c) Input pair · (d) Gain · (e) Unity-gain bandwidth

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Power → currents; swing → overdrives; then sizes.
> 2. Folded: the input pair is not in the output stack, so only four overdrives.
> 3. ID5,6 = ISS/2 + I.
> 4. ISS = 0.75 mA.

> [!info]- Concept and formulas
> Folded-cascode design from power and swing (same recipe as Tutorial 2 Q3).
> $$I_{SS} = P/V_{DD}\ (\text{split})$$
> $$\dfrac{W}{L} = \dfrac{2I_D}{\mu C_{ox}V_{ov}^2}$$
> $$\omega_u = g_{m1}/C_L$$

> [!success]- Answers
> - (a) Tail current: **750 µA**
> - (b) Swing-critical overdrive: **500 mV**
> - (b) NMOS cascodes: **22.34**
> - (b) NMOS sources: **44.68**
> - (b) PMOS cascodes and sources: **78.21**
> - (c) Input pair: **217.2**
> - (d) Gain: **333.3 V/V**
> - (e) Unity-gain bandwidth: **1250000000 rad/s**

> [!example]- Full solution
> 1. (a) 4.5 mW / 3 V = 1.5 mA: half to the pair, half to the two cascode branches
>    $$I_{SS} = 0.75\,\mathrm{mA},\; I = 0.375\,\mathrm{mA},\; I_{D5,6} = I_{SS}/2 + I = 0.75\,\mathrm{mA}$$
> 2. (b) Each output swings 1 V; four overdrives share 3 − 1 = 2 V
>    $$V_{ov} = 0.5\,\mathrm{V}$$
> 3. NMOS cascodes carry I
>    $$\left(\tfrac{W}{L}\right)_{3,4} = \frac{2(0.375\mathrm{m})}{134.28\mu(0.5)^2} = 22.3$$
> 4. NMOS sources carry ISS/2 + I = 0.75 mA
>    $$\left(\tfrac{W}{L}\right)_{5,6} = 44.7$$
> 5. PMOS carry I
>    $$\left(\tfrac{W}{L}\right)_{7-10} = 78.2$$
> 6. (c) Input pair at 0.375 mA, |Vov| = 0.3 V
>    $$\left(\tfrac{W}{L}\right)_{1,2} = 217$$
> 7. (d) gm1 (Rup ‖ Rdown)
>    $$A_v \approx 333$$
> 8. (e) ωu = gm1/CL
>    $$\omega_u = \frac{2(0.375\mathrm{m})/0.3}{2\,\mathrm{pF}} = 1.25\,\mathrm{Grad/s}$$

> [!abstract]- Calculator keys (fx-991CW)
> - **W/L from the square law, in one line:** `2 × I ÷ ( µCox × Vov² )   e.g.  2 × 0.1[m] ÷ ( 400[µ] × 0.15² )`

