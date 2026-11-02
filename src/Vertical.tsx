import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {C, CONFIG, beatToFrame} from './config';
import {Defs, Grain, SafeZones} from './components/Base';
import {TicketCurtain} from './components/Curtain';
import {LeafWipe} from './components/Leaf';
import {Demo} from './scenes/vertical/Demo';
import {Hook} from './scenes/vertical/Hook';
import {Problem} from './scenes/vertical/Problem';
import {Result} from './scenes/vertical/Result';
import {Signature} from './scenes/vertical/Signature';
import {Twist} from './scenes/vertical/Twist';
import {ensureFonts} from './fonts';

ensureFonts();

export type VerticalProps = {showSafeZones: boolean};

/** FRESCY · 9:16 · 1080×1920 · 30 s */
export const FrescyVertical: React.FC<VerticalProps> = ({showSafeZones}) => {
  const {fps, width, height} = useVideoConfig();
  const B = CONFIG.vertical.beats;
  const f = (b: number) => beatToFrame(b, fps);
  const ticks = (n: number) => Math.round((n * fps) / 30);
  const WIPE = ticks(16);
  const seq = (from: number, to: number, extra = 0) => ({from: f(from), durationInFrames: f(to) - f(from) + extra});

  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Defs />

      <Sequence name="1 · Hook" {...seq(B.hook, B.problem)}>
        <Hook />
      </Sequence>

      {/* le problème reste dessous pendant l'essuyage par la feuille */}
      <Sequence name="2 · Problème" {...seq(B.problem, B.twist, WIPE)}>
        <Problem />
      </Sequence>

      <Sequence name="3 · Twist (feuille)" {...seq(B.twist, B.scan)}>
        <LeafWipe width={width} height={height} leafColor={C.blueDeep} veinColor={C.blue} dir={[1, -0.8]}>
          <Twist />
        </LeafWipe>
      </Sequence>

      <Sequence name="4 · Démo (scan → tri → alerte → validation)" {...seq(B.scan, B.result)}>
        <Demo />
      </Sequence>

      <Sequence name="5 · Résultat" {...seq(B.result, B.signature, WIPE)}>
        <Result />
      </Sequence>

      {/* ticket-rideau : couvre la coupe Démo → Résultat */}
      <Sequence name="↳ rideau ticket" from={f(B.result) - ticks(12)} durationInFrames={ticks(22)}>
        <TicketCurtain width={width} height={height} />
      </Sequence>

      <Sequence name="6 · Signature + CTA" {...seq(B.signature, B.end)}>
        <LeafWipe width={width} height={height} leafColor={C.blue} veinColor={C.paper} dir={[-1, -0.7]}>
          <Signature />
        </LeafWipe>
      </Sequence>

      <Grain />
      {showSafeZones ? <SafeZones {...CONFIG.vertical.safe} /> : null}
    </AbsoluteFill>
  );
};
