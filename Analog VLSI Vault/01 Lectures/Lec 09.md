---
tags: ["lecture", "lec/09"]
aliases: ["Auxiliary amplifiers for gain boosting; differential boosting; CMFB introduction"]
date: "21 Aug"
---
# Lec 09 · Auxiliary amplifiers for gain boosting; differential boosting; CMFB introduction

**Date:** 21 Aug · **Handout:** L6, L7 · **Topics:** [[L6 Gain boosting]] · [[L7 CMFB concept and sensing]]

> [!abstract] In one paragraph
> The folded auxiliary amplifier’s gain, boosting a differential pair (one aux per side or one differential aux), a full folded-cascode aux, both cascodes boosted, and why fully differential outputs need CMFB.

**Before:** [[Lec 08]] · **Next:** [[Lec 10]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec09.webp]]

Original PDF: [[Notes – lecture-09-21082026.pdf]]

## The page, item by item

### Folded auxiliary amplifier (M3 PMOS into M4 NMOS cascode, I3, I2)

The auxiliary amp is itself an amplifier: $A_{aux} = G_{m,aux}R_{out,aux}$. Its input device is M3 ($g_{m3}$) and its output sees the cascode $g_{m4}r_{O4}r_{O3}$.

$$A_v = G_mR_{out},\quad G_m = g_{m1}$$

$$R_{out} = (1 + A_{aux})\,g_{m2}r_{O2}r_{O1}$$

$$A_{aux} = G_{m,aux}R_{out,aux} = g_{m3}\,g_{m4}r_{O4}r_{O3}$$

$$A_v = g_{m1}\left[1 + g_{m3}g_{m4}r_{O4}r_{O3}\right]g_{m2}r_{O2}r_{O1}$$

### Boosting a differential pair: two single aux amps, or one differential aux

Each cascode (M3, M4) needs its own booster ($A_1 = A_2$). Because the two sides move in opposite directions, one **differential** auxiliary amplifier can watch both sources and drive both gates.

$$A_1 = A_2$$

### Differential boosting with CS auxiliaries (M5, M6, ISS1)

Using a differential pair (M5, M6 with its own tail $I_{SS1}$) as the auxiliary costs headroom at the bottom: the output must stay above the aux tail, its $V_{GS}$ and the cascode’s overdrive.

$$V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}$$

### Folded-cascode auxiliary (M5, M7, M9, M11, M13)

A full folded cascode as the auxiliary: $A_{aux} = g_{m5}(R_{up,aux}\parallel R_{down,aux})$.

$$R_{out} = (1 + A_{aux})\,g_{m3}r_{O3}r_{O1}$$

$$A_{aux} = g_{m5}\left[g_{m11}r_{O11}r_{O13} \parallel g_{m7}r_{O7}(r_{O9}\parallel r_{O5})\right]$$

### Telescopic op amp with both cascodes boosted (A1, A2)

Boost the NMOS cascodes with $A_1$ — a folded-cascode diff amp with **PMOS** inputs (its input CM is low, near the cascode sources) — and the PMOS cascodes with $A_2$, a folded-cascode diff amp with **NMOS** inputs (its input CM is high). Same trick on a folded-cascode main amplifier.

### Common-mode feedback: why it is needed

With resistor loads the output CM is set by $V_{DD} - R_D I_{SS}/2$. With current-source loads (M3, M4 from $V_b$) each output sits between a PMOS source $I_P$ and an NMOS source $I_N$: any mismatch $I_P - I_N$ flows into a huge resistance $R_P \parallel R_N$, so the output CM is undefined.

$$\Delta V_{out,CM} = (I_P - I_N)(R_P\parallel R_N)$$

## Explained step by step

The booster is just another amplifier, so its gain is found the usual way — its own $G_m$ times its own $R_{out}$: $A_{aux} = G_{m,aux}R_{out,aux}$. Plug it in as $A_1$:

$A_v = g_{m1}[1 + g_{m3}g_{m4}r_{O4}r_{O3}]g_{m2}r_{O2}r_{O1}$.

In a differential pair, each cascode needs a booster ($A_1 = A_2$). But the two cascode sources move in **opposite** directions (that is what a differential signal does), so **one differential amplifier** can watch both sources and drive both gates.

