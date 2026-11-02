import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../config';
import {EASE_IN_OUT, tw, useT} from '../lib/motion';
import {Zigzag} from './Receipt';

/**
 * TRANSITION SIGNATURE n°3 : un long ticket de caisse monte et sert de rideau.
 * Couvre entièrement le cadre autour de `cover` (tick local).
 */
export const TicketCurtain: React.FC<{width: number; height: number; dur?: number}> = ({width, height, dur = 22}) => {
  const t = useT();
  const len = height * 1.95;
  const p = tw(t, [0, dur], [0, 1], EASE_IN_OUT);
  const top = height + 40 - p * (height + len + 120);
  const w = width * 1.22;
  const rows = Math.floor(len / 64);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: (width - w) / 2, top, width: w, transform: 'rotate(-3deg)', filter: 'drop-shadow(0 -10px 24px rgba(14,26,58,0.18))'}}>
        <Zigzag width={w} flip={false} tooth={30} />
        <div style={{height: len, background: C.white, padding: '40px 160px', overflow: 'hidden'}}>
          {Array.from({length: rows}).map((_, i) => (
            <div key={i} style={{display: 'flex', gap: 24, height: 64, alignItems: 'center', opacity: 0.12}}>
              <div style={{height: 16, width: `${30 + ((i * 37) % 40)}%`, background: C.ink, borderRadius: 3}} />
              <div style={{flex: 1, borderBottom: `4px dotted ${C.ink}`}} />
              <div style={{height: 16, width: 90, background: C.ink, borderRadius: 3}} />
            </div>
          ))}
        </div>
        <Zigzag width={w} flip tooth={30} />
      </div>
    </AbsoluteFill>
  );
};
