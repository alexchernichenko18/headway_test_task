import type { MouseEventHandler, ReactNode } from 'react';
import getAnswerLetter from './helpers';
import styles from './AnswerItem.module.css';

type AnswerState = 'inactive' | 'selected' | 'correct' | 'wrong';

type AnswerItemProps = {
  children: ReactNode;
  state?: AnswerState;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  indexCount: number;
};

function AnswerItem({
  children,
  state = 'inactive',
  onClick,
  indexCount,
}: AnswerItemProps) {
  const letter = getAnswerLetter(indexCount);

  return (
    <button
      type="button"
      className={`${styles.answer} ${styles[state]}`}
      onClick={onClick}
    >
      <i aria-hidden />
      <span className={styles.content}>
        <span className={styles.index} aria-hidden>
          {letter}
        </span>
        <span className={styles.text}>{children}</span>
      </span>
    </button>
  );
}

AnswerItem.defaultProps = {
  state: 'inactive',
  onClick: undefined,
};

export default AnswerItem;
