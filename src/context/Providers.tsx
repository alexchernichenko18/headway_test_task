'use client';

import type { ReactNode } from 'react';

import type { GameConfig } from '@/src/types/game';
import { GameProvider } from '@/src/context/GameContext';
import gameConfig from '../../public/data/game-confing-1.json';

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <GameProvider initialConfig={gameConfig as GameConfig}>
      {children}
    </GameProvider>
  );
}
