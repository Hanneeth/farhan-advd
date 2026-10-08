---
tags: ["question", "source/tutorial", "unit/L8", "unit/L7"]
aliases: ["Tutorial 5 Q2 (Razavi Problem 9.12)"]
---
# Tutorial 5 Q2: which pair for the CMFB amplifier, and the loop gain

**Source:** Tutorial 5 Q2 (Razavi Problem 9.12)

**Topics:** [[L8 CMFB techniques]] · [[L7 CMFB concept and sensing]] · **Lectures:** [[Lec 09]] · [[Lec 10]] · [[Lec 11]] · [[Lec 12]]

> [!quote] Tutorial 5, Question 2 (as printed)
> ![[t5q2.webp]]

## Question

In the folded cascode with resistive sensing (R1, R2), an error amplifier compares Vout,CM with VREF and drives M3, M4 through VE. The error amplifier is a differential pair with an active current-mirror load. (a) NMOS or PMOS input pair? (b) Which expression is the CMFB loop gain?

**Find:** (a) Input pair of the error amplifier · (b) Loop gain

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. What DC level must VE have to bias M3, M4?
> 2. Where does the output of a 5-T OTA sit, for each pair type?
> 3. Break the loop at VE and go round: sense, amplify, convert to current, back to voltage.
> 4. In common mode, R1 and R2 carry no current.

> [!info]- Concept and formulas
> The CMFB error amplifier’s input CM must be near its output’s needed level: choose the pair type that fits. Loop gain = sense gain × error-amp gain × how hard the controlled source moves Vout,CM.
> $$T = A_{EA}\cdot g_{m,ctrl}(R_{up}\parallel R_{down})$$

> [!success]- Answers
> - (a) Input pair of the error amplifier: **0**
> - (b) Loop gain: **0**

> [!example]- Full solution
> 1. (a) VE must sit at about VGS3 (≈ Vthn + Vov), low. A PMOS pair with an NMOS mirror puts its output one VGS,n above ground: the right level. An NMOS pair’s output sits near VDD − |VGS,p|, far too high
>    $$\text{PMOS input pair}$$
> 2. (b) Go round the loop: Vout,CM → (sense: gain 1) → error amp A_EA = gm,EA(rO,N ‖ rO,P) → VE → M3, M4 (gm3 each) → a CM current into each output
>    $$\Delta I = g_{m3}\,A_{EA}\,\Delta V_{out,CM}$$
> 3. In CM no current flows through R1, R2 (both ends move together), so each output sees Rup ‖ Rdown
>    $$T_{CM} = A_{EA}\,g_{m3}\,(R_{up}\parallel R_{down})$$

