---
tags: ["question", "source/tutorial", "unit/L9", "unit/L4"]
aliases: ["Tutorial 6 Q3"]
---
# Tutorial 6 Q3: folded-cascode slew rate

**Source:** Tutorial 6 Q3

**Topics:** [[L9 Input range and slew rate]] · [[L4 Folded cascode]] · **Lectures:** [[Lec 05]] · [[Lec 13]] · [[Lec 14]]

> [!quote] Tutorial 6, Question 3 (as printed)
> ![[t6q3.webp]]

## Question

NMOS-input folded cascode with a cascode-mirror bottom: CL = 4 pF, ISS = 300 µA, each folding PMOS source IP = 200 µA, VA = 25 V, Vov1,2 = 150 mV. (a) SR+. (b) SR− and what limits it. (c) The condition on IP for SR = ISS/CL both ways. (d) The input step that forces full slewing.

| Given | Value |
|---|---|
| $I_{SS}$ | 300 µA |
| $I_P$ | 200 µA |
| $C_L$ | 4 pF |
| $V_{ov1,2}$ | 150 mV |

**Find:** (a) Positive slew rate · (b) Negative slew rate · (c) Minimum IP for SR = ISS/CL · (d) Step for full slewing

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Write the output current as (right branch) − (mirror of left branch).
> 2. A cascode branch carries IP − ID; it cannot go negative.
> 3. With IP ≥ ISS both slew rates are ISS/CL.
> 4. IP = 200 µA < ISS = 300 µA.

> [!info]- Concept and formulas
> Folded cascode slewing: the output current is (IP − ID2) minus the mirrored (IP − ID1); a branch cannot go negative. Symmetric SR = ISS/CL needs IP ≥ ISS.
> $$SR^+ = \dfrac{I_P}{C_L}\ \text{or}\ \dfrac{I_{SS}}{C_L}\ (\text{smaller}),\quad I_P \ge I_{SS}$$

> [!success]- Answers
> - (a) Positive slew rate: **50 V/µs**
> - (b) Negative slew rate: **50 V/µs**
> - (c) Minimum IP for SR = ISS/CL: **300 µA**
> - (d) Step for full slewing: **212.1 mV**

> [!example]- Full solution
> 1. Output current = (IP − ID2) − copy of (IP − ID1); a branch cannot carry negative current
>    $$\text{with } I_P < I_{SS}\text{ one cascode branch turns off}$$
> 2. (a) ID2 → 0: the right branch delivers IP; the left branch (IP − ISS < 0) is off, so the mirror sinks nothing
>    $$SR_+ = \frac{I_P}{C_L} = 50\,\mathrm{V/\mu s}$$
> 3. (b) ID2 → ISS: the right branch is off, the mirror sinks IP. Limited by IP
>    $$SR_- = 50\,\mathrm{V/\mu s}$$
> 4. (c) To slew at ISS/CL both ways, no branch may turn off
>    $$I_P \ge I_{SS} = 300\,\mathrm{\mu A}$$
> 5. (d) Full steering at √2·Vov
>    $$\sqrt{2}\times 0.15 = 0.212\,\mathrm{V}$$

