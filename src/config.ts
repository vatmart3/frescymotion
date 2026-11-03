/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  FRESCY · CONFIGURATION UNIQUE                              ║
 * ║  Couleurs, textes, produits, prix et timings : tout est ici. ║
 * ║  Change une valeur, le Studio se met à jour en direct.       ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Timings : les scènes sont calées en TEMPS (beats) sur le tempo `bpm`.
 *   1 temps = 60 / bpm secondes (96 BPM → 0,625 s).
 * Les animations ont été dessinées à 110 BPM : baisser `bpm` ralentit TOUT
 * (animations comprises) en gardant chaque coupe sur un temps.
 * Les micro-animations à l'intérieur des scènes sont exprimées en "ticks"
 * de 1/30 s, quel que soit le fps choisi (30 ou 60 fonctionnent).
 */

export type Urgency = 'ok' | 'soon' | 'urgent';

export type Product = {
  id: string;
  name: string;
  /** "DLC" ou "DDM" */
  dateType: 'DLC' | 'DDM';
  /** format JJ/MM */
  date: string;
  /** jours restants par rapport à `today` (0 = aujourd'hui) */
  daysLeft: number;
  /** prix jeté, en euros (scène "problème") */
  price: number;
  /** illustration à utiliser */
  art: 'yaourt' | 'jambon' | 'creme' | 'salade' | 'comte' | 'merguez';
  /** rayon (utilisé par la version 16:9) */
  aisle: 'Crèmerie' | 'Boucherie' | 'Fruits & légumes';
};

export const CONFIG = {
  // ───────────────────────── Technique
  fps: 30,
  bpm: 96,
  /** tempo de référence des animations (ne pas modifier) */
  designBpm: 110,

  // ───────────────────────── Couleurs (charte stricte)
  colors: {
    blue: '#1D3FBF', // Bleu Frescy
    blueDeep: '#142D8C', // fonds sombres, ombres
    ink: '#0E1A3A', // texte
    paper: '#FBFAF7', // fond clair principal
    blueLight: '#EEF1FB', // surfaces
    white: '#FFFFFF',
    // États de fraîcheur : UNIQUEMENT pour l'urgence
    ok: '#13804C',
    soon: '#C26A00',
    urgent: '#C8321F',
  },

  fonts: {
    title: 'Anton',
    ui: 'Inter',
    hand: 'Caveat',
  },

  // ───────────────────────── Grain papier (0.02 – 0.03 conseillé)
  grain: 0.022,

  // ───────────────────────── Marque
  brand: {
    name: 'Frescy',
    site: 'frescy.fr',
    instagram: '@frescyfr',
  },

  // ───────────────────────── Date du jour dans l'appli (sert aux "J-x")
  today: {label: 'Mardi 3 nov.', short: '03/11'},

  // ───────────────────────── Produits (vrais noms, vrais formats de date)
  products: [
    {id: 'creme', name: 'Crème fraîche 20 cl', dateType: 'DLC', date: '03/11', daysLeft: 0, price: 1.8, art: 'creme', aisle: 'Crèmerie'},
    {id: 'salade', name: 'Salade iceberg', dateType: 'DLC', date: '04/11', daysLeft: 1, price: 1.2, art: 'salade', aisle: 'Fruits & légumes'},
    {id: 'jambon', name: 'Jambon blanc 4 tr.', dateType: 'DLC', date: '05/11', daysLeft: 2, price: 3.9, art: 'jambon', aisle: 'Boucherie'},
    {id: 'merguez', name: 'Merguez ×6', dateType: 'DLC', date: '06/11', daysLeft: 3, price: 4.5, art: 'merguez', aisle: 'Boucherie'},
    {id: 'yaourt', name: 'Yaourt nature ×6', dateType: 'DLC', date: '08/11', daysLeft: 5, price: 4.2, art: 'yaourt', aisle: 'Crèmerie'},
    {id: 'comte', name: 'Comté 18 mois', dateType: 'DDM', date: '12/11', daysLeft: 9, price: 6.9, art: 'comte', aisle: 'Crèmerie'},
  ] as Product[],

  /** Seuils d'urgence (en jours restants) */
  urgency: {urgentMax: 1, soonMax: 3},

  // ───────────────────────── Scène "problème" : ticket des produits jetés
  wasteTicket: {
    header: 'INVENDUS · SEMAINE 45',
    /** ids des produits imprimés sur le ticket (dans l'ordre) */
    items: ['yaourt', 'jambon', 'creme', 'salade'],
    totalLabel: 'TOTAL JETÉ',
  },

  // ───────────────────────── Scène "alerte"
  alert: {
    productId: 'jambon',
    qty: 8,
    discount: '-20 %',
    title: 'J-2 · Jambon blanc ×8',
    body: 'Passe-le à -20 % ou mets-le en avant',
    actionA: 'Passer à -20 %',
    actionB: 'Mettre en avant',
    done: 'C’est fait',
  },

  // ───────────────────────── Scène "résultat" (exemple d'écran, pas une statistique)
  result: {
    header: 'TON RELEVÉ · NOVEMBRE',
    savedLabel: 'Produits sauvés ce mois',
    savedValue: 23,
    weekLabel: 'Rien jeté cette semaine',
    disclaimer: 'exemple d’écran de l’appli',
  },

  // ───────────────────────── VERSION B « net » : intertitres et pastilles d'annotation
  net: {
    sections: {
      problem: '01 — LE CONSTAT',
      scan: '02 — SCAN',
      sort: '03 — TRI',
      alert: '04 — ALERTE',
      done: '05 — VALIDATION',
      result: '06 — RÉSULTAT',
    },
    callouts: {
      scan: '1 photo,\nc’est tout',
      sort: 'L’urgent\nen haut',
      alert: 'Prévenu\nà J-2',
      done: '1 tap.\nZéro\nformation.',
    },
  },

  // ───────────────────────── VERSION VERTICALE 9:16
  vertical: {
    width: 1080,
    height: 1920,
    /** zones de sécurité TikTok / Reels (px) */
    safe: {top: 220, bottom: 400, right: 140, left: 0},
    /** début de chaque scène, en temps (beats). `end` = durée totale. */
    beats: {
      hook: 0,
      problem: 4,
      twist: 13,
      scan: 17,
      sort: 22,
      alert: 28,
      done: 34,
      result: 40,
      signature: 48,
      end: 56, // 56 temps × 0,625 s = 35,0 s
    },
    texts: {
      hook: {
        lines: [['COMBIEN'], ['T’AS', 'JETÉ'], ['CETTE'], ['SEMAINE ?']],
        note: 'sois honnête',
      },
      problem: {
        lineA: [['C’EST', 'PAS'], ['DU', 'GASPI.']],
        lineB: [['C’EST', 'TA'], ['MARGE.']],
      },
      twist: {tagline: 'pour les commerces de quartier'},
      scan: {caption: 'TU SCANNES.', note: ['1 photo.', 'c’est tout.']},
      sort: {caption: 'FRESCY TRIE.', note: ['l’urgent', 'en haut !']},
      alert: {caption: 'FRESCY PRÉVIENT.', note: ['et hop,', 'ça part.']},
      done: {caption: 'TOI, TU VENDS.', note: ['1 tap.', 'zéro', 'formation.']},
      result: {note: ['ton mois,', 'noir sur blanc']},
      signature: {
        lineA: ['AVEC', 'FRESCY,'],
        lineB: [['RIEN', 'NE'], ['SE', 'PERD.']],
        cta: 'Teste-le dans ton commerce',
        note: 'promis.',
      },
    },
  },
} as const;

