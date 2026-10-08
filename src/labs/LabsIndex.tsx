import { IconBolt, IconLab } from '../ui/Icons';

const LABS = [
  { id: 'mosfet', title: 'MOSFET lab', desc: 'Channel cross-section with moving electrons, ID–VDS curves, region, gm, rO, gm·rO.', ready: true },
  { id: 'dc', title: 'DC recipe stepper', desc: 'Step A one click at a time, with the saturation check turning green or red.', ready: true },
  { id: 'impedance', title: 'Impedance explorer', desc: 'Click a terminal: ∞, rO, 1/gm, and why the device fights back.', ready: true, m: 2 },
  { id: 'cs', title: 'CS amplifier lab', desc: 'Every load, a transfer curve with a draggable Q, Gm·Rout.', ready: true, m: 2 },
  { id: 'cascode', title: 'Cascode lab', desc: 'Telescopic and folded, the bias ladder, Rout comparison.', ready: true, m: 2 },
  { id: 'folded', title: 'Folded-cascode lab', desc: 'Eleven live transistors, the current divider at the folding node, input CM below ground.', ready: true, m: 4 },
  { id: 'headroom', title: 'Headroom stack', desc: 'Stacked overdrives, VISS, diode costs: the swing left over.', ready: true, m: 3 },
  { id: 'diffpair', title: 'Differential pair lab', desc: 'Current steering, ±√2·Vov, DM and CM half circuits.', ready: true, m: 3 },
  { id: 'ota', title: 'Five-transistor OTA lab', desc: 'Signal currents through the mirror, CM range, swing, buffer.', ready: true, m: 3 },
  { id: 'feedback', title: 'Feedback, Bode and settling', desc: 'The 1/β line, the ε band, 4.6τ, slewing then settling.', ready: true, m: 3 },
  { id: 'inverter', title: 'Inverter lab', desc: 'CMOS VTC from the square law: VM, VIL, VIH, noise margins, τPHL and τPLH.', ready: true, m: 6 },
  { id: 'effort', title: 'Logical effort lab', desc: 'Size a path of gates: F = GBH, equal stage effort, D = Nf̂ + P, best N.', ready: true, m: 6 },
  { id: 'stability', title: 'Stability & compensation', desc: 'Poles, ωgx, ωpx, phase and gain margin, ringing; the two-stage op amp with CC and Rz.', ready: true, m: 5 },
];

export function LabsIndex() {
  return (
    <div className="page">
      <h1>Labs</h1>
      <p className="muted lab-intro">Play with real circuits. Drag the sliders and watch the currents, voltages and curves respond. Every number comes from the same equations you use in your tutorials.</p>
      {[
        { title: 'Analog', ids: LABS.filter((l) => !['inverter', 'effort'].includes(l.id)) },
        { title: 'Digital', ids: LABS.filter((l) => ['inverter', 'effort'].includes(l.id)) },
      ].map((grp) => (
        <section key={grp.title}>
          <h2 className="path-heading">{grp.title}</h2>
          <ul className="labs-grid">
            {grp.ids.map((l) => (
              <li key={l.id}>
                <a href={`#/labs/${l.id}`} className="lab-card card">
                  <span className="lab-icon">{l.id === 'dc' ? <IconBolt size={22} /> : <IconLab size={22} />}</span>
                  <strong>{l.title}</strong>
                  <span className="small muted">{l.desc}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
