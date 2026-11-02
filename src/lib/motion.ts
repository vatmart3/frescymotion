import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/** Ease-out fort (entrées) */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
/** Ease-in rapide (sorties) */
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
/** In-out pour les déplacements "caméra" */
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** Ressort "objet physique" : léger dépassement puis stabilisation */
export const SPRING_PHYS = {stiffness: 300, damping: 18, mass: 1};
/** Ressort plus sec (UI) */
export const SPRING_UI = {stiffness: 380, damping: 30, mass: 1};
/** Ressort "trop" : le sticker qui rebondit un peu trop */
export const SPRING_BOUNCY = {stiffness: 300, damping: 12, mass: 1};

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Temps local en "ticks" de 1/30 s, indépendant du fps de rendu.
 * Toutes les scènes sont écrites dans cette unité.
 */
export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (frame * 30) / fps;
};

/** interpolate() borné, avec easing optionnel */
export const tw = (
  t: number,
  [t0, t1]: [number, number],
  [v0, v1]: [number, number],
  easing: (x: number) => number = EASE_OUT,
) => interpolate(t, [t0, t1], [v0, v1], {...CLAMP, easing});

/** Variante multi-étapes */
export const tws = (t: number, input: number[], output: number[], easing: (x: number) => number = EASE_OUT) =>
  interpolate(t, input, output, {...CLAMP, easing});

/**
 * spring() Remotion exprimé en ticks (1/30 s). Renvoie 0 avant `delay`.
 */
export const sp = (
  t: number,
  delay: number,
  config: {stiffness: number; damping: number; mass?: number} = SPRING_PHYS,
) => {
  const local = t - delay;
  if (local <= 0) return 0;
  // On convertit en frames entières à 60 i/s pour une courbe identique en 30 ou 60 fps.
  const f = Math.round(local * 2);
  return spring({frame: f, fps: 60, config: {mass: 1, ...config}});
};

/** Petit bruit déterministe (pour tremblements "à la main") */
export const noise = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Secousse d'impact (tampon) : amplitude qui décroît vite */
export const shake = (t: number, at: number, amp = 14, dur = 7) => {
  const k = t - at;
  if (k < 0 || k > dur) return {x: 0, y: 0, r: 0};
  const decay = 1 - k / dur;
  const step = Math.floor(k);
  return {
    x: (noise(step + at) - 0.5) * 2 * amp * decay,
    y: (noise(step + at + 9) - 0.5) * 2 * amp * decay,
    r: (noise(step + at + 3) - 0.5) * 1.2 * decay,
  };
};

/** "boiling line" : graine qui change tous les n ticks pour les traits à la main */
export const boilSeed = (t: number, every = 3) => Math.floor(t / every) % 4;
