import React from 'react';
import {C} from '../config';
import {EASE_IN, EASE_OUT, SPRING_UI, sp, tw, useT} from '../lib/motion';
import {inter} from './Base';

/**
 * Intertitre numéroté (version B) : filet bleu qui se trace, puis le libellé monte par masque.
 * « 02 — SCAN »
 */
export const SectionLabel: React.FC<{text: string; at: number; outAt?: number; x?: number; y?: number; color?: string}> = ({
  text,
  at,
  outAt,
  x = 80,
  y = 236,
  color = C.blue,
}) => {
  const t = useT();
  if (t < at) return null;
  const rule = tw(t, [at, at + 7], [0, 1], EASE_OUT);
  const txt = tw(t, [at + 3, at + 11], [0, 1], EASE_OUT);
  const out = outAt !== undefined ? tw(t, [outAt, outAt + 5], [0, 1], EASE_IN) : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 16, height: 34}}>
      <div style={{width: 46, height: 4, background: color, transform: `scaleX(${rule * (1 - out)})`, transformOrigin: '0 50%'}} />
      <div style={{overflow: 'hidden', height: 34, display: 'flex', alignItems: 'center'}}>
        <span style={{...inter(25, 700, color), letterSpacing: '0.16em', display: 'inline-block', transform: `translateY(${(1 - txt) * 120 - out * 120}%)`, whiteSpace: 'nowrap'}}>
          {text}
        </span>
      </div>
    </div>
  );
};

/**
 * Pastille d'annotation nette (version B) : point d'ancrage sur l'élément visé,
 * filet horizontal qui se trace jusqu'à la marge, étiquette qui sort par masque.
 * `text` accepte des retours à la ligne (\n).
 */
export const Callout: React.FC<{
  text: string;
  at: number;
  outAt?: number;
  /** point visé (px dans le cadre) */
  dot: [number, number];
  /** bord gauche de l'étiquette (px) — l'étiquette est centrée verticalement sur le point */
  chipLeft: number;
  /** largeur max de l'étiquette */
  maxWidth?: number;
}> = ({text, at, outAt, dot, chipLeft, maxWidth = 240}) => {
  const t = useT();
  if (t < at || (outAt !== undefined && t > outAt + 7)) return null;
  const dotP = sp(t, at, {stiffness: 520, damping: 22});
  const line = tw(t, [at + 2, at + 8], [0, 1], EASE_OUT);
  const lab = sp(t, at + 6, SPRING_UI);
  const out = outAt !== undefined ? tw(t, [outAt, outAt + 6], [0, 1], EASE_IN) : 0;
  const [dx, dy] = dot;
  const len = Math.max(0, chipLeft - dx);
  const lines = text.split('\n');
  const h = 26 + lines.length * 38;
  return (
    <>
      <div style={{position: 'absolute', left: dx, top: dy - 2, width: len * line * (1 - out), height: 4, background: C.blue}} />
      <div
        style={{
          position: 'absolute',
          left: dx - 12,
          top: dy - 12,
          width: 24,
          height: 24,
          borderRadius: 12,
          background: C.white,
          border: `6px solid ${C.blue}`,
          boxSizing: 'border-box',
          transform: `scale(${dotP * (1 - out)})`,
        }}
      />
      <div style={{position: 'absolute', left: chipLeft, top: dy - h / 2, maxWidth, height: h, overflow: 'hidden', borderRadius: 20}}>
        <div
          style={{
            ...inter(30, 700, C.white),
            lineHeight: '38px',
            height: h,
            padding: '13px 22px',
            boxSizing: 'border-box',
            background: C.blue,
            borderRadius: 20,
            whiteSpace: 'nowrap',
            transform: `translateX(${(-1 + Math.min(1, lab)) * 105 - out * 105}%)`,
          }}
        >
          {lines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>
    </>
  );
};
