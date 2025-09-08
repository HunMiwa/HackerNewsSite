import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../LoginPage';

describe('LoginPage', () => {
  const mockOnLogin = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // no timers
  });

  const defaultProps = {
    onLogin: mockOnLogin,
    onClose: mockOnClose,
    isOpen: true,
    modaltype: 'login' as const
  };

  it('does not render when isOpen is false', () => {
    const { container } = render(<LoginPage {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders login form with correct elements', () => {
    render(<LoginPage {...defaultProps} />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
  });

  it('renders register form when modaltype is register', () => {
    render(<LoginPage {...defaultProps} modaltype="register" />);
    
    expect(screen.getByText('Join Hacker News')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByText('Why join Hacker News?')).toBeInTheDocument();
    expect(screen.getByText('💬 Comment on stories and participate in discussions')).toBeInTheDocument();
  });

  it('displays custom message when provided', () => {
    const customMessage = 'Please log in to continue';
    render(<LoginPage {...defaultProps} customMessage={customMessage as any} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('validates form fields correctly', async () => {
    const user = userEvent.setup();
    render(<LoginPage {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    await user.click(submitButton);
    
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('validates username length', async () => {
    const user = userEvent.setup();
    render(<LoginPage {...defaultProps} />);
    
    const usernameInput = screen.getByLabelText('Username');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    await user.type(usernameInput, 'a');
    await user.click(submitButton);
    
    expect(screen.getByText('Username must be at least 2 characters')).toBeInTheDocument();
  });

  it('validates password length', async () => {
    const user = userEvent.setup();
    render(<LoginPage {...defaultProps} />);
    
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    await user.type(passwordInput, '123');
    await user.click(submitButton);
    
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
  });

  it('clears errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(<LoginPage {...defaultProps} />);
    
    const usernameInput = screen.getByLabelText('Username');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    // Trigger validation error
    await user.click(submitButton);
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    
    // Start typing to clear error
    await user.type(usernameInput, 'test');
    expect(screen.queryByText('Username is required')).not.toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<LoginPage {...defaultProps} />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(screen.getByText('Signing In...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('testuser');
      expect(mockOnClose).toHaveBeenCalled();
    }, { timeout: 2500 });
  });

  it('toggles between login and register modes', async () => {
    const user = userEvent.setup();
    render(<LoginPage {...defaultProps} />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    
    const toggleButton = screen.getByRole('button', { name: 'Create Account' });
    await user.click(toggleButton);
    
    expect(screen.getByText('Join Hacker News')).toBeInTheDocument();
    expect(screen.getByText('Why join Hacker News?')).toBeInTheDocument();
  });

  it('closes modal when overlay is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginPage {...defaultProps} />);
    
    const overlay = document.querySelector('[class*="loginOverlay"]') as HTMLElement;
    await user.click(overlay);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginPage {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: 'Close login modal' });
    await user.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not close when clicking inside modal', async () => {
    const user = userEvent.setup();
    render(<LoginPage {...defaultProps} />);
    
    const modal = document.querySelector('.loginModal') as HTMLElement;
    await user.click(modal);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('resets form when modal opens', () => {
    const { rerender } = render(<LoginPage {...defaultProps} isOpen={false} />);
    
    rerender(<LoginPage {...defaultProps} isOpen={true} modaltype="login" />);
    
    const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    
    expect(usernameInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });

  it('disables form inputs when loading', async () => {
    const user = userEvent.setup();
    render(<LoginPage {...defaultProps} />);
    
    const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });
});