If the booster is a differential pair (input devices M5, with its own tail $I_{SS1}$), the cascode source X is now the booster’s **gate**. Walk up from ground: the booster tail’s **check** ($V_{ISS1}$, 0.2 V), then the **link** up to the booster’s gate ($V_{GS5}$, 0.7 V) — that gate is X — then the cascode M3’s **check** ($V_{ov3}$, 0.2 V) up to the output:

$V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}$ = 1.1 V, against 0.4 V for a plain cascode.

Every booster input level is the same question: walk up from ground, a $V_{ov}$ per channel and a $V_{GS}$ per gate.

Use the best single-stage amplifier we know as the booster: a whole **folded cascode**. Its gain is the usual look-up/look-down result:

$A_{aux} = g_{m5}[g_{m11}r_{O11}r_{O13}\parallel g_{m7}r_{O7}(r_{O9}\parallel r_{O5})]$

— note the two $r_O$ in parallel at its fold node, exactly as in Lec 5.

A booster’s input must sit where the cascode source it watches sits. The **NMOS** cascode sources are low — about one overdrive above ground (0.2 V). An NMOS-input booster could not take that: its gate needs a tail check plus a link, $V_{ov} + V_{GS}$ = 0.9 V, above ground. A **folded PMOS input** can: its floor is $V_{ov} - |V_{thp}|$, even below ground (Lec 6). The **PMOS** cascode sources are high (near VDD), so their booster needs an **NMOS input**, whose ceiling passes VDD (Lec 6 again).

Why a fully differential op amp needs **common-mode feedback (CMFB)**. First, what “CM” means for the outputs: the **output common mode** $V_{out,CM} = (V_{out1} + V_{out2})/2$ is the level both outputs share; the signal is their difference.

With resistor loads, $V_{DD} - R_DI_{SS}/2$ fixes that level. With current-source loads, each output sits between **two current sources** — and two current sources in series do not set any voltage. If the top one is even 0.1 % bigger, the extra current has nowhere to go but the huge output resistance, and the output runs to a rail.

![[s-lec09-cmfb.svg]]

So we need a loop that **senses** the output CM, **compares** it with a reference $V_{REF}$ and **corrects** one current source. That loop is CMFB (Lec 10–12).

## Questions that use this lecture

- [[Tutorial 4 Q1 – regulated cascode with an NMOS auxiliary]] · Tutorial 4 Q1 (adapted Razavi 9.10)
- [[Tutorial 4 Q2 – gain boosting with a PMOS auxiliary]] · Tutorial 4 Q2
- [[Tutorial 4 Q3 – gain boosting with a folded-cascode auxiliary]] · Tutorial 4 Q3
- [[Tutorial 5 Q1 – size the triode CMFB devices]] · Tutorial 5 Q1 (Razavi 9.11 extended)
- [[Tutorial 5 Q2 – which pair for the CMFB amplifier, and the loop gain]] · Tutorial 5 Q2 (Razavi Problem 9.12)
- [[Tutorial 5 Q3 – CM gain and CMRR with and without CMFB]] · Tutorial 5 Q3
- [[Quiz 2 Part A – triode-sensing CMFB on a telescopic]] · Quiz 2 Part A
- [[Quiz 2 Part B – triode-sensing CMFB on a telescopic]] · Quiz 2 Part B
- [[Quiz 2 Part C – triode-sensing CMFB on a telescopic]] · Quiz 2 Part C
- [[2025 mid-sem Q1 – gain-boosted cascode with a CS auxiliary]] · Mid-sem 2025-26 Q1 (13 marks)
- [[2025 mid-sem Q4 – size the triode CMFB devices (= Tutorial 5 Q1)]] · Mid-sem 2025-26 Q4 (12 marks)
- [[2024 mid-sem Q1 – CMFB with R = 10 MΩ sensing (= Tutorial 5 Q3)]] · Mid-sem 2024-25 Q1 (20 marks)
- [[2024 mid-sem Q4 – Rout of a gain-boosted cascode with a folded auxiliary]] · Mid-sem 2024-25 Q4 (7 marks)
- [[2024 Quiz 2 Q2 – resistive-sensing CMFB VREF, Vin,CM and the CM gain for ±1%]] · Quiz 2 2024-25 Q2 (9 marks)

## Animated lessons

- [[Analog Lab Lec 7-12 (animated).html]]
- [[Analog Lab Revision Lec 1-10 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – L6]] · [[Flashcards – L7]]

