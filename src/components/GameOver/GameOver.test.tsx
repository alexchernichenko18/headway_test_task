import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import formatCurrency from '@/src/utils/formatCurrency';
import GameOver from './GameOver';

type NextImageMockProps = {
  src: string;
  alt: string;
  [key: string]: unknown;
};

vi.mock('next/image', () => ({
  default: ({ src, alt }: NextImageMockProps) => <img src={String(src)} alt={alt} />,
}));

describe('GameOver', () => {
  it('should render total score label', () => {
    render(
      <GameOver
        earnedAmount={0}
        currency="USD"
        onTryAgain={vi.fn()}
      />,
    );

    expect(screen.getByText('Total score:')).toBeInTheDocument();
  });

  it('should render formatted earned amount', () => {
    render(
      <GameOver
        earnedAmount={1000}
        currency="USD"
        onTryAgain={vi.fn()}
      />,
    );

    const expected = `${formatCurrency(1000, 'USD')} earned`;
    expect(screen.getByRole('heading', { level: 1, name: expected })).toBeInTheDocument();
  });

  it('should render image with alt text', () => {
    render(
      <GameOver
        earnedAmount={0}
        currency="USD"
        onTryAgain={vi.fn()}
      />,
    );

    expect(screen.getByAltText('Game over')).toBeInTheDocument();
  });

  it('should call onTryAgain when button is clicked', () => {
    const onTryAgain = vi.fn();

    render(
      <GameOver
        earnedAmount={0}
        currency="USD"
        onTryAgain={onTryAgain}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(onTryAgain).toHaveBeenCalledTimes(1);
  });
});