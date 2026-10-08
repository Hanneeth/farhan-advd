/**
 * Figures for fixed-bank problems written before every problem carried one. Each entry reuses a figure the
 * app already draws for the same circuit. Applied only when the problem has no figure of its own.
 */
import { ps1P6, SET_A, SET_B, type Process } from '../physics';
import type { FigureSpec } from './schema';

const P6 = ps1P6();
const WL11 = (2 * 0.75e-3) / (SET_A.kpp * 0.4 * 0.4);
/** The chat's 1 V example: |Vth| = 0.3 V, every overdrive 0.1 V (ISS = 100 µA → sizes below). */
const ONE_VOLT: Process = { name: '1 V example', kpn: 200e-6, kpp: 100e-6, vthn: 0.3, vthp: 0.3, lambdan: 0.1, lambdap: 0.1, vdd: 1 };

export const BANK_FIGURES: Record<string, FigureSpec> = {
  'bank-t3q3': { kind: 'twoStageTele' },
  'bank-ex92': { kind: 'nonInverting', props: { r1: 9e3, r2: 1e3 } },
  'bank-ex98': {
    kind: 'folded',
    props: { proc: SET_A, iss: 0.75e-3, i: 0.375e-3, wl1: P6.m1.wl, wl3: P6.m3.wl, wl5: P6.m5.wl, wl7: P6.m7.wl, wl9: P6.m9.wl, wl11: WL11, vinCm: 0.6, vout: 1.5 },
  },
  'bank-ps1p10': { kind: 'step', props: { vstep: 1, tau: 20e-9 / Math.log(1000), eps: 0.001 } },
  'bank-lab1': { kind: 'rcLadder', props: { stages: [{ r: 1e3, c: 1e-12 }] } },
  'bank-lab2': { kind: 'nmosRd', props: { vdd: 1.8, labelOnly: true, showVin: true } },
  'bank-lab3': { kind: 'cascode', props: { load: 'current', proc: SET_B, id: 100e-6, wl: 20, vb1: 1.0, vout: 1.1, rd: 7e3 } },
  'bank-lab5': { kind: 'mirror', props: { iref: 20e-6, wlRef: 10, wlOut: 20, iout: 40e-6 } },
  'bank-lab7': { kind: 'fiveT', props: { proc: SET_B, iss: 200e-6, wl12: 20, wl34: 40, wlTail: 40, vinCm: 0.9 } },
  'bank-lab4': { kind: 'pmosFollower' },
  'bank-lab6': { kind: 'pmosPairRd' },
  'bank-lab8': { kind: 'capNonInv' },
  'bank-lab9': { kind: 'twoStageMiller' },
  'bank-chat-cm94': { kind: 'fiveT', props: { proc: ONE_VOLT, iss: 100e-6, wl12: 50, wl34: 100, wlTail: 100, vinCm: 0.7, buffer: true } },
};
