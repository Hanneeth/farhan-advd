---
tags: ["flashcards"]
---
#flashcards/L2

# Flashcards – L2

Topic: [[L2 One-stage op amps]]

Telescopic gain and differential swing?::gm1(gm3rO3rO1 ‖ gm5rO5rO7); 2[VDD − (VISS + Vov1 + Vov3 + |Vov5| + |Vov7|)].
Lec 3: how does a closed-loop op amp look to a load RL?::Like a source Vin·Aclosed behind Rout,closed = Rout,open/(1 + βAopen). For the 5-T OTA buffer (β = 1) that is ≈ 1/gm2, so RL barely loads it; its pole moves to gm2/CL.
Output window of a telescopic in unity-gain feedback?::Vb1 − Vth4 ≤ Vout ≤ Vb1 − VGS4 + Vth2 (width Vth − Vov4).
Ex 9.6: best output CM of a telescopic closed through capacitors?::VCM = Vb − (VGS3,4 − Vth1,2) (M1, M2 at their edge). X can then fall to Vb − Vth3,4: a swing of ±(Vth − Vov).
Why can X rise above that VCM without pushing M1, M2 into triode?::The op amp’s high gain keeps its input gates nearly still, so M1, M2’s fence does not move; only the PMOS loads limit the upswing.
