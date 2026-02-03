'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/src/components/ui';
import { ROUTES } from '@/src/constants';
import styles from './GameStart.module.css';

export default function GameStart() {
  const router = useRouter();

  const onStartHandler = () => {
    router.push(ROUTES.GAME);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <Image
          src="/assets/img/welcome.svg"
          alt="Welcome"
          width={624}
          height={368}
          priority
        />
      </div>

      <div className={styles.right}>
        <h1 className={styles.title}>Who wants to be a millionaire?</h1>

        <div className={styles.button}>
          <Button
            onClick={onStartHandler}
          >
            Start
          </Button>
        </div>
      </div>
    </div>
  );
}
