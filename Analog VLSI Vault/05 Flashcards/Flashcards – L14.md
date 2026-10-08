---
tags: ["flashcards"]
---
#flashcards/L14

# Flashcards – L14

Topic: [[L14 Compensation II]]

GBW of a Miller-compensated two-stage op amp?::ωu = Gm1/CC.
CC for PM = 45° / 60° (zero removed, β = 1)?::CC = (Gm1/Gm2)CL for 45°; 1.73·(Gm1/Gm2)CL for 60°.
Allen’s CC ≥ 0.22·CL rule: where does it come from?::RHP zero at 10·GB and P2 ≥ 2.2·GB for 60°; with Gm2 = 10·Gm1 that is CC ≈ 0.22·CL, the same as our tan formula with the zero kept.
Slew rate of a two-stage op amp?::ISS/CC, unless the output current source runs out: (I7 − ISS)/CL.
Where does the RHP zero of a Miller two-stage op amp come from?::CC feeds the signal forward from M6’s gate to the output, opposing the main path; they cancel at ωz = Gm2/CC.
How does Razavi make Rz track 1/Gm2 over process and temperature?::Build Rz from a triode MOSFET whose gate is biased by a replica branch, so its resistance follows the output device’s 1/gm.
Nulling resistor values?::Rz = 1/Gm2 moves the zero to ∞; Rz = (CL + CC)/(Gm2CC) puts it on P2 in the LHP.
