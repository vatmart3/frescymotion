import React from 'react';
import {C, CONFIG, Product} from '../config';

/**
 * Illustrations plates façon risographie mono-bleue : aplats bleu / bleu clair / blanc,
 * trait encre fin. Les couleurs d'état (vert/orange/rouge) restent réservées à l'urgence.
 * Toutes dans une boîte 200×200.
 */
const S = {stroke: C.ink, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const label = (x: number, y: number, txt: string, size = 15, fill: string = C.white) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={CONFIG.fonts.ui} fontWeight={800} fontSize={size} fill={fill} letterSpacing="0.04em">
    {txt}
  </text>
);

const Yaourt = () => (
  <g>
    {/* deux pots devant, sous fourreau carton */}
    {[0, 1].map((i) => (
      <g key={i} transform={`translate(${i * 58 - 29} 0)`}>
        <path d="M58 70 L142 70 L132 178 Q131 186 123 186 L77 186 Q69 186 68 178 Z" fill={C.white} {...S} />
        <rect x={52} y={56} width={96} height={18} rx={6} fill={C.blueLight} {...S} />
        <path d="M62 104 L138 104 L134 146 L66 146 Z" fill={C.blue} stroke="none" />
        <circle cx={100} cy={125} r={11} fill={C.white} />
      </g>
    ))}
    <rect x={20} y={150} width={160} height={40} rx={6} fill={C.blueDeep} {...S} />
    {label(100, 176, 'NATURE ×6', 16)}
  </g>
);

