import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {C, CONFIG, Product, beatToFrame, framesToTicks, productById} from '../../config';
import {ProductArt} from '../../components/Art';
import {AppButton, AppHeader, CARD_H, Chip, ProductCard, StatusBar, UrgencySummary} from '../../components/AppUI';
import {Paper, anton, inter} from '../../components/Base';
import {PHONE, Phone, SCREEN, Sticker, TapRing} from '../../components/Device';
import {HandPath, HandText, handDuration} from '../../components/Hand';
import {AppIcon, ArrowRight, Check, Clock} from '../../components/Icons';
import {EASE_IN, EASE_OUT, SPRING_BOUNCY, SPRING_PHYS, SPRING_UI, sp, tw, tws, useT} from '../../lib/motion';
import {LogoBlock, TWIST_LOGO_SIZE} from './Twist';

const TX = CONFIG.vertical.texts;
const B = CONFIG.vertical.beats;

/** Position du téléphone (centre) dans le cadre 1080×1920 */
const PX = 350;
const PY = 845;
const INTRO_SCALE = 2;
const LIST_TOP = 272;
const STEP = CARD_H + 12;
const CARD_W = SCREEN.w - 44;

/** Conversion écran → cadre (approx. sans l'inclinaison) */
const toFrame = (sx: number, sy: number, px = PX, py = PY) => [px - SCREEN.w / 2 + sx, py - SCREEN.h / 2 + sy];

const usePhases = () => {
  const {fps} = useVideoConfig();
  const base = beatToFrame(B.scan, fps);
  const k = (b: number) => framesToTicks(beatToFrame(b, fps) - base, fps);
  return {sort: k(B.sort), alert: k(B.alert), done: k(B.done), end: k(B.result)};
};

