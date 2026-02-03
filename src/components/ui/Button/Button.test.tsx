import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from './Button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Start</Button>);

    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Start</Button>);

    await user.click(screen.getByRole('button', { name: 'Start' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled is true', () => {
    render(<Button disabled>Start</Button>);

    expect(screen.getByRole('button', { name: 'Start' })).toBeDisabled();
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Start
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Start' }));

    expect(onClick).toHaveBeenCalledTimes(0);
  });

  it('should have type="button"', () => {
    render(<Button>Start</Button>);

    expect(screen.getByRole('button', { name: 'Start' })).toHaveAttribute('type', 'button');
  });
});
