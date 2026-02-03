'use client';

import { AmountItem } from '@/src/components/ui';
import type { GameStep } from '@/src/types/game';
import styles from './AmountsModal.module.css';

type AmountState = 'active' | 'inactive' | 'disabled';

type Props = {
  isOpen: boolean;
  amountSteps: GameStep[];
  currentAmount: number;
  currency: string;
  onClose: () => void;
  formatCurrency: (amount: number, curr: string) => string;
  getAmountState: (step: GameStep, currentAmountValue: number) => AmountState;
};

export default function AmountsModal({
  isOpen,
  amountSteps,
  currentAmount,
  currency,
  onClose,
  formatCurrency,
  getAmountState,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-label="Amounts modal"
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {amountSteps.map((step) => (
            <div key={step.id} className={styles.amountRow}>
              <AmountItem state={getAmountState(step, currentAmount)}>
                {formatCurrency(step.amount, currency)}
              </AmountItem>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={styles.modalBackdrop}
        aria-label="Close amounts"
        onClick={onClose}
      />
    </div>
  );
}
