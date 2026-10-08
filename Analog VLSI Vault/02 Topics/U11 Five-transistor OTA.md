---
tags: ["topic", "unit/U11", "group/foundations"]
aliases: ["Five-transistor OTA"]
---
# U11 · Five-transistor OTA

*The mirror recovers the lost half*

**Reference:** Razavi §5.3 · Quiz 1 · **Lectures:** [[Lec 01]] · [[Lec 02]]

**Needs first:** [[U10 Differential pair]]

## Five-transistor OTA: the mirror recovers the lost half

**Why:** Your exam question is this circuit. Part (b), its gain gm1(rO2 ‖ rO4), is four marks for one line.

> [!question] Predict first: A resistor-loaded pair with a single-ended output uses only half the signal current. How much does the mirror-loaded pair deliver to the output?
> a) Half: i
> b) All of it: 2i = gm·vd
> c) None

> [!success]- Answer
> **All of it: 2i = gm·vd**. M4 copies M1’s +i and pushes it into the output, while M2 pulls −i out. Both add at the output node: 2i = gm·vd.

Replace the drain resistors by a PMOS **current mirror**: M3 is a diode, M4 copies it.

Follow a small $v_d$: M1 gains $+i$ and M2 loses $i$, with $i = g_m v_d/2$. M1’s $+i$ flows through diode M3, and M4 **copies** it: $+i$ pushed into the output. M2 **pulls** $i$ less out of the output, which is the same as another $+i$ in. Total: $2i = g_m v_d$.

So $G_m$ $= g_{m1}$: the full pair’s transconductance, single-ended. The output node sees M2 looking down ($r_{O2}$) and M4 looking up ($r_{O4}$):
$A_v = g_{m1}(r_{O2} \parallel r_{O4})$.

**The rule**

$$G_m = g_{m1}$$

$$R_{out} = r_{O2}\parallel r_{O4}$$

$$A_v = g_{m1}\,(r_{O2}\parallel r_{O4})$$

> [!note]
> Signs: Vin2 on the output side (M2) is the inverting input; Vin1 on the diode side is non-inverting. That is why a buffer feeds Vout back to M2’s gate.

> [!important] Lock it in
> 5-T OTA: +i, copied +i, −i: the mirror adds both halves, Gm = gm1. Rout = rO2 ‖ rO4. Av = gm1(rO2 ‖ rO4).
> **Hook:** “The mirror recovers the lost half.”

## OTA CM range and swing: your exam, step by step

**Why:** Exam Q1(a) and (c): size M1 and M3 from the CM range, then find the output swing. Ten marks from two fences.

> [!question] Predict first: The exam gives Vin,CM,max = 1.45 V. Which transistor’s size does that number fix?
> a) M1
> b) M3 (the PMOS diode)
> c) M5

> [!success]- Answer
> **M3 (the PMOS diode)**. The ceiling is M1’s fence against the diode node VDD − |VGS3|. Fixing the ceiling fixes |VGS3|, hence |Vov3| and (W/L)3.

The two CM limits are the design equations, run **backwards**:

**Floor** $V_{CM,min} = V_{ov5} + V_{GS1}$: the tail M5 needs its $V_{ov5}$ (set by I1 and $(W/L)_5$), then M1 needs a full $V_{GS}$. Given the floor, that fixes $V_{ov1}$ and so $(W/L)_1$.

**Ceiling** $V_{CM,max} = V_{DD} - |V_{GS3}| + V_{thn}$: fixes $|V_{ov3}|$ and so $(W/L)_3$.

**Output swing:** the output can rise to $V_{DD} - |V_{ov4}|$ and fall to $V_{ov5} + V_{ov2}$ (with the input CM at its lowest).

**The rule**

$$V_{ov1} = V_{in,CM,min} - V_{ov5} - V_{thn}$$

$$|V_{GS3}| = V_{DD} - V_{in,CM,max} + V_{thn}$$

$$V_{out} \in [\,V_{ov5} + V_{ov2},\; V_{DD} - |V_{ov4}|\,]$$

> [!note]
> Every W/L then comes from the square law with ID = ISS/2.

> [!important] Lock it in
> Floor → Vov1 → (W/L)1. Ceiling → |VGS3| → (W/L)3. Swing from VDD − |Vov4| down to Vov5 + Vov2.
> **Hook:** “Run the fences backwards.”

## Questions you can solve after this topic

- [[Tutorial 1 Q5 – mirror-loaded pair, find the bias current]] · Tutorial 1 Q5
- [[2024 Quiz 1 Q1 – five-transistor OTA from its sizes]] · Quiz 1 2024-25 Q1 (9 marks)

## Questions that also use it

- [[Exam Q1 – five-transistor OTA (a–e)]]
- [[PS1 P1 – five-transistor OTA, full analysis]]
- [[Quiz 1 Part A – five-transistor OTA]]
- [[Quiz 1 Part B – five-transistor OTA]]
- [[Tutorial 6 Q2 – a 5-T OTA slews, then settles]]
- [[Lab 7 – turn the 5-T OTA specs into numbers]]
- [[Chat – input range of a 5-T OTA buffer on a 1 V supply]]

## Flashcards

[[Flashcards – U11]]

## Symbols

[[stage transconductance (Gm)]] · [[gate-source voltage (VGS)]]
