# FRESCY · vidéos de lancement (Remotion)

Deux compositions :

| ID | Format | Durée | État |
|---|---|---|---|
| `Frescy-Vertical` | 1080×1920 (9:16), 30 i/s | 30,0 s (55 temps à 110 BPM) | ✅ prête à valider |
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
découpage des scènes **en temps musicaux** (`vertical.beats`). Le total du ticket « TOTAL JETÉ » est recalculé
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

## Temps forts (110 BPM, 1 temps = 0,545 s) — pour caler la musique dans CapCut

Mesures (tous les 4 temps) : **0,00 · 2,18 · 4,36 · 6,55 · 8,73 · 10,91 · 13,09 · 15,27 · 17,45 · 19,64 · 21,82 · 24,00 · 26,18 · 28,36 · 30,00**

Coupes de scène (toutes sur un temps) :

| Temps | Timecode | Scène |
|---|---|---|
| 0 | 0,00 s | Hook |
| 4 | 2,18 s | Problème |
| 12 | 6,55 s | Twist (feuille → bleu) |
| 16 | 8,73 s | Démo · scan |
| 21 | 11,45 s | Démo · tri |
| 27 | 14,73 s | Démo · alerte |
| 33 | 18,00 s | Démo · validation |
| 39 | 21,27 s | Résultat (ticket-rideau à 20,87 s) |
| 47 | 25,64 s | Signature + CTA (image fixe à partir de 28,5 s) |

## Bruitages à caler (9:16)

| Timecode | Son | Quoi |
|---|---|---|
| 0,00 | sifflement court | le yaourt tombe |
| 0,40 | « toc » plastique | il tape le rebord |
| 1,00 | **« clac »** poubelle | le couvercle claque (temps 2) |
| 1,55 → 1,95 | feutre | « sois honnête » s'écrit |
| 2,28 → 3,90 | imprimante thermique (4 à-coups : 2,98 · 3,28 · 3,58 · 3,88) | ticket des pertes |
| 2,38 · 2,68 · 2,98 · 3,28 | « tic » léger | étiquettes qui virent à l'orange |
| 2,92 · 3,22 · 3,52 · 3,82 | « bloup » sourd | produits qui tombent du rayon |
| 4,22 | **« ding »** de caisse | TOTAL JETÉ 11,10 € |
| 4,91 | **« tchac »** tampon + mini-secousse | PERDU (temps 9) |
| 6,55 → 7,05 | frottement feuille | essuyage vers le bleu |
| 7,64 | « pop » doux | la feuille se plante sur le y (temps 14) |
| 8,73 → 9,26 | « zoup » | l'écran bleu rentre dans le téléphone |
| 9,99 | « bip » / « tic » | date détectée |
| 10,73 | « pop » | la date se pose dans la fiche |
| 11,52 → 12,02 | 6 « tic » en cascade | les cartes tombent dans la liste |
| 12,25 → 12,60 | glissé de cartes | tri par urgence |
| 14,83 / 15,13 | glissé + **« ding »** | notification |
| 15,86 | « tic » | tap « Passer à -20 % » |
| 16,29 | **« pop »** sticker | -20 % collé de travers |
| 18,60 | « tic » | tap « C'est fait » |
| 18,75 → 19,00 | « ding » validé | coche qui se dessine, carte verte |
| 19,47 | glissé | la carte quitte la liste |
| 20,87 → 21,60 | papier qui défile | ticket-rideau |
| 21,87 → 22,87 | cliquetis compteur | odomètre 0 → 23 |
| 22,87 | **« ding »** de caisse | fin du compteur |
| 24,00 | **« tchac »** tampon | SAUVÉ (temps 44) |
| 25,64 → 26,14 | frottement feuille | essuyage final |
| 27,30 → 27,70 | feutre | « PERD » barré puis effacé |
| 28,30 | « pop » doux | feuille posée sur le Y de FRESCY |

Musique conseillée : groove funky / lo-fi à ~110 BPM (basse ronde, guitare muted, batterie sèche), pas d'EDM épique.
Démarrer la musique pile à 0,00 s ; la vidéo boucle proprement (fond papier → fond papier).
