import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ButtonSample from '../ButtonSample';

describe('ButtonSample', () => {
  it('renders button with children', () => {
    render(<ButtonSample onClick={() => {}}>Click me</ButtonSample>);
    
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies default props', () => {
    render(<ButtonSample onClick={() => {}}>Test</ButtonSample>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toBeDisabled();
  });

  it('handles onClick callback', async () => {
    const mockClick = vi.fn();
    const user = userEvent.setup();
    
    render(<ButtonSample onClick={mockClick}>Click me</ButtonSample>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockClick).toHaveBeenCalledOnce();
  });

  it('can be disabled', () => {
    render(<ButtonSample onClick={() => {}} disabled>Disabled</ButtonSample>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('accepts custom type', () => {
    render(<ButtonSample onClick={() => {}} type="submit">Submit</ButtonSample>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('applies custom className', () => {
    render(<ButtonSample onClick={() => {}} className="custom-class">Test</ButtonSample>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    render(<ButtonSample onClick={() => {}} title="Custom title" data-testid="test-button">Test</ButtonSample>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Custom title');
    expect(button).toHaveAttribute('data-testid', 'test-button');
  });

  it('does not call onClick when disabled', async () => {
    const mockClick = vi.fn();
    const user = userEvent.setup();
    
    render(<ButtonSample onClick={mockClick} disabled>Disabled</ButtonSample>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockClick).not.toHaveBeenCalled();
  });

  it('renders complex children', () => {
    render(
      <ButtonSample onClick={() => {}}>
        <span>Icon</span>
        <span>Text</span>
      </ButtonSample>
    );
    
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('maintains focus behavior', async () => {
    const user = userEvent.setup();
    render(<ButtonSample onClick={() => {}}>Focusable</ButtonSample>);
    
    const button = screen.getByRole('button');
    await user.tab();
    
    expect(button).toHaveFocus();
  });
});

