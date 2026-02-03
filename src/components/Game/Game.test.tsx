import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import Game from './Game';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const waitMock = vi.fn(() => Promise.resolve());
vi.mock('@/src/utils/wait', () => ({
  // @ts-ignore
  default: (ms: number) => waitMock(ms),
}));

const formatCurrencyMock = vi.fn((amount: number, currency: string) => `${currency} ${amount}`);
vi.mock('@/src/utils/formatCurrency', () => ({
  default: (amount: number, currency: string) => formatCurrencyMock(amount, currency),
}));

vi.mock('@/src/constants', () => ({
  ROUTES: {
    GAME_OVER: '/game-over',
  },
}));

vi.mock('@/src/components/ui', () => ({
  AnswerItem: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  AmountItem: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div>{children}</div>,
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

const amountsModalPropsSpy = vi.fn();
vi.mock('../AmountsModal/AmountsModal', () => ({
  default: (props: any) => {
    amountsModalPropsSpy(props);
    return props.isOpen ? (
      <div role="dialog" aria-label="Amounts modal">
        Amounts modal
      </div>
    ) : null;
  },
}));

type Answer = { id: string; text: string };
type Question = { text: string; answers: Answer[]; correctAnswerIds: string[] };
type Step = { id: string; amount: number; question: Question };
type Config = { currency: string; steps: Step[] };

const makeSteps = (): Step[] => ([
  {
    id: 's1',
    amount: 100,
    question: {
      text: 'Q1?',
      answers: [
        { id: 'a1', text: 'A1' },
        { id: 'a2', text: 'A2' },
      ],
      correctAnswerIds: ['a1'],
    },
  },
  {
    id: 's2',
    amount: 200,
    question: {
      text: 'Q2?',
      answers: [
        { id: 'b1', text: 'B1' },
        { id: 'b2', text: 'B2' },
      ],
      correctAnswerIds: ['b1', 'b2'],
    },
  },
]);

const baseConfig: Config = {
  currency: 'USD',
  steps: makeSteps(),
};

const gameContextMock = vi.fn();

vi.mock('@/src/context/GameContext', () => ({
  useGame: () => gameContextMock(),
}));

describe('Game', () => {
  beforeEach(() => {
    pushMock.mockClear();
    waitMock.mockClear();
    formatCurrencyMock.mockClear();
    amountsModalPropsSpy.mockClear();
    gameContextMock.mockClear();
  });

  it('should render question and answers', () => {
    gameContextMock.mockReturnValue({
      state: {
        config: baseConfig,
        stepIndex: 0,
        selectedAnswerIds: new Set(),
        isAmountsOpen: false,
      },
      actions: {
        submitAnswer: vi.fn(() => 'correct'),
        submitSelectedAnswers: vi.fn(() => 'correct'),
        toggleAnswer: vi.fn(),
        goToNextStep: vi.fn(),
        resetGame: vi.fn(),
        openAmounts: vi.fn(),
        closeAmounts: vi.fn(),
      },
      currentStep: baseConfig.steps[0],
      isMultiSelect: false,
    });

    render(<Game />);

    expect(screen.getByRole('heading', { level: 2, name: 'Q1?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A2' })).toBeInTheDocument();
  });

  it('should render amount rows and format currency for each step', () => {
    gameContextMock.mockReturnValue({
      state: {
        config: baseConfig,
        stepIndex: 0,
        selectedAnswerIds: new Set(),
        isAmountsOpen: false,
      },
      actions: {
        submitAnswer: vi.fn(() => 'correct'),
        submitSelectedAnswers: vi.fn(() => 'correct'),
        toggleAnswer: vi.fn(),
        goToNextStep: vi.fn(),
        resetGame: vi.fn(),
        openAmounts: vi.fn(),
        closeAmounts: vi.fn(),
      },
      currentStep: baseConfig.steps[0],
      isMultiSelect: false,
    });

    render(<Game />);

    expect(formatCurrencyMock).toHaveBeenCalledTimes(baseConfig.steps.length);
    expect(screen.getByText('USD 200')).toBeInTheDocument();
    expect(screen.getByText('USD 100')).toBeInTheDocument();
  });

  it('should open amounts via actions.openAmounts', async () => {
    const user = userEvent.setup();

    const openAmounts = vi.fn();

    gameContextMock.mockReturnValue({
      state: {
        config: baseConfig,
        stepIndex: 0,
        selectedAnswerIds: new Set(),
        isAmountsOpen: false,
      },
      actions: {
        submitAnswer: vi.fn(() => 'correct'),
        submitSelectedAnswers: vi.fn(() => 'correct'),
        toggleAnswer: vi.fn(),
        goToNextStep: vi.fn(),
        resetGame: vi.fn(),
        openAmounts,
        closeAmounts: vi.fn(),
      },
      currentStep: baseConfig.steps[0],
      isMultiSelect: false,
    });

    render(<Game />);

    await user.click(screen.getByRole('button', { name: 'Open amounts' }));

    expect(openAmounts).toHaveBeenCalledTimes(1);
  });

  it('single select: should submit answer, wait, goToNextStep on correct', async () => {
    const user = userEvent.setup();

    const submitAnswer = vi.fn(() => 'correct');
    const goToNextStep = vi.fn();

    gameContextMock.mockReturnValue({
      state: {
        config: baseConfig,
        stepIndex: 0,
        selectedAnswerIds: new Set(),
        isAmountsOpen: false,
      },
      actions: {
        submitAnswer,
        submitSelectedAnswers: vi.fn(() => 'correct'),
        toggleAnswer: vi.fn(),
        goToNextStep,
        resetGame: vi.fn(),
        openAmounts: vi.fn(),
        closeAmounts: vi.fn(),
      },
      currentStep: baseConfig.steps[0],
      isMultiSelect: false,
    });

    render(<Game />);

    await user.click(screen.getByRole('button', { name: 'A1' }));

    expect(submitAnswer).toHaveBeenCalledTimes(1);
    expect(submitAnswer).toHaveBeenCalledWith('a1');
    expect(waitMock).toHaveBeenCalledTimes(1);
    expect(goToNextStep).toHaveBeenCalledTimes(1);
  });

  it('single select: should submit answer, wait, reset and redirect on wrong', async () => {
    const user = userEvent.setup();

    const submitAnswer = vi.fn(() => 'wrong');
    const resetGame = vi.fn();

    gameContextMock.mockReturnValue({
      state: {
        config: baseConfig,
        stepIndex: 0,
        selectedAnswerIds: new Set(),
        isAmountsOpen: false,
      },
      actions: {
        submitAnswer,
        submitSelectedAnswers: vi.fn(() => 'correct'),
        toggleAnswer: vi.fn(),
        goToNextStep: vi.fn(),
        resetGame,
        openAmounts: vi.fn(),
        closeAmounts: vi.fn(),
      },
      currentStep: baseConfig.steps[0],
      isMultiSelect: false,
    });

    render(<Game />);

    await user.click(screen.getByRole('button', { name: 'A2' }));

    expect(submitAnswer).toHaveBeenCalledWith('a2');
    expect(waitMock).toHaveBeenCalledTimes(1);
    expect(resetGame).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/game-over');
  });

  it('single select: last step correct should reset and redirect', async () => {
    const user = userEvent.setup();

    const lastStepOnlyConfig: Config = {
      currency: 'USD',
      steps: [
        {
          id: 'last',
          amount: 1000,
          question: {
            text: 'Last?',
            answers: [{ id: 'x', text: 'X' }],
            correctAnswerIds: ['x'],
          },
        },
      ],
    };

    const submitAnswer = vi.fn(() => 'correct');
    const resetGame = vi.fn();

    gameContextMock.mockReturnValue({
      state: {
        config: lastStepOnlyConfig,
        stepIndex: 0,
        selectedAnswerIds: new Set(),
        isAmountsOpen: false,
      },
      actions: {
        submitAnswer,
        submitSelectedAnswers: vi.fn(() => 'correct'),
        toggleAnswer: vi.fn(),
        goToNextStep: vi.fn(),
        resetGame,
        openAmounts: vi.fn(),
        closeAmounts: vi.fn(),
      },
      currentStep: lastStepOnlyConfig.steps[0],
      isMultiSelect: false,
    });

    render(<Game />);

    await user.click(screen.getByRole('button', { name: 'X' }));

    expect(waitMock).toHaveBeenCalledTimes(1);
    expect(resetGame).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/game-over');
  });

  it('multi select: should toggle answers on click and show Submit button', async () => {
    const user = userEvent.setup();

    const toggleAnswer = vi.fn();

    gameContextMock.mockReturnValue({
      state: {
        config: baseConfig,
        stepIndex: 1,
        selectedAnswerIds: new Set(),
        isAmountsOpen: false,
      },
      actions: {
        submitAnswer: vi.fn(() => 'correct'),
        submitSelectedAnswers: vi.fn(() => 'correct'),
        toggleAnswer,
        goToNextStep: vi.fn(),
        resetGame: vi.fn(),
        openAmounts: vi.fn(),
        closeAmounts: vi.fn(),
      },
      currentStep: baseConfig.steps[1],
      isMultiSelect: true,
    });

    render(<Game />);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'B1' }));
    await user.click(screen.getByRole('button', { name: 'B2' }));

    expect(toggleAnswer).toHaveBeenCalledTimes(2);
    expect(toggleAnswer).toHaveBeenNthCalledWith(1, 'b1');
    expect(toggleAnswer).toHaveBeenNthCalledWith(2, 'b2');
  });

  it('multi select: submit should call submitSelectedAnswers, wait, reset and redirect on wrong', async () => {
    const user = userEvent.setup();

    const submitSelectedAnswers = vi.fn(() => 'wrong');
    const resetGame = vi.fn();

    gameContextMock.mockReturnValue({
      state: {
        config: baseConfig,
        stepIndex: 1,
        selectedAnswerIds: new Set(['b1']),
        isAmountsOpen: false,
      },
      actions: {
        submitAnswer: vi.fn(() => 'correct'),
        submitSelectedAnswers,
        toggleAnswer: vi.fn(),
        goToNextStep: vi.fn(),
        resetGame,
        openAmounts: vi.fn(),
        closeAmounts: vi.fn(),
      },
      currentStep: baseConfig.steps[1],
      isMultiSelect: true,
    });

    render(<Game />);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(submitSelectedAnswers).toHaveBeenCalledTimes(1);
    expect(waitMock).toHaveBeenCalledTimes(1);
    expect(resetGame).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/game-over');
  });

  it('should pass correct props to AmountsModal', () => {
    const closeAmounts = vi.fn();

    gameContextMock.mockReturnValue({
      state: {
        config: baseConfig,
        stepIndex: 0,
        selectedAnswerIds: new Set(),
        isAmountsOpen: true,
      },
      actions: {
        submitAnswer: vi.fn(() => 'correct'),
        submitSelectedAnswers: vi.fn(() => 'correct'),
        toggleAnswer: vi.fn(),
        goToNextStep: vi.fn(),
        resetGame: vi.fn(),
        openAmounts: vi.fn(),
        closeAmounts,
      },
      currentStep: baseConfig.steps[0],
      isMultiSelect: false,
    });

    render(<Game />);

    expect(amountsModalPropsSpy).toHaveBeenCalled();
    const props = amountsModalPropsSpy.mock.calls[0][0];

    expect(props.isOpen).toBe(true);
    expect(props.currentAmount).toBe(100);
    expect(props.currency).toBe('USD');
    expect(props.onClose).toBe(closeAmounts);
    expect(props.amountSteps).toHaveLength(2);
    expect(typeof props.formatCurrency).toBe('function');
    expect(typeof props.getAmountState).toBe('function');
  });
});