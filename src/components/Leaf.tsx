import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CONFIG} from '../config';
import {EASE_IN_OUT, EASE_OUT, sp, tw, useT} from '../lib/motion';

/**
 * La feuille Frescy. Seul élément organique de la marque.
 * Dessinée dans une boîte 100×100, pointe en haut à droite, queue en bas à gauche.
 */
export const LEAF_PATH = 'M14 86 C 10 46, 38 12, 92 8 C 92 58, 62 90, 14 86 Z';
export const LEAF_VEIN = 'M14 86 C 34 66, 56 42, 80 20';

export const Leaf: React.FC<{size: number; color?: string; vein?: string; style?: React.CSSProperties}> = ({
  size,
  color = C.blue,
  vein = C.paper,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', ...style}}>
    <path d="M14 86 L4 96" stroke={color} strokeWidth={7} strokeLinecap="round" />
    <path d={LEAF_PATH} fill={color} />
    <path d={LEAF_VEIN} stroke={vein} strokeWidth={4.5} fill="none" strokeLinecap="round" />
  </svg>
);

/**
 * Logo "Frescy" + feuille posée sur le y.
 * `leafAt` : tick où la feuille se plante (arrivée en arc + petit rebond). undefined = déjà posée.
 */
export const Logo: React.FC<{
  size: number;
  color?: string;
  leafColor?: string;
  veinColor?: string;
  lettersAt?: number;
  leafAt?: number;
  style?: React.CSSProperties;
}> = ({size, color = C.ink, leafColor, veinColor, lettersAt, leafAt, style}) => {
  const t = useT();
  const letters = CONFIG.brand.name.split('');
  const lc = leafColor ?? (color === C.white ? C.white : C.blue);
  const vc = veinColor ?? (color === C.white ? C.blue : C.paper);
  // feuille : vol en arc puis plantée
  const leafP = leafAt === undefined ? 1 : tw(t, [leafAt - 12, leafAt], [0, 1], EASE_IN_OUT);
  const land = leafAt === undefined ? 1 : sp(t, leafAt, {stiffness: 420, damping: 13});
  const fx = (1 - leafP) * size * 2.6;
  const fy = -(1 - leafP) * size * 2.2 - Math.sin(leafP * Math.PI) * size * 0.6;
  const frot = (1 - leafP) * -220;
  const squash = leafAt === undefined ? 1 : 1 + (1 - land) * 0.35 * (t >= leafAt ? 1 : 0);
  const showLeaf = leafAt === undefined || t >= leafAt - 12;
  return (
    <div style={{position: 'relative', display: 'inline-block', ...style}}>
      <div style={{display: 'flex', fontFamily: CONFIG.fonts.ui, fontWeight: 800, fontSize: size, letterSpacing: '-0.055em', color, lineHeight: 1}}>
        {letters.map((ch, i) => {
          const p = lettersAt === undefined ? 1 : tw(t, [lettersAt + i * 2, lettersAt + i * 2 + 8], [0, 1], EASE_OUT);
          return (
            <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: '0.24em', marginBottom: '-0.24em', paddingRight: '0.06em', marginRight: '-0.06em'}}>
              <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 150}%)`}}>{ch}</span>
            </span>
          );
        })}
      </div>
      {showLeaf ? (
        <div
          style={{
            position: 'absolute',
            // ancrage : bras droit du "y"
            right: size * -0.2,
            top: size * -0.12,
            width: size * 0.42,
            height: size * 0.42,
            transform: `translate(${fx}px, ${fy}px) rotate(${frot + (1 - land) * 18}deg) scale(${1 / squash}, ${squash})`,
            transformOrigin: '4% 96%',
          }}
        >
          <Leaf size={size * 0.42} color={lc} vein={vc} />
        </div>
      ) : null}
    </div>
  );
};

/**
 * TRANSITION SIGNATURE n°1 : la feuille traverse l'écran et "essuie" la scène.
 * Enveloppe la scène entrante ; la scène sortante reste dessous.
 */
export const LeafWipe: React.FC<{
  width: number;
  height: number;
  at?: number;
  dur?: number;
  /** direction du mouvement (vecteur) */
  dir?: [number, number];
  leafColor: string;
  veinColor: string;
  children: React.ReactNode;
}> = ({width, height, at = 0, dur = 15, dir = [1, -0.75], leafColor, veinColor, children}) => {
  const t = useT();
  const len = Math.hypot(dir[0], dir[1]);
  const d = [dir[0] / len, dir[1] / len];
  const perp = [-d[1], d[0]];
  const diag = Math.hypot(width, height);
  const cx = width / 2;
  const cy = height / 2;
  const leafSize = diag * 0.44;
  const p = tw(t, [at, at + dur], [0, 1], EASE_IN_OUT);
  const travel = diag / 2 + leafSize * 0.55;
  const s = -travel + p * travel * 2;
  const c = [cx + d[0] * s, cy + d[1] * s];
  const L = 6000;
  // demi-plan "derrière" la feuille = scène révélée. Bord légèrement en retrait sous la feuille.
  const back = 40;
  const e = [c[0] - d[0] * back, c[1] - d[1] * back];
  const poly = [
    [e[0] + perp[0] * L, e[1] + perp[1] * L],
    [e[0] + perp[0] * L - d[0] * L, e[1] + perp[1] * L - d[1] * L],
    [e[0] - perp[0] * L - d[0] * L, e[1] - perp[1] * L - d[1] * L],
    [e[0] - perp[0] * L, e[1] - perp[1] * L],
  ]
    .map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`)
    .join(', ');
  const done = p >= 1;
  const angle = (Math.atan2(d[1], d[0]) * 180) / Math.PI;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: done ? undefined : `polygon(${poly})`}}>{children}</AbsoluteFill>
      {!done && t >= at ? (
        <div
          style={{
            position: 'absolute',
            left: c[0] - leafSize / 2,
            top: c[1] - leafSize / 2,
            width: leafSize,
            height: leafSize,
            // feuille couchée le long du bord d'essuyage, légère rotation pendant le vol
            transform: `rotate(${angle + 135 + (p - 0.5) * 24}deg)`,
          }}
        >
          <Leaf size={leafSize} color={leafColor} vein={veinColor} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
