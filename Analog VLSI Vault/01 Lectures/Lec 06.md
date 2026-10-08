---
tags: ["lecture", "lec/06"]
aliases: ["Folded-cascode CM range (PMOS and NMOS input); rail-to-rail input; folded cascode as a buffer; low-voltage cascode load"]
date: "14 Aug"
---
# Lec 06 · Folded-cascode CM range (PMOS and NMOS input); rail-to-rail input; folded cascode as a buffer; low-voltage cascode load

**Date:** 14 Aug · **Handout:** L4, L3, L6 · **Topics:** [[L6 Gain boosting]]

> [!abstract] In one paragraph
> Input CM limits of both folded cascodes, the NMOS-input gain, a complementary (rail-to-rail) input, the window when the output is shorted to an input, the low-voltage cascode load (M7, M8 gates on X), and the start of gain boosting.

**Before:** [[Lec 05]] · **Next:** [[Lec 07]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec06.webp]]

Original PDF: [[Notes – lecture-06-14082026.pdf]]

## The page, item by item

### PMOS-input folded cascode: input CM range

Top limit: the PMOS tail M11 needs $|V_{ov11}|$ and M1 needs $|V_{GS1}|$ below VDD. Bottom limit: M1 (PMOS) stays saturated while its gate is no more than $|V_{thp}|$ below its drain, and its drain is the folding node at $V_{ov9}$. So the input CM can go **below ground**. Your numbers: 1.8 − 0.2 − 0.7 = 0.9 V at the top, 0.2 − 0.5 = −0.3 V at the bottom.

- $V_{in,CM,max} = V_{DD} - |V_{ov11}| - |V_{GS1}|$
- $V_{in,CM,min} = V_{ov9} - |V_{thp}|$
- the same thing written with VGS1: $= V_{ov9} + |V_{ov1}| - |V_{GS1}| = V_{ov9} + |V_{ov1}| - (|V_{ov1}| + |V_{th1}|)$

$$V_{ov9} - |V_{thp}| \le V_{in,CM} \le V_{DD} - |V_{ov11}| - |V_{GS1}|$$

> [!question] Asked in exams
> Problem Set 1 P8 (input CM range of a folded cascode): the minimum is negative.

### NMOS-input folded cascode (M1, M2 NMOS, M11 tail; PMOS M9, M10 on top, M7, M8 PMOS cascodes, M5, M6 NMOS cascodes on M3, M4)

Same idea mirrored. The fold node now hangs from the **top** PMOS M10, so Rup carries $(r_{O10}\parallel r_{O2})$ under the PMOS cascode M8; Rdown is the NMOS cascode M6 on M4. Input CM: bottom set by the tail and $V_{GS1}$; top by M1’s drain at $V_{DD} - |V_{ov10}|$ (it can go **above VDD**).

$$A_v = g_{m1,2}\left[g_{m8}r_{O8}(r_{O10}\parallel r_{O2}) \parallel g_{m6}r_{O6}r_{O4}\right]$$

$$V_{in,CM,min} = V_{ov11} + V_{GS1}$$

$$V_{in,CM,max} = V_{DD} - |V_{ov10}| + V_{th1}$$

### Rail-to-rail input: NMOS and PMOS pairs together (M1–M13)

Your bottom-left circuit puts a PMOS pair (M3, M4 with tail M13) and an NMOS pair (M1, M2) in parallel, both folding into the same cascode branch (M5–M12). When the input CM is near ground the PMOS pair works; near VDD the NMOS pair works; in the middle both do. That is how an op amp accepts **any input CM from rail to rail** (handout L9, §9.8).

### Folded cascode with the output shorted to an input (buffer)

Tie $V_{out}$ to the gate of input PMOS M2. **M4** (NMOS cascode, gate $V_{b2}$) needs the output high enough. **M2** (PMOS) needs its drain — M4’s source, $V_{b2} - V_{GS4}$ — to stay no more than $|V_{th2}|$ above its gate. Your numbers: $0.8 - 0.4 = 0.4$ V and $0.8 - 0.6 - 0.5 = -0.3$ V, so the **M4 limit binds**: the output must stay above 0.4 V.

