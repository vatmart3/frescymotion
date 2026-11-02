import React from 'react';
import {C} from '../config';
import {EASE_IN, EASE_OUT, tw, useT} from '../lib/motion';
import {anton} from './Base';

export type WordStyle = {color?: string; box?: string; boxText?: string};

/**
 * Texte cinétique Anton : chaque mot est révélé PAR MASQUE, du bas vers le haut,
 * un par un. Jamais de fondu.
 *
 * lines : [["COMBIEN"], ["T'AS","JETÉ"]]  → 2 lignes
 * at    : tick d'apparition de chaque mot (aplati, dans l'ordre) OU un nombre (début) + `stagger`.
 */
export const KineticLines: React.FC<{
  lines: readonly (readonly string[])[];
  at: number | number[];
  stagger?: number;
  size: number;
  color?: string;
  lineHeight?: number;
  /** style par mot (clé = mot exact) */
  styles?: Record<string, WordStyle>;
  /** tick de sortie (les mots repartent par le haut, ease-in) */
  exitAt?: number;
  align?: 'left' | 'right' | 'center';
  dur?: number;
  wordGap?: number;
  renderWord?: (word: string, idx: number) => React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  lines,
  at,
  stagger = 5,
  size,
  color = C.ink,
  lineHeight = 0.9,
  styles = {},
  exitAt,
  align = 'left',
  dur = 9,
  wordGap = 0.22,
  renderWord,
  style,
}) => {
  const t = useT();
  let k = -1;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center', ...style}}>
      {lines.map((line, li) => (
        <div key={li} style={{display: 'flex', gap: `0 ${wordGap}em`, fontSize: size, height: size * lineHeight, alignItems: 'flex-end'}}>
          {line.map((w) => {
            k += 1;
            const start = Array.isArray(at) ? at[k] ?? at[at.length - 1] + stagger * (k - at.length + 1) : at + k * stagger;
            const p = tw(t, [start, start + dur], [0, 1], EASE_OUT);
            const out = exitAt !== undefined ? tw(t, [exitAt + k * 1.2, exitAt + k * 1.2 + 6], [0, 1], EASE_IN) : 0;
            const y = (1 - p) * 135 - out * 150;
            const rot = (1 - p) * 4;
            const ws = styles[w] ?? {};
            const visible = t >= start;
            return (
              <span
                key={k}
                style={{
                  // masque : on laisse de la marge en haut pour les accents (É, À…)
                  display: 'inline-block',
                  // le masque s'ouvre une fois le mot posé (pour la feuille qui se pose dessus)
                  overflow: p >= 1 && out === 0 ? 'visible' : 'hidden',
                  paddingTop: size * 0.34,
                  marginTop: -size * 0.34,
                  paddingRight: size * 0.04,
                  marginRight: -size * 0.04,
                  paddingBottom: size * 0.1,
                  marginBottom: -size * 0.1,
                  lineHeight: lineHeight,
                  visibility: visible ? 'visible' : 'hidden',
                }}
              >
                <span
                  style={{
                    ...anton(size, ws.color ?? color),
                    lineHeight: lineHeight,
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    transform: `translateY(${y}%) rotate(${rot}deg)`,
                    transformOrigin: '0% 100%',
                    ...(ws.box
                      ? {background: ws.box, color: ws.boxText ?? C.white, padding: `0.06em 0.12em 0 0.12em`, marginLeft: '-0.06em'}
                      : {}),
                  }}
                >
                  {renderWord ? renderWord(w, k) : w}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
