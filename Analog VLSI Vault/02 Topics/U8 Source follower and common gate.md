---
tags: ["topic", "unit/U8", "group/foundations"]
aliases: ["Source follower and common gate"]
---
# U8 · Source follower and common gate

*Gain 1, Rout 1/gm; gain gm·RD, Rin 1/gm*

**Reference:** Razavi §3.4–3.5 · **Lectures:** [[Lec 01]] · [[Lec 02]]

**Needs first:** [[U7 CS with every load + degeneration]]

## Source follower: a level shifter with gain ≈ 1

**Why:** Followers are the output buffers and level shifters in op amps; the exam asks where the output sits, which is one VGS below the input.

> [!question] Predict first: Vin rises by 100 mV. By how much does the output of a source follower rise?
> a) About 100 mV
> b) About 1 V (big gain)
> c) It falls by 100 mV

> [!success]- Answer
> **About 100 mV**. The current is fixed by the source below, so VGS is fixed; the source must move with the gate. Gain ≈ 1, not inverting.

Input on the **gate**, output on the **source**, drain at VDD: the **source follower** (common drain). A current source fixes the current, so $V_{GS}$ is fixed too. Then the source must **follow** the gate, one full $V_{GS}$ lower: $V_{out} = V_{in} - V_{GS}$.

Small signal, ratio rule: output resistance at the source over the source path $1/g_m$ plus that same resistance. With an ideal current source only $r_O$ is left: $A_v = r_O/(1/g_m + r_O) \approx 1$.

Looking back into the output you see the **source rule**: $R_{out} \approx 1/g_m$. Small output resistance: a good buffer.

**The rule**

$$V_{out} = V_{in} - V_{GS}$$

$$A_v = \dfrac{R_S\parallel r_O}{1/g_m + R_S\parallel r_O} \approx 1$$

$$R_{out} = \tfrac{1}{g_m}\parallel r_O$$

> [!note]
> With body effect (γ ≠ 0) the gain would drop further; the tutorials take γ = 0.

> [!important] Lock it in
> Follower: Vout = Vin − VGS, gain ≈ 1 (ratio rule), Rout ≈ 1/gm. A buffer and a level shifter.
> **Hook:** “The source follows the gate, one VGS below.”

## Common gate: gain gm·RD, input 1/gm

**Why:** The cascode device and the folded cascode (L4) are common-gate stages; you need its gain and its low input resistance.

> [!question] Predict first: In a common-gate stage the input source moves up by 10 mV. Which way does the output (drain) move?
> a) Up
> b) Down
> c) It does not move

> [!success]- Answer
> **Up**. Source up with the gate fixed means VGS falls, current falls, less drop across RD: the drain rises. Non-inverting.

Gate **fixed** at $V_G$ = Vb, signal into the **source**, output from the **drain**: the **common gate**. Raise the source and $V_{GS}$ shrinks, the current drops, the drop across $R_D$ shrinks, so the drain **rises**: gain is **positive**.

It is the CS stage turned around: same current change $g_m v_{in}$, same load, so $A_v = +g_m R_D$ ($\lambda = 0$).

The catch: the input is the **source**, and by the source rule its resistance is only about $1/g_m$. It takes a current in and passes it up to the drain almost unchanged: that is exactly what a **cascode** device does.

**The rule**

$$A_v = +g_m R_D\quad(\lambda = 0)$$

$$R_{in} = \dfrac{R_D + r_O}{1 + g_m r_O} \approx \dfrac{1}{g_m}$$

> [!note]
> DC: VS = Vb − VGS; fence VD ≥ Vb − Vth.

> [!important] Lock it in
> CG: source in, drain out, gate fixed. Av = +gm·RD, Rin ≈ 1/gm. It passes current through, the heart of the cascode.
> **Hook:** “Source in, drain out, current passes through.”

## Questions you can solve after this topic

- [[Lab 4 – PMOS source follower]] · Lab 4 (hand calculations)

## Flashcards

[[Flashcards – U8]]

## Symbols

[[gate-source voltage (VGS)]] · [[output resistance (rO)]] · [[gate voltage (VG)]] · [[drain resistor (RD)]]