- $M4:\; V_{out} - V_{S4} \ge V_{b2} - V_{S4} - V_{th4} \Rightarrow V_{out} \ge V_{b2} - V_{th4}$
- $M2\,(\text{PMOS}):\; V_{D2} \le V_{G2} + |V_{th2}|,\quad V_{D2} = V_{b2} - V_{GS4},\; V_{G2} = V_{out}$
- $V_{out} \ge V_{b2} - V_{GS4} - |V_{th2}|$

$$V_{out} \ge \max\left(V_{b2} - V_{th4},\; V_{b2} - V_{GS4} - |V_{th2}|\right)$$

> [!question] Asked in exams
> The folded-cascode version of the buffer-window question (Tutorial 3 Q1(c) is the telescopic one).

### Low-voltage cascode load: M7, M8 gates tied to X

The last circuit is a single-ended telescopic whose PMOS load is a cascode mirror with the top gates (M7, M8) tied to **X**, the drain of cascode M5 — M7 is not a diode. So $X = V_{DD} - |V_{GS7}|$. **M5 saturated** (its drain X at most $|V_{th5}|$ above its gate) gives the lowest $V_{b1}$; **M7 saturated** (its drain P keeps $|V_{ov7}|$ below VDD) gives $P_{max}$, and since $P = V_{b1} + |V_{GS5}|$ that caps $V_{b1}$. With $V_{b1}$ in between, the output keeps the full $V_{DD} - |V_{ov8}| - |V_{ov6}|$ at the top: no diode tax (compare the Lec 3 mirror).

$$V_{b1} \ge V_{DD} - |V_{GS7}| - |V_{th5}|$$

$$V_{P,max} = V_{DD} - |V_{ov7}| = V_{DD} - |V_{GS7}| + |V_{th7}|$$

$$V_{b1} \le V_{DD} - |V_{ov7}| - |V_{GS5}|$$

### Gain boosting begins

Every amplifier gain is $A_v = G_m R_{out}$. $G_m$ is hard to raise (it is set by $g_m$); $R_{out}$ is the one to improve. Lec 7–8 do it.

$$A_v = G_m R_{out}$$

## Explained step by step

**Starting at Lec 6? Everything you need is in this step.** Read it once; every later step uses the same few ideas.

**1 · The saturation fences.** An NMOS stays saturated while its drain is no lower than one threshold below its gate: $V_D \ge V_G - V_{th}$. A PMOS is the mirror image: its drain may be at most $|V_{th}|$ above its gate, $V_D \le V_G + |V_{th}|$.

**2 · Check vs link.** Every headroom question uses two kinds of step along a column:

- a **check** — source to drain, *through* a channel: it must be at least $|V_{ov}|$ (0.2 V in your numbers) or the device drops into triode. Checks are what *fail*.
- a **link** — source to gate: always exactly $|V_{GS}| = |V_{th}| + |V_{ov}|$ (0.7 V). A link never fails; it just tells you where a gate sits once you know its source (or the reverse).

The fence in tool 1 is simply a check and a link written in one line.

**3 · Gain by two looks.** $A_v = G_m(R_{up}\parallel R_{down})$: the input device makes a current $G_mv_{in}$ ($G_m \approx g_m$ of the input device) and it meets the resistances seen looking up and down from the output. A cascode device **multiplies** whatever sits under it by $g_mr_O$; looking into a **source** you see only about $1/g_m$.

![[s-lec06-start.svg]]

**4 · $V_{CM}$, the input common-mode level.** CM always means **the average of a pair**. The two inputs share an average level $V_{in,CM} = \dfrac{V_{in1} + V_{in2}}{2}$ and differ by the signal $v_d = V_{in1} - V_{in2}$. (A fully differential circuit also has an **output** CM, the average of its two outputs.) The **input CM range** asks: how low and how high can that shared input level sit with every transistor still saturated?

![[s-lec02-cmdm.svg]]

**5 · Folding (Lec 5) in one paragraph.** In a cascode the input device (the “pump”) sits right under the cascode device (the “shield”). But the shield only needs a signal current pushed into its source — it does not care where it comes from. So flip the input device to the opposite type and plug its drain into the shield’s source **from the side**, at the **fold node**; add a current source there so the DC current has a path. Same $G_m \approx g_{m1}$, same gain formula, and the input device has left the output column.

