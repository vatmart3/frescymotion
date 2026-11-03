import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CONFIG} from '../../config';
import {Paper, inter} from '../../components/Base';
import {Odometer} from '../../components/Device';
import {HandPath, HandText, handDuration} from '../../components/Hand';
import {Check} from '../../components/Icons';
import {Logo} from '../../components/Leaf';
import {Receipt, ReceiptRow} from '../../components/Receipt';
import {Stamp} from '../../components/Stamp';
import {EASE_OUT, shake, tw, useT} from '../../lib/motion';
import {useIsNet, useTilt} from '../../lib/style';

export const RESULT_T = {header: 4, sep: 9, row1: 14, count: 18, countDur: 30, row2: 52, check: 56, sep2: 66, footer: 70, stamp: 82, note: 92};

/** Lignes du ticket "version Frescy" (réutilisées en 16:9) */
export const useSavedRows = (scale = 1): ReceiptRow[] => {
  const t = useT();
  const R = CONFIG.result;
  const checkP = tw(t, [RESULT_T.check, RESULT_T.check + 8], [0, 1], EASE_OUT);
  return [
    {
      kind: 'header',
      h: 184 * scale,
      node: (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 * scale}}>
          <Logo size={62 * scale} color={C.ink} />
          <div style={{...inter(24 * scale, 800), letterSpacing: '0.08em'}}>{R.header}</div>
          <div style={{...inter(20 * scale, 600, 'rgba(14,26,58,0.55)'), letterSpacing: '0.04em', marginTop: -4 * scale}}>{R.disclaimer}</div>
        </div>
      ),
    },
    {kind: 'sep', h: 34 * scale},
    {
      kind: 'line',
      h: 138 * scale,
      size: 34 * scale,
      label: R.savedLabel,
      value: <Odometer value={R.savedValue} at={RESULT_T.count} dur={RESULT_T.countDur} size={118 * scale} color={C.blue} />,
    },
    {
      kind: 'line',
      h: 112 * scale,
      size: 34 * scale,
      label: R.weekLabel,
      value: (
        <span style={{width: 84 * scale, height: 84 * scale, borderRadius: 42 * scale, background: C.blue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
          <Check size={58 * scale} p={checkP} stroke={3.4} />
        </span>
      ),
    },
    {kind: 'sep', h: 34 * scale},
    {
      kind: 'node',
      h: 84 * scale,
      node: (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 * scale}}>
          <div style={{display: 'flex', gap: 3 * scale, height: 52 * scale}}>
            {Array.from({length: 46}).map((_, i) => (
              <span key={i} style={{width: ((i * 11) % 5 === 0 ? 6 : (i * 3) % 4 === 0 ? 4 : 2) * scale, background: C.ink, height: '100%'}} />
            ))}
          </div>
        </div>
      ),
    },
  ];
};

export const SAVED_PRINT_AT = [RESULT_T.header, RESULT_T.sep, RESULT_T.row1, RESULT_T.row2, RESULT_T.sep2, RESULT_T.footer];

/**
 * [21 – 25,5 s] LE RÉSULTAT
 * Le ticket se réimprime, version Frescy. Odomètre, coche, tampon bleu "SAUVÉ".
 */
export const Result: React.FC = () => {
  const t = useT();
  const rows = useSavedRows();
  const tilt = useTilt();
  const noteAt = useIsNet() ? 50 : RESULT_T.note;
  const sh = shake(t, RESULT_T.stamp, 14);
  const note = CONFIG.vertical.texts.result.note;
  return (
    <Paper>
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r}deg)`}}>
        <Receipt width={760} rows={rows} printAt={SAVED_PRINT_AT} slotX={500} slotY={1310} rotate={tilt(-1.5)} padding={48} />
        <Stamp id="sauve" text="SAUVÉ" color={C.blue} at={RESULT_T.stamp} rotate={tilt(-8) || -5} width={500} height={250} fontSize={150} style={{left: 300, top: 1190}} />
        <div style={{position: 'absolute', left: 92, top: 330}}>
          <HandText lines={note} at={noteAt} size={80} rotate={tilt(-6)} />
        </div>
        <HandPath
          at={noteAt + handDuration(note)}
          dur={6}
          viewBox="0 0 300 300"
          w={300}
          h={300}
          style={{left: 470, top: 410}}
          d="M20 20 C 120 30, 170 90, 150 200"
          arrowHead="M118 172 L150 204 L176 166"
        />
      </AbsoluteFill>
    </Paper>
  );
};
