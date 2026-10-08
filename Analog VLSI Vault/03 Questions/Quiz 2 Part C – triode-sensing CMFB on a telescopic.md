---
tags: ["question", "source/quiz", "unit/L8", "unit/L7"]
aliases: ["Quiz 2 Part C"]
---
# Quiz 2 Part C: triode-sensing CMFB on a telescopic

**Source:** Quiz 2 Part C

**Topics:** [[L8 CMFB techniques]] · [[L7 CMFB concept and sensing]] · **Lectures:** [[Lec 09]] · [[Lec 10]] · [[Lec 11]] · [[Lec 12]]

## Question

Reconstructed from your Quiz 2 key (the question sheet was not uploaded). VDD = 1.8 V, µnCox = 120 µA/V², µpCox = 60 µA/V², Vthn = 0.3 V, |Vthp| = 0.45 V, λn = 0.1 V⁻¹. PMOS M3,4: W/L = 60 at 120 µA. NMOS devices: W/L = 60 at 60 µA, Vb1 = 0.55 V; output CM = 0.4·VDD. Find VD4, VP, (W/L)11,12 of the triode sensing pair, Vout,min and Rout looking down.

| Given | Value |
|---|---|
| $V_{b1}$ | 550 mV |

**Find:** VD4 · VP · Sensing devices · Lowest output · Rout looking down

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Walk the nodes: PMOS diode from VDD, NMOS from Vb1.
> 2. Triode devices act as a resistor set by the output CM.
> 3. VP = 2ID·Rtot with Rtot = 1/(µnCox(W/L)(Vout1 + Vout2 − 2Vth)).
> 4. VP = 0.121 V.

> [!info]- Concept and formulas
> Two triode devices whose gates are the outputs act as one resistor set by Vout1 + Vout2. The tail current through that resistor fixes VP, so fixing VP (by the cascode bias) pins the output CM.
> $$R_{tot} = \dfrac{1}{\mu_nC_{ox}(W/L)(V_{out1}+V_{out2}-2V_{th})}$$
> $$V_P = 2I_D R_{tot},\quad V_P = V_{b1} - V_{GS}$$
> $$V_{out,min} = V_P + V_{ov} + V_{ov}$$

> [!success]- Answers
> - VD4: **1.092 V**
> - VP: **120.9 mV**
> - Sensing devices: **9.847**
> - Lowest output: **379.1 mV**
> - Rout looking down: **25.82 MΩ**

> [!example]- Full solution
> 1. PMOS diode node: VDD − |VGS3,4|
>    $$V_{D4} = 1.8 - (0.45 + 0.258) = 1.092\,\mathrm{V}$$
> 2. P sits one VGS10 below Vb1
>    $$V_P = 0.55 - (0.3 + 0.129) = 0.1209\,\mathrm{V}$$
> 3. Triode sensing pair: VP = 2ID/(µnCox(W/L)(Vout1 + Vout2 − 2Vth))
>    $$\left(\tfrac{W}{L}\right)_{11,12} = \frac{2I_D}{\mu_n C_{ox} V_P (1.44 - 2V_{th})} = 9.847$$
> 4. Lowest output: VP + two NMOS overdrives
>    $$0.3791\,\mathrm{V}$$
> 5. Looking down: gm·rO·rO
>    $$R_{out,down} = 25.8\,\mathrm{M\Omega}$$

> [!note]- Official Quiz 2 key (all parts)
> ![[k-quiz2.webp]]

> [!abstract]- Calculator keys (fx-991CW)
> - **W/L from the square law, in one line:** `2 × I ÷ ( µCox × Vov² )   e.g.  2 × 0.1[m] ÷ ( 400[µ] × 0.15² )`