![[s-lec05-fold.svg]]

**6 · How to read a tower.** The figures below draw a column of transistors as a stack of blocks. **One block = one transistor; its height = the voltage across it** (top node minus bottom node). The blocks always add up to VDD. No block may be shorter than its $V_{ov}$. When an input or output moves, one boundary slides: one block grows and its neighbour shrinks. **The limit is the moment a block shrinks to its minimum — drawn red, “squeezed”.** A block labelled “room” is not a transistor, just spare voltage. So every CM or swing question becomes one question: *which block gets squeezed first?*

![[s-lec03-tower.svg]]

**Now your page’s first circuit, the PMOS-input folded cascode:** PMOS tail M11 from VDD, input pair M1, M2, fold nodes X, NMOS cascodes M3, M4, bottom sources M9, M10, and on top the PMOS cascode loads M5, M6 on M7, M8. For the input CM range only one column matters: **M11 → P → M1 → X → M9**. X is held at $V_{ov9}$ (0.2 V) by the bias, and P always sits one link above the input: $P = V_{in} + |V_{GS1}| = V_{in} + 0.7$. So moving $V_{in}$ moves only P, and P decides how the 1.8 V is shared between M11 (above P) and M1 (below P).

![[s-lec06-cm.svg]]

**Ceiling — push $V_{in}$ up.** P rises towards VDD, so **M11’s** block shrinks. Check: $V_{DD} - P \ge |V_{ov11}|$ gives $P \le 1.6$ V. Link: $V_{in} = P - 0.7 \le 0.9$ V. In symbols, $V_{in,CM,max} = V_{DD} - |V_{ov11}| - |V_{GS1}|$.

**Floor — pull $V_{in}$ down.** P falls towards X, so **M1’s** block shrinks. Checks: X ≥ 0.2 (M9) and $P - X \ge 0.2$ (M1), so $P \ge 0.4$ V. Link: $V_{in} = P - 0.7 \ge -0.3$ V — **below ground**. In symbols, $V_{in,CM,min} = V_{ov9} + |V_{ov1}| - |V_{GS1}|$, your page’s second line. Since $|V_{GS1}| = |V_{ov1}| + |V_{thp}|$ the $|V_{ov1}|$ cancel, leaving the short form $V_{ov9} - |V_{thp}|$ (0.2 − 0.5 = −0.3 V).

“Why $V_{ov}$ for M11 but $V_{GS}$ for M1?” Because M11’s step is a **check** (through its channel) and M1’s step is the **link** to the gate, where $V_{in}$ lives. Both limits use both kinds of step; only the squeezed block changes. Folding is what makes the floor this low: X belongs to M9 alone, so it can sit just one $V_{ov}$ above ground.

Before the second circuit, the cascode facts its gain uses — the ones Lec 5 built on:

![[s-lec05-cascode.svg]]

And what folding changes compared with a normal cascode (green = same, red = changed):

![[s-lec05-compare.svg]]

Now swap every device type. The input pair is **NMOS** (M1, M2, with tail M11 to ground), and it folds into the **top**: each fold node hangs under a PMOS current source (M9, M10), held only $|V_{ov10}|$ (0.2 V) below VDD. Below it come the PMOS cascode M8, the output, the NMOS cascode M6 and the bottom source M4.

![[s-lec06-nfold.svg]]

**Gain, by the same two looks.** Looking **up** from the output you meet the PMOS cascode M8, and under its source (the fold node) hang two resistances in parallel: M10’s $r_{O10}$ and the input device’s $r_{O2}$. The cascode multiplies them: $R_{up} = g_{m8}r_{O8}(r_{O10}\parallel r_{O2})$. Looking **down** is an ordinary NMOS cascode: $R_{down} = g_{m6}r_{O6}r_{O4}$. The signal current is still $g_{m1,2}v_{in}$ — at the fold node it takes the easy path into M8’s source ($\approx 1/g_{m8}$). So

$A_v = g_{m1,2}\left[g_{m8}r_{O8}(r_{O10}\parallel r_{O2}) \parallel g_{m6}r_{O6}r_{O4}\right]$

