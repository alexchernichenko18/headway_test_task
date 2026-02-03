import { render, screen } from '@testing-library/react';

import AmountItem from './AmountItem';

describe('AmountItem', () => {
  it('should render children', () => {
    render(<AmountItem>$100</AmountItem>);

    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('should apply inactive state by default', () => {
    const { container } = render(<AmountItem>$100</AmountItem>);

    const root = container.querySelector('div');
    expect(root?.className).toContain('amount');
    expect(root?.className).toContain('inactive');
  });

  it('should apply provided state class', () => {
    const { container } = render(<AmountItem state="active">$100</AmountItem>);

    const root = container.querySelector('div');
    expect(root?.className).toContain('active');
  });

  it('should render aria-hidden icon', () => {
    const { container } = render(<AmountItem>$100</AmountItem>);

    const icon = container.querySelector('i');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden');
  });

  it('should render content wrapper with children inside', () => {
    const { container } = render(<AmountItem>$100</AmountItem>);

    const content = container.querySelector('span');
    expect(content).toBeInTheDocument();
    expect(content?.textContent).toBe('$100');
  });
});