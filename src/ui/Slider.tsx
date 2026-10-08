import { useId } from 'react';

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const id = useId();
  return (
    <div className="slider">
      <label htmlFor={id}>
        <span>{label}</span>
        <output htmlFor={id} className="mono">
          {format ? format(value) : value}
        </output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

/** A labelled number readout, e.g. ID = 90 µA. */
export function Readout({ label, value, tone }: { label: React.ReactNode; value: string; tone?: 'ok' | 'bad' | 'signal' }) {
  return (
    <div className={`readout ${tone ?? ''}`}>
      <span className="readout-label">{label}</span>
      <span className="readout-value mono">{value}</span>
    </div>
  );
}
