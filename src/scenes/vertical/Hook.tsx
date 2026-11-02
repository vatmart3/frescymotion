import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CONFIG} from '../../config';
import {ArtG, Bin} from '../../components/Art';
import {Paper} from '../../components/Base';
import {EyesDoodle, HandPath, HandText, handDuration} from '../../components/Hand';
import {KineticLines} from '../../components/Kinetic';
import {EASE_IN, EASE_OUT, sp, tw, tws, useT} from '../../lib/motion';

const TX = CONFIG.vertical.texts.hook;

/**
 * [0 – 2,2 s] HOOK
 * Un yaourt tombe, tape le rebord, rebondit, finit dans la poubelle (clac sur le temps 2).
 */
export const Hook: React.FC = () => {
  const t = useT();

  // ── trajectoire du pot (coordonnées de la poubelle, boîte 200×260)
  const HIT = 12; // tape le rebord
  const APEX = 20;
  const IN = 28; // disparaît dans la poubelle
  let x = 140;
  let y = -980;
  let r = -10;
  if (t < HIT) {
    const p = tw(t, [0, HIT], [0, 1], EASE_IN);
    y = -980 + p * (980 + 10);
    r = -10 + p * 20;
  } else if (t < APEX) {
    const p = tw(t, [HIT, APEX], [0, 1], EASE_OUT);
    y = 10 - p * 190;
    x = 140 - p * 50;
    r = 10 - p * 140;
  } else {
    const p = tw(t, [APEX, IN + 4], [0, 1], EASE_IN);
    y = -180 + p * 320;
    x = 90 + p * 12;
    r = -130 - p * 70;
  }
  // couvercle : ouvert, puis claque (léger rebond)
  const slam = sp(t, IN + 1, {stiffness: 700, damping: 14});
  const lid = t < IN + 1 ? 1 : 1 - slam;
  // la poubelle encaisse
  const gulp = sp(t, IN + 4, {stiffness: 500, damping: 12});
  const squash = t > IN + 4 ? 1 + Math.sin(gulp * Math.PI) * 0.05 : 1;
  const hitKick = tws(t, [HIT, HIT + 2, HIT + 6], [0, 6, 0]);

  const noteAt = 46;
  const noteEnd = noteAt + handDuration([TX.note], 0.9);

  return (
    <Paper>
      {/* plan objets */}
      <div style={{position: 'absolute', left: 610, top: 1168, transform: `scaleY(${squash}) rotate(${hitKick * 0.4}deg)`, transformOrigin: '50% 100%'}}>
        <Bin size={270} lid={lid}>
          <g transform={`translate(${x} ${y}) rotate(${r})`}>
            <g transform="translate(-62 -62) scale(0.62)">
              <ArtG art="yaourt" />
            </g>
          </g>
        </Bin>
      </div>

      {/* plan texte */}
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 60, top: 360, transform: 'rotate(-5deg)', transformOrigin: '0 0'}}>
          <KineticLines
            lines={TX.lines}
            at={[3, 9, 15, 33, 39]}
            size={205}
            lineHeight={0.97}
            styles={{'SEMAINE ?': {box: C.blue, boxText: C.white}}}
          />
        </div>
        <div style={{position: 'absolute', left: 74, top: 1236}}>
          <HandText lines={[TX.note]} at={noteAt} size={84} rotate={-6} />
          <EyesDoodle at={noteEnd - 2} size={104} style={{position: 'absolute', left: 448, top: -42}} />
        </div>
        <HandPath
          at={noteEnd + 1}
          dur={7}
          viewBox="0 0 400 200"
          w={400}
          h={200}
          style={{left: 200, top: 1316}}
          d="M10 40 C 80 130, 230 150, 380 96"
          arrowHead="M346 70 L382 95 L344 122"
        />
      </AbsoluteFill>
    </Paper>
  );
};
