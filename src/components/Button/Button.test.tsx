import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('ButtonSample', () => {
  it('renders button with children', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies default props', () => {
    render(<Button onClick={() => {}}>Test</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toBeDisabled();
  });

  it('handles onClick callback', async () => {
    const mockClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={mockClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockClick).toHaveBeenCalledOnce();
  });

  it('can be disabled', () => {
    render(<Button onClick={() => {}} disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('accepts custom type', () => {
    render(<Button onClick={() => {}} type="submit">Submit</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('applies custom className', () => {
    render(<Button onClick={() => {}} className="custom-class">Test</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    render(<Button onClick={() => {}} title="Custom title" data-testid="test-button">Test</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Custom title');
    expect(button).toHaveAttribute('data-testid', 'test-button');
  });

  it('does not call onClick when disabled', async () => {
    const mockClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={mockClick} disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockClick).not.toHaveBeenCalled();
  });

  it('renders complex children', () => {
    render(
      <Button onClick={() => {}}>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    );
    
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('maintains focus behavior', async () => {
    const user = userEvent.setup();
    render(<Button onClick={() => {}}>Focusable</Button>);
    
    const button = screen.getByRole('button');
    await user.tab();
    
    expect(button).toHaveFocus();
  });
});

