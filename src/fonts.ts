import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/** Polices en local (public/fonts) : aucun appel réseau au rendu. */
const FONTS: {family: string; file: string; weight: string}[] = [
  {family: 'Anton', file: 'Anton-400.woff2', weight: '400'},
  {family: 'Inter', file: 'Inter-500.woff2', weight: '500'},
  {family: 'Inter', file: 'Inter-600.woff2', weight: '600'},
  {family: 'Inter', file: 'Inter-700.woff2', weight: '700'},
  {family: 'Inter', file: 'Inter-800.woff2', weight: '800'},
  {family: 'Caveat', file: 'Caveat-600.woff2', weight: '600'},
  {family: 'Caveat', file: 'Caveat-700.woff2', weight: '700'},
];

let loaded = false;
export const ensureFonts = () => {
  if (loaded) return;
  loaded = true;
  for (const f of FONTS) {
    loadFont({family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, format: 'woff2'});
  }
};
