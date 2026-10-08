/** Small line icons drawn for this app (24×24, currentColor). */
type P = { size?: number };
const base = (size = 22) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

/** Path: a route of stations. */
export const IconPath = ({ size }: P) => (
  <svg {...base(size)}>
    <circle cx="5" cy="18" r="2" />
    <circle cx="12" cy="7" r="2" />
    <circle cx="19" cy="16" r="2" />
    <path d="M6.3 16.4 10.7 8.6M13.4 8.4l4.3 6" />
  </svg>
);
/** Learn: an open notebook. */
export const IconLearn = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M3 5.5c3-1.3 6-1.3 9 .5 3-1.8 6-1.8 9-.5V19c-3-1.3-6-1.3-9 .5-3-1.8-6-1.8-9-.5z" />
    <path d="M12 6v13.5" />
  </svg>
);
/** Labs: an oscilloscope trace. */
export const IconLab = ({ size }: P) => (
  <svg {...base(size)}>
    <rect x="3" y="4" width="18" height="14" rx="2.5" />
    <path d="M6 13h2.5l1.5-4 2.5 7 1.5-3H18" />
    <path d="M8 21h8" />
  </svg>
);
/** Practice: a pencil. */
export const IconPractice = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />
    <path d="m13.5 6.5 4 4" />
  </svg>
);
/** Review: stacked cards. */
export const IconReview = ({ size }: P) => (
  <svg {...base(size)}>
    <rect x="3" y="7" width="14" height="12" rx="2" />
    <path d="M7 4h12a2 2 0 0 1 2 2v10" />
  </svg>
);
export const IconSettings = ({ size }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3" />
  </svg>
);
export const IconArrowRight = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconArrowLeft = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const IconCheck = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const IconLock = ({ size }: P) => (
  <svg {...base(size)}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);
export const IconBolt = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M13 3 5 13.5h6L10 21l8-10.5h-6z" />
  </svg>
);
export const IconBulb = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
  </svg>
);
export const IconDice = ({ size }: P) => (
  <svg {...base(size)}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <circle cx="9" cy="9" r="1" fill="currentColor" />
    <circle cx="15" cy="15" r="1" fill="currentColor" />
    <circle cx="15" cy="9" r="1" fill="currentColor" />
    <circle cx="9" cy="15" r="1" fill="currentColor" />
  </svg>
);

/** Icons for the eight lesson steps, in template order. */
export const STEP_ICONS = [
  // why
  ({ size }: P) => (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.3a2.6 2.6 0 1 1 3.6 2.4c-.7.3-1.1.9-1.1 1.6v.4M12 17h.01" />
    </svg>
  ),
  // picture
  ({ size }: P) => (
    <svg {...base(size)}>
      <path d="M3 17h4l2-8 4 10 2-6h6" />
    </svg>
  ),
  // predict
  ({ size }: P) => (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  ),
  IconBulb,
  // rule
  ({ size }: P) => (
    <svg {...base(size)}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 10h8M8 14h5" />
    </svg>
  ),
  // worked
  ({ size }: P) => (
    <svg {...base(size)}>
      <path d="M5 6h14M5 12h14M5 18h9" />
      <path d="m17 17 1.5 1.5L21 16" />
    </svg>
  ),
  IconPractice,
  // lock in
  ({ size }: P) => (
    <svg {...base(size)}>
      <path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z" />
      <path d="m8.5 12 2.5 2.5 4.5-4.5" />
    </svg>
  ),
];

/** Notes: a handwritten page. */
export const IconNotes = ({ size }: P) => (
  <svg {...base(size)}>
    <path d="M6 3h9l4 4v14H6z" />
    <path d="M15 3v4h4M9 11c1.5-1 3 1 4.5 0s2-.5 2.5 0M9 15c1.5-1 3 1 4.5 0" />
  </svg>
);
/** Sprint: a stopwatch. */
export const IconSprint = ({ size }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="13.5" r="7.5" />
    <path d="M12 13.5V9.5M10 2.5h4M18.5 6.5l1.5-1.5" />
  </svg>
);
/** Calculator. */
export const IconCalc = ({ size }: P) => (
  <svg {...base(size)}>
    <rect x="5" y="2.5" width="14" height="19" rx="2" />
    <path d="M8 6.5h8v3H8zM8.5 13h.01M12 13h.01M15.5 13h.01M8.5 17h.01M12 17h.01M15.5 17h.01" />
  </svg>
);
