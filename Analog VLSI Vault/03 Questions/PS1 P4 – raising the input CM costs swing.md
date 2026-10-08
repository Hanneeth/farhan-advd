---
tags: ["question", "source/problem-set", "unit/L2"]
aliases: ["Problem Set 1 P4 (tutoring chat)"]
---
# PS1 P4: raising the input CM costs swing

**Source:** Problem Set 1 P4 (tutoring chat)

**Topics:** [[L2 One-stage op amps]] · **Lectures:** [[Lec 02]]

## Question

Continue P3. (a) With Vb1 fixed at the P3 value, why can the input CM not rise at all? (b) The system needs Vin,CM = 1.6 V: how much must Vb1 rise, and what does it cost in differential swing?

| Given | Value |
|---|---|
| $V_{in,CM,new}$ | 1.6 V |

**Find:** (a) VX (= Vin,CM − Vth) · (b) Rise in Vb1 · (b) Change in differential swing

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. In a telescopic, the input CM and the output floor are tied through X.
> 2. X = Vb1 − VGS3 must stay ≥ Vin,CM − Vth.
> 3. ΔVb1 = ΔVin,CM; each output floor rises by ΔVb1.
> 4. The differential swing loses 2ΔVb1.

> [!success]- Answers
> - (a) VX (= Vin,CM − Vth): **672.9 mV**
> - (b) Rise in Vb1: **227.1 mV**
> - (b) Change in differential swing: **-454.2 mV**

> [!example]- Full solution
> 1. (a) X = Vb1 − VGS3 sits exactly at Vin,CM − Vth: M1 is at its edge, any rise of its gate pushes it into triode
>    $$V_X = 0.6729\,\mathrm{V}$$
> 2. (b) X must rise with the input: Vb1 rises by the same amount
>    $$\Delta V_{b1} = 1.6 - 1.373 = 0.2271\,\mathrm{V}$$
> 3. The output floor rises by the same amount on each side: the differential swing loses twice that
>    $$\Delta V_{pp,diff} = -2\times 0.227 = -0.454\,\mathrm{V}$$

