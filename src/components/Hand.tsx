import React from 'react';
import {C} from '../config';
import {EASE_IN_OUT, EASE_OUT, tw, useT} from '../lib/motion';
import {caveat, useWobble} from './Base';

/**
 * Annotation Caveat qui "s'écrit" : révélation gauche → droite au rythme d'un feutre,
 * ligne après ligne, avec un trait qui tremble (boiling line).
 */
export const HandText: React.FC<{
  lines: readonly string[];
  at: number;
  /** ticks par caractère */
  speed?: number;
  size?: number;
  color?: string;
  rotate?: number;
  style?: React.CSSProperties;
  lineGap?: number;
  after?: React.ReactNode;
}> = ({lines, at, speed = 0.9, size = 64, color = C.blue, rotate = -4, style, lineGap = 0, after}) => {
  const t = useT();
  const filter = useWobble();
  let cursor = at;
  return (
    <div style={{transform: `rotate(${rotate}deg)`, transformOrigin: '0 0', filter, ...style}}>
      {lines.map((l, i) => {
        const start = cursor;
        const dur = Math.max(4, l.length * speed);
        cursor += dur + 2;
        const p = tw(t, [start, start + dur], [0, 1], (x) => x);
        // petit à-coup de feutre : on avance par paliers de caractère
        const chars = Math.ceil(p * l.length);
        const pct = l.length ? (chars / l.length) * 100 : 0;
        return (
          <div
            key={i}
            style={{
              ...caveat(size, color),
              whiteSpace: 'nowrap',
              marginTop: i ? lineGap : 0,
              marginLeft: i * size * 0.1,
              clipPath: `inset(-30% ${100 - pct}% -30% -5%)`,
              visibility: t >= start ? 'visible' : 'hidden',
            }}
          >
            {l}
          </div>
        );
      })}
      {after}
    </div>
  );
};

/** Durée totale d'écriture d'un HandText (pour enchaîner une flèche après) */
export const handDuration = (lines: readonly string[], speed = 0.9) =>
  lines.reduce((acc, l) => acc + Math.max(4, l.length * speed) + 2, 0);

/**
 * Trait à la main (SVG) qui se dessine : stroke-dashoffset sur pathLength=1.
 * `retractAt` : le trait se "dé-dessine" (part de la fin).
 */
export const HandPath: React.FC<{
  d: string;
  at: number;
  dur?: number;
  width?: number;
  color?: string;
  viewBox: string;
  w: number;
  h: number;
  style?: React.CSSProperties;
  retractAt?: number;
  retractDur?: number;
  arrowHead?: string;
}> = ({d, at, dur = 8, width = 7, color = C.blue, viewBox, w, h, style, retractAt, retractDur = 6, arrowHead}) => {
  const t = useT();
  const filter = useWobble();
  const p = tw(t, [at, at + dur], [0, 1], EASE_IN_OUT);
  const r = retractAt !== undefined ? tw(t, [retractAt, retractAt + retractDur], [0, 1], EASE_OUT) : 0;
  const headP = arrowHead ? tw(t, [at + dur - 1, at + dur + 3], [0, 1], EASE_OUT) : 0;
  // trait vide (pas encore dessiné / entièrement effacé) : rien, sinon le bout arrondi laisse un point
  if (t < at || p - r <= 0.002 || (r > 0 && p - r < 0.06)) return null;
  return (
    <svg width={w} height={h} viewBox={viewBox} style={{position: 'absolute', overflow: 'visible', filter, ...style}}>
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${Math.max(0, p - r)} 2`}
        strokeDashoffset={-r}
      />
      {arrowHead && r === 0 ? (
        <path
          d={arrowHead}
          pathLength={1}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${headP} 2`}
        />
      ) : null}
    </svg>
  );
};

/** Petits yeux griffonnés (remplace l'emoji 👀, rendu identique partout) */
export const EyesDoodle: React.FC<{at: number; size?: number; style?: React.CSSProperties}> = ({at, size = 90, style}) => {
  const t = useT();
  const filter = useWobble();
  const s = tw(t, [at, at + 6], [0, 1], EASE_OUT);
  const look = tw(t, [at + 8, at + 12], [0, 1], EASE_OUT);
  if (t < at) return null;
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 100 62" style={{filter, transform: `scale(${s})`, ...style}}>
      {[27, 73].map((cx, i) => (
        <g key={cx}>
          <ellipse cx={cx} cy={31} rx={21} ry={26} fill={C.white} stroke={C.blue} strokeWidth={5} transform={`rotate(${i ? 6 : -6} ${cx} 31)`} />
          <circle cx={cx - 3 + look * 9} cy={36 - look * 2} r={9} fill={C.ink} />
          <circle cx={cx - 6 + look * 9} cy={32 - look * 2} r={2.6} fill={C.white} />
        </g>
      ))}
    </svg>
  );
};