const Jambon = () => (
  <g>
    <rect x={18} y={62} width={164} height={112} rx={16} fill={C.blueLight} {...S} />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${i * 9} ${i * -6})`}>
        <path d="M36 150 C 30 110, 60 86, 100 88 C 142 90, 168 112, 160 146 C 150 170, 46 172, 36 150 Z" fill={C.white} {...S} />
        <path d="M44 146 C 42 118, 66 98, 100 100 C 136 102, 154 120, 150 142" fill="none" stroke={C.blue} strokeWidth={6} strokeLinecap="round" />
      </g>
    ))}
    <path d="M30 76 L70 70" stroke={C.white} strokeWidth={6} strokeLinecap="round" opacity={0.9} />
    <rect x={26} y={44} width={104} height={30} rx={4} fill={C.blue} {...S} />
    {label(78, 65, 'JAMBON', 15)}
  </g>
);

const Creme = () => (
  <g>
    <path d="M40 84 L160 84 L152 176 Q151 184 143 184 L57 184 Q49 184 48 176 Z" fill={C.white} {...S} />
    <rect x={32} y={64} width={136} height={24} rx={9} fill={C.blue} {...S} />
    <path d="M52 118 C 72 108, 88 128, 108 118 S 140 110, 150 118" fill="none" stroke={C.blue} strokeWidth={6} strokeLinecap="round" />
    {label(100, 152, 'CRÈME', 20, C.blueDeep)}
    {label(100, 172, '20 cl', 13, C.ink)}
  </g>
);

const Salade = () => (
  <g>
    <path d="M30 130 C 28 80, 62 50, 100 50 C 138 50, 172 80, 170 130 C 168 170, 138 188, 100 188 C 62 188, 32 170, 30 130 Z" fill={C.blueLight} {...S} />
    <path d="M52 140 C 50 100, 72 78, 100 78 C 128 78, 150 100, 148 140 C 146 166, 126 178, 100 178 C 74 178, 54 166, 52 140 Z" fill={C.white} {...S} />
    <path d="M100 78 L100 176 M100 128 L76 106 M100 150 L126 126 M100 108 L120 92" fill="none" stroke={C.blue} strokeWidth={5} strokeLinecap="round" />
    <path d="M30 130 C 44 120, 50 104, 46 92 M170 130 C 156 120, 150 104, 154 92" fill="none" {...S} />
  </g>
);

const Comte = () => (
  <g>
    <path d="M22 168 L178 168 L178 66 Z" fill={C.white} {...S} />
    <path d="M178 66 L178 168 L162 168 L162 82 Z" fill={C.blue} {...S} />
    <ellipse cx={130} cy={140} rx={9} ry={7} fill={C.blueLight} {...S} strokeWidth={3.5} />
    <ellipse cx={104} cy={152} rx={6} ry={5} fill={C.blueLight} {...S} strokeWidth={3.5} />
    <ellipse cx={142} cy={112} rx={5} ry={4} fill={C.blueLight} {...S} strokeWidth={3.5} />
    <rect x={30} y={174} width={96} height={22} rx={4} fill={C.blueDeep} />
    {label(78, 190, '18 MOIS', 14)}
  </g>
);

const Merguez = () => (
  <g>
    <rect x={14} y={70} width={172} height={104} rx={16} fill={C.blueLight} {...S} />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <path d={`M34 ${100 + i * 24} C 70 ${88 + i * 24}, 130 ${112 + i * 24}, 166 ${98 + i * 24}`} fill="none" stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
        <path d={`M34 ${100 + i * 24} C 70 ${88 + i * 24}, 130 ${112 + i * 24}, 166 ${98 + i * 24}`} fill="none" stroke={C.blueDeep} strokeWidth={13} strokeLinecap="round" />
        <path d={`M52 ${95 + i * 24} C 70 ${91 + i * 24}, 86 ${95 + i * 24}, 98 ${98 + i * 24}`} fill="none" stroke={C.white} strokeWidth={3} strokeLinecap="round" opacity={0.8} />
      </g>
    ))}
    <rect x={110} y={52} width={80} height={28} rx={4} fill={C.blue} {...S} />
    {label(150, 72, 'MERGUEZ', 13)}
  </g>
);

const ART: Record<Product['art'], React.FC> = {yaourt: Yaourt, jambon: Jambon, creme: Creme, salade: Salade, comte: Comte, merguez: Merguez};

export const ProductArt: React.FC<{art: Product['art']; size: number; style?: React.CSSProperties}> = ({art, size, style}) => {
  const A = ART[art];
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible', ...style}}>
      <A />
    </svg>
  );
};

/**
 * Poubelle à pédale. Couvercle articulé à l'arrière droit.
 * lid : 0 = fermé, 1 = grand ouvert.
 */
export const Bin: React.FC<{size: number; lid: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({size, lid, children, style}) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 200 260" style={{overflow: 'visible', ...style}}>
    <defs>
      <clipPath id="bin-mouth">
        <rect x={-200} y={-600} width={600} height={672} />
      </clipPath>
    </defs>
    {/* contenu qui tombe dedans (masqué par le corps) */}
    <g clipPath="url(#bin-mouth)">{children}</g>
    <path d="M30 70 L170 70 L158 232 Q157 242 147 242 L53 242 Q43 242 42 232 Z" fill={C.blueDeep} {...S} />
    {[70, 100, 130].map((x) => (
      <path key={x} d={`M${x} 92 L${x - (x - 100) * 0.08} 220`} stroke={C.blue} strokeWidth={8} strokeLinecap="round" />
    ))}
    <rect x={64} y={236} width={34} height={12} rx={5} fill={C.blueDeep} {...S} />
    <g transform={`rotate(${lid * 98} 176 66)`}>
      <rect x={20} y={50} width={160} height={22} rx={10} fill={C.blue} {...S} />
      <rect x={82} y={40} width={36} height={12} rx={5} fill={C.ink} {...S} />
    </g>
  </svg>
);

/** Étiquette de prix papier sous le produit (DLC) */
export const ShelfTag: React.FC<{date: string; color: string; width?: number; type?: string; urgentLabel?: string}> = ({
  date,
  color,
  width = 190,
  type = 'DLC',
  urgentLabel,
}) => (
  <div
    style={{
      width,
      height: 74,
      background: C.white,
      border: `4px solid ${C.ink}`,
      borderRadius: 6,
      display: 'flex',
      overflow: 'hidden',
      boxShadow: '0 4px 0 rgba(14,26,58,0.15)',
    }}
  >
    <div style={{width: 22, background: color}} />
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 12}}>
      <span style={{fontFamily: CONFIG.fonts.ui, fontWeight: 600, fontSize: 18, color: C.ink, opacity: 0.7, lineHeight: 1}}>{urgentLabel ?? type}</span>
      <span style={{fontFamily: CONFIG.fonts.ui, fontWeight: 800, fontSize: 30, color, lineHeight: 1.05, fontFeatureSettings: '"tnum" 1'}}>{date}</span>
    </div>
  </div>
);

/** Version <g> (à imbriquer dans un autre SVG, boîte 200×200) */
export const ArtG: React.FC<{art: Product['art']}> = ({art}) => {
  const A = ART[art];
  return <A />;
};
