import React from 'react';
import {C} from '../config';
import {EASE_OUT, noise, tw, useT} from '../lib/motion';
import {inter} from './Base';
import {useIsNet} from '../lib/style';

export type ReceiptRow =
  | {kind: 'header'; node: React.ReactNode; h: number}
  | {kind: 'line'; label: React.ReactNode; value: React.ReactNode; h: number; bold?: boolean; size?: number}
  | {kind: 'sep'; h: number; dashed?: boolean}
  | {kind: 'node'; node: React.ReactNode; h: number};

/** Bord dentelé (déchiré) du ticket */
export const Zigzag: React.FC<{width: number; color?: string; flip?: boolean; tooth?: number}> = ({
  width,
  color = C.white,
  flip,
  tooth = 22,
}) => {
  const n = Math.ceil(width / tooth);
  let d = `M0 ${flip ? 0 : 14} `;
  for (let i = 0; i < n; i++) {
    const x0 = i * tooth;
    d += `L${x0 + tooth / 2} ${flip ? 14 : 0} L${Math.min(width, x0 + tooth)} ${flip ? 0 : 14} `;
  }
  d += flip ? `L${width} 0 Z` : `L${width} 14 L0 14 Z`;
  return (
    <svg width={width} height={14} viewBox={`0 0 ${width} 14`} style={{display: 'block'}}>
      <path d={d} fill={color} />
    </svg>
  );
};

/**
 * Ticket de caisse qui s'imprime ligne par ligne.
 * La fente de l'imprimante est EN BAS : le papier monte, la dernière ligne imprimée
 * est toujours collée à la fente (comme une vraie imprimante thermique).
 *
 * rows[i] s'imprime au tick printAt[i]. Le papier avance par à-coups.
 */
export const Receipt: React.FC<{
  width: number;
  rows: ReceiptRow[];
  printAt: number[];
  /** position de la fente (bas du ticket), en px dans le parent */
  slotX: number;
  slotY: number;
  rotate?: number;
  showSlot?: boolean;
  padding?: number;
}> = ({width, rows, printAt, slotX, slotY, rotate = 0, showSlot = true, padding = 40}) => {
  const t = useT();
  const net = useIsNet();
  // hauteur imprimée
  let h = 14; // bord dentelé du haut
  let printing = false;
  rows.forEach((r, i) => {
    const p = tw(t, [printAt[i], printAt[i] + 4], [0, 1], EASE_OUT);
    if (p > 0 && p < 1) printing = true;
    h += r.h * p;
  });
  h += 18; // marge basse sous la dernière ligne
  const vib = printing && !net ? (noise(Math.floor(t)) - 0.5) * 2 : 0;
  const started = t >= printAt[0];

  return (
    <div style={{position: 'absolute', left: slotX - width / 2, top: slotY, width, transform: `rotate(${rotate}deg)`, transformOrigin: '50% 0%'}}>
      {/* papier */}
      {started ? (
        <div
          style={{
            position: 'absolute',
            left: vib,
            bottom: 0,
            width,
            height: h,
            overflow: 'hidden',
            filter: 'drop-shadow(0 18px 22px rgba(14,26,58,0.16)) drop-shadow(0 3px 4px rgba(14,26,58,0.12))',
          }}
        >
          <div style={{position: 'absolute', top: 0, left: 0, width}}>
            <Zigzag width={width} flip={false} />
            <div style={{background: C.white, padding: `6px ${padding}px 18px`}}>
              {rows.map((r, i) => {
                const vis = t >= printAt[i];
                const common: React.CSSProperties = {height: r.h, visibility: vis ? 'visible' : 'hidden', display: 'flex', alignItems: 'center'};
                if (r.kind === 'sep')
                  return (
                    <div key={i} style={common}>
                      <div style={{width: '100%', borderTop: `3px ${r.dashed === false ? 'solid' : 'dashed'} ${C.ink}`, opacity: 0.85}} />
                    </div>
                  );
                if (r.kind === 'header' || r.kind === 'node')
                  return (
                    <div key={i} style={{...common, justifyContent: 'center'}}>
                      {r.node}
                    </div>
                  );
                const size = r.size ?? 30;
                return (
                  <div key={i} style={{...common, gap: 10}}>
                    <span style={{...inter(size, r.bold ? 800 : 600), whiteSpace: 'nowrap'}}>{r.label}</span>
                    <span style={{flex: 1, borderBottom: `3px dotted ${C.ink}`, opacity: 0.45, transform: `translateY(${size * 0.32}px)`}} />
                    <span style={{...inter(size, r.bold ? 800 : 700), whiteSpace: 'nowrap', fontFeatureSettings: '"tnum" 1'}}>{r.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
      {/* fente de l'imprimante */}
      {showSlot ? (
        <div
          style={{
            position: 'absolute',
            left: -34,
            top: -12,
            width: width + 68,
            height: 30,
            borderRadius: 15,
            background: C.ink,
            boxShadow: 'inset 0 -6px 0 rgba(255,255,255,0.08)',
          }}
        />
      ) : null}
    </div>
  );
};

/** Hauteur totale d'un ticket entièrement imprimé */
export const receiptHeight = (rows: ReceiptRow[]) => rows.reduce((a, r) => a + r.h, 0) + 14 + 6 + 18 + 18;