export type Colors = typeof CONFIG.colors;
export const C = CONFIG.colors;

// ───────────────────────── Helpers dérivés (ne pas modifier)
export const urgencyOf = (daysLeft: number): Urgency =>
  daysLeft <= CONFIG.urgency.urgentMax ? 'urgent' : daysLeft <= CONFIG.urgency.soonMax ? 'soon' : 'ok';

export const urgencyColor = (u: Urgency) => (u === 'urgent' ? C.urgent : u === 'soon' ? C.soon : C.ok);

export const dayLabel = (daysLeft: number) =>
  daysLeft <= 0 ? 'Aujourd’hui' : daysLeft === 1 ? 'Demain' : `J-${daysLeft}`;

export const euro = (v: number) => `${v.toFixed(2).replace('.', ',')} €`;

export const productById = (id: string): Product => {
  const p = CONFIG.products.find((x) => x.id === id);
  if (!p) throw new Error(`Produit inconnu : ${id}`);
  return p;
};

/** Frame (au fps courant) d'un temps donné */
export const beatToFrame = (beat: number, fps: number = CONFIG.fps) => Math.round(((beat * 60) / CONFIG.bpm) * fps);
export const beatToSec = (beat: number) => (beat * 60) / CONFIG.bpm;
/** facteur de ralenti des animations (1 = tempo de référence) */
export const PACE = CONFIG.designBpm / CONFIG.bpm;
/** frames (au fps courant) → ticks d'animation */
export const framesToTicks = (frames: number, fps: number) => ((frames * 30) / fps) / PACE;
/** ticks d'animation → frames (au fps courant) */
export const ticksToFrames = (ticks: number, fps: number) => Math.round(((ticks * fps) / 30) * PACE);
