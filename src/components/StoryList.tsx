import { useEffect, useRef, useCallback } from 'react';
import { StoryCard } from './StoryCard';
import ButtonSample from '../ui/ButtonSample';
import classes from './StoryList.module.css';

/**
 * StoryList component with lazy loading functionality
 * @param {Array} stories - Array of story objects
 * @param {boolean} loading - Loading state
 * @param {string} error - Error message
 * @param {boolean} hasMore - Whether there are more stories to load
 * @param {function} onLoadMore - Callback to load more stories
 * @param {function} onRefresh - Callback to refresh stories
 * @param {function} onLoginClick - Callback to handle login click
 */
export const StoryList = ({ 
  stories, 
  loading, 
  error, 
  hasMore, 
  onLoadMore, 
  onRefresh,
  onLoginClick 
}) => {
  const observerRef = useRef<any>(null);
  const loadMoreRef = useRef<any>(null);

  // Set up intersection observer for lazy loading
  const lastStoryElementRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current && typeof observerRef.current.disconnect === 'function') {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    }, {
      threshold: 1.0,
      rootMargin: '100px'
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current && typeof observerRef.current.disconnect === 'function') {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Error state
  if (error && stories.length === 0) {
    return (
      <div className={classes.storyListError} >
        <div className={classes.errorContent}>
          <h3>😕 Oops! Something went wrong</h3>
          <p>{error}</p>
          <ButtonSample onClick={onRefresh}>
            🔄 Try Again
          </ButtonSample>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && stories.length === 0) {
    return (
      <div className={classes.storyListEmpty}>
        <h3>📭 No stories found</h3>
        <p>Try refreshing the page or check back later.</p>
        <ButtonSample onClick={onRefresh}>
          🔄 Refresh
        </ButtonSample>
      </div>
    );
  }

  return (
    <div className={classes.storyList}>
      {/* Refresh button */}
      <div className={classes.storyListHeader}>
        <ButtonSample onClick={onRefresh} disabled={loading} className={classes.refreshButton}>
          🔄 Refresh
        </ButtonSample>
      </div>

      {/* Stories */}
      <div className={classes.storiesContainer}>
        {stories.map((story, index) => {
          // Attach ref to the last few elements for lazy loading
          const isLastElement = index === stories.length - 1;
          
          return (
            <div id = {`story_item_${index}`}
              key={story.id}
              ref={isLastElement ? lastStoryElementRef : null}
              className={classes.storyItem}
            >
              <StoryCard story={story} onLoginClick={onLoginClick} />
            </div>
          );
        })}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className={classes.loadingIndicator}>
          <div className={classes.loadingSpinner}></div>
          <p>Loading stories...</p>
        </div>
      )}

      {/* Load more button (fallback) */}
      {!loading && hasMore && (
        <div className={classes.loadMoreContainer}>
          <ButtonSample 
            ref={loadMoreRef}
            onClick={onLoadMore}
          >
            Load More Stories
          </ButtonSample>
        </div>
      )}

      {/* End indicator */}
      {!loading && !hasMore && stories.length > 0 && (
        <div className={classes.endIndicator}>
          <p>🎉 You've reached the end!</p>
        </div>
      )}

      {/* Error during loading more */}
      {error && stories.length > 0 && (
        <div className={classes.loadError}>
          <p>Failed to load more stories: {error}</p>
          <ButtonSample onClick={onLoadMore}>
            Try Again
          </ButtonSample>
        </div>
      )}
    </div>
  );
};
