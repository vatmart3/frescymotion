import React, {createContext, useContext} from 'react';

/**
 * Deux directions artistiques partagent les mêmes composants :
 *  - 'tactile' (A) : papier, grain, traits qui tremblent, tampons mouchetés, objets de biais
 *  - 'net'     (B) : suisse/éditorial, aplats nets, grille stricte, zéro grain, zéro tremblé
 */
export type Look = 'tactile' | 'net';
const LookCtx = createContext<Look>('tactile');

export const LookProvider: React.FC<{look: Look; children: React.ReactNode}> = ({look, children}) => (
  <LookCtx.Provider value={look}>{children}</LookCtx.Provider>
);

export const useLook = () => useContext(LookCtx);
export const useIsNet = () => useContext(LookCtx) === 'net';

/** Rotation "imparfaite" : conservée en tactile, annulée en net */
export const useTilt = () => {
  const net = useIsNet();
  return (deg: number) => (net ? 0 : deg);
};
