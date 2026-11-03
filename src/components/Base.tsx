import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CONFIG} from '../config';
import {boilSeed, useT} from '../lib/motion';
import {useIsNet} from '../lib/style';

/**
 * Filtres SVG partagés : "wobble" pour les traits à la main (4 graines → boiling line).
 * À poser une seule fois par composition.
 */
export const Defs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
    <defs>
      {[0, 1, 2, 3].map((s) => (
        <filter key={s} id={`wobble-${s}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={s * 7 + 3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={3.2} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      ))}
    </defs>
  </svg>
);

/** Classe CSS filter pour un trait "qui tremble" */
export const useWobble = () => {
  const t = useT();
  const net = useIsNet();
  return net ? 'none' : `url(#wobble-${boilSeed(t)})`;
};

/** Grain papier très léger, en multiply, au-dessus de tout. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = CONFIG.grain}) => {
  const t = useT();
  const seed = Math.floor(t / 3) % 4;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'multiply', opacity}}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={seed * 13 + 1} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Fond papier (couleur + légère fibre) */
export const Paper: React.FC<{color?: string; children?: React.ReactNode; style?: React.CSSProperties}> = ({
  color = C.paper,
  children,
  style,
}) => <AbsoluteFill style={{background: color, ...style}}>{children}</AbsoluteFill>;

/** Overlay de contrôle des zones de sécurité TikTok/Reels (activable dans le Studio) */
export const SafeZones: React.FC<{top: number; bottom: number; right: number}> = ({top, bottom, right}) => {
  const z: React.CSSProperties = {position: 'absolute', background: 'rgba(200,50,31,0.28)', border: '2px dashed #C8321F'};
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{...z, left: 0, right: 0, top: 0, height: top}} />
      <div style={{...z, left: 0, right: 0, bottom: 0, height: bottom}} />
      <div style={{...z, right: 0, top: top, bottom: bottom, width: right}} />
    </AbsoluteFill>
  );
};

/** Typo helpers */
export const anton = (size: number, color: string = C.ink): React.CSSProperties => ({
  fontFamily: CONFIG.fonts.title,
  fontSize: size,
  lineHeight: 0.92,
  color,
  textTransform: 'uppercase',
  letterSpacing: '-0.005em',
  fontWeight: 400,
});

export const inter = (size: number, weight: 500 | 600 | 700 | 800 = 600, color: string = C.ink): React.CSSProperties => ({
  fontFamily: CONFIG.fonts.ui,
  fontSize: size,
  fontWeight: weight,
  color,
  letterSpacing: '-0.01em',
  fontFeatureSettings: '"cv11" 1',
});

export const caveat = (size: number, color: string = C.blue): React.CSSProperties => ({
  fontFamily: CONFIG.fonts.hand,
  fontSize: size,
  fontWeight: 700,
  color,
  lineHeight: 0.95,
});
