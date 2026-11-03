import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CONFIG} from '../../config';
import {ProductArt} from '../../components/Art';
import {Paper} from '../../components/Base';
import {Phone, SCREEN, Sticker} from '../../components/Device';
import {KineticLines} from '../../components/Kinetic';
import {Callout, SectionLabel} from '../../components/Net';
import {EASE_IN, EASE_OUT, SPRING_BOUNCY, SPRING_PHYS, sp, tw, useT} from '../../lib/motion';
import {ListScreen, Notification, ScanScreen, usePhases} from './Demo';
import {LogoBlock, TWIST_LOGO_SIZE} from './Twist';

const TX = CONFIG.vertical.texts;
const N = CONFIG.net;

/** Mise en page B : téléphone de face, plus grand, marge droite pour les annotations */
const PX = 430;
const PY = 1093;
const S = 1.08;
const INTRO_SCALE = 2;
const CHIP_X = 704;
/** écran → cadre */
const f = (sx: number, sy: number): [number, number] => [PX + (sx - SCREEN.w / 2) * S, PY + (sy - SCREEN.h / 2) * S];

/**
 * [10,6 – 25 s] DÉMO, version B « net »
 * Intertitre numéroté + légende Anton en haut, téléphone de face, pastilles d'annotation dans la marge.
 */
export const DemoNet: React.FC = () => {
  const t = useT();
  const ph = usePhases();

  // intro : l'écran bleu plein cadre devient l'écran du téléphone (raccord avec le logo)
  const intro = tw(t, [0, 16], [0, 1], EASE_OUT);
  const scale = INTRO_SCALE + (S - INTRO_SCALE) * intro;
  const cx = 540 + (PX - 540) * intro;
  const cy = 960 + (PY - 960) * intro;
  // micro-respiration au changement de phase (pas d'inclinaison : tout reste d'équerre)
  const bump = [ph.sort, ph.alert, ph.done].reduce((acc, at) => {
    const k = sp(t, at, SPRING_PHYS);
    return t >= at && t < at + 20 ? acc + Math.sin(Math.min(1, k) * Math.PI) * 0.012 : acc;
  }, 0);

  const ta = t - ph.alert;
  const td = t - ph.done;

  // produit au premier plan + sticker (scène alerte)
  const packIn = sp(ta, 20, SPRING_PHYS);
  const packOut = tw(td, [2, 11], [0, 1], EASE_IN);
  const packX = 1220 - packIn * 616 + packOut * 700;
  const packY = 1150;
  const stAt = ph.alert + 36;
  const stLand = ph.alert + 47;
  const [bx, by] = f(140, 330);
  const flyP = tw(t, [stAt, stLand], [0, 1], EASE_OUT);
  const slap = sp(t, stLand, SPRING_BOUNCY);
  const target = [packX + 160, packY + 110];
  const sx = t < stLand ? bx + (target[0] - bx) * flyP : target[0];
  const sy = t < stLand ? by + (target[1] - by) * flyP - Math.sin(flyP * Math.PI) * 220 : target[1];
  const sScale = t < stLand ? 0.35 + flyP * 0.95 : 1.3 - slap * 0.3;
  const sRot = t < stLand ? -200 + flyP * 188 : -12 + (1 - slap) * -10;

  // en-têtes par phase
  const heads = [
    {at: 14, out: ph.sort - 6, label: N.sections.scan, caption: TX.scan.caption},
    {at: ph.sort + 2, out: ph.alert - 6, label: N.sections.sort, caption: TX.sort.caption},
    {at: ph.alert + 2, out: ph.done - 6, label: N.sections.alert, caption: TX.alert.caption},
    {at: ph.done + 2, out: ph.end + 40, label: N.sections.done, caption: TX.done.caption},
  ];

  return (
    <Paper color={C.blueLight}>
      <Phone x={cx} y={cy} scale={scale * (1 + bump)} bezelOpacity={t < 2 ? 0 : 1}>
        {t < 16 ? (
          <AbsoluteFill style={{background: C.blue, alignItems: 'center', justifyContent: 'center'}}>
            <LogoBlock size={TWIST_LOGO_SIZE / INTRO_SCALE} />
          </AbsoluteFill>
        ) : t < ph.sort ? (
          <ScanScreen t={t} />
        ) : (
          <ListScreen t={t} ph={ph} />
        )}
        {t >= ph.alert && t < ph.done + 2 ? <Notification ta={ta} base={ph.alert} /> : null}
      </Phone>

      {/* premier plan : produit + sticker */}
      {ta > 18 && td < 12 ? (
        <div style={{position: 'absolute', left: packX, top: packY}}>
          <ProductArt art="jambon" size={320} />
        </div>
      ) : null}
      {t >= stAt && td < 12 ? (
        <div style={{position: 'absolute', left: sx - 90, top: sy - 90, transform: `rotate(${sRot}deg) scale(${sScale})`}}>
          <Sticker text={CONFIG.alert.discount} size={180} />
        </div>
      ) : null}

      {/* annotations nettes */}
      <Callout text={N.callouts.scan} at={40} outAt={ph.sort - 7} dot={f(408, 124)} chipLeft={CHIP_X} />
      <Callout text={N.callouts.sort} at={ph.sort + 44} outAt={ph.alert - 7} dot={f(500, 334)} chipLeft={CHIP_X} />
      <Callout text={N.callouts.alert} at={ph.alert + 18} outAt={ph.alert + 84} dot={f(470, 176)} chipLeft={CHIP_X} />
      <Callout text={N.callouts.done} at={ph.done + 20} outAt={ph.done + 64} dot={f(486, 748)} chipLeft={CHIP_X} />

      {/* intertitre + légende */}
      {heads.map((h, i) => (
        <React.Fragment key={i}>
          <SectionLabel text={h.label} at={h.at} outAt={h.out} />
          {t >= h.at && t < h.out + 12 ? (
            <div style={{position: 'absolute', left: 80, top: 300}}>
              <KineticLines lines={[h.caption.split(' ')]} at={h.at + 3} stagger={5} size={118} exitAt={h.out} />
            </div>
          ) : null}
        </React.Fragment>
      ))}
    </Paper>
  );
};
