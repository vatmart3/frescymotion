import React from 'react';
import {C} from '../config';
import {Leaf} from './Leaf';

/** Flèche → (dessinée : la police Inter "latin" ne contient pas U+2192) */
export const ArrowRight: React.FC<{size: number; color?: string; stroke?: number; style?: React.CSSProperties}> = ({
  size,
  color = C.ink,
  stroke = 2.6,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'inline-block', flexShrink: 0, ...style}}>
    <path d="M3 12 H20 M13.5 5.5 L20 12 L13.5 18.5" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Coche ✓ qui se dessine (p de 0 à 1) */
export const Check: React.FC<{size: number; color?: string; p?: number; stroke?: number; style?: React.CSSProperties}> = ({
  size,
  color = C.white,
  p = 1,
  stroke = 3.2,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'inline-block', flexShrink: 0, ...style}}>
    <path
      d="M4.5 12.5 L9.6 17.4 L19.5 6.8"
      pathLength={1}
      strokeDasharray={`${p} 2`}
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Réveil (remplace ⏰) */
export const Clock: React.FC<{size: number; color?: string; style?: React.CSSProperties}> = ({size, color = C.soon, style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'inline-block', flexShrink: 0, ...style}}>
    <circle cx={12} cy={13} r={8} fill={color} />
    <path d="M12 9 V13.4 L14.8 15" fill="none" stroke={C.white} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 6.5 L6.5 3.8 M20.5 6.5 L17.5 3.8" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    <path d="M7.5 20 L6 21.8 M16.5 20 L18 21.8" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
  </svg>
);

/** Icône d'appli Frescy (carré bleu + feuille blanche) */
export const AppIcon: React.FC<{size: number}> = ({size}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.26,
      background: C.blue,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <Leaf size={size * 0.62} color={C.white} vein={C.blue} />
  </div>
);
