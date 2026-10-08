import type { Generator } from '../schema';
import { FOUNDATION_GENERATORS } from './foundations';
import { SINGLE_STAGE_GENERATORS } from './single';
import { DIFF_GENERATORS } from './diff';
import { HANDOUT_GENERATORS } from './handout';
import { STABILITY_GENERATORS } from './stability';
import { DIGITAL_GENERATORS } from './digital';

export const ALL_GENERATORS: Generator[] = [...FOUNDATION_GENERATORS, ...SINGLE_STAGE_GENERATORS, ...DIFF_GENERATORS, ...HANDOUT_GENERATORS, ...STABILITY_GENERATORS, ...DIGITAL_GENERATORS];
