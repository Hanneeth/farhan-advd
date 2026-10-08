---
tags: ["topic", "unit/U1", "group/foundations"]
aliases: ["The MOSFET"]
---
# U1 · The MOSFET

*Gate, channel, Vth, Vov, W/L*

**Reference:** Razavi §2.1–2.2 · **Lectures:** [[Lec 01]] · [[Lec 02]]

**Needs first:** [[U0 Circuit language]]

## The MOSFET: a tap whose handle is the gate

**Why:** Every sizing question (“find W/L”) and every headroom question starts from Vov. This lesson defines it.

> [!question] Predict first: Vth = 0.4 V. You set VGS = 0.3 V. Does a channel form?
> a) Yes, a thin one
> b) No, the device is off
> c) Only if VDS is large

> [!success]- Answer
> **No, the device is off**. Below threshold there is no channel at all: the device is OFF and ID = 0, whatever VDS is.

A MOSFET has a **source** and a **drain** (two pools of electrons), a **gate** on top, and a thin layer of glass (oxide) in between. No current can ever flow into the gate.

Put a voltage $V_{GS}$ on the gate and it pulls electrons to the surface. Past the **threshold** $V_{th}$ they join into a sheet: the **channel**. How far you go past threshold is the {{Vov|overdrive}}, $V_{ov} = V_{GS} - V_{th}$, and it sets how thick the channel is. The channel's width over length, $W/L$, is the size of the tap.

> [!tip] Picture it
> The MOSFET is a tap. The gate is the handle; Vth is the stiff first bit of the turn; Vov is how far you have opened it past that.

**The rule**

$$V_{ov} = V_{GS} - V_{th}$$

$$V_{GS} < V_{th} \Rightarrow \text{OFF},\ I_D = 0$$

$$I_G = 0\quad\text{(the gate is a capacitor plate)}$$

> [!important] Lock it in
> Gate voltage builds a channel once VGS passes Vth. Overdrive Vov = VGS − Vth sets its thickness; W/L sets its size. The gate draws no current.
> **Hook:** “Overdrive is the most important number in the course.”

## Flashcards

[[Flashcards – U1]]

## Symbols

[[gate-source voltage (VGS)]] · [[threshold voltage (Vth)]] · [[aspect ratio (WL)]]
