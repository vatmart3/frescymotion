import React from 'react';
import {CONFIG} from '../config';
import {EASE_IN, sp, tw, useT} from '../lib/motion';

/**
 * Tampon encreur qui s'écrase : descend vite (ease-in), écrase (squash),
 * se stabilise avec un petit ressort. Encre imparfaite (mouchetures), posé de biais.
 */
export const Stamp: React.FC<{
  id: string;
  text: string;
  color: string;
  at: number;
  rotate?: number;
  width?: number;
  height?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({id, text, color, at, rotate = -12, width = 620, height = 250, fontSize = 190, style}) => {
  const t = useT();
  if (t < at - 4) return null;
  // chute : 4 ticks avant l'impact
  const fall = tw(t, [at - 4, at], [0, 1], EASE_IN);
  const settle = sp(t, at, {stiffness: 520, damping: 16});
  const scale = t < at ? 2.4 - 1.4 * fall : 1 + (1 - settle) * -0.06;
  const opacity = t < at ? 0.12 + fall * 0.3 : 1;
  // encre : plus chargée pile à l'impact
  const inkBleed = tw(t, [at, at + 5], [1.6, 0], (x) => x);
  const m = `stamp-mask-${id}`;
  const f = `stamp-speckle-${id}`;
  const pad = 26;
  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
        <defs>
          <filter id={f} x="0" y="0" width={width} height={height} filterUnits="userSpaceOnUse">
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={2} seed={7} />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  13 0 0 0 -8.1" />
          </filter>
          <mask id={m} maskUnits="userSpaceOnUse" x={-50} y={-50} width={width + 100} height={height + 100}>
            <rect x={-50} y={-50} width={width + 100} height={height + 100} fill="white" />
            <rect x={0} y={0} width={width} height={height} filter={`url(#${f})`} />
          </mask>
        </defs>
        <g mask={`url(#${m})`}>
          <rect
            x={pad / 2}
            y={pad / 2}
            width={width - pad}
            height={height - pad}
            rx={18}
            fill="none"
            stroke={color}
            strokeWidth={13 + inkBleed}
          />
          <rect x={pad + 6} y={pad + 6} width={width - pad * 2 - 12} height={height - pad * 2 - 12} rx={8} fill="none" stroke={color} strokeWidth={5} />
          <text
            x={width / 2}
            y={height / 2 + fontSize * (/[ÉÈÊÀÂÔÙÛÎÏÇ]/.test(text) ? 0.47 : 0.36)}
            textAnchor="middle"
            fontFamily={CONFIG.fonts.title}
            fontSize={fontSize}
            fill={color}
            letterSpacing="0.02em"
            stroke={color}
            strokeWidth={inkBleed}
          >
            {text}
          </text>
        </g>
      </svg>
    </div>
  );
};