— the two $r_O$ in parallel at the fold node are why a folded cascode has a little less gain than a telescopic.

**CM range, with towers.** The column is M10 → fold → M2 → S → tail M11, and now the link is $S = V_{in} - V_{GS1}$ (an NMOS source sits a $V_{GS}$ **below** its gate).

**Floor** — pull $V_{in}$ down: S falls, the **tail** block shrinks; check $S \ge V_{ov11}$ = 0.2, link $V_{in} = S + 0.7 \ge 0.9$ V: $V_{in,CM,min} = V_{ov11} + V_{GS1}$.

**Ceiling** — push $V_{in}$ up: S rises towards the fold node, the **input device’s** block shrinks; check fold − S ≥ 0.2 with fold = 1.6, so $S \le 1.4$; link $V_{in} \le 2.1$ V — **above VDD**. In symbols $V_{in,CM,max} = V_{DD} - |V_{ov10}| - V_{ov1} + V_{GS1} = V_{DD} - |V_{ov10}| + V_{th1}$.

**One rule for both:** the input pair’s drain sits near the **opposite** rail, so the CM range passes that rail. PMOS input → below ground; NMOS input → above VDD.

Each folded version passes **one** rail but not the other: the PMOS pair’s ceiling, $V_{DD} - |V_{ov}| - |V_{GS}|$, is well below VDD, and the NMOS pair’s floor, $V_{ov} + V_{GS}$, is well above ground.

So the bottom circuit on your page uses **both**: an NMOS pair (M1, M2) and a PMOS pair (M3, M4, tail M13) take the same two inputs, and both fold their currents into the same cascode branches (M5–M12), which add them at the output.

![[s-lec06-r2r.svg]]

Slide the input CM from 0 to VDD: near ground only the PMOS pair is on, in the middle both are, near VDD only the NMOS pair is. Some pair always works, so the op amp accepts **any input CM, rail to rail** (handout L9, Razavi §9.8).

The side effect worth one line in the exam: where both pairs work their currents add, so $G_m$ — and the gain — roughly **doubles** in the middle of the range. Keeping $G_m$ constant needs extra circuitry (not in the mid-sem).

“If we short the output with one of the inputs” is the **unity-gain buffer**: wire $V_{out}$ to the gate of M2, the inverting input, so the feedback factor is $\beta = 1$ and $V_{out} \approx V_{in}$. (Why the − input: feedback must oppose a change — if $V_{out}$ rises, M2’s gate rises and pushes $V_{out}$ back down.) The question: for which output levels is every device still saturated? One voltage is now both an output and an input gate, so write each check with $V_{out}$ in it.

Your zoomed circuit: the NMOS cascode M4 (gate $V_{b2}$) above the bottom source M10 (gate $V_{b1}$). Between them is the fold node, which is also the drain of the PMOS input M2 — whose gate is $V_{out}$.

![[s-lec06-fbuf.svg]]

**First, the link that pins the fold node:** M4’s gate is fixed at $V_{b2}$ and its source is the fold node, so fold $= V_{b2} - V_{GS4}$ (0.8 − 0.6 = 0.2 V). It does not move with $V_{out}$.

**M4 (NMOS) check:** its channel runs from the fold node up to $V_{out}$: $V_{out} - (V_{b2} - V_{GS4}) \ge V_{ov4}$, i.e. $V_{out} \ge V_{b2} - V_{th4}$ $= 0.8 - 0.4 = 0.4$ V. (Your page writes it as the fence $V_{DS4} \ge V_{GS4} - V_{th4}$; the source terms cancel — same line.)

**M2 (PMOS) check:** its source sits one link above its gate, $V_{out} + |V_{GS2}|$, and its drain is the fold node. The fence form on your page: drain ≤ gate + $|V_{th2}|$, so $V_{b2} - V_{GS4} \le V_{out} + |V_{th2}|$, i.e. $V_{out} \ge V_{b2} - V_{GS4} - |V_{th2}|$ $= 0.8 - 0.6 - 0.5 = -0.3$ V. (Your page writes $+V_{th2}$ with the PMOS threshold negative; same thing.)

