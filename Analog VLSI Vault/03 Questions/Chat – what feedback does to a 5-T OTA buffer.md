---
tags: ["question", "source/Razavi", "unit/L2", "unit/U12"]
aliases: ["Unity-gain buffer lecture (tutoring chat, Razavi Ex 9.4)"]
---
# Chat: what feedback does to a 5-T OTA buffer

**Source:** Unity-gain buffer lecture (tutoring chat, Razavi Ex 9.4)

**Topics:** [[L2 One-stage op amps]] · [[U12 Poles and bandwidth]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

A five-transistor OTA with gm2 = 1 mS and rO2 = rO4 = 20 kΩ drives CL = 1 pF. Find the open-loop Rout and gain, the open-loop pole, the closed-loop Rout as a unity-gain buffer, the closed-loop pole, and the buffer’s gain error.

| Given | Value |
|---|---|
| $g_{m2}$ | 1 mS |
| $r_{O2} = r_{O4}$ | 20 kΩ |
| $C_L$ | 1 pF |

**Find:** Open-loop Rout · Open-loop gain · Open-loop pole · Buffer Rout · Buffer gain error (fraction)

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Open loop first: Gm·Rout.
> 2. Feedback divides Rout by (1 + βA).
> 3. The pole moves out by the same factor: gm/CL.
> 4. A = 10.

> [!success]- Answers
> - Open-loop Rout: **10 kΩ**
> - Open-loop gain: **10 V/V**
> - Open-loop pole: **100000000 rad/s**
> - Buffer Rout: **909.1 Ω**
> - Buffer gain error (fraction): **0.09091**

> [!example]- Full solution
> 1. rO2 ‖ rO4
>    $$R_{out} = 20\mathrm{k}\parallel 20\mathrm{k} = 10\,\mathrm{k\Omega}$$
> 2. Gm·Rout
>    $$A = 1\,\mathrm{mS}\times 10\,\mathrm{k\Omega} = 10$$
> 3. One pole at the output
>    $$\omega_p = \frac{1}{10\mathrm{k}\times 1\mathrm{p}} = 100\,\mathrm{Mrad/s}$$
> 4. Voltage feedback makes the output stiff: Rout/(1 + βA), β = 1
>    $$R_{out,closed} = \frac{10\mathrm{k}}{11} = 909\,\mathrm{\Omega};\approx 1/g_m$$
> 5. Gain error 1/(1 + A): the buffer’s gain is only 0.91
>    $$\varepsilon = \frac{1}{11} = 0.0909$$

