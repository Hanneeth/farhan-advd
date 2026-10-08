---
tags: ["topic", "unit/U9", "group/foundations"]
aliases: ["Cascode"]
---
# U9 · Cascode

*Shielding, gm·rO², the load trap*

**Reference:** Razavi §3.6 · **Lectures:** [[Lec 01]] · [[Lec 02]]

**Needs first:** [[U8 Source follower and common gate]]

## The cascode: gm·rO², and the load trap

**Why:** Telescopic and folded-cascode op amps (L2, L4) get their gain this way. The classic exam trap is a cascode with a simple load.

> [!question] Predict first: A cascode (Rdown ≈ gm·rO²) is loaded by a simple PMOS current source (rO). The gain is about…
> a) gm·(gm·rO²), huge
> b) gm·rO, the same as a plain CS
> c) About 1

> [!success]- Answer
> **gm·rO, the same as a plain CS**. The output sees gm·rO² in parallel with rO. The smallest resistance wins, so Rout ≈ rO and the gain is barely better than a plain CS stage.

Stack a common-gate device M2 on top of the input device M1. M1 still makes the current $g_m v_{in}$; M2 passes it up. Looking **down** into M2’s drain, M1’s $r_O$ sits under M2’s source, so by “up multiplies”:
$R_{down} \approx g_{m2} r_{O2}\, r_{O1}$ — about $g_m r_O$ times bigger than one device.

**The load trap:** Rout is Rdown **in parallel with** whatever is looking up. A simple PMOS source gives only $r_O$, and the smallest wins. To keep the gain you must **cascode the load too**: then $R_{out} = R_{down} \parallel R_{up}$ and $|A_v| \approx g_m (g_m r_O^2/2)$.

Cost: each stacked device needs its own $V_{ov}$ of headroom.

**The rule**

$$R_{down} = r_{O2} + (1 + g_{m2} r_{O2}) r_{O1} \approx g_{m2} r_{O2} r_{O1}$$

$$A_v = -g_{m1}\,(R_{down} \parallel R_{up})$$

$$R_{up} = r_{O}\ (\text{simple}) \quad\text{or}\quad g_m r_O^2\ (\text{cascoded})$$

> [!note]
> The notes use R ≈ gm·rO·R; the exact form adds rO (a few % difference).

> [!important] Lock it in
> Cascode: Rdown ≈ gm·rO². The output also sees Rup; the smallest wins, so cascode the load too. Each device costs one Vov of headroom.
> **Hook:** “A cascode is only as good as its load.”

## Telescopic cascode: headroom stacking

**Why:** Razavi Ex 9.7 and Problem Set 1 P3 ask for the output swing and the bias voltages Vb1, Vb2 of exactly this circuit.

> [!question] Predict first: VDD = 3 V, VISS = 0.5 V, every NMOS Vov = 0.2 V, every PMOS |Vov| = 0.3 V. What is the lowest output?
> a) 0.5 V
> b) 0.9 V
> c) 1.4 V

> [!success]- Answer
> **0.9 V**. Climb from ground: VISS + Vov1 + Vov3 = 0.5 + 0.2 + 0.2 = 0.9 V. Each stacked device costs its own overdrive.

The fully differential **telescopic** op amp stacks five devices on each side: tail M9, input M1, NMOS cascode M3, PMOS cascode M5, PMOS source M7.

Think of a **room with a floor and a ceiling**. Each stacked transistor needs $V_{ov}$ of breathing room to stay saturated; the tail needs $V_{ISS}$. So the output can only move between
floor $= V_{ISS} + V_{ov1} + V_{ov3}$ and ceiling $= V_{DD} - |V_{ov5}| - |V_{ov7}|$.

The two outputs move in opposite directions, so the **differential** swing is twice that range. The bias voltages Vb1, Vb2 must put every device exactly at its edge to get the full range.

> [!tip] Picture it
> A room with a floor and a ceiling: every stacked transistor needs its own breathing room.

**The rule**

$$V_{out,min} = V_{ISS} + V_{ov1} + V_{ov3}$$

$$V_{out,max} = V_{DD} - |V_{ov5}| - |V_{ov7}|$$

$$V_{pp,diff} = 2\,(V_{out,max} - V_{out,min})$$

> [!note]
> Full-swing bias (Ex 9.7): Vin,CM = VISS + VGS1; Vb1 = Vin,CM − Vth + VGS3; Vb2 = VDD − |Vov7| − |VGS5|.

> [!important] Lock it in
> Telescopic: gain ≈ gm·(gm·rO² ‖ gm·rO²), but every stacked device eats one Vov. Floor VISS + 2Vov(n), ceiling VDD − 2|Vov(p)|, differential swing doubles it.
> **Hook:** “A room with a floor and a ceiling.”

## Questions you can solve after this topic

- [[Lab 5 – simple versus low-compliance cascode mirror]] · Lab 5 (hand calculations)

## Questions that also use it

- [[Lab 3 – CS versus cascode gain, bandwidth and GBW]]

## Flashcards

[[Flashcards – U9]]

## Symbols

[[intrinsic gain (gmro)]] · [[overdrive (Vov)]] · [[tail headroom (VISS)]]
