---
tags: ["question", "source/lab", "unit/U10"]
aliases: ["Lab 6 (hand calculations)"]
---
# Lab 6: design a PMOS-input resistive diff amp

**Source:** Lab 6 (hand calculations)

**Topics:** [[U10 Differential pair]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

PMOS-input pair with resistor loads to ground: ISS = 40 µA (20 µA each side), output CM level 0.7 V, differential gain 8 V/V, CL = 1 pF. Find RD, the required V*, gm and the bandwidth.

| Given | Value |
|---|---|
| $I_{SS}$ | 40 µA |
| $V_{out,CM}$ | 700 mV |
| $A_d$ | 8 V/V |
| $C_L$ | 1 pF |

**Find:** Load resistors · Required V* · gm of each device · Bandwidth

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Each side carries ISS/2.
> 2. Gain = twice the drop over V*.
> 3. f = 1/(2πRD·CL).
> 4. RD = 35 kΩ.

> [!success]- Answers
> - Load resistors: **35 kΩ**
> - Required V*: **175 mV**
> - gm of each device: **228.6 µS**
> - Bandwidth: **4.547 MHz**

> [!example]- Full solution
> 1. The output CM is the drop across RD (loads go to ground)
>    $$R_D = \frac{0.7}{20\,\mu} = 35\,\mathrm{k\Omega}$$
> 2. |Ad| = gm·RD = 2VRD/V*
>    $$V^* = \frac{2(0.7)}{8} = 0.175\,\mathrm{V}$$
> 3. gm = 2ID/V*
>    $$g_m = 0.229\,\mathrm{mS}$$
> 4. Output pole RD·CL
>    $$f_{-3dB} = \frac{1}{2\pi(35\,\mathrm{k\Omega})(1\,\mathrm{pF})} = 4.55\,\mathrm{MHz}$$

