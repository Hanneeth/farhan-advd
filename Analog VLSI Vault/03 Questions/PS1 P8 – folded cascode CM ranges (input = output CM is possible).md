---
tags: ["question", "source/problem-set", "unit/L4"]
aliases: ["Problem Set 1 P8 (tutoring chat)"]
---
# PS1 P8: folded cascode CM ranges (input = output CM is possible)

**Source:** Problem Set 1 P8 (tutoring chat)

**Topics:** [[L4 Folded cascode]] · **Lectures:** [[Lec 05]]

## Question

For the P6 design with the tail M11 needing 0.4 V: (a) the input CM range; (b) the output range, and a CM level that works for both input and output.

| Given | Value |
|---|---|
| $V_{ISS}$ | 400 mV |

**Find:** (a) Input CM floor · (a) Input CM ceiling · (b) Output floor · (b) Output ceiling

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Folding flips the inequality.
> 2. PMOS fence: VD ≤ VG + |Vth|.
> 3. The input range and the output range overlap from 1.0 to 1.5 V.
> 4. X sits at Vov5 = 0.5 V.

> [!info]- Concept and formulas
> PMOS-input folded cascode CM range: can go below ground (floor Vov5 − |Vthp|).
> $$V_{in,CM}: [V_{ov5} - |V_{thp}|,\; V_{DD} - V_{ISS} - |V_{GS1}|]$$

> [!success]- Answers
> - (a) Input CM floor: **-300 mV**
> - (a) Input CM ceiling: **1.5 V**
> - (b) Output floor: **1 V**
> - (b) Output ceiling: **2 V**

> [!example]- Full solution
> 1. (a) Floor: M1 fence (PMOS VD ≤ VG + |Vth|) against X = Vov5 = 0.5 V
>    $$V_{in,CM} \ge 0.5 - 0.8 = -0.3\,\mathrm{V}$$
> 2. Ceiling: the tail needs 0.4 V below VDD, then M1 needs |VGS1| = 1.1 V
>    $$V_{in,CM} \le 3 - 0.4 - 1.1 = 1.5\,\mathrm{V}$$
> 3. (b) Output: two NMOS overdrives up, two PMOS down
>    $$V_{out} \ge 0.5 + 0.5 = 1\,\mathrm{V}$$
> 4. Ceiling
>    $$V_{out} \le 3 - 0.5 - 0.5 = 2\,\mathrm{V}\;\Rightarrow\;\text{choose } V_{CM} = 1.5\,\mathrm{V}$$

