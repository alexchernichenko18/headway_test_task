'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type {
  AnswerId,
  GameConfig,
  GameStep,
} from '@/src/types/game';

type GameStatus = 'inProgress' | 'won' | 'lost';

type GameState = {
  config: GameConfig;
  stepIndex: number;
  status: GameStatus;
  earnedAmount: number;
  selectedAnswerIds: Set<AnswerId>;
  isAmountsOpen: boolean;
};

type GameActions = {
  toggleAnswer: (answerId: AnswerId) => void;
  submitAnswer: (answerId: AnswerId) => 'correct' | 'wrong';
  submitSelectedAnswers: () => 'correct' | 'wrong';
  goToNextStep: () => void;
  openAmounts: () => void;
  closeAmounts: () => void;
  resetGame: () => void;
};

type GameContextValue = {
  state: GameState;
  currentStep: GameStep;
  isMultiSelect: boolean;
  actions: GameActions;
};

const GameContext = createContext<GameContextValue | null>(null);

type GameProviderProps = {
  children: ReactNode;
  initialConfig: GameConfig;
};

const areSetsEqual = (a: Set<string>, b: Set<string>) => {
  if (a.size !== b.size) return false;
  return [...a].every((x) => b.has(x));
};

export function GameProvider({ children, initialConfig }: GameProviderProps) {
  const [state, setState] = useState<GameState>({
    config: initialConfig,
    stepIndex: 0,
    status: 'inProgress',
    earnedAmount: 0,
    selectedAnswerIds: new Set<AnswerId>(),
    isAmountsOpen: false,
  });

  const currentStep = state.config.steps[state.stepIndex];

  const correctIds = useMemo(
    () => new Set<AnswerId>(currentStep.question.correctAnswerIds),
    [currentStep.question.correctAnswerIds],
  );

  const isMultiSelect = correctIds.size > 1;

  const toggleAnswer = useCallback((answerId: AnswerId) => {
    setState((prev) => {
      const next = new Set(prev.selectedAnswerIds);

      if (next.has(answerId)) next.delete(answerId);
      else next.add(answerId);

      return { ...prev, selectedAnswerIds: next };
    });
  }, []);

  const submitAnswer = useCallback(
    (answerId: AnswerId): 'correct' | 'wrong' => {
      const selected = new Set<AnswerId>([answerId]);
      const isCorrect = areSetsEqual(selected as Set<string>, correctIds as Set<string>);

      if (!isCorrect) {
        setState((prev) => ({ ...prev, status: 'lost' }));
        return 'wrong';
      }

      return 'correct';
    },
    [correctIds],
  );

  const submitSelectedAnswers = useCallback((): 'correct' | 'wrong' => {
    const selected = state.selectedAnswerIds;
    const isCorrect = areSetsEqual(selected as Set<string>, correctIds as Set<string>);

    if (!isCorrect) {
      setState((prev) => ({ ...prev, status: 'lost' }));
      return 'wrong';
    }

    return 'correct';
  }, [correctIds, state.selectedAnswerIds]);

  const goToNextStep = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.stepIndex + 1;

      if (nextIndex >= prev.config.steps.length) {
        return {
          ...prev,
          status: 'won',
          earnedAmount: prev.config.steps[prev.stepIndex].amount,
          selectedAnswerIds: new Set<AnswerId>(),
        };
      }

      return {
        ...prev,
        stepIndex: nextIndex,
        earnedAmount: prev.config.steps[prev.stepIndex].amount,
        selectedAnswerIds: new Set<AnswerId>(),
      };
    });
  }, []);

  const openAmounts = useCallback(() => {
    setState((prev) => ({ ...prev, isAmountsOpen: true }));
  }, []);

  const closeAmounts = useCallback(() => {
    setState((prev) => ({ ...prev, isAmountsOpen: false }));
  }, []);

  const resetGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      stepIndex: 0,
      status: 'inProgress',
      earnedAmount: 0,
      selectedAnswerIds: new Set<AnswerId>(),
      isAmountsOpen: false,
    }));
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      currentStep,
      isMultiSelect,
      actions: {
        toggleAnswer,
        submitAnswer,
        submitSelectedAnswers,
        goToNextStep,
        openAmounts,
        closeAmounts,
        resetGame,
      },
    }),
    [
      state,
      currentStep,
      isMultiSelect,
      toggleAnswer,
      submitAnswer,
      submitSelectedAnswers,
      goToNextStep,
      openAmounts,
      closeAmounts,
      resetGame,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within GameProvider');
  }
  return ctx;
};
