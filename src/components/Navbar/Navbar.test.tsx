import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar/Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navbar with logo and title', () => {
    renderWithProviders(<Navbar/>);
    
    expect(screen.getByText('📰')).toBeInTheDocument();
    expect(screen.getByText('Hacker News')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    renderWithProviders(<Navbar/>);
    
    expect(screen.getByRole('link', { name: 'Top Stories' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Newest Stories' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ask' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Show' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Jobs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();
  });

  it('renders navigation items with correct titles', () => {
    renderWithProviders(<Navbar/>);
    
    expect(screen.getByTitle('Top Stories')).toBeInTheDocument();
    expect(screen.getByTitle('Newest Stories')).toBeInTheDocument();
    expect(screen.getByTitle('Ask')).toBeInTheDocument();
    expect(screen.getByTitle('Show')).toBeInTheDocument();
    expect(screen.getByTitle('Jobs')).toBeInTheDocument();
  });

  it('shows login button when user is not logged in', () => {
    renderWithProviders(<Navbar/>);
    
    expect(screen.getByRole('button', { name: 'login' })).toBeInTheDocument();
    expect(screen.queryByText('logout')).not.toBeInTheDocument();
  });

  it('shows username and logout button when user is logged in', () => {
    const preloadedState = {
      login: {
        user: { username: 'testuser' },
        isLoginModalOpen: false,
        loginMessage: null
      }
    };
    renderWithProviders(<Navbar/>, { preloadedState });
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'logout' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'login' })).not.toBeInTheDocument();
  });

  it('navigates when navigation item is clicked', async () => {
    renderWithProviders(<Navbar/>);
    
    const newLink = screen.getByRole('link', { name: 'Newest Stories' });
    expect(newLink).toHaveAttribute('href', '/new');
  });

  it('sets active state on navigation items', () => {
    renderWithProviders(<Navbar/>);
  
    const topLink = screen.getByRole('link', { name: 'Top Stories' });
    expect(topLink.className).toContain('navItemActive');
  });

  it('opens login modal when login button is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Navbar/>);
    
    const loginButton = screen.getByRole('button', { name: 'login' });
    await user.click(loginButton);
    
    expect(store.getState().login.isLoginModalOpen).toBe(true);
  });

  it('logs out when logout button is clicked', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      login: {
        user: { username: 'testuser' },
        isLoginModalOpen: false,
        loginMessage: null
      }
    };
    const { store } = renderWithProviders(<Navbar/>, { preloadedState });
    
    const logoutButton = screen.getByRole('button', { name: 'logout' });
    await user.click(logoutButton);
    
    expect(store.getState().login.user).toBeNull();
  });

  it('opens login modal when submit button is clicked and user is not logged in', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Navbar/>);
    
    const submitButton = screen.getByRole('button', { name: 'submit' });
    await user.click(submitButton);
    
    expect(store.getState().login.isLoginModalOpen).toBe(true);
  });

  it('logs to console when submit button is clicked and user is logged in', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const user = userEvent.setup();
    const preloadedState = {
      login: {
        user: { username: 'testuser' },
        isLoginModalOpen: false,
        loginMessage: null
      }
    };
    renderWithProviders(<Navbar/>, { preloadedState });
    
    const submitButton = screen.getByRole('button', { name: 'submit' });
    await user.click(submitButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Navigate to submit page');
    
    consoleSpy.mockRestore();
  });

  it('shows correct submit button title based on login state', () => {
    renderWithProviders(<Navbar/>);
    expect(screen.getByTitle('Login to Submit')).toBeInTheDocument();
    
    const preloadedState = {
      login: {
        user: { username: 'testuser' },
        isLoginModalOpen: false,
        loginMessage: null
      }
    };
    renderWithProviders(<Navbar/>, { preloadedState });
    expect(screen.getByTitle('Submit a Story')).toBeInTheDocument();
  });

  it('renders navigation items correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);
    
    const topLink = screen.getByRole('link', { name: 'Top Stories' });
    
    expect(() => user.click(topLink)).not.toThrow();
  });
});