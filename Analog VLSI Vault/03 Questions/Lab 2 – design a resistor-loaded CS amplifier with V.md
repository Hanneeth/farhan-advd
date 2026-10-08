---
tags: ["question", "source/lab", "unit/U5"]
aliases: ["Lab 2 (hand calculations)"]
---
# Lab 2: design a resistor-loaded CS amplifier with V*

**Source:** Lab 2 (hand calculations)

**Topics:** [[U5 First amplifier common source]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

Specs: gain −8 V/V, VDD = 1.8 V, 100 µA. The output sits at VDD/2 (so VRD = 0.9 V). Use |Av| = 2VRD/V* with V* = 2ID/gm. (a) RD. (b) The required V*. (c) Example chart reading: at that V* a W = 10 µm device carries IDX = 40 µA; find W by ratio and proportion. (d) With VGS fixed, the largest gain you could get by raising RD (keep the device saturated: VDS ≥ V*).

| Given | Value |
|---|---|
| $V_{DD}$ | 1.8 V |
| $I_D$ | 100 µA |
| $|A_v|$ | 8 V/V |
| $I_{DX}$ | 40 µA |

**Find:** (a) Drain resistor · (b) Required V* · (c) Width (µm) · (d) Maximum gain

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Gain = twice the drop over the overdrive (here V*).
> 2. RD = VRD/ID; V* = 2VRD/|Av|.
> 3. W scales with ID at the same V*.
> 4. V* = 0.225 V.

> [!success]- Answers
> - (a) Drain resistor: **9 kΩ**
> - (b) Required V*: **225 mV**
> - (c) Width (µm): **25**
> - (d) Maximum gain: **14 V/V**

> [!example]- Full solution
> 1. (a) RD drops half the supply at 100 µA
>    $$R_D = \frac{0.9}{100\,\mu} = 9\,\mathrm{k\Omega}$$
> 2. (b) |Av| = gm·RD = (2ID/V*)·RD = 2VRD/V*
>    $$V^* = \frac{2(0.9)}{8} = 0.225\,\mathrm{V}$$
> 3. (c) ID ∝ W at fixed V*: ratio and proportion
>    $$W = 10\,\mu\mathrm{m}\times\frac{100\,\mu\mathrm{A}}{40\,\mu\mathrm{A}} = 25\,\mu\mathrm{m}$$
> 4. (d) Raising RD raises the gain until VD falls to V*: VRD,max = VDD − V*
>    $$|A_v|_{max} = \frac{2(1.8 - 0.225)}{0.225} = 14$$

