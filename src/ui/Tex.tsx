import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useMemo } from 'react';

/** Notation macros so content can write \Vov, \VDD etc. exactly as in the lecture notes. */
const MACROS: Record<string, string> = {
  '\\Vov': 'V_{ov}',
  '\\Vth': 'V_{th}',
  '\\VDD': 'V_{DD}',
  '\\VSS': 'V_{SS}',
  '\\VGS': 'V_{GS}',
  '\\VDS': 'V_{DS}',
  '\\ID': 'I_D',
  '\\gm': 'g_m',
  '\\rO': 'r_O',
  '\\muCox': '\\mu C_{ox}',
  '\\WL': '\\tfrac{W}{L}',
  '\\par': '\\parallel',
};

export function Tex({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: block,
        throwOnError: false,
        macros: { ...MACROS },
        strict: 'ignore',
        output: 'htmlAndMathml',
      }),
    [tex, block],
  );
  return <span className={block ? 'tex-block' : 'tex-inline'} dangerouslySetInnerHTML={{ __html: html }} />;
}
