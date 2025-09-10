import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import { StoryCard } from '../StoryCard/StoryCard';

describe('StoryCard', () => {
  const mockStory = {
    id: 1,
    title: 'Story Title',
    url: 'https://example.com',
    by: 'testuser',
    time: 1640995200,
    score: 150,
    descendants: 25
  };

  it('renders story information correctly', () => {
    renderWithProviders(<StoryCard story={mockStory as any} onLoginClick={() => {}} />);
    
    expect(screen.getByText('Story Title')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByTitle('Points')).toHaveTextContent('▲ 150');
    expect(screen.getByText(/25.*comments/)).toBeInTheDocument();
  });

  it('renders external link for stories with URLs', () => {
    renderWithProviders(<StoryCard story={mockStory as any} onLoginClick={() => {}} />);
    
    const titleLink = screen.getByRole('link', { name: 'Story Title' });
    expect(titleLink).toHaveAttribute('href', 'https://example.com');
    expect(titleLink).toHaveAttribute('target', '_blank');
  });

  it('renders Hacker News link for stories without URLs', () => {
    const storyWithoutUrl = { ...mockStory, url: null };
    renderWithProviders(<StoryCard story={storyWithoutUrl as any} onLoginClick={() => {}} />);
    
    const titleLink = screen.getByRole('link', { name: 'Story Title' });
    expect(titleLink).toHaveAttribute('href', 'https://news.ycombinator.com/item?id=1');
  });

  it('displays domain correctly', () => {
    renderWithProviders(<StoryCard story={mockStory as any} onLoginClick={() => {}} />);
    
    expect(screen.getByText('(example.com)')).toBeInTheDocument();
  });

  it('handles missing story gracefully', () => {
    const { container } = renderWithProviders(<StoryCard story={null as any} onLoginClick={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles missing comment count', () => {
    const storyWithoutComments = { ...mockStory, descendants: undefined };
    renderWithProviders(<StoryCard story={storyWithoutComments as any} onLoginClick={() => {}} />);
    
    expect(screen.getByText('💬 0 comments')).toBeInTheDocument();
  });
});

