---
tags: ["question", "source/tutorial", "unit/L9", "unit/U11"]
aliases: ["Tutorial 6 Q2"]
---
# Tutorial 6 Q2: a 5-T OTA slews, then settles

**Source:** Tutorial 6 Q2

**Topics:** [[L9 Input range and slew rate]] · [[U11 Five-transistor OTA]] · **Lectures:** [[Lec 01]] · [[Lec 02]] · [[Lec 13]] · [[Lec 14]]

> [!quote] Tutorial 6, Question 2 (as printed)
> ![[t6q2.webp]]

## Question

A five-transistor OTA in a non-inverting loop: ISS = 200 µA, CL = 5 pF, R1 = 3 MΩ, R2 = 1 MΩ, µnCox(W/L)1,2 = 4 mA/V², |VA| = 20 V. (a) SR+ and SR−. (b) The differential input that turns M2 fully off. (c) For a 1.2 V input step, how long it slews. (d) Rout, the closed-loop τ, and the total time to settle within 1%.

| Given | Value |
|---|---|
| $I_{SS}$ | 200 µA |
| $C_L$ | 5 pF |
| $\mu_n C_{ox} W/L$ | 0.004 A/V² |
| $V_A$ | 20 V |

**Find:** (a) Slew rate (both) · (b) Input that turns M2 off · (c) Slewing time · (d) Output resistance · (d) Closed-loop τ · (d) Total settling time (1%)

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. A 5-T OTA slews at ISS/CL both ways.
> 2. M2 turns off at √2·Vov.
> 3. τcl = RoutCL/(1 + βA0).
> 4. β = 1/4.

> [!info]- Concept and formulas
> A 5-T OTA slews at ISS/CL until the input difference falls below √2·Vov, then settles linearly with τ = RoutCL/(1 + βA0).
> $$SR = I_{SS}/C_L$$
> $$\Delta V_{in,full} = \sqrt2\,V_{ov}$$
> $$t = \tau\ln\dfrac{\text{error at start}}{\text{final error}}$$

> [!success]- Answers
> - (a) Slew rate (both): **40 V/µs**
> - (b) Input that turns M2 off: **316.2 mV**
> - (c) Slewing time: **88.38 ns**
> - (d) Output resistance: **100 kΩ**
> - (d) Closed-loop τ: **21.4 ns**
> - (d) Total settling time (1%): **155.5 ns**

> [!example]- Full solution
> 1. (a) Either way the whole tail current charges or discharges CL (through the mirror)
>    $$SR = \frac{200\,\mu}{5\,\mathrm{p}} = 40\,\mathrm{V/\mu s}$$
> 2. (b) Full steering at √2·Vov (Vov at balance)
>    $$\sqrt{2}\sqrt{\tfrac{2(100\mu)}{4\,\mathrm{m}}} = 0.316\,\mathrm{V}$$
> 3. (c) Slewing ends when X = βVout = V0 − ΔVin,min
>    $$V_{out} = \frac{1.2 - 0.316}{0.25} = 3.54\,\mathrm{V},\; t_{slew} = \frac{V_{out}}{SR} = 88.4\,\mathrm{ns}$$
> 4. (d) Rout = rO2 ‖ rO4 = (VA/ID)/2
>    $$R_{out} = \frac{20/100\mu}{2} = 100\,\mathrm{k\Omega}$$
> 5. τcl = RoutCL/(1 + βA0), A0 = gm·Rout
>    $$\tau_{cl} = 21.4\,\mathrm{ns}$$
> 6. Linear settling of what is left after slewing, to 1% of the final value
>    $$t_{total} = t_{slew} + \tau\ln\frac{V_{final} - V_{out}(t_{slew})}{0.01\,V_{final}} = 156\,\mathrm{ns}$$

