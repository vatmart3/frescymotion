import React from 'react';
import {C} from '../config';
import {useIsNet} from '../lib/style';
import {EASE_OUT, SPRING_BOUNCY, sp, tw, useT} from '../lib/motion';
import {anton, inter} from './Base';

export const PHONE = {w: 580, h: 1210, bezel: 14, radius: 78};
export const SCREEN = {w: PHONE.w - PHONE.bezel * 2, h: PHONE.h - PHONE.bezel * 2, radius: PHONE.radius - PHONE.bezel};

/**
 * Téléphone en 2,5D : inclinaison 3D (max 12°), vraie ombre portée douce.
 * Le contenu de l'écran est passé en enfant (coordonnées SCREEN.w × SCREEN.h).
 */
export const Phone: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  children: React.ReactNode;
  bezelOpacity?: number;
}> = ({x, y, scale = 1, rotX = 0, rotY = 0, rotZ = 0, children, bezelOpacity = 1}) => {
  const net = useIsNet();
  const clamp = (v: number) => Math.max(-12, Math.min(12, v));
  return (
    <div
      style={{
        position: 'absolute',
        left: x - PHONE.w / 2,
        top: y - PHONE.h / 2,
        width: PHONE.w,
        height: PHONE.h,
        perspective: 2600,
      }}
    >
      {/* ombre portée au sol (plan arrière) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: net ? `translate(0px, ${30 * scale}px) scale(${scale * 0.96})` : `translate(${28 + rotY * 3}px, ${46}px) scale(${scale * 0.97}) rotate(${rotZ}deg)`,
          borderRadius: PHONE.radius,
          background: net ? 'rgba(20,45,140,0.16)' : 'rgba(20,45,140,0.18)',
          filter: net ? 'blur(26px)' : 'blur(40px)',
          opacity: bezelOpacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale}) rotateX(${clamp(rotX)}deg) rotateY(${clamp(rotY)}deg) rotateZ(${rotZ}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: PHONE.radius,
            background: C.blueDeep,
            opacity: bezelOpacity,
            boxShadow: `inset 0 0 0 3px ${C.blue}, inset 0 0 0 6px ${C.blueDeep}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: PHONE.bezel,
            top: PHONE.bezel,
            width: SCREEN.w,
            height: SCREEN.h,
            borderRadius: SCREEN.radius,
            overflow: 'hidden',
            background: C.paper,
          }}
        >
          {children}
          {/* île / encoche */}
          <div
            style={{
              position: 'absolute',
              left: SCREEN.w / 2 - 70,
              top: 18,
              width: 140,
              height: 40,
              borderRadius: 20,
              background: C.ink,
              opacity: bezelOpacity,
            }}
          />
        </div>
      </div>
    </div>
  );
};

/** Cercle de tap bleu qui s'étend (le "doigt") */
export const TapRing: React.FC<{x: number; y: number; at: number; color?: string}> = ({x, y, at, color = C.blue}) => {
  const t = useT();
  if (t < at - 3 || t > at + 16) return null;
  const press = tw(t, [at - 3, at], [0, 1], EASE_OUT);
  const ring = tw(t, [at, at + 14], [0, 1], EASE_OUT);
  const dotOut = tw(t, [at + 4, at + 9], [1, 0], EASE_OUT);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: -60,
          top: -60,
          width: 120,
          height: 120,
          borderRadius: 60,
          border: `6px solid ${color}`,
          transform: `scale(${0.3 + ring * 1.2})`,
          opacity: t >= at ? 1 - ring : 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -34,
          top: -34,
          width: 68,
          height: 68,
          borderRadius: 34,
          background: color,
          opacity: 0.35 * press * dotOut,
          transform: `scale(${0.6 + press * 0.4})`,
        }}
      />
    </div>
  );
};

/** Sticker papier "-20 %" : découpe blanche, aplat bleu, coin qui rebique */
export const Sticker: React.FC<{text: string; size: number; color?: string; style?: React.CSSProperties}> = ({
  text,
  size,
  color = C.blue,
  style,
}) => (
  <div style={{position: 'relative', width: size, height: size, ...style}}>
    <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <circle cx={50} cy={52.5} r={47} fill="rgba(14,26,58,0.18)" />
      <circle cx={50} cy={50} r={47} fill={C.white} />
      <circle cx={50} cy={50} r={41} fill={color} />
      <circle cx={50} cy={50} r={36} fill="none" stroke={C.white} strokeWidth={1.4} strokeDasharray="3 3" />
      {/* coin décollé */}
      <path d="M78 82 Q86 74 92 70 Q88 86 78 82 Z" fill={C.blueLight} stroke={C.white} strokeWidth={1} />
    </svg>
    <div
      style={{
        ...anton(size * (text.length > 4 ? 0.27 : 0.34), C.white),
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        paddingTop: size * 0.02,
      }}
    >
      {text}
    </div>
  </div>
);

/** Ressort de "collage" de sticker (overshoot assumé) */
export const useStickerSlap = (at: number) => {
  const t = useT();
  return sp(t, at, SPRING_BOUNCY);
};

/**
 * Compteur à chiffres qui roulent (odomètre). Progression LINÉAIRE (seule exception autorisée).
 */
export const Odometer: React.FC<{value: number; from?: number; at: number; dur: number; size: number; color?: string; font?: 'anton' | 'inter'}> = ({
  value,
  from = 0,
  at,
  dur,
  size,
  color = C.ink,
  font = 'anton',
}) => {
  const t = useT();
  const v = tw(t, [at, at + dur], [from, value], (x) => x);
  const digits = String(Math.max(value, 1)).length;
  const style = font === 'anton' ? anton(size, color) : inter(size, 800, color);
  const cols = [];
  for (let i = digits - 1; i >= 0; i--) {
    const pow = Math.pow(10, i);
    // position continue de la colonne (roule entre deux chiffres)
    const raw = v / pow;
    const base = Math.floor(raw);
    // les colonnes hautes ne roulent qu'au passage de la retenue
    const frac = i === 0 ? raw - base : Math.max(0, (v % pow) - (pow - 1));
    const pos = (base % 10) + frac;
    // zéro de tête "fantôme", comme un vrai compteur mécanique
    const ghost = i > 0 && v < pow - 1 ? 0.16 : 1;
    cols.push(
      <span key={i} style={{display: 'inline-block', height: size * 1.0, overflow: 'hidden', position: 'relative', width: '0.56em', opacity: ghost}}>
        <span style={{position: 'absolute', left: 0, right: 0, top: 0, transform: `translateY(${-pos * size}px)`, textAlign: 'center'}}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, k) => (
            <span key={k} style={{display: 'block', height: size, lineHeight: `${size}px`}}>
              {d}
            </span>
          ))}
        </span>
      </span>,
    );
  }
  return <span style={{...style, display: 'inline-flex', lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{cols}</span>;
};

