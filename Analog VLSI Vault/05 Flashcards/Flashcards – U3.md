---
tags: ["flashcards"]
---
#flashcards/U3

# Flashcards – U3

Topic: [[U3 DC recipe and PMOS]]

The four moves of Step A (DC recipe)?::Assume saturation → square law → walk the node voltages → check the fence.
WE1: VDD 1.8, VG 0.7, Vth 0.4, µnCox 200µ, W/L 10, RD 10k. ID and VD?::Vov = 0.3 V, ID = 90 µA, VD = 0.9 V ≥ 0.3 V → saturated.
PMOS overdrive with the source at VDD?::|Vov| = (VDD − VG) − |Vth|.
Analysis vs design direction?::Analysis: W/L → Vov → ID. Design: ID and Vov → W/L = 2ID/(µCox Vov²).
