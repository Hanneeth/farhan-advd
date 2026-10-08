---
tags: ["question", "source/worked-example", "unit/L10"]
aliases: ["Worked example: your exam OTA (L10)"]
---
# Your exam OTA: PSRR and input noise

**Source:** Worked example: your exam OTA (L10)

**Topics:** [[L10 PSRR and noise]] · **Lectures:** 

## Question

The mid-sem 5-T OTA has gm1 = 0.8 mS, rO2 = 333 kΩ, rO4 = 167 kΩ, |Vov3| = 0.25 V and 60 µA per side. (a) Its low-frequency PSRR in dB. (b) Its input-referred thermal noise (γ = 2/3, T = 300 K).

| Given | Value |
|---|---|
| $g_{m1}$ | 800 µS |
| $r_{O2}$ | 333.3 kΩ |
| $r_{O4}$ | 166.7 kΩ |
| $|V_{ov3}|$ | 250 mV |

**Find:** (a) PSRR · (b) Input noise

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Wiggle VDD: what does the diode do?
> 2. PSRR ≈ gm1(rO2‖rO4), in dB.
> 3. Noise: 8kTγ(1/gm1 + gm3/gm1²).
> 4. gm3 = 0.48 mS.

> [!success]- Answers
> - (a) PSRR: **38.98 dB**
> - (b) Input noise: **6.647 nV/√Hz**

> [!example]- Full solution
> 1. Signal gain = gm1(rO2 ‖ rO4) = 88.9 (your exam answer)
>    $$A_v = 88.9$$
> 2. Supply gain ≈ 1: the diode M3 carries X (and the output) along with VDD
> 3. (a) PSRR = Av/1 in dB
>    $$20\log_{10}88.9 = 39\,\mathrm{dB}$$
> 4. Load gm: gm3 = 2ID/|Vov3|
>    $$g_{m3} = \frac{2(60\,\mu\mathrm{A})}{0.25} = 0.48\,\mathrm{mS}$$
> 5. (b) 8kTγ(1/gm1 + gm3/gm1²), square root
>    $$\overline{V_n} = \sqrt{2.21\times 10^{-20}(1250 + 750)} = 6.65\,\mathrm{nV/\sqrt{Hz}}$$

