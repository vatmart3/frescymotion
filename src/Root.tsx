import React from 'react';
import {Composition} from 'remotion';
import {CONFIG, beatToFrame} from './config';
import {FrescyVertical} from './Vertical';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Frescy-Vertical"
      component={FrescyVertical}
      width={CONFIG.vertical.width}
      height={CONFIG.vertical.height}
      fps={CONFIG.fps}
      durationInFrames={beatToFrame(CONFIG.vertical.beats.end)}
      defaultProps={{showSafeZones: false}}
    />
  </>
);
