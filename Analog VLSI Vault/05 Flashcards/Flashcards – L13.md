---
tags: ["flashcards"]
---
#flashcards/L13

# Flashcards – L13

Topic: [[L13 Compensation I]]

Dominant-pole compensation for PM = 45° with one fixed pole ωp2?::Put ωgx at ωp2: move the first pole to ωp2/(βA0).
Why does raising Rout not compensate an op amp?::It raises the low-frequency gain but leaves the high-frequency |βA| (and ωgx) unchanged.
Does a telescopic op amp need compensation?::Usually not: its output node (Rout·CL) is the dominant pole; internal poles sit near gm/C. CL itself compensates it.
Doubling CL: effect on a one-stage vs a two-stage op amp?::One stage: fu halves, PM rises. Two stage: fu = Gm1/CC unchanged, P2 = Gm2/CL halves, PM falls (rings).
Miller-compensated dominant pole (Lec 17)?::P1′ ≈ 1/(R1[C1 + (1 + A2)CC]) ≈ 1/(R1A2CC), A2 = Gm2R2.
Why does Miller compensation push the output pole UP?::At high f, CC shorts M6’s gate to its drain: M6 acts as a diode (≈ 1/Gm2), so the output pole becomes ≈ Gm2/C2.
