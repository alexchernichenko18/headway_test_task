'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';

import { AnswerItem, AmountItem, Button } from '@/src/components/ui';
import { useGame } from '@/src/context/GameContext';
import type { AnswerId, GameStep } from '@/src/types/game';
import formatCurrency from '@/src/utils/formatCurrency';
import wait from '@/src/utils/wait';
import styles from './Game.module.css';

type AmountState = 'active' | 'inactive' | 'disabled';
type RevealState = 'correct' | 'wrong' | null;

const TIME_TO_WAIT_MS = 1000;

const getAmountState = (step: GameStep, currentAmount: number): AmountState => {
  if (step.amount === currentAmount) return 'active';
  if (step.amount < currentAmount) return 'disabled';
  return 'inactive';
};

export default function Game() {
  const router = useRouter();
  const {
    state,
    actions,
    currentStep,
    isMultiSelect,
  } = useGame();

  const [isLocked, setIsLocked] = useState(false);
  const [revealedAnswerId, setRevealedAnswerId] = useState<AnswerId | null>(null);
  const [revealedAnswerIds, setRevealedAnswerIds] = useState<Set<AnswerId>>(() => new Set());
  const [revealState, setRevealState] = useState<RevealState>(null);

  const amountsReversed = useMemo(
    () => [...state.config.steps].reverse(),
    [state.config.steps],
  );

  const currentAmount = currentStep.amount;
  const isLastStep = state.stepIndex === state.config.steps.length - 1;

  useEffect(() => {
    setIsLocked(false);
    setRevealedAnswerId(null);
    setRevealedAnswerIds(new Set());
    setRevealState(null);
  }, [currentStep.id]);

  const handleWrong = async () => {
    await wait(TIME_TO_WAIT_MS);
    actions.resetGame();
    router.push('/game-over');
  };

  const handleCorrect = async () => {
    await wait(TIME_TO_WAIT_MS);

    if (isLastStep) {
      actions.resetGame();
      router.push('/game-over');
      return;
    }

    actions.goToNextStep();
  };

  const handleSingleAnswerClick = async (answerId: AnswerId) => {
    if (isLocked) return;

    setIsLocked(true);

    const result = actions.submitAnswer(answerId);

    setRevealedAnswerId(answerId);
    setRevealState(result);

    if (result === 'wrong') {
      await handleWrong();
      return;
    }

    await handleCorrect();
  };

  const handleMultiAnswerToggle = (answerId: AnswerId) => {
    if (isLocked) return;
    actions.toggleAnswer(answerId);
  };

  const handleMultiSubmit = async () => {
    if (isLocked) return;

    setIsLocked(true);

    const result = actions.submitSelectedAnswers();

    setRevealedAnswerIds(new Set(state.selectedAnswerIds));
    setRevealState(result);

    if (result === 'wrong') {
      await handleWrong();
      return;
    }

    await handleCorrect();
  };

  const getAnswerVisualState = (answerId: AnswerId) => {
    if (!isMultiSelect) {
      if (answerId === revealedAnswerId && revealState === 'correct') return 'correct';
      if (answerId === revealedAnswerId && revealState === 'wrong') return 'wrong';
      return 'inactive';
    }

    if (revealedAnswerIds.has(answerId) && revealState === 'correct') return 'correct';
    if (revealedAnswerIds.has(answerId) && revealState === 'wrong') return 'wrong';
    if (state.selectedAnswerIds.has(answerId)) return 'selected';
    return 'inactive';
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="Open amounts"
            onClick={actions.openAmounts}
            disabled={isLocked}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <h2 className={styles.question}>{currentStep.question.text}</h2>

        <div className={styles.answers}>
          {currentStep.question.answers.map((a, idx) => (
            <AnswerItem
              key={a.id}
              indexCount={idx}
              state={getAnswerVisualState(a.id)}
              onClick={() => {
                if (isMultiSelect) {
                  handleMultiAnswerToggle(a.id);
                } else {
                  handleSingleAnswerClick(a.id);
                }
              }}
              disabled={isLocked}
            >
              {a.text}
            </AnswerItem>
          ))}

          {isMultiSelect && (
            <div className={styles.submitWrap}>
              <Button
                disabled={isLocked || state.selectedAnswerIds.size === 0}
                onClick={handleMultiSubmit}
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>

      <aside className={styles.right} aria-label="Amounts">
        <div className={styles.amounts}>
          {amountsReversed.map((s) => (
            <div key={s.id} className={styles.amountRow}>
              <AmountItem state={getAmountState(s, currentAmount)}>
                {formatCurrency(s.amount, state.config.currency)}
              </AmountItem>
            </div>
          ))}
        </div>
      </aside>

      {state.isAmountsOpen && (
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
                onClick={actions.closeAmounts}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              {amountsReversed.map((s) => (
                <div key={s.id} className={styles.amountRow}>
                  <AmountItem state={getAmountState(s, currentAmount)}>
                    {formatCurrency(s.amount, state.config.currency)}
                  </AmountItem>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={styles.modalBackdrop}
            aria-label="Close amounts"
            onClick={actions.closeAmounts}
          />
        </div>
      )}
    </div>
  );
}
