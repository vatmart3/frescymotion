import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CONFIG} from '../../config';
import {Paper, inter} from '../../components/Base';
import {Logo} from '../../components/Leaf';
import {EASE_OUT, tw, useT} from '../../lib/motion';

export const TWIST_T = {letters: 13, leaf: 33, tagline: 40};
export const TWIST_LOGO_SIZE = 236;
export const TWIST_TAGLINE = CONFIG.vertical.texts.twist.tagline;

/** Bloc logo + accroche, réutilisé à l'identique dans l'écran de démarrage du téléphone (raccord) */
export const LogoBlock: React.FC<{size: number; lettersAt?: number; leafAt?: number; taglineAt?: number}> = ({
  size,
  lettersAt,
  leafAt,
  taglineAt,
}) => {
  const t = useT();
  const tp = taglineAt === undefined ? 1 : tw(t, [taglineAt, taglineAt + 9], [0, 1], EASE_OUT);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Logo size={size} color={C.white} lettersAt={lettersAt} leafAt={leafAt} />
      <div style={{overflow: 'hidden', marginTop: size * 0.12}}>
        <div style={{...inter(size * 0.19, 600, 'rgba(255,255,255,0.86)'), transform: `translateY(${(1 - tp) * 110}%)`, whiteSpace: 'nowrap'}}>
          {TWIST_TAGLINE}
        </div>
      </div>
    </div>
  );
};

/**
 * [6,5 – 8,7 s] LE TWIST
 * (l'essuyage par la feuille est géré par LeafWipe dans la composition)
 * Fond bleu Frescy, logo blanc, la feuille vient se planter sur le "y".
 */
export const Twist: React.FC = () => (
  <Paper color={C.blue}>
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <LogoBlock size={TWIST_LOGO_SIZE} lettersAt={TWIST_T.letters} leafAt={TWIST_T.leaf} taglineAt={TWIST_T.tagline} />
    </AbsoluteFill>
  </Paper>
);

