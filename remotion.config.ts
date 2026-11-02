import {Config} from '@remotion/cli/config';

// Rendu net : JPEG haute qualité pour les frames intermédiaires, H.264 en sortie.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setConcurrency(null);
// Si Chrome n'est pas téléchargeable automatiquement, décommenter et pointer vers un Chromium local :
// Config.setBrowserExecutable('/chemin/vers/chromium');
