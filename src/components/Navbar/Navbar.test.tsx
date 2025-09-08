import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar/Navbar';

describe('Navbar', () => {
  const mockOnNavigate = vi.fn();
  const mockOnLoginClick = vi.fn();
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    onNavigate: mockOnNavigate,
    onLoginClick: mockOnLoginClick,
    onLogout: mockOnLogout,
    isLoggedIn: false,
    username: null as any
  };

  it('renders navbar with logo and title', () => {
    render(<Navbar {...defaultProps} />);
    
    expect(screen.getByText('📰')).toBeInTheDocument();
    expect(screen.getByText('Hacker News')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<Navbar {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: 'top' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'new' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ask' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'show' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'jobs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();
  });

  it('renders navigation items with correct titles', () => {
    render(<Navbar {...defaultProps} />);
    
    expect(screen.getByTitle('Top Stories')).toBeInTheDocument();
    expect(screen.getByTitle('Newest Stories')).toBeInTheDocument();
    expect(screen.getByTitle('Ask HN')).toBeInTheDocument();
    expect(screen.getByTitle('Show HN')).toBeInTheDocument();
    expect(screen.getByTitle('Jobs')).toBeInTheDocument();
  });

  it('shows login button when user is not logged in', () => {
    render(<Navbar {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: 'login' })).toBeInTheDocument();
    expect(screen.queryByText('logout')).not.toBeInTheDocument();
  });

  it('shows username and logout button when user is logged in', () => {
    render(<Navbar {...defaultProps} isLoggedIn={true} username="testuser"/>);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'logout' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'login' })).not.toBeInTheDocument();
  });

  it('calls onNavigate when navigation item is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar {...defaultProps} />);
    
    const newButton = screen.getByRole('button', { name: 'new' });
    await user.click(newButton);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('new');
  });

  it('sets active state on navigation items', async () => {
    const user = userEvent.setup();
    render(<Navbar {...defaultProps} />);
  
    const topButton = screen.getByRole('button', { name: 'top' });
    expect(topButton.className).toContain('navItemActive');
    
    const newButton = screen.getByRole('button', { name: 'new' });
    await user.click(newButton);
    
    expect(newButton.className).toContain('navItemActive');
    expect(topButton.className).not.toContain('navItemActive');
  });

  it('calls onLoginClick when login button is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar {...defaultProps} />);
    
    const loginButton = screen.getByRole('button', { name: 'login' });
    await user.click(loginButton);
    
    expect(mockOnLoginClick).toHaveBeenCalled();
  });

  it('calls onLogout when logout button is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar {...defaultProps} isLoggedIn={true} username="testuser" />);
    
    const logoutButton = screen.getByRole('button', { name: 'logout' });
    await user.click(logoutButton);
    
    expect(mockOnLogout).toHaveBeenCalled();
  });

  it('calls onLoginClick when submit button is clicked and user is not logged in', async () => {
    const user = userEvent.setup();
    render(<Navbar {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: 'submit' });
    await user.click(submitButton);
    
    expect(mockOnLoginClick).toHaveBeenCalled();
  });

  it('logs to console when submit button is clicked and user is logged in', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<Navbar {...defaultProps} isLoggedIn={true} username="testuser" />);
    
    const submitButton = screen.getByRole('button', { name: 'submit' });
    await user.click(submitButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Navigate to submit page');
    expect(mockOnLoginClick).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('shows correct submit button title based on login state', () => {
    const { rerender } = render(<Navbar {...defaultProps} />);
    
    expect(screen.getByTitle('Login to Submit')).toBeInTheDocument();
    
    rerender(<Navbar {...defaultProps} isLoggedIn={true} username="testuser" />);
    
    expect(screen.getByTitle('Submit a Story')).toBeInTheDocument();
  });

  it('handles missing callback functions gracefully', async () => {
    const user = userEvent.setup();
    // @ts-ignore
    render(<Navbar />);
    
    const topButton = screen.getByRole('button', { name: 'top' });
    
    expect(() => user.click(topButton)).not.toThrow();
  });
});

