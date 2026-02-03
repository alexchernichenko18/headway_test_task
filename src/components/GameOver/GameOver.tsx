'use client';

import type { MouseEventHandler } from 'react';
import Image from 'next/image';

import { Button } from '@/src/components/ui';
import formatCurrency from '@/src/utils/formatCurrency';
import styles from './GameOver.module.css';

type GameOverProps = {
  earnedAmount: number;
  currency: string;
  onTryAgain: MouseEventHandler<HTMLButtonElement>;
};

export default function GameOver({ earnedAmount, currency, onTryAgain }: GameOverProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <Image
          src="/assets/img/welcome.svg"
          alt="Game over"
          width={624}
          height={368}
          priority
        />
      </div>

      <div className={styles.right}>
        <p className={styles.label}>Total score:</p>
        <h1 className={styles.title}>
          {formatCurrency(earnedAmount, currency)}
          {' '}
          earned
        </h1>

        <div className={styles.button}>
          <Button onClick={onTryAgain}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}

GameOver.defaultProps = {};
