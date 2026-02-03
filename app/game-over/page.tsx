'use client';

import { useRouter } from 'next/navigation';

import GameOver from '@/src/components/GameOver/GameOver';
import { useGame } from '@/src/context/GameContext';

export default function GameOverPage() {
  const router = useRouter();
  const { state } = useGame();

  const onTryAgain = () => {
    router.push('/game');
  };

  return (
    <GameOver
      earnedAmount={state.earnedAmount}
      currency={state.config.currency}
      onTryAgain={onTryAgain}
    />
  );
}