Both results are **floors** ($V_{out} \ge$ …) and the output must obey both, so the **higher** one binds: the output must stay above 0.4 V.

Compare the telescopic buffer (Lec 3–4): there M2 sat **under** the cascode in the same column, so it gave a **ceiling**, and the window between floor and ceiling was only $V_{th} - V_{ov}$ wide. Here M2’s drain is the fold node, pinned by $V_{b2}$ in **another column**, so moving the output cannot squeeze M2’s block. That is the second gift of folding.

The last circuit on your page is a single-ended **telescopic** (NMOS input M1, M2, tail M9, NMOS cascodes on $V_{b2}$) with a PMOS cascode mirror as its load — wired in a special way. Look closely: the gates of the top devices M7 and M8 are **not** tied to their own drains (M7 is not a diode). They go down to **X**, the drain of the cascode M5. The cascodes M5, M6 get their own bias $V_{b1}$.

Why bother? A mirror needs one side’s current turned into a gate voltage. The usual cascode mirror (Lec 3) does it with two stacked diodes, which fixes M6’s gate too low and costs the output an extra $|V_{thp}|$ of swing — the **diode tax**. This load avoids it.

![[s-lec06-lvc.svg]]

Read the voltages from the top. M7’s source is VDD and its gate is X, so $X = V_{DD} - |V_{GS7}|$. Node P (M7’s drain, M5’s source) sits $|V_{GS5}|$ above M5’s gate: $P = V_{b1} + |V_{GS5}|$.

Two fences set $V_{b1}$. **M5 saturated** (PMOS fence): its drain X may be at most $|V_{th5}|$ above its gate, $X \le V_{b1} + |V_{th5}|$, so $V_{b1} \ge V_{DD} - |V_{GS7}| - |V_{th5}|$ — your page’s first line. **M7 saturated:** its drain P must keep $|V_{ov7}|$ below VDD, $P_{max} = V_{DD} - |V_{ov7}|$ — your second line — which caps $V_{b1}$ at $V_{DD} - |V_{ov7}| - |V_{GS5}|$.

With $V_{b1}$ between those limits, M5 and M7 are both saturated, and with $V_{b1}$ near its top the output can rise to $V_{DD} - |V_{ov8}| - |V_{ov6}|$: the full cascode swing, no diode tax. (Your page expands $P_{max}$ as $V_{DD} - |V_{GS7}| - |V_{th7}|$. Since $|V_{ov7}| = |V_{GS7}| - |V_{th7}|$, it is $+|V_{th7}|$.)

The last line of the page opens the next topic. Seen from its output, every amplifier so far is a current $G_mv_{in}$ pushed into a resistance $R_{out}$, so $A_v = G_mR_{out}$.

![[s-lec06-gmrout.svg]]

Which factor can grow? $G_m$ is essentially the input device’s $g_m = \dfrac{2I_D}{V_{ov}}$: raising it costs current (power) or a smaller overdrive, so your page calls it hard to improve. $R_{out}$ is the one to work on, and you already know one way: each cascode multiplies it by $g_mr_O$. But every stacked device eats another $V_{ov}$ of swing.

The next two lectures get more gain **without** stacking more devices: a second gain stage (Lec 7), and **gain boosting** (Lec 7–8), where a small extra amplifier multiplies $R_{out}$ by $(1 + A_1)$.

## Questions that use this lecture

- [[Tutorial 4 Q1 – regulated cascode with an NMOS auxiliary]] · Tutorial 4 Q1 (adapted Razavi 9.10)
- [[Tutorial 4 Q2 – gain boosting with a PMOS auxiliary]] · Tutorial 4 Q2
- [[Tutorial 4 Q3 – gain boosting with a folded-cascode auxiliary]] · Tutorial 4 Q3
- [[2025 mid-sem Q1 – gain-boosted cascode with a CS auxiliary]] · Mid-sem 2025-26 Q1 (13 marks)
- [[2024 mid-sem Q4 – Rout of a gain-boosted cascode with a folded auxiliary]] · Mid-sem 2024-25 Q4 (7 marks)

## Animated lessons

- [[Analog Lab Lec 6 (animated).html]]
- [[Analog Lab Revision Lec 1-10 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – L6]]

