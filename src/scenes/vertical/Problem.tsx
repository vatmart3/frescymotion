import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CONFIG, euro, productById} from '../../config';
import {ProductArt, ShelfTag} from '../../components/Art';
import {Paper, inter} from '../../components/Base';
import {KineticLines} from '../../components/Kinetic';
import {Receipt, ReceiptRow} from '../../components/Receipt';
import {Stamp} from '../../components/Stamp';
import {EASE_IN, shake, tw, tws, useT} from '../../lib/motion';
import {useIsNet, useTilt} from '../../lib/style';

const TX = CONFIG.vertical.texts.problem;

/** Timings internes (ticks 1/30 s, relatifs au début de la scène) */
export const PROBLEM_T = {
  orange: (i: number) => 6 + i * 9,
  red: (i: number) => 16 + i * 9,
  fall: (i: number) => 22 + i * 9,
  print: (i: number) => 24 + i * 9,
  header: 3,
  total: 61,
  stamp: 82,
  shelfOut: 92,
  lineA: [98, 102, 106, 110],
  lineB: [115, 119, 123],
};

export const useWasteRows = (size = 31): {rows: ReceiptRow[]; printAt: number[]} => {
  const items = CONFIG.wasteTicket.items.map(productById);
  const total = items.reduce((a, p) => a + p.price, 0);
  const rows: ReceiptRow[] = [
    {
      kind: 'header',
      h: 84,
      node: (
        <div style={{textAlign: 'center'}}>
          <div style={{...inter(27, 800), letterSpacing: '0.06em'}}>{CONFIG.wasteTicket.header}</div>
          <div style={inter(21, 600, 'rgba(14,26,58,0.55)')}>poubelle du rayon frais</div>
        </div>
      ),
    },
    {kind: 'sep', h: 26},
    ...items.map((p) => ({kind: 'line' as const, h: 64, size, label: p.name, value: euro(p.price)})),
    {kind: 'sep', h: 30, dashed: false},
    {kind: 'line', h: 80, size: size + 5, bold: true, label: CONFIG.wasteTicket.totalLabel, value: euro(total)},
  ];
  const printAt = [
    PROBLEM_T.header,
    PROBLEM_T.header + 4,
    ...items.map((_, i) => PROBLEM_T.print(i)),
    PROBLEM_T.total - 3,
    PROBLEM_T.total,
  ];
  return {rows, printAt};
};

/**
 * [2,2 – 6,5 s] LE PROBLÈME
 * Rayon frais : les étiquettes DLC virent au orange puis au rouge, les produits tombent,
 * le ticket des pertes s'imprime en parallèle. Tampon "PERDU". Puis la phrase qui fait mal.
 */
export const Problem: React.FC = () => {
  const t = useT();
  const tilt = useTilt();
  const net = useIsNet();
  const items = CONFIG.wasteTicket.items.map(productById);
  const {rows, printAt} = useWasteRows();
  const sh = shake(t, PROBLEM_T.stamp, 16);
  const shelfOut = tw(t, [PROBLEM_T.shelfOut, PROBLEM_T.shelfOut + 7], [0, 1], EASE_IN);

  return (
    <Paper>
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r}deg)`}}>
        {/* ── RAYON FRAIS */}
        <div style={{position: 'absolute', left: 30, top: 250, width: 900, height: 450, transform: `translateY(${-shelfOut * 900}px)`}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 18, background: C.blueLight, border: `5px solid ${C.ink}`}} />
          {[1, 2, 3].map((i) => (
            <div key={i} style={{position: 'absolute', left: i * 225, top: 70, bottom: 110, width: 4, background: 'rgba(29,63,191,0.18)'}} />
          ))}
          <div style={{position: 'absolute', left: -5, right: -5, top: -5, height: 70, borderRadius: '18px 18px 0 0', background: C.blue, display: 'flex', alignItems: 'center', paddingLeft: 30, gap: 16}}>
            <span style={{...inter(30, 800, C.white), letterSpacing: '0.18em'}}>RAYON FRAIS</span>
            <span style={inter(24, 600, 'rgba(255,255,255,0.7)')}>· 4 °C</span>
          </div>
          {/* tablette */}
          <div style={{position: 'absolute', left: -5, right: -5, top: 316, height: 30, background: C.ink, borderRadius: 4}} />
          {items.map((p, i) => {
            const fallP = tw(t, [PROBLEM_T.fall(i), PROBLEM_T.fall(i) + 10], [0, 1], EASE_IN);
            const wob = t > PROBLEM_T.red(i) && t < PROBLEM_T.fall(i) ? Math.sin((t - PROBLEM_T.red(i)) * 1.6) * 4 : 0;
            const state = t >= PROBLEM_T.red(i) ? 'urgent' : t >= PROBLEM_T.orange(i) ? 'soon' : 'ok';
            const flip = Math.max(
              tws(t, [PROBLEM_T.orange(i), PROBLEM_T.orange(i) + 2, PROBLEM_T.orange(i) + 5], [0, 1, 0]),
              tws(t, [PROBLEM_T.red(i), PROBLEM_T.red(i) + 2, PROBLEM_T.red(i) + 5], [0, 1, 0]),
            );
            const color = state === 'urgent' ? C.urgent : state === 'soon' ? C.soon : C.ok;
            const lab = state === 'urgent' ? 'PÉRIMÉ' : state === 'soon' ? 'BIENTÔT' : p.dateType;
            return (
              <React.Fragment key={p.id}>
                {fallP >= 1 ? null : <div
                  style={{
                    position: 'absolute',
                    left: 4 + i * 225,
                    top: 98,
                    transform: `translateY(${fallP * 1500}px) rotate(${wob + fallP * (i % 2 ? 70 : -60)}deg)`,
                    transformOrigin: '50% 100%',
                  }}
                >
                  <ProductArt art={p.art} size={218} />
                </div>}
                <div style={{position: 'absolute', left: 18 + i * 225, top: 356, transform: `scaleY(${1 - flip * 0.25}) rotate(${tilt(i % 2 ? 1.5 : -1.2)}deg)`}}>
                  <ShelfTag date={p.date} color={color} width={190} type={p.dateType} urgentLabel={lab} />
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* ── LA PHRASE */}
        <div style={{position: 'absolute', left: 58, top: 290}}>
          <KineticLines lines={TX.lineA} at={PROBLEM_T.lineA} size={168} lineHeight={0.9} />
          <KineticLines lines={TX.lineB} at={PROBLEM_T.lineB} size={168} lineHeight={0.9} styles={{'MARGE.': {box: C.blue, boxText: C.white}}} />
        </div>

        {/* ── TICKET DES PERTES */}
        <Receipt width={610} rows={rows} printAt={printAt} slotX={618} slotY={1456} rotate={tilt(2)} />

        <Stamp id="perdu" text="PERDU" color={C.urgent} at={PROBLEM_T.stamp} rotate={net ? -7 : -14} width={580} height={236} fontSize={190} style={{left: 330, top: 1060}} />
      </AbsoluteFill>
    </Paper>
  );
};
