# FRESCY · vidéos de lancement (Remotion)

Deux compositions :

| ID | Format | Durée | État |
|---|---|---|---|
| `Frescy-Vertical` | 1080×1920 (9:16), 30 i/s | 35,0 s (56 temps à 96 BPM) | ✅ prête à valider |
| `Frescy-Horizontal` | 1920×1080 (16:9), 30 i/s | 40 s | ⏳ après validation de la 9:16 |

## Démarrer

```bash
npm install
npm run studio          # Remotion Studio → http://localhost:3000
```

Dans le Studio, coche la prop `showSafeZones` pour afficher les zones TikTok/Reels (haut 220 px, bas 400 px, droite 140 px).

## Exporter

```bash
npx remotion render Frescy-Vertical out/frescy-vertical-9x16.mp4 --codec=h264 --crf=16
```

(= `npm run render:vertical`). En 60 i/s : passer `fps: 60` dans `src/config.ts`, tous les timings suivent.

## Tout changer en 10 secondes : `src/config.ts`

Couleurs, textes, produits (noms, dates, prix), seuils d'urgence, textes de l'alerte, chiffres du relevé,
découpage des scènes **en temps musicaux** (`vertical.beats`) et tempo (`bpm`) : baisser le BPM ralentit toute la vidéo en gardant les coupes sur les temps. Le total du ticket « TOTAL JETÉ » est recalculé
automatiquement à partir des prix.

## Structure

```
src/config.ts              ← LE fichier à modifier
src/lib/motion.ts          courbes (ease-out 0.16,1,0.3,1 / ease-in), ressorts (300/18), secousse, bruit
src/components/            Kinetic (Anton mot par mot, par masque), Hand (Caveat + traits qui tremblent),
                           Stamp (tampon), Receipt (ticket qui s'imprime), Leaf (feuille, logo, essuyage),
                           Curtain (ticket-rideau), Device (téléphone 2,5D, tap, sticker, odomètre),
                           AppUI (vraie UI Frescy), Art (illustrations SVG plates), Icons
src/scenes/vertical/       Hook, Problem, Twist, Demo (scan → tri → alerte → validation), Result, Signature
public/fonts/              Anton, Inter (500–800), Caveat (600–700) en .woff2 local
```

## Temps forts (96 BPM, 1 temps = 0,625 s) — pour caler la musique dans CapCut

Mesures (tous les 4 temps) : **0,00 · 2,50 · 5,00 · 7,50 · 10,00 · 12,50 · 15,00 · 17,50 · 20,00 · 22,50 · 25,00 · 27,50 · 30,00 · 32,50 · 35,00**

Coupes de scène (toutes sur un temps) :

| Temps | Timecode | Scène |
|---|---|---|
| 0 | 0,00 s | Hook |
| 4 | 2,50 s | Problème |
| 13 | 8,12 s | Twist (feuille → bleu) |
| 17 | 10,62 s | Démo · scan |
| 22 | 13,75 s | Démo · tri |
| 28 | 17,50 s | Démo · alerte |
| 34 | 21,25 s | Démo · validation |
| 40 | 25,00 s | Résultat (ticket-rideau à 24,54 s) |
| 48 | 30,00 s | Signature + CTA (image fixe à partir de 33,28 s) |

## Bruitages à caler (9:16)

| Timecode (s) | Son | Quoi |
|---|---|---|
| 0,00 | sifflement court | le yaourt tombe |
| 0,46 | « toc » plastique | il tape le rebord |
| 1,15 | **« clac »** poubelle | le couvercle claque |
| 1,76 → 2,22 | feutre | « sois honnête » s’écrit |
| 2,61 → 4,49 (à-coups : 3,42 · 3,76 · 4,10 · 4,45) | imprimante thermique | ticket des pertes |
| 2,73 · 3,07 · 3,42 · 3,76 | « tic » léger | étiquettes qui virent à l’orange |
| 3,34 · 3,68 · 4,03 · 4,37 | « bloup » sourd | produits qui tombent du rayon |
| 4,83 | **« ding »** de caisse | TOTAL JETÉ 11,10 € |
| 5,63 | **« tchac »** tampon + mini-secousse | PERDU |
| 8,12 → 8,70 | frottement feuille | essuyage vers le bleu |
| 9,39 | « pop » doux | la feuille se plante sur le y |
| 10,62 → 11,24 | « zoup » | l’écran bleu rentre dans le téléphone |
| 12,08 | « bip » / « tic » | date détectée |
| 12,92 | « pop » | la date se pose dans la fiche |
| 13,83 → 14,40 | 6 « tic » en cascade | les cartes tombent dans la liste |
| 14,67 → 15,12 | glissé de cartes | tri par urgence |
| 17,61 / 17,96 | glissé + **« ding »** | notification |
| 18,80 | « tic » | tap « Passer à -20 % » |
| 19,30 | **« pop »** sticker | -20 % collé de travers |
| 21,94 | « tic » | tap « C’est fait » |
| 22,09 → 22,40 | « ding » validé | coche qui se dessine, carte verte |
| 22,93 | glissé | la carte quitte la liste |
| 24,54 → 25,38 | papier qui défile | ticket-rideau |
| 25,69 → 26,83 | cliquetis compteur | odomètre 0 → 23 |
| 26,83 | **« ding »** de caisse | fin du compteur |
| 28,13 | **« tchac »** tampon | SAUVÉ |
| 30,00 → 30,57 | frottement feuille | essuyage final |
| 31,91 → 32,60 | feutre | « PERD » barré puis effacé |
| 33,06 | « pop » doux | feuille posée sur le Y de FRESCY |

Musique conseillée : groove funky / lo-fi à **96 BPM** (basse ronde, guitare muted, batterie sèche), pas d'EDM épique.
Démarrer la musique pile à 0,00 s ; la vidéo boucle proprement (fond papier → fond papier).
