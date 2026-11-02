import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CONFIG} from '../../config';
import {Paper, inter} from '../../components/Base';
import {HandPath, HandText} from '../../components/Hand';
import {ArrowRight} from '../../components/Icons';
import {KineticLines} from '../../components/Kinetic';
import {Leaf} from '../../components/Leaf';
import {EASE_IN_OUT, EASE_OUT, sp, tw, useT} from '../../lib/motion';

const TX = CONFIG.vertical.texts.signature;
export const SIGN_T = {a: [14, 20], b: [30, 35, 40, 45], strike: 50, retract: 62, note: 66, cta: 62, leaf: 80};

/** Feuille qui arrive en arc et se plante (petit rebond) */
export const LandingLeaf: React.FC<{size: number; at: number; color?: string; vein?: string; style?: React.CSSProperties}> = ({
  size,
  at,
  color = C.blue,
  vein = C.paper,
  style,
}) => {
  const t = useT();
  if (t < at - 14) return null;
  const p = tw(t, [at - 14, at], [0, 1], EASE_IN_OUT);
  const land = sp(t, at, {stiffness: 460, damping: 14});
  const fx = (1 - p) * 520;
  const fy = -(1 - p) * 420 - Math.sin(p * Math.PI) * 140;
  const rot = (1 - p) * -260 + (t >= at ? (1 - land) * 20 : 0);
  const sq = t >= at ? 1 + (1 - land) * 0.3 : 1;
  return (
    <div style={{position: 'absolute', width: size, height: size, transform: `translate(${fx}px, ${fy}px) rotate(${rot}deg) scale(${1 / sq}, ${sq})`, transformOrigin: '4% 96%', ...style}}>
      <Leaf size={size} color={color} vein={vein} />
    </div>
  );
};

/**
 * [25,5 – 30 s] SIGNATURE + CTA
 * Slogan mot par mot. "PERD" se fait barrer à la main… puis le trait s'efface : rien ne se perd.
 * La feuille se pose une dernière fois sur le Y. Les 1,5 dernières secondes sont fixes.
 */
export const Signature: React.FC = () => {
  const t = useT();
  const SIZE_A = 150;
  const SIZE_B = 238;
  const cta = (i: number) => tw(t, [SIGN_T.cta + i * 4, SIGN_T.cta + i * 4 + 9], [0, 1], EASE_OUT);
  const mask = (i: number, node: React.ReactNode, extra?: React.CSSProperties) => (
    <div style={{overflow: 'hidden', paddingTop: 8, ...extra}}>
      <div style={{transform: `translateY(${(1 - cta(i)) * 110}%)`}}>{node}</div>
    </div>
  );
  return (
    <Paper>
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 64, top: 360}}>
          <KineticLines
            lines={[TX.lineA]}
            at={SIGN_T.a}
            size={SIZE_A}
            renderWord={(w) =>
              w.startsWith('FRESCY') ? (
                <span style={{display: 'inline-block'}}>
                  <span style={{position: 'relative', display: 'inline-block'}}>
                    FRESCY
                    {/* feuille posée sur le bras droit du Y */}
                    <LandingLeaf size={SIZE_A * 0.5} at={SIGN_T.leaf} style={{left: `calc(100% - ${SIZE_A * 0.13}px)`, top: -SIZE_A * 0.43}} />
                  </span>
                  {w.slice(6)}
                </span>
              ) : (
                w
              )
            }
          />
          <div style={{height: 18}} />
          <KineticLines
            lines={TX.lineB}
            at={SIGN_T.b}
            size={SIZE_B}
            color={C.blue}
            lineHeight={0.88}
            renderWord={(w) =>
              w.startsWith('PERD') ? (
                <span style={{position: 'relative', display: 'inline-block'}}>
                  {w}
                  <HandPath
                    at={SIGN_T.strike}
                    dur={7}
                    retractAt={SIGN_T.retract}
                    retractDur={6}
                    width={16}
                    color={C.ink}
                    viewBox="0 0 400 100"
                    w={SIZE_B * 1.62}
                    h={SIZE_B * 0.4}
                    style={{left: SIZE_B * 0.02, top: SIZE_B * 0.36}}
                    d="M6 64 C 90 40, 210 58, 300 34 S 380 30, 394 26"
                  />
                </span>
              ) : (
                w
              )
            }
          />
        </div>

        <div style={{position: 'absolute', left: 690, top: 900}}>
          <HandText lines={[TX.note]} at={SIGN_T.note} size={86} rotate={-8} />
        </div>

        <div style={{position: 'absolute', left: 68, top: 1086}}>
          {mask(0, <div style={inter(50, 600)}>{TX.cta}</div>)}
          {mask(
            1,
            <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <ArrowRight size={70} color={C.blue} stroke={3} />
              <span style={{...inter(86, 800, C.blue), letterSpacing: '-0.04em'}}>{CONFIG.brand.site}</span>
            </div>,
            {marginTop: 4},
          )}
          {mask(2, <div style={inter(38, 600, 'rgba(14,26,58,0.62)')}>{CONFIG.brand.instagram}</div>, {marginTop: 8})}
        </div>
      </AbsoluteFill>
    </Paper>
  );
};
