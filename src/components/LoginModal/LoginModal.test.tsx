import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import LoginModal from './LoginModal';

describe('LoginModal', () => {
  const mockOnLogin = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    onLogin: mockOnLogin,
    onClose: mockOnClose,
    isOpen: true,
    modaltype: 'login' as const
  };

  it('does not render when isOpen is false', () => {
    const { container } = renderWithProviders(<LoginModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders login form with correct elements', () => {
    renderWithProviders(<LoginModal {...defaultProps} />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
  });

  it('renders register form when modaltype is register', () => {
    renderWithProviders(<LoginModal {...defaultProps} modaltype="register" />);
    
    expect(screen.getByText('Join Hacker News')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByText('Why join Hacker News?')).toBeInTheDocument();
    expect(screen.getByText('💬 Comment on stories and participate in discussions')).toBeInTheDocument();
  });

  it('displays custom message when provided', () => {
    const customMessage = 'Please log in to continue';
    renderWithProviders(<LoginModal {...defaultProps} customMessage={customMessage as any} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('validates form fields correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginModal {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    await user.click(submitButton);
    
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('validates username length', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginModal {...defaultProps} />);
    
    const usernameInput = screen.getByLabelText('Username');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    await user.type(usernameInput, 'a');
    await user.click(submitButton);
    
    expect(screen.getByText('Username must be at least 2 characters')).toBeInTheDocument();
  });

  it('validates password length', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginModal {...defaultProps} />);
    
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    await user.type(passwordInput, '123');
    await user.click(submitButton);
    
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
  });

  it('clears errors when user starts typing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginModal {...defaultProps} />);
    
    const usernameInput = screen.getByLabelText('Username');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    await user.click(submitButton);
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    
    await user.type(usernameInput, 'test');
    expect(screen.queryByText('Username is required')).not.toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      login: {
        user: null,
        isLoginModalOpen: true,
        loginMessage: null
      }
    };
    const { store } = renderWithProviders(<LoginModal {...defaultProps} />, { preloadedState });
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(screen.getByText('Signing In...')).toBeInTheDocument();
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.login.user?.username).toBe('testuser');
      expect(state.login.isLoginModalOpen).toBe(false);
    }, { timeout: 2500 });
  });

  it('toggles between login and register modes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginModal {...defaultProps} />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    
    const toggleButton = screen.getByRole('button', { name: 'Create Account' });
    await user.click(toggleButton);
    
    expect(screen.getByText('Join Hacker News')).toBeInTheDocument();
    expect(screen.getByText('Why join Hacker News?')).toBeInTheDocument();
  });

  it('closes modal when overlay is clicked', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      login: {
        user: null,
        isLoginModalOpen: true,
        loginMessage: null
      }
    };
    const { store } = renderWithProviders(<LoginModal {...defaultProps} />, { preloadedState });
    
    const overlay = document.querySelector('[class*="loginOverlay"]') as HTMLElement;
    await user.click(overlay);
    
    await waitFor(() => {
      expect(store.getState().login.isLoginModalOpen).toBe(false);
    });
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      login: {
        user: null,
        isLoginModalOpen: true,
        loginMessage: null
      }
    };
    const { store } = renderWithProviders(<LoginModal {...defaultProps} />, { preloadedState });
    
    const closeButton = screen.getByRole('button', { name: 'Close login modal' });
    await user.click(closeButton);
    
    await waitFor(() => {
      expect(store.getState().login.isLoginModalOpen).toBe(false);
    });
  });

  it('does not close when clicking inside modal', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      login: {
        user: null,
        isLoginModalOpen: true,
        loginMessage: null
      }
    };
    const { store } = renderWithProviders(<LoginModal {...defaultProps} />, { preloadedState });
    
    const modal = document.querySelector('[class*="loginModal"]') as HTMLElement;
    await user.click(modal);
    
    expect(store.getState().login.isLoginModalOpen).toBe(true);
  });

  it('resets form when modal opens', () => {
    const { rerender } = renderWithProviders(<LoginModal {...defaultProps} isOpen={false} />);
    
    rerender(<LoginModal {...defaultProps} isOpen={true} modaltype="login" />);
    
    const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    
    expect(usernameInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });

  it('disables form inputs when loading', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginModal {...defaultProps} />);
    
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

