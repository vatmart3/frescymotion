import React from 'react';
import {C, CONFIG, Product, dayLabel, urgencyColor, urgencyOf} from '../config';
import {ProductArt} from './Art';
import {inter} from './Base';
import {AppIcon, Check} from './Icons';

/** Barre d'état du téléphone */
export const StatusBar: React.FC<{color?: string}> = ({color = C.ink}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 44px 0'}}>
    <span style={inter(26, 700, color)}>9:41</span>
    <span style={{display: 'flex', gap: 8, alignItems: 'flex-end'}}>
      {[10, 15, 20, 25].map((h) => (
        <span key={h} style={{width: 6, height: h, borderRadius: 2, background: color}} />
      ))}
      <span style={{width: 40, height: 20, borderRadius: 6, border: `2.5px solid ${color}`, marginLeft: 8, padding: 2, display: 'flex'}}>
        <span style={{flex: 1, borderRadius: 2, background: color}} />
      </span>
    </span>
  </div>
);

/** En-tête de l'appli */
export const AppHeader: React.FC<{title: string; subtitle?: React.ReactNode}> = ({title, subtitle}) => (
  <div style={{position: 'absolute', left: 30, right: 30, top: 86}}>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <AppIcon size={44} />
        <span style={{...inter(30, 800), letterSpacing: '-0.04em'}}>{CONFIG.brand.name}</span>
      </div>
      <span style={inter(22, 600, 'rgba(14,26,58,0.62)')}>{CONFIG.today.label}</span>
    </div>
    <div style={{...inter(46, 800), letterSpacing: '-0.035em', marginTop: 22}}>{title}</div>
    {subtitle ? <div style={{marginTop: 10}}>{subtitle}</div> : null}
  </div>
);

export const Chip: React.FC<{color: string; children: React.ReactNode; size?: number}> = ({color, children, size = 22}) => (
  <span
    style={{
      ...inter(size, 700, C.white),
      background: color,
      borderRadius: 999,
      padding: `${size * 0.22}px ${size * 0.62}px`,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
    }}
  >
    {children}
  </span>
);

/** Résumé "2 urgents · 2 bientôt · 2 ok" */
export const UrgencySummary: React.FC<{products: Product[]}> = ({products}) => {
  const n = (u: string) => products.filter((p) => urgencyOf(p.daysLeft) === u).length;
  const item = (count: number, label: string, color: string) => (
    <span style={{display: 'inline-flex', alignItems: 'center', gap: 8}}>
      <span style={{width: 14, height: 14, borderRadius: 7, background: color}} />
      <span style={inter(22, 600, 'rgba(14,26,58,0.75)')}>
        {count} {label}
      </span>
    </span>
  );
  return (
    <div style={{display: 'flex', gap: 22}}>
      {item(n('urgent'), n('urgent') > 1 ? 'urgents' : 'urgent', C.urgent)}
      {item(n('soon'), 'bientôt', C.soon)}
      {item(n('ok'), 'tranquille' + (n('ok') > 1 ? 's' : ''), C.ok)}
    </div>
  );
};

export const CARD_H = 124;

/**
 * Carte produit de la liste. `done` (0→1) bascule la carte au vert "Fait".
 * `extra` : zone dépliée sous la carte (hauteur `extraH`).
 */
export const ProductCard: React.FC<{
  p: Product;
  width: number;
  done?: number;
  lift?: number;
  ring?: number;
  extraH?: number;
  extra?: React.ReactNode;
  badge?: React.ReactNode;
}> = ({p, width, done = 0, lift = 0, ring = 0, extraH = 0, extra, badge}) => {
  const u = urgencyOf(p.daysLeft);
  const col = done > 0.5 ? C.ok : urgencyColor(u);
  return (
    <div
      style={{
        width,
        height: CARD_H + extraH,
        background: C.white,
        borderRadius: 24,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 ${2 + lift * 18}px ${6 + lift * 30}px rgba(14,26,58,${0.1 + lift * 0.12}), 0 0 0 ${ring * 5}px ${C.blue}`,
        transform: `scale(${1 + lift * 0.035})`,
      }}
    >
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, background: col}} />
      <div style={{position: 'absolute', left: 28, top: 16, width: 92, height: 92, borderRadius: 20, background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <ProductArt art={p.art} size={80} />
        {badge}
      </div>
      <div style={{position: 'absolute', left: 140, right: 18, top: 19}}>
        <div style={{...inter(31, 600), whiteSpace: 'nowrap', letterSpacing: '-0.02em'}}>{p.name}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 12}}>
          <span style={inter(24, 600, 'rgba(14,26,58,0.62)')}>
            {p.dateType} {p.date}
          </span>
          <Chip color={col}>
            {done > 0.5 ? (
              <>
                <Check size={22} p={Math.min(1, (done - 0.5) * 2)} stroke={3.6} /> Fait
              </>
            ) : (
              dayLabel(p.daysLeft)
            )}
          </Chip>
        </div>
      </div>
      {extraH > 0 ? <div style={{position: 'absolute', left: 30, right: 22, top: CARD_H - 4, height: extraH}}>{extra}</div> : null}
    </div>
  );
};

/** Gros bouton bleu de l'appli. press : 0→1 (s'enfonce de 2 px) */
export const AppButton: React.FC<{
  children: React.ReactNode;
  width: number | string;
  height?: number;
  press?: number;
  color?: string;
  textColor?: string;
  size?: number;
  outline?: boolean;
}> = ({children, width, height = 84, press = 0, color = C.blue, textColor = C.white, size = 30, outline}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 22,
      background: outline ? C.white : color,
      border: outline ? `3px solid ${color}` : 'none',
      boxShadow: outline ? "none" : `0 ${5 - press * 2}px 0 ${C.blueDeep}`,
      transform: `translateY(${press * 2}px)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      ...inter(size, 700, outline ? color : textColor),
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);
