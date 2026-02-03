import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import AmountsModal from './AmountsModal';

vi.mock('@/src/components/ui', () => ({
  AmountItem: ({ children, state }: { children: React.ReactNode; state?: string }) => (
    <div data-testid="amount-item" data-state={state}>
      {children}
    </div>
  ),
}));

type GameStepMock = {
  id: string;
  amount: number;
  question: {
    text: string;
    answers: { id: string; text: string }[];
    correctAnswerIds: string[];
  };
};

describe('AmountsModal', () => {
  const formatCurrency = vi.fn((amount: number, curr: string) => `${curr} ${amount}`);
  const getAmountState = vi.fn(() => 'inactive');

  const steps: GameStepMock[] = [
    {
      id: 's1',
      amount: 100,
      question: { text: '', answers: [], correctAnswerIds: [] },
    },
    {
      id: 's2',
      amount: 200,
      question: { text: '', answers: [], correctAnswerIds: [] },
    },
  ];

  beforeEach(() => {
    formatCurrency.mockClear();
    getAmountState.mockClear();
  });

  it('should render null when isOpen is false', () => {
    const { container } = render(
      <AmountsModal
        isOpen={false}
        amountSteps={steps as any}
        currentAmount={100}
        currency="USD"
        onClose={vi.fn()}
        formatCurrency={formatCurrency}
        getAmountState={getAmountState as any}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render dialog when isOpen is true', () => {
    render(
      <AmountsModal
        isOpen
        amountSteps={steps as any}
        currentAmount={100}
        currency="USD"
        onClose={vi.fn()}
        formatCurrency={formatCurrency}
        getAmountState={getAmountState as any}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Amounts modal' })).toBeInTheDocument();
  });

  it('should render amount rows', () => {
    render(
      <AmountsModal
        isOpen
        amountSteps={steps as any}
        currentAmount={100}
        currency="USD"
        onClose={vi.fn()}
        formatCurrency={formatCurrency}
        getAmountState={getAmountState as any}
      />,
    );

    const items = screen.getAllByTestId('amount-item');
    expect(items).toHaveLength(2);
    expect(screen.getByText('USD 100')).toBeInTheDocument();
    expect(screen.getByText('USD 200')).toBeInTheDocument();
  });

  it('should call getAmountState for each step with currentAmount', () => {
    render(
      <AmountsModal
        isOpen
        amountSteps={steps as any}
        currentAmount={100}
        currency="USD"
        onClose={vi.fn()}
        formatCurrency={formatCurrency}
        getAmountState={getAmountState as any}
      />,
    );

    expect(getAmountState).toHaveBeenCalledTimes(2);
    expect(getAmountState).toHaveBeenNthCalledWith(1, steps[0], 100);
    expect(getAmountState).toHaveBeenNthCalledWith(2, steps[1], 100);
  });

  it('should call formatCurrency for each step with currency', () => {
    render(
      <AmountsModal
        isOpen
        amountSteps={steps as any}
        currentAmount={100}
        currency="USD"
        onClose={vi.fn()}
        formatCurrency={formatCurrency}
        getAmountState={getAmountState as any}
      />,
    );

    expect(formatCurrency).toHaveBeenCalledTimes(2);
    expect(formatCurrency).toHaveBeenNthCalledWith(1, 100, 'USD');
    expect(formatCurrency).toHaveBeenNthCalledWith(2, 200, 'USD');
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();

    render(
      <AmountsModal
        isOpen
        amountSteps={steps as any}
        currentAmount={100}
        currency="USD"
        onClose={onClose}
        formatCurrency={formatCurrency}
        getAmountState={getAmountState as any}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    const onClose = vi.fn();

    render(
      <AmountsModal
        isOpen
        amountSteps={steps as any}
        currentAmount={100}
        currency="USD"
        onClose={onClose}
        formatCurrency={formatCurrency}
        getAmountState={getAmountState as any}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close amounts' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});