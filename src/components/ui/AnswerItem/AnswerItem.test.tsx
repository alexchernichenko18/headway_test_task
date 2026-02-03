import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AnswerItem from './AnswerItem';

describe('AnswerItem', () => {
  it('should render children', () => {
    render(
      <AnswerItem indexCount={0}>
        Answer text
      </AnswerItem>,
    );

    expect(screen.getByRole('button', { name: /answer text/i })).toBeInTheDocument();
  });

  it('should render letter based on indexCount', () => {
    render(
      <AnswerItem indexCount={0}>
        Answer text
      </AnswerItem>,
    );

    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should apply inactive state by default', () => {
    const { container } = render(
      <AnswerItem indexCount={0}>
        Answer text
      </AnswerItem>,
    );

    const btn = screen.getByRole('button', { name: /answer text/i });
    expect(btn.className).toContain('answer');
    expect(container.querySelector('button')?.className).toContain('inactive');
  });

  it('should apply provided state class', () => {
    render(
      <AnswerItem indexCount={0} state="correct">
        Answer text
      </AnswerItem>,
    );

    const btn = screen.getByRole('button', { name: /answer text/i });
    expect(btn.className).toContain('correct');
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <AnswerItem indexCount={0} onClick={onClick}>
        Answer text
      </AnswerItem>,
    );

    await user.click(screen.getByRole('button', { name: /answer text/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled is true', () => {
    render(
      <AnswerItem indexCount={0} disabled>
        Answer text
      </AnswerItem>,
    );

    expect(screen.getByRole('button', { name: /answer text/i })).toBeDisabled();
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <AnswerItem indexCount={0} disabled onClick={onClick}>
        Answer text
      </AnswerItem>,
    );

    await user.click(screen.getByRole('button', { name: /answer text/i }));

    expect(onClick).toHaveBeenCalledTimes(0);
  });

  it('should have type="button"', () => {
    render(
      <AnswerItem indexCount={0}>
        Answer text
      </AnswerItem>,
    );

    expect(screen.getByRole('button', { name: /answer text/i })).toHaveAttribute('type', 'button');
  });

  it('should render aria-hidden icon and index', () => {
    render(
      <AnswerItem indexCount={0}>
        Answer text
      </AnswerItem>,
    );

    const btn = screen.getByRole('button', { name: /answer text/i });

    const icon = btn.querySelector('i');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden');

    const index = screen.getByText('A');
    expect(index).toHaveAttribute('aria-hidden');
  });
});
