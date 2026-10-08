---
tags: ["flashcards"]
---
#flashcards/L10

# Flashcards – L10

Topic: [[L10 PSRR and noise]]

PSRR of a 5-T OTA?::≈ gmN(rOP‖rON), equal to its gain, because the supply reaches the output with gain ≈ 1 (the diode clamps X to VDD).
Does feedback improve PSRR?::Not much: it divides the supply gain and the signal gain by the same (1 + βA).
Total noise a resistor leaves on C?::√(kT/C): 64 µV rms for 1 pF at 300 K. R cancels (more noise per Hz, fewer Hz).
Two independent noises of 30 µV and 40 µV rms together?::√(30² + 40²) = 50 µV: they add as powers, not amplitudes.
Razavi’s quick test for which devices add noise?::Change each gate voltage a little: if the output moves, that device’s noise counts (inputs, current sources); tails and cascodes barely count.
Input noise of a 5-T OTA / telescopic?::8kTγ(1/gm1 + gm3/gm1²) (both halves add; loads divided by gm1²).
Noise vs swing trade-off?::Load gm = 2ID/Vov: a small overdrive (for swing) gives a big gm and more noise.