// ════════════════════════════════════════════ ÉCRAN 1 : SCAN
const ScanScreen: React.FC<{t: number}> = ({t}) => {
  const jambon = productById('jambon');
  // caméra tenue à la main
  const hx = Math.sin(t * 0.21) * 5 + Math.sin(t * 0.53) * 2;
  const hy = Math.cos(t * 0.17) * 4;
  // cadre de détection : plein écran → zone de la date
  const lockP = sp(t, 18, SPRING_UI);
  const from = {x: 36, y: 190, w: SCREEN.w - 72, h: 780};
  const to = {x: 116, y: 742, w: 288, h: 86};
  const r = {
    x: from.x + (to.x - from.x) * lockP,
    y: from.y + (to.y - from.y) * lockP,
    w: from.w + (to.w - from.w) * lockP,
    h: from.h + (to.h - from.h) * lockP,
  };
  const locked = t >= 38;
  const pulse = locked ? 1 + (1 - sp(t, 38, {stiffness: 600, damping: 14})) * 0.08 : 1;
  const hl = tw(t, [40, 46], [0, 1], EASE_OUT);
  // bottom sheet
  const sheet = sp(t, 46, SPRING_UI);
  const sheetY = SCREEN.h - sheet * 430;
  // la date s'envole vers la fiche
  const fly = tw(t, [48, 60], [0, 1], EASE_OUT);
  const land = sp(t, 60, SPRING_PHYS);
  const chipFrom = [to.x + 22, to.y + 14];
  const chipTo = [196, SCREEN.h - 430 + 150];
  const cx = chipFrom[0] + (chipTo[0] - chipFrom[0]) * fly;
  const cy = chipFrom[1] + (chipTo[1] - chipFrom[1]) * fly - Math.sin(fly * Math.PI) * 160;
  const chipScale = t < 60 ? 1 + Math.sin(fly * Math.PI) * 0.25 : 1 + (1 - land) * 0.12;
  const showJ = tw(t, [62, 68], [0, 1], EASE_OUT);

  return (
    <AbsoluteFill style={{background: C.blueLight}}>
      {/* "image caméra" : le produit, en illustration */}
      <AbsoluteFill style={{transform: `translate(${hx}px, ${hy}px)`}}>
        <div style={{position: 'absolute', left: -60, top: 640, width: SCREEN.w + 120, height: 600, background: '#DCE2F6'}} />
        <div style={{position: 'absolute', left: 36, top: 230, transform: 'rotate(-4deg)'}}>
          <ProductArt art="jambon" size={480} />
        </div>
        {/* étiquette imprimée */}
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 640,
            width: 340,
            height: 250,
            background: C.white,
            border: `4px solid ${C.ink}`,
            borderRadius: 8,
            padding: '16px 20px',
            transform: 'rotate(-4deg)',
            transformOrigin: '0 0',
          }}
        >
          <div style={{...inter(26, 800), letterSpacing: '0.02em'}}>JAMBON BLANC</div>
          <div style={inter(19, 500, 'rgba(14,26,58,0.7)')}>4 tranches · 160 g · 3,90 €</div>
          <div style={{position: 'relative', marginTop: 16, height: 60, display: 'flex', alignItems: 'center'}}>
            <div style={{position: 'absolute', left: -8, top: 0, height: 60, width: `${hl * 260}px`, background: C.blue, borderRadius: 6}} />
            <span style={{...inter(46, 800, hl > 0.6 ? C.white : C.ink), position: 'relative', letterSpacing: '-0.02em'}}>
              {jambon.dateType} {jambon.date}
            </span>
          </div>
          <div style={{display: 'flex', gap: 3, marginTop: 14, height: 34}}>
            {Array.from({length: 34}).map((_, i) => (
              <span key={i} style={{width: (i * 7) % 3 === 0 ? 5 : 2.5, background: C.ink, height: '100%'}} />
            ))}
          </div>
        </div>
      </AbsoluteFill>

      {/* masque + cadre de détection */}
      <div
        style={{
          position: 'absolute',
          left: r.x,
          top: r.y,
          width: r.w,
          height: r.h,
          borderRadius: 18,
          boxShadow: `0 0 0 2000px rgba(14,26,58,${0.06 + lockP * 0.14})`,
          transform: `scale(${pulse})`,
        }}
      >
        {[
          {left: -6, top: -6, bt: 1, bl: 1},
          {right: -6, top: -6, bt: 1, br: 1},
          {left: -6, bottom: -6, bb: 1, bl: 1},
          {right: -6, bottom: -6, bb: 1, br: 1},
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 46,
              height: 46,
              left: c.left,
              right: c.right,
              top: c.top,
              bottom: c.bottom,
              borderTop: c.bt ? `8px solid ${locked ? C.blue : C.white}` : undefined,
              borderBottom: c.bb ? `8px solid ${locked ? C.blue : C.white}` : undefined,
              borderLeft: c.bl ? `8px solid ${locked ? C.blue : C.white}` : undefined,
              borderRight: c.br ? `8px solid ${locked ? C.blue : C.white}` : undefined,
              borderRadius: 14,
              ...(c.bt && c.bl ? {borderBottomLeftRadius: 0, borderTopRightRadius: 0} : {}),
            }}
          />
        ))}
      </div>

      {/* UI caméra */}
      <StatusBar />
      <div style={{position: 'absolute', top: 96, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <span style={{...inter(26, 700, C.white), background: C.blue, borderRadius: 999, padding: '12px 26px', display: 'flex', alignItems: 'center', gap: 10}}>
          {locked ? (
            <>
              <Check size={28} p={tw(t, [38, 44], [0, 1])} /> Date trouvée
            </>
          ) : (
            'Vise la date limite'
          )}
        </span>
      </div>
      <div style={{position: 'absolute', bottom: 70, left: SCREEN.w / 2 - 54, width: 108, height: 108, borderRadius: 54, border: `7px solid ${C.white}`, padding: 7}}>
        <div style={{width: '100%', height: '100%', borderRadius: 50, background: C.white}} />
      </div>

      {/* fiche produit qui monte */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: sheetY,
          height: 470,
          background: C.white,
          borderRadius: '38px 38px 0 0',
          boxShadow: '0 -14px 40px rgba(14,26,58,0.22)',
          padding: '18px 34px',
        }}
      >
        <div style={{width: 72, height: 8, borderRadius: 4, background: 'rgba(14,26,58,0.18)', margin: '0 auto 22px'}} />
        <div style={{...inter(36, 800), letterSpacing: '-0.03em'}}>{jambon.name}</div>
        <div style={{...inter(22, 600, 'rgba(14,26,58,0.6)'), marginTop: 6}}>Boucherie · ×8 en rayon</div>
        <div style={{marginTop: 22, display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 260, height: 72, borderRadius: 18, border: `3px dashed ${C.blue}`, background: C.blueLight}} />
          <div style={{opacity: showJ > 0 ? 1 : 0, transform: `scale(${0.6 + showJ * 0.4})`}}>
            <Chip color={C.soon} size={26}>
              {`J-${jambon.daysLeft}`}
            </Chip>
          </div>
        </div>
        <div style={{marginTop: 28}}>
          <AppButton width="100%" height={80}>
            Ajouter au suivi
          </AppButton>
        </div>
      </div>

      {/* la date qui s'envole */}
      {t >= 48 ? (
        <div
          style={{
            position: 'absolute',
            left: cx,
            top: cy,
            transform: `scale(${chipScale}) rotate(${(1 - fly) * -4}deg)`,
            transformOrigin: '0 50%',
            ...inter(42, 800, C.white),
            background: C.blue,
            borderRadius: 14,
            padding: '8px 18px',
            whiteSpace: 'nowrap',
            boxShadow: `0 ${8 + Math.sin(fly * Math.PI) * 16}px 20px rgba(14,26,58,0.25)`,
          }}
        >
          {jambon.dateType} {jambon.date}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════ ÉCRAN 2 : LISTE (tri, alerte, validation)
const UNSORTED = ['yaourt', 'creme', 'comte', 'jambon', 'salade', 'merguez'];

const ListScreen: React.FC<{t: number; ph: ReturnType<typeof usePhases>}> = ({t, ph}) => {
  const sorted = CONFIG.products.slice().sort((a, b) => a.daysLeft - b.daysLeft);
  const ts = t - ph.sort;
  const ta = t - ph.alert;
  const td = t - ph.done;
  const alertId = CONFIG.alert.productId;
  const alertIdx = sorted.findIndex((p) => p.id === alertId);

  // validation
  const expand = td > 0 ? sp(td, 2, SPRING_UI) : 0;
  const extraH = expand * 156 * (1 - tw(td, [68, 78], [0, 1], EASE_IN));
  const press = tws(td, [11, 14, 18], [0, 1, 0]);
  const checkP = tw(td, [18, 26], [0, 1], EASE_OUT);
  const doneP = tw(td, [22, 26], [0, 1], EASE_OUT);
  const outX = tw(td, [66, 76], [0, 1], EASE_IN);
  const collapse = sp(td, 72, SPRING_PHYS);
  const removed = td >= 76;
  const remaining = removed ? sorted.filter((p) => p.id !== alertId) : sorted;

  const cards = UNSORTED.map((id, k) => {
    const p = productById(id) as Product;
    const rank = sorted.findIndex((q) => q.id === id);
    const appear = sp(ts, 2 + k * 3, {stiffness: 420, damping: 20});
    const move = sp(ts, 24 + rank * 2, SPRING_PHYS);
    let y = LIST_TOP + (k + (rank - k) * move) * STEP;
    // après la validation : décalage sous la carte dépliée, puis remontée
    if (rank > alertIdx) y += extraH - (td >= 72 ? STEP * collapse : 0);
    const lift = Math.sin(Math.min(1, move) * Math.PI) * (rank === k ? 0 : 1);
    const isAlert = id === alertId;
    const ring = isAlert ? tws(ta, [8, 12, 60, 70], [0, 1, 1, 0]) : 0;
    return {p, k, rank, y, lift, appear, isAlert, ring, up: rank < k};
  });
  // les cartes qui montent passent au-dessus
  const order = cards.slice().sort((a, b) => Number(a.up) - Number(b.up) || a.lift - b.lift);

  return (
    <AbsoluteFill style={{background: C.paper}}>
      <StatusBar />
      <AppHeader title="À écouler" subtitle={<UrgencySummary products={remaining} />} />
      {order.map(({p, y, lift, appear, isAlert, ring}) => {
        if (ts < 2) return null;
        const hidden = isAlert && removed;
        if (hidden) return null;
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: 22,
              top: y,
              transform: `translateX(${isAlert ? outX * 640 : 0}px) translateY(${(1 - appear) * -50}px) scale(${0.7 + appear * 0.3})`,
              opacity: appear > 0 ? 1 : 0,
            }}
          >
            <ProductCard
              p={p}
              width={CARD_W}
              lift={lift}
              ring={ring}
              done={isAlert ? doneP : 0}
              extraH={isAlert ? extraH : 0}
              badge={
                isAlert && t >= ph.alert + 47 ? (
                  <div style={{position: 'absolute', right: -14, top: -12, transform: 'rotate(-14deg)'}}>
                    <Sticker text={CONFIG.alert.discount} size={56} />
                  </div>
                ) : null
              }
              extra={
                isAlert ? (
                  <div style={{paddingTop: 6}}>
                    <div style={{...inter(22, 600, 'rgba(14,26,58,0.7)'), display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
                      <span style={{...inter(22, 800, C.blue)}}>{CONFIG.alert.discount}</span> appliqué · étiquette posée
                    </div>
                    <div style={{position: 'relative'}}>
                      <AppButton width="100%" height={84} press={press} color={doneP > 0 ? C.ok : C.blue} size={32}>
                        {CONFIG.alert.done} <Check size={34} p={checkP} stroke={3.6} />
                      </AppButton>
                      <TapRing x={(CARD_W - 52) / 2} y={42} at={ph.done + 14} />
                    </div>
                  </div>
                ) : null
              }
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════ NOTIFICATION
const Notification: React.FC<{ta: number; base: number}> = ({ta, base}) => {
  const inP = sp(ta, 3, SPRING_UI);
  const out = tw(ta, [86, 94], [0, 1], EASE_IN);
  const ding = ta > 12 && ta < 22 ? Math.sin((ta - 12) * 2.2) * (1 - (ta - 12) / 10) * 2.2 : 0;
  const open = sp(ta, 16, SPRING_UI);
  const press = tws(ta, [31, 34, 38], [0, 1, 0]);
  const y = -320 + inP * 390 - out * 420;
  if (ta < 3) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        top: y,
        background: C.white,
        borderRadius: 34,
        padding: '22px 24px 22px',
        boxShadow: '0 22px 50px rgba(14,26,58,0.28), 0 0 0 2px rgba(14,26,58,0.06)',
        transform: `rotate(${ding}deg)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <AppIcon size={46} />
        <span style={{...inter(22, 700, 'rgba(14,26,58,0.6)'), letterSpacing: '0.06em', flex: 1}}>FRESCY</span>
        <span style={inter(21, 600, 'rgba(14,26,58,0.5)')}>maintenant</span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 16}}>
        <Clock size={36} />
        <span style={{...inter(32, 800), letterSpacing: '-0.025em', whiteSpace: 'nowrap'}}>{CONFIG.alert.title}</span>
      </div>
      <div style={{display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 10}}>
        <ArrowRight size={30} color={C.blue} style={{marginTop: 2}} />
        <span style={{...inter(27, 600, 'rgba(14,26,58,0.85)'), lineHeight: 1.25}}>{CONFIG.alert.body}</span>
      </div>
      <div style={{height: open * 108, overflow: 'hidden'}}>
        <div style={{display: 'flex', gap: 14, paddingTop: 22}}>
          <div style={{flex: 1, position: 'relative'}}>
            <AppButton width="100%" height={76} size={24} press={press}>
              {CONFIG.alert.actionA}
            </AppButton>
            <TapRing x={118} y={38} at={base + 34} />
          </div>
          <div style={{flex: 1}}>
            <AppButton width="100%" height={76} size={24} outline>
              {CONFIG.alert.actionB}
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════ BANDE ADHÉSIVE (légendes Anton)
const TAPE = {left: 36, top: 1352, w: 878, h: 150};

const Tape: React.FC<{t: number; ph: ReturnType<typeof usePhases>}> = ({t, ph}) => {
  const captions = [
    {at: 14, text: TX.scan.caption},
    {at: ph.sort + 4, text: TX.sort.caption},
    {at: ph.alert + 4, text: TX.alert.caption},
    {at: ph.done + 12, text: TX.done.caption},
  ];
  const slap = sp(t, 10, SPRING_PHYS);
  // la légende courante reste affichée jusqu'à l'entrée de la suivante (sa sortie se joue juste avant)
  const idx = captions.reduce((acc, c, i) => (t >= c.at ? i : acc), 0);
  const cur = captions[idx];
  const next = captions[idx + 1];
  const words = cur.text.split(' ');
  // taille auto selon la longueur (Anton ≈ 0,46 em / caractère)
  const size = Math.min(122, 790 / (cur.text.length * 0.46));
  const exitAt = next ? next.at - 6 : undefined;
  const reslap = idx > 0 ? sp(t, cur.at - 2, {stiffness: 500, damping: 16}) : 1;
  if (t < 10) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: TAPE.left,
        top: TAPE.top,
        width: TAPE.w,
        height: TAPE.h,
        transform: `rotate(${-3 + (1 - slap) * -6}deg) scale(${1.25 - slap * 0.25 + (1 - reslap) * 0.03})`,
        transformOrigin: '30% 50%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: C.blue,
          clipPath:
            'polygon(0% 6%, 1.4% 0%, 98.4% 0%, 100% 9%, 99.1% 22%, 100% 38%, 99.2% 55%, 100% 74%, 99% 90%, 98.6% 100%, 1.6% 100%, 0% 92%, 0.9% 75%, 0% 58%, 1% 40%, 0% 22%)',
          boxShadow: '0 10px 0 rgba(20,45,140,0.25)',
        }}
      />
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: size * 0.22}}>
        {words.map((w, i) => {
          const at = cur.at + i * 6;
          const p = tw(t, [at, at + 8], [0, 1], EASE_OUT);
          const o = exitAt !== undefined ? tw(t, [exitAt + i, exitAt + i + 5], [0, 1], EASE_IN) : 0;
          return (
            <span key={`${idx}-${i}`} style={{display: 'inline-block', overflow: 'hidden', paddingTop: size * 0.2, marginTop: -size * 0.2, height: size * 1.02 + size * 0.2}}>
              <span style={{...anton(size, C.white), display: 'inline-block', lineHeight: 1.02, transform: `translateY(${(1 - p) * 110 - o * 120}%)`}}>{w}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════ SCÈNE
export const Demo: React.FC = () => {
  const t = useT();
  const ph = usePhases();

  // intro : l'écran bleu plein cadre rétrécit et devient l'écran du téléphone
  const intro = tw(t, [0, 16], [0, 1], EASE_OUT);
  const scale = INTRO_SCALE + (1 - INTRO_SCALE) * intro;
  const cxp = 540 + (PX - 540) * intro;
  const cyp = 960 + (PY - 960) * intro;

  // inclinaison par phase (ressort à chaque changement)
  const tilts = [
    {at: 0, x: 4, y: 9, z: -2.5},
    {at: ph.sort, x: 5, y: -8, z: 2},
    {at: ph.alert, x: 3, y: 7, z: -1.5},
    {at: ph.done, x: 4, y: -6, z: 1.5},
  ];
  let rot = {x: 0, y: 0, z: 0};
  tilts.forEach((k, i) => {
    const prev = i === 0 ? {x: 0, y: 0, z: 0} : tilts[i - 1];
    const s = i === 0 ? intro : sp(t, k.at, SPRING_PHYS);
    if (t >= k.at) rot = {x: prev.x + (k.x - prev.x) * s, y: prev.y + (k.y - prev.y) * s, z: prev.z + (k.z - prev.z) * s};
  });

  const ta = t - ph.alert;
  const td = t - ph.done;

  // gros paquet de jambon au premier plan (scène alerte)
  const packIn = sp(ta, 20, SPRING_PHYS);
  const packOut = tw(td, [2, 11], [0, 1], EASE_IN);
  const packX = 1240 - packIn * 690 + packOut * 700;
  const packY = 930;
  const packR = 9 - packIn * 2;

  // sticker : part du bouton tapé, vole et se colle de travers sur le paquet
  const stAt = ph.alert + 36;
  const stLand = ph.alert + 47;
  const [bx, by] = toFrame(150, 560);
  const flyP = tw(t, [stAt, stLand], [0, 1], EASE_OUT);
  const slap = sp(t, stLand, SPRING_BOUNCY);
  const target = [packX + 150, packY + 100];
  const sx = t < stLand ? bx + (target[0] - bx) * flyP : target[0];
  const sy = t < stLand ? by + (target[1] - by) * flyP - Math.sin(flyP * Math.PI) * 260 : target[1];
  const sScale = t < stLand ? 0.35 + flyP * 1.0 : 1.35 - slap * 0.35;
  const sRot = t < stLand ? -220 + flyP * 190 : -30 + slap * 16;

  // notes Caveat
  const notes = [
    {at: 34, lines: TX.scan.note, x: 650, y: 640, arrow: {d: 'M70 10 C 30 30, 10 70, -40 92', head: 'M-10 70 L-42 94 L-6 108', x: 640, y: 770}},
    {at: ph.sort + 46, lines: TX.sort.note, x: 652, y: 470, arrow: {d: 'M60 10 C 20 10, -10 40, -60 70', head: 'M-34 50 L-62 72 L-28 86', x: 650, y: 600}},
    {at: ph.alert + 52, lines: TX.alert.note, x: 640, y: 690, arrow: {d: 'M120 0 C 150 40, 150 70, 120 110', head: 'M150 92 L120 112 L104 80', x: 700, y: 800}},
    {at: ph.done + 20, until: ph.done + 66, lines: TX.done.note, x: 634, y: 600, arrow: {d: 'M70 0 C 50 60, 10 110, -60 140', head: 'M-28 124 L-62 141 L-36 168', x: 670, y: 846}},
  ];
  const phaseEnd = [ph.sort, ph.alert, ph.done, ph.end];

  return (
    <Paper>
      {/* plan objets : téléphone */}
      <Phone x={cxp} y={cyp} scale={scale} rotX={rot.x} rotY={rot.y} rotZ={rot.z}>
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
        <div style={{position: 'absolute', left: packX, top: packY, transform: `rotate(${packR}deg)`}}>
          <ProductArt art="jambon" size={380} />
        </div>
      ) : null}
      {t >= stAt && td < 12 ? (
        <div style={{position: 'absolute', left: sx - 95, top: sy - 95, transform: `rotate(${sRot}deg) scale(${sScale})`}}>
          <Sticker text={CONFIG.alert.discount} size={190} />
        </div>
      ) : null}

      {/* annotations à la main */}
      {notes.map((n, i) =>
        t >= n.at && t < ('until' in n && n.until ? n.until : phaseEnd[i]) ? (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: n.x, top: n.y}}>
              <HandText lines={n.lines} at={n.at} size={74} rotate={-5} speed={0.75} />
            </div>
            <HandPath
              at={n.at + handDuration(n.lines, 0.75)}
              dur={6}
              viewBox="-100 -20 300 220"
              w={300}
              h={220}
              style={{left: n.arrow.x - 100, top: n.arrow.y - 20}}
              d={n.arrow.d}
              arrowHead={n.arrow.head}
            />
          </React.Fragment>
        ) : null,
      )}

      {/* légende sur bande adhésive */}
      <Tape t={t} ph={ph} />
    </Paper>
  );
};

export const DEMO_LAYOUT = {PX, PY, PHONE, TAPE};
