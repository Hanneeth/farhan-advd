/** Region from node voltages (magnitudes for PMOS) — the fence, as a pure function. */
import type { Region } from './device';
export function regionFromNodesPure(d: { kind: 'n' | 'p'; vg: number; vs: number; vd: number; vth: number }): Region {
  const vgs = d.kind === 'n' ? d.vg - d.vs : d.vs - d.vg;
  const vds = d.kind === 'n' ? d.vd - d.vs : d.vs - d.vd;
  const vov = vgs - d.vth;
  if (vov <= 0) return 'off';
  return vds >= vov - 1e-9 ? 'saturation' : 'triode';
}
