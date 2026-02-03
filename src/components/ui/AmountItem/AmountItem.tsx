import type { ReactNode } from 'react';
import styles from './AmountItem.module.css';

type AmountState = 'inactive' | 'active' | 'disabled';

type AmountItemProps = {
  children: ReactNode;
  state?: AmountState;
};

function AmountItem({ children, state = 'inactive' }: AmountItemProps) {
  return (
    <div className={`${styles.amount} ${styles[state]}`}>
      <i aria-hidden />
      <span className={styles.content}>{children}</span>
    </div>
  );
}

AmountItem.defaultProps = {
  state: 'inactive',
};

export default AmountItem;
