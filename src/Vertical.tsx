import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {C, CONFIG, beatToFrame, framesToTicks, ticksToFrames} from './config';
import {Defs, Grain, SafeZones} from './components/Base';
import {TicketCurtain} from './components/Curtain';
import {LeafWipe} from './components/Leaf';
import {Demo} from './scenes/vertical/Demo';
import {DemoNet} from './scenes/vertical/DemoNet';
import {SectionLabel} from './components/Net';
import {Look, LookProvider} from './lib/style';
import {Hook} from './scenes/vertical/Hook';
import {Problem} from './scenes/vertical/Problem';
import {Result} from './scenes/vertical/Result';
import {Signature} from './scenes/vertical/Signature';
import {Twist} from './scenes/vertical/Twist';
import {ensureFonts} from './fonts';

ensureFonts();

export type VerticalProps = {showSafeZones: boolean; look?: Look};

/** FRESCY · 9:16 · 1080×1920 — version A « tactile » ou B « net » */
export const FrescyVertical: React.FC<VerticalProps> = ({showSafeZones, look = 'tactile'}) => {
  const net = look === 'net';
  const {fps, width, height} = useVideoConfig();
  const B = CONFIG.vertical.beats;
  const f = (b: number) => beatToFrame(b, fps);
  const ticks = (n: number) => ticksToFrames(n, fps);
  const WIPE = ticks(16);
  const seq = (from: number, to: number, extra = 0) => ({from: f(from), durationInFrames: f(to) - f(from) + extra});

  // en version B, le haut de chaque scène accueille un intertitre numéroté
  const shift: React.CSSProperties = net ? {transform: 'translateY(50px)'} : {};
  const len = (a: number, b: number) => framesToTicks(f(b) - f(a), fps);

  return (
    <LookProvider look={look}>
    <AbsoluteFill style={{background: C.paper}}>
      <Defs />

      <Sequence name="1 · Hook" {...seq(B.hook, B.problem)}>
        <Hook />
      </Sequence>

      {/* le problème reste dessous pendant l'essuyage par la feuille */}
      <Sequence name="2 · Problème" {...seq(B.problem, B.twist, WIPE)}>
        <AbsoluteFill style={shift}>
          <Problem />
        </AbsoluteFill>
        {net ? <SectionLabel text={CONFIG.net.sections.problem} at={3} outAt={len(B.problem, B.twist) - 8} /> : null}
      </Sequence>

      <Sequence name="3 · Twist (feuille)" {...seq(B.twist, B.scan)}>
        <LeafWipe width={width} height={height} leafColor={C.blueDeep} veinColor={C.blue} dir={[1, -0.8]}>
          <Twist />
        </LeafWipe>
      </Sequence>

      <Sequence name="4 · Démo (scan → tri → alerte → validation)" {...seq(B.scan, B.result)}>
        {net ? <DemoNet /> : <Demo />}
      </Sequence>

      <Sequence name="5 · Résultat" {...seq(B.result, B.signature, WIPE)}>
        <AbsoluteFill style={shift}>
          <Result />
        </AbsoluteFill>
        {net ? <SectionLabel text={CONFIG.net.sections.result} at={6} outAt={len(B.result, B.signature) - 6} /> : null}
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

      {net ? null : <Grain />}
      {showSafeZones ? <SafeZones {...CONFIG.vertical.safe} /> : null}
    </AbsoluteFill>
    </LookProvider>
  );
};
