import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import GameStart from './GameStart';
import { ROUTES } from '../../../src/constants';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('GameStart', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it('should render title', () => {
    render(<GameStart />);

    expect(
      screen.getByRole('heading', {
        name: /who wants to be a millionaire/i,
      }),
    ).toBeInTheDocument();
  });

  it('should render welcome image', () => {
    render(<GameStart />);

    const image = screen.getByAltText('Welcome');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/assets/img/welcome.svg');
  });

  it('should render Start button', () => {
    render(<GameStart />);

    expect(
      screen.getByRole('button', { name: 'Start' }),
    ).toBeInTheDocument();
  });

  it('should navigate to game page on Start click', async () => {
    const user = userEvent.setup();

    render(<GameStart />);

    await user.click(screen.getByRole('button', { name: 'Start' }));

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(ROUTES.GAME);
  });
});